<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetBookingDataAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, GetBookingDataAction $action): Response
    {
        $bookingData = $action->execute();
        
        return Inertia::render('booking/AvailabilityGrid', [
            'djs' => $bookingData['djs'],
            'dates' => $bookingData['dates'],
            'bookings' => $bookingData['bookings'],
        ]);
    }
}
