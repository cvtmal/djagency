<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\DjStatus;
use App\Models\BookingDate;
use App\Models\BookingRequest;
use App\Models\DJ;
use App\Models\DjAvailability;
use Illuminate\Database\Eloquent\Collection;

final readonly class GetBookingDataAction
{
    /**
     * Get all booking data for the availability grid.
     *
     * @return array{
     *     djs: Collection<int, DJ>,
     *     dates: Collection<int, BookingDate>,
     *     bookings: Collection<int, BookingRequest>,
     *     djAvailabilities: array<array<string, mixed>>
     * }
     */
    public function execute(): array
    {
        // Only get active DJs
        $djs = DJ::query()
            ->where('status', DjStatus::Active)
            ->orderBy('id')
            ->get();
            
        $dates = BookingDate::query()->orderBy('date')->get();
        
        // We're not using bookings in the refactored version
        // but keeping the structure for compatibility
        $bookings = collect([]);
            
        // Get only Friday and Saturday DJ availabilities (no custom dates)
        $djAvailabilities = DjAvailability::query()
            ->whereIn('dj_id', $djs->pluck('id')->toArray())
            ->where('is_custom_date', false) // Only regular weekend dates, no custom ones
            ->orderBy('date')
            ->get()
            ->map(function ($availability) use ($dates) {
                // Find the corresponding booking date
                $matchingDate = $dates->first(function ($date) use ($availability) {
                    return $date->date->format('Y-m-d') === $availability->date->format('Y-m-d');
                });
                
                // Check if it's Friday or Saturday
                $dayOfWeek = $availability->date->dayOfWeek;
                $isFridayOrSaturday = ($dayOfWeek === 5 || $dayOfWeek === 6); // 5 = Friday, 6 = Saturday
                
                if (!$isFridayOrSaturday) {
                    return null;
                }
                
                return [
                    'id' => $availability->id,
                    'dj_id' => $availability->dj_id,
                    'booking_date_id' => $matchingDate?->id,
                    'date' => $availability->date->format('d.m.Y'),
                    'status' => $availability->status->value,
                    'is_custom_date' => $availability->is_custom_date,
                    'day_of_week' => $dayOfWeek,
                    'note' => $availability->note,
                ];
            })
            ->filter() // Remove null entries
            ->toArray();

        return [
            'djs' => $djs,
            'dates' => $dates,
            'bookings' => $bookings,
            'djAvailabilities' => $djAvailabilities,
        ];
    }
}
