<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateBookingRequestAction;
use App\Http\Requests\CreateContactBookingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BookingContactController extends Controller
{
    /**
     * Display the contact booking form
     */
    public function create(): Response
    {
        return Inertia::render('BookingForm');
    }

    /**
     * Handle the contact booking form submission
     */
    public function store(CreateContactBookingRequest $request, CreateBookingRequestAction $action): RedirectResponse
    {
        // Execute the action with validated data
        $bookingRequest = $action->execute($request->validated());

        // Redirect with success message
        return redirect()
            ->route('contact')
            ->with('success', 'Vielen Dank! Ihre DJ-Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.');
    }
}
