<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DjAvailability;
use Illuminate\Support\Carbon;

final readonly class GetAgencyBookedAvailabilitiesStatsAction
{
    /**
     * Get statistics for availabilities booked through the agency in a specific year.
     *
     * @return array{count: int, year: int}
     */
    public function execute(int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;
        
        $startOfYear = Carbon::createFromDate($year, 1, 1)->startOfDay();
        $endOfYear = Carbon::createFromDate($year, 12, 31)->endOfDay();
        
        $count = DjAvailability::query()
            ->where('status', DjAvailabilityStatusEnum::BookedThroughAgency)
            ->whereBetween('date', [$startOfYear, $endOfYear])
            ->count();
            
        return [
            'count' => $count,
            'year' => $year,
        ];
    }
}
