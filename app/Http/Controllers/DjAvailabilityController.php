<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateDjAvailabilityAction;
use App\Actions\DeleteDjAvailabilityAction;
use App\Actions\UpdateDjAvailabilityAction;
use App\Enums\DjAvailabilityStatusEnum;
use App\Http\Requests\CreateDjAvailabilityRequest;
use App\Http\Requests\UpdateDjAvailabilityRequest;
use App\Models\DJ;
use App\Models\DjAvailability;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DjAvailabilityController
{
    public function show(Request $request, string $uniqueIdentifier): Response
    {
        $dj = DJ::query()->where('unique_identifier', $uniqueIdentifier)->firstOrFail();
        $year = (int) $request->query('year', Carbon::now()->year);
        
        // Generate all Fridays and Saturdays for the specified year
        $fridaysAndSaturdays = $this->generateWeekendDates($year);
        
        // Get all existing DJ availability entries for the specified year
        $availabilities = $dj->availabilities()
            ->whereYear('date', $year)
            ->get()
            ->keyBy(fn (DjAvailability $availability) => $availability->date->format('Y-m-d'));
        
        // Merge weekend dates with custom dates and organize by month
        $calendarData = $this->prepareCalendarData($fridaysAndSaturdays, $availabilities);
        
        // Get all existing custom dates (non-weekend dates)
        $customDates = $dj->availabilities()
            ->where('is_custom_date', true)
            ->whereYear('date', $year)
            ->get();
        
        return Inertia::render('DjCalendar', [
            'dj' => $dj,
            'calendarData' => $calendarData,
            'customDates' => $customDates,
            'year' => $year,
            'availabilityStatuses' => $this->getAvailabilityStatusesForFrontend(),
        ]);
    }
    
    public function store(
        CreateDjAvailabilityRequest $request, 
        CreateDjAvailabilityAction $action, 
        string $uniqueIdentifier
    ): RedirectResponse {
        $dj = DJ::query()->where('unique_identifier', $uniqueIdentifier)->firstOrFail();
        
        $action->execute($dj, $request->validated());
        
        return back();
    }
    
    public function update(
        UpdateDjAvailabilityRequest $request, 
        UpdateDjAvailabilityAction $action, 
        string $uniqueIdentifier, 
        DjAvailability $djAvailability
    ): RedirectResponse {
        $dj = DJ::query()->where('unique_identifier', $uniqueIdentifier)->firstOrFail();
        
        // Ensure the availability belongs to the DJ
        if ($djAvailability->dj_id !== $dj->id) {
            abort(403);
        }
        
        $action->execute($djAvailability, $request->validated());
        
        return back();
    }
    
    public function destroy(
        DeleteDjAvailabilityAction $action, 
        string $uniqueIdentifier, 
        DjAvailability $djAvailability
    ): RedirectResponse {
        $dj = DJ::query()->where('unique_identifier', $uniqueIdentifier)->firstOrFail();
        
        // Ensure the availability belongs to the DJ
        if ($djAvailability->dj_id !== $dj->id) {
            abort(403);
        }
        
        $action->execute($djAvailability);
        
        return back();
    }
    
    /**
     * Generate all Fridays and Saturdays for a given year
     * 
     * @return array<string, array{date: Carbon, day_name: string, status: DjAvailabilityStatusEnum}>
     */
    private function generateWeekendDates(int $year): array
    {
        $startDate = Carbon::createFromDate($year, 1, 1);
        $endDate = Carbon::createFromDate($year, 12, 31);
        
        $dates = [];
        
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // 5 = Friday, 6 = Saturday
            if ($date->dayOfWeek === 5 || $date->dayOfWeek === 6) {
                $key = $date->format('Y-m-d');
                $dates[$key] = [
                    'date' => $date->copy(),
                    'day_name' => $date->format('l'),
                    'status' => DjAvailabilityStatusEnum::Available,
                ];
            }
        }
        
        return $dates;
    }
    
    /**
     * Prepare calendar data by merging weekend dates with custom dates and organizing by month
     * 
     * @param array<string, array{date: Carbon, day_name: string, status: DjAvailabilityStatusEnum}> $weekendDates
     * @param \Illuminate\Database\Eloquent\Collection<int, DjAvailability> $availabilities
     * 
     * @return array<string, array<string, array{
     *     id: int|null,
     *     date: string, 
     *     day: int, 
     *     day_name: string, 
     *     status: string, 
     *     is_custom_date: bool,
     *     note: string|null
     * }>>
     */
    private function prepareCalendarData(array $weekendDates, $availabilities): array
    {
        $calendarData = [];
        
        // Process all weekend dates
        foreach ($weekendDates as $dateStr => $dateInfo) {
            $date = $dateInfo['date'];
            $monthKey = $date->format('Y-m');
            
            if (!isset($calendarData[$monthKey])) {
                $calendarData[$monthKey] = [];
            }
            
            // Check if there's an availability record for this date
            if (isset($availabilities[$dateStr])) {
                $availability = $availabilities[$dateStr];
                $calendarData[$monthKey][$dateStr] = [
                    'id' => $availability->id,
                    'date' => $dateStr,
                    'day' => (int) $date->format('j'),
                    'day_name' => $dateInfo['day_name'],
                    'status' => $availability->status->value,
                    'is_custom_date' => false,
                    'note' => $availability->note,
                ];
            } else {
                $calendarData[$monthKey][$dateStr] = [
                    'id' => null,
                    'date' => $dateStr,
                    'day' => (int) $date->format('j'),
                    'day_name' => $dateInfo['day_name'],
                    'status' => DjAvailabilityStatusEnum::Available->value,
                    'is_custom_date' => false,
                    'note' => null,
                ];
            }
        }
        
        // Process all custom dates (that aren't already included in weekend dates)
        foreach ($availabilities as $dateStr => $availability) {
            // Skip if it's already included in weekend dates
            if (isset($weekendDates[$dateStr])) {
                continue;
            }
            
            $date = Carbon::parse($dateStr);
            $monthKey = $date->format('Y-m');
            
            if (!isset($calendarData[$monthKey])) {
                $calendarData[$monthKey] = [];
            }
            
            if ($availability->is_custom_date) {
                $calendarData[$monthKey][$dateStr] = [
                    'id' => $availability->id,
                    'date' => $dateStr,
                    'day' => (int) $date->format('j'),
                    'day_name' => $date->format('l'),
                    'status' => $availability->status->value,
                    'is_custom_date' => true,
                    'note' => $availability->note,
                ];
            }
        }
        
        // Sort months and dates
        ksort($calendarData);
        foreach ($calendarData as &$monthData) {
            ksort($monthData);
        }
        
        return $calendarData;
    }
    
    /**
     * Get availability statuses for the frontend
     * 
     * @return array<string, array{label: string, color: string}>
     */
    private function getAvailabilityStatusesForFrontend(): array
    {
        $statuses = [];
        
        foreach (DjAvailabilityStatusEnum::cases() as $status) {
            $statuses[$status->value] = [
                'label' => $status->label(),
                'color' => $status->color(),
            ];
        }
        
        return $statuses;
    }
}
