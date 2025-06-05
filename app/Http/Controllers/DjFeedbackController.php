<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\UpdateDjFeedbackAction;
use App\Http\Requests\UpdateDjFeedbackRequest;
use App\Models\DjFeedbackRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class DjFeedbackController
{
    /**
     * Display the feedback form for the DJ.
     */
    public function show(string $token): Response
    {
        $feedbackRequest = DjFeedbackRequest::where('token', $token)
            ->with(['availability', 'dj'])
            ->firstOrFail();
            
        return Inertia::render('DjFeedback/Show', [
            'feedbackRequest' => [
                'id' => $feedbackRequest->id,
                'token' => $feedbackRequest->token,
                'bookingRequest' => [
                    'id' => $feedbackRequest->availability->id,
                    'date' => $feedbackRequest->availability->date->format('F j, Y'),
                    // We don't have venue_name and client_name in DjAvailability, so we'll provide defaults
                    'venue_name' => 'Venue information not available',
                    'client_name' => 'Client information not available',
                ],
                'dj' => [
                    'id' => $feedbackRequest->dj->id,
                    'name' => $feedbackRequest->dj->name,
                ],
                'status' => $feedbackRequest->status->value,
            ],
        ]);
    }

    /**
     * Update the feedback for the booking.
     */
    public function update(UpdateDjFeedbackRequest $request, string $token, UpdateDjFeedbackAction $action): RedirectResponse
    {
        $feedbackRequest = DjFeedbackRequest::where('token', $token)->firstOrFail();
        
        $action->execute($feedbackRequest, $request->validated());
        
        return redirect()->route('dj-feedback.thank-you', $token);
    }
    
    /**
     * Show the thank you page after feedback submission.
     */
    public function thankYou(string $token): Response
    {
        $feedbackRequest = DjFeedbackRequest::where('token', $token)
            ->with(['availability', 'dj'])
            ->firstOrFail();
            
        return Inertia::render('DjFeedback/ThankYou', [
            'feedbackRequest' => [
                'id' => $feedbackRequest->id,
                'token' => $feedbackRequest->token,
                'bookingRequest' => [
                    'id' => $feedbackRequest->availability->id,
                    'date' => $feedbackRequest->availability->date->format('F j, Y'),
                    'venue_name' => 'Venue information not available',
                ],
                'dj' => [
                    'name' => $feedbackRequest->dj->name,
                ],
            ],
        ]);
    }
}
