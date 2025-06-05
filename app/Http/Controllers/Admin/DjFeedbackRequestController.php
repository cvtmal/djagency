<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\ContactClientForReviewAction;
use App\Enums\FeedbackStatusEnum;
use App\Http\Requests\ContactClientReviewRequest;
use App\Models\DjFeedbackRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class DjFeedbackRequestController
{
    /**
     * Display a listing of DJ feedback requests.
     */
    public function index(): Response
    {
        $feedbackRequests = DjFeedbackRequest::query()
            ->with(['availability', 'dj'])
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest('sent_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (DjFeedbackRequest $feedbackRequest) => [
                'id' => $feedbackRequest->id,
                'booking_id' => $feedbackRequest->booking_id,
                'dj' => [
                    'id' => $feedbackRequest->dj->id,
                    'name' => $feedbackRequest->dj->name,
                ],
                'bookingRequest' => [
                    'id' => $feedbackRequest->availability->id,
                    'date' => $feedbackRequest->availability->date->format('Y-m-d'),
                    'venue_name' => 'Venue information not available',
                    'client_name' => 'Client information not available',
                ],
                'status' => $feedbackRequest->status->value,
                'was_party_good' => $feedbackRequest->was_party_good,
                'request_review' => $feedbackRequest->request_review,
                'client_email' => $feedbackRequest->client_email,
                'sent_at' => $feedbackRequest->sent_at?->diffForHumans(),
                'responded_at' => $feedbackRequest->responded_at?->diffForHumans(),
                'client_contacted_at' => $feedbackRequest->client_contacted_at?->diffForHumans(),
            ]);

        return Inertia::render('Admin/DjFeedback/Index', [
            'feedbackRequests' => $feedbackRequests,
            'filters' => request()->only('status'),
            'statuses' => [
                FeedbackStatusEnum::Pending->value => 'Pending',
                FeedbackStatusEnum::Completed->value => 'Completed',
                FeedbackStatusEnum::ClientContacted->value => 'Client Contacted',
            ],
        ]);
    }

    /**
     * Show the details of a specific feedback request.
     */
    public function show(DjFeedbackRequest $djFeedbackRequest): Response
    {
        $djFeedbackRequest->load(['availability', 'dj']);

        return Inertia::render('Admin/DjFeedback/Show', [
            'feedbackRequest' => [
                'id' => $djFeedbackRequest->id,
                'dj' => [
                    'id' => $djFeedbackRequest->dj->id,
                    'name' => $djFeedbackRequest->dj->name,
                    'email' => $djFeedbackRequest->dj->email,
                ],
                'bookingRequest' => [
                    'id' => $djFeedbackRequest->availability->id,
                    'date' => $djFeedbackRequest->availability->date->format('F j, Y'),
                    'venue_name' => 'Venue information not available',
                    'client_name' => 'Client information not available',
                ],
                'status' => $djFeedbackRequest->status->value,
                'was_party_good' => $djFeedbackRequest->was_party_good,
                'request_review' => $djFeedbackRequest->request_review,
                'client_email' => $djFeedbackRequest->client_email,
                'additional_comments' => $djFeedbackRequest->additional_comments,
                'sent_at' => $djFeedbackRequest->sent_at?->format('F j, Y g:i A'),
                'responded_at' => $djFeedbackRequest->responded_at?->format('F j, Y g:i A'),
                'client_contacted_at' => $djFeedbackRequest->client_contacted_at?->format('F j, Y g:i A'),
            ],
        ]);
    }

    /**
     * Contact the client for a review based on the DJ feedback.
     */
    public function contactClient(
        ContactClientReviewRequest $request, 
        DjFeedbackRequest $djFeedbackRequest,
        ContactClientForReviewAction $action
    ): RedirectResponse {
        $action->execute($djFeedbackRequest, $request->validated());
        
        return back()->with('success', 'Client has been contacted for a review.');
    }
}
