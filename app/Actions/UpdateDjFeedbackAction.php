<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\FeedbackStatusEnum;
use App\Models\DjFeedbackRequest;
use Illuminate\Support\Facades\DB;

final readonly class UpdateDjFeedbackAction
{
    /**
     * Update the DJ feedback request with the provided data
     * 
     * @param array{was_party_good: bool, request_review: bool, client_email?: ?string, additional_comments?: ?string} $data
     */
    public function execute(DjFeedbackRequest $feedbackRequest, array $data): DjFeedbackRequest
    {
        return DB::transaction(function () use ($feedbackRequest, $data): DjFeedbackRequest {
            $feedbackRequest->was_party_good = $data['was_party_good'];
            $feedbackRequest->request_review = $data['request_review'];
            $feedbackRequest->client_email = $data['client_email'] ?? null;
            $feedbackRequest->additional_comments = $data['additional_comments'] ?? null;
            $feedbackRequest->status = FeedbackStatusEnum::Completed;
            $feedbackRequest->responded_at = now();
            $feedbackRequest->save();
            
            return $feedbackRequest;
        });
    }
}
