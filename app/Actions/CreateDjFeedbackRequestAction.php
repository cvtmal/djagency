<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\FeedbackStatusEnum;
use App\Mail\DjWeekendBookingFeedbackRequestMail;
use App\Models\DjAvailability;
use App\Models\DjFeedbackRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final readonly class CreateDjFeedbackRequestAction
{
    /**
     * Create a new feedback request for the booking and send email to DJ
     */
    public function execute(DjAvailability $booking): DjFeedbackRequest
    {
        $feedbackRequest = new DjFeedbackRequest();
        $feedbackRequest->booking_id = $booking->id;
        $feedbackRequest->dj_id = $booking->dj_id;
        $feedbackRequest->token = (string) Str::uuid();
        $feedbackRequest->status = FeedbackStatusEnum::Pending;
        $feedbackRequest->sent_at = now();
        $feedbackRequest->save();
        
        // Send email notification to DJ
        $dj = $booking->dj;
        if ($dj && $dj->email) {
            Mail::to($dj->email)
                ->send(new DjWeekendBookingFeedbackRequestMail($feedbackRequest));
        }
        
        return $feedbackRequest;
    }
}
