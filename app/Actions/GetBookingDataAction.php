<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\BookingDate;
use App\Models\BookingRequest;
use App\Models\DJ;
use Illuminate\Support\Collection;

final readonly class GetBookingDataAction
{
    /**
     * Get all booking data for the availability grid.
     *
     * @return array{
     *     djs: Collection<int, DJ>,
     *     dates: Collection<int, BookingDate>,
     *     bookings: Collection<int, BookingRequest>
     * }
     */
    public function execute(): array
    {
        $djs = DJ::query()->orderBy('id')->get();
        $dates = BookingDate::query()->orderBy('date')->get();
        $bookings = BookingRequest::query()
            ->with(['dj', 'bookingDate'])
            ->get();

        return [
            'djs' => $djs,
            'dates' => $dates,
            'bookings' => $bookings,
        ];
    }
}
