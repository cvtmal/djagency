<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\AssignDjToBookingRequestAction;
use App\Actions\DeleteBookingRequestAction;
use App\Actions\SendEmailQuoteAction;
use App\Actions\UpdateBookingRequestAction;
use App\Http\Requests\AssignDjToBookingRequestRequest;
use App\Http\Requests\SendEmailQuoteRequest;
use App\Http\Requests\UpdateBookingRequestRequest;
use App\Models\BookingRequest;
use App\Models\DJ;
use App\Models\EmailTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BookingRequestController
{
    public function index(): Response
    {
        return Inertia::render('booking/requests', [
            'bookingRequests' => BookingRequest::query()
                ->with('dj:id,name')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($request) {
                    return array_merge($request->toArray(), [
                        'dj_name' => $request->dj ? $request->dj->name : null,
                    ]);
                }),
            'djs' => DJ::all(),
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

    public function showEmailQuote(BookingRequest $bookingRequest): Response
    {
        return Inertia::render('booking/email-quote', [
            'bookingRequest' => $bookingRequest,
            'djs' => DJ::all(),
            'emailTemplates' => EmailTemplate::query()->orderBy('name')->get(),
        ]);
    }

    public function sendEmailQuote(
        SendEmailQuoteRequest $request,
        BookingRequest $bookingRequest,
        SendEmailQuoteAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest, $request->validated());

        return redirect()->route('booking-requests.index')->with('success', 'Email quote sent successfully.');
    }

    public function assignDj(
        AssignDjToBookingRequestRequest $request,
        BookingRequest $bookingRequest,
        AssignDjToBookingRequestAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest, $request->validated()['dj_id']);

        return redirect()->route('booking-requests.index')->with('success', 'DJ assigned to booking request successfully.');
    }
}
