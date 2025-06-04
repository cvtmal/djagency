<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetBookingDataAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final readonly class BookingController
{
    /**
     * Handle the incoming request.
     * Display the DJ availability grid showing only active DJs and their Friday/Saturday availability.
     */
    public function __invoke(Request $request, GetBookingDataAction $action): Response
    {
        $bookingData = $action->execute();

        return Inertia::render('booking/AvailabilityGrid', [
            'djs' => $bookingData['djs'],
            'dates' => $bookingData['dates'],
            'djAvailabilities' => $bookingData['djAvailabilities'] ?? [],
            // Remove bookings data as it's no longer used, but keep empty array for backward compatibility
            'bookings' => [],
        ]);
    }
}
