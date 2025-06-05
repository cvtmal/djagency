<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\FeedbackStatusEnum;
use App\Mail\ClientReviewRequestMail;
use App\Models\DjFeedbackRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

final readonly class ContactClientForReviewAction
{
    /**
     * Contact the client for a review based on the DJ's feedback
     * 
     * @param array{client_email: string, message?: ?string} $data
     */
    public function execute(DjFeedbackRequest $feedbackRequest, array $data): DjFeedbackRequest
    {
        return DB::transaction(function () use ($feedbackRequest, $data): DjFeedbackRequest {
            // Update the client email if it wasn't already set
            if (empty($feedbackRequest->client_email)) {
                $feedbackRequest->client_email = $data['client_email'];
            }
            
            // Update the status to indicate the client has been contacted
            $feedbackRequest->status = FeedbackStatusEnum::ClientContacted;
            $feedbackRequest->client_contacted_at = now();
            $feedbackRequest->save();
            
            // Send the email to the client
            Mail::to($data['client_email'])
                ->send(new ClientReviewRequestMail(
                    $feedbackRequest,
                    $data['message'] ?? null
                ));
            
            return $feedbackRequest;
        });
    }
}
