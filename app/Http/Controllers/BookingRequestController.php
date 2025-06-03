<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\DeleteBookingRequestAction;
use App\Actions\UpdateBookingRequestAction;
use App\Http\Requests\UpdateBookingRequestRequest;
use App\Models\BookingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BookingRequestController
{
    public function index(): Response
    {
        return Inertia::render('booking/requests', [
            'bookingRequests' => BookingRequest::query()
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function update(
        UpdateBookingRequestRequest $request, 
        BookingRequest $bookingRequest,
        UpdateBookingRequestAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest, $request->validated());
        
        return redirect()->back()->with('success', 'Booking request updated successfully.');
    }

    public function destroy(
        BookingRequest $bookingRequest,
        DeleteBookingRequestAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest);
        
        return redirect()->route('booking-requests.index')->with('success', 'Booking request deleted successfully.');
    }
}
