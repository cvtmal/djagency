<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\MarkClientResponseAction;
use App\Actions\ScheduleFollowUpAction;
use App\Enums\ClientResponseMethodEnum;
use App\Http\Requests\CreateClientInteractionRequest;
use App\Http\Requests\ScheduleFollowUpRequest;
use App\Http\Requests\UpdateFollowUpRequest;
use App\Models\BookingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ClientInteractionController
{
    /**
     * Display the client interactions for a specific booking request.
     */
    public function index(BookingRequest $bookingRequest): Response
    {
        return Inertia::render('booking/interactions', [
            'bookingRequest' => $bookingRequest->load('interactions'),
            'interactions' => $bookingRequest->interactions()->orderBy('created_at', 'desc')->get(),
            'responseMethods' => $this->getResponseMethodOptions(),
        ]);
    }

    /**
     * Display the form to record a new client interaction.
     */
    public function create(BookingRequest $bookingRequest): Response
    {
        return Inertia::render('booking/record-interaction', [
            'bookingRequest' => $bookingRequest,
            'responseMethods' => $this->getResponseMethodOptions(),
        ]);
    }

    /**
     * Store a newly created client interaction and mark the client's response.
     */
    public function store(
        CreateClientInteractionRequest $request,
        BookingRequest $bookingRequest,
        MarkClientResponseAction $action
    ): RedirectResponse {
        $validatedData = $request->validated();
        $responseMethod = ClientResponseMethodEnum::from($validatedData['interaction_method']);

        $action->execute(
            $bookingRequest,
            $responseMethod,
            $validatedData['notes'] ?? null,
            $validatedData['metadata'] ?? []
        );

        return redirect()
            ->route('booking-requests.interactions.index', $bookingRequest)
            ->with('success', 'Client interaction recorded successfully.');
    }

    /**
     * Display the form to schedule a follow-up.
     */
    public function showScheduleFollowUp(BookingRequest $bookingRequest): Response
    {
        return Inertia::render('booking/schedule-follow-up', [
            'bookingRequest' => $bookingRequest,
        ]);
    }

    /**
     * Schedule a follow-up for the booking request.
     */
    public function scheduleFollowUp(
        ScheduleFollowUpRequest $request,
        BookingRequest $bookingRequest,
        ScheduleFollowUpAction $action
    ): RedirectResponse {
        $validatedData = $request->validated();
        $followUpDate = null;

        if ($validatedData['follow_up_date']) {
            $followUpDate = \Carbon\Carbon::parse($validatedData['follow_up_date']);
        }

        // Set automated follow-up preference (defaulting to true if not provided)
        $automatedFollowUp = $validatedData['automated_follow_up'] ?? true;
        $bookingRequest->automated_follow_up = $automatedFollowUp;
        $bookingRequest->save();

        $action->execute($bookingRequest, $followUpDate);

        return redirect()
            ->route('booking-requests.index')
            ->with('success', 'Follow-up scheduled successfully.');
    }

    /**
     * Update the follow-up for an existing booking request.
     */
    public function updateFollowUp(
        UpdateFollowUpRequest $request,
        BookingRequest $bookingRequest,
        ScheduleFollowUpAction $action
    ): RedirectResponse {
        $validatedData = $request->validated();
        $followUpDate = $validatedData['follow_up_date'] 
            ? \Carbon\Carbon::parse($validatedData['follow_up_date'])
            : null;

        // Update the automated follow-up preference
        $bookingRequest->automated_follow_up = $validatedData['automated_follow_up'];
        $bookingRequest->save();

        // Update the follow-up date using the action with isUpdate=true
        $action->execute($bookingRequest, $followUpDate, $validatedData['notes'] ?? null, true);

        return redirect()
            ->route('booking-requests.interactions.index', $bookingRequest)
            ->with('success', 'Follow-up updated successfully.');
    }

    /**
     * Get the list of response method options for the UI.
     *
     * @return array<string, string>
     */
    private function getResponseMethodOptions(): array
    {
        $options = [];

        foreach (ClientResponseMethodEnum::cases() as $method) {
            $options[$method->value] = $method->label();
        }

        return $options;
    }
}
