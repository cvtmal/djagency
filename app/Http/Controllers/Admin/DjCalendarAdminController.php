<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DJ;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class DjCalendarAdminController
{
    public function index(): Response
    {
        $djs = DJ::query()
            ->select(['id', 'name', 'unique_identifier'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/DjCalendars', [
            'djs' => $djs,
        ]);
    }

    public function generateLink(Request $request, DJ $dj): RedirectResponse
    {
        // Generate a new unique identifier if it doesn't already exist
        if (! $dj->unique_identifier) {
            $dj->unique_identifier = (string) Str::uuid();
            $dj->save();
        }

        return back()->with('success', 'Calendar link generated successfully.');
    }

    public function showCalendarStats(DJ $dj): Response
    {
        $year = Carbon::now()->year;

        // Get availability stats for the current year
        $stats = [
            'total_dates' => $dj->availabilities()->whereYear('date', $year)->count(),
            'status_counts' => [],
        ];

        // Count occurrences of each status
        foreach (DjAvailabilityStatusEnum::cases() as $status) {
            $stats['status_counts'][$status->value] = [
                'label' => $status->label(),
                'count' => $dj->availabilities()
                    ->whereYear('date', $year)
                    ->where('status', $status->value)
                    ->count(),
                'color' => $status->color(),
            ];
        }

        // Count custom dates vs regular weekend dates
        $stats['custom_dates_count'] = $dj->availabilities()
            ->whereYear('date', $year)
            ->where('is_custom_date', true)
            ->count();

        $stats['weekend_dates_count'] = $stats['total_dates'] - $stats['custom_dates_count'];

        return Inertia::render('Admin/DjCalendarStats', [
            'dj' => $dj,
            'stats' => $stats,
            'calendarUrl' => route('dj-calendar.show', ['uniqueIdentifier' => $dj->unique_identifier]),
        ]);
    }
}
