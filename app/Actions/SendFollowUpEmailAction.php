<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ClientResponseMethodEnum;
use App\Mail\BookingFollowUp;
use App\Models\BookingRequest;
use App\Models\ClientInteraction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final readonly class SendFollowUpEmailAction
{
    /**
     * Send a follow-up email to a client based on the follow-up count
     * 
     * @param BookingRequest $bookingRequest The booking request to follow up on
     * @return bool Whether the email was sent successfully
     */
    public function execute(BookingRequest $bookingRequest): bool
    {
        if (!$this->shouldSendFollowUp($bookingRequest)) {
            return false;
        }

        return DB::transaction(function () use ($bookingRequest): bool {
            try {
                // Get customized content based on follow-up count
                $followUpNumber = $bookingRequest->follow_up_count;
                $subject = $this->getSubjectLine($followUpNumber);
                $content = $this->getEmailContent($bookingRequest, $followUpNumber);
                
                // Send the email
                Mail::to($bookingRequest->contact_email)
                    ->send(new BookingFollowUp($bookingRequest, $subject, $content, $followUpNumber));
                
                // Record this interaction
                ClientInteraction::create([
                    'booking_request_id' => $bookingRequest->id,
                    'interaction_method' => ClientResponseMethodEnum::Email,
                    'notes' => "Follow-up email #{$followUpNumber} sent",
                    'metadata' => [
                        'subject' => $subject, 
                        'follow_up_number' => $followUpNumber
                    ],
                    'is_follow_up' => true,
                    'is_client_response' => false,
                ]);
                
                // Schedule the next follow-up if needed (exponential backoff)
                if ($followUpNumber < 3) {
                    $daysToAdd = $followUpNumber === 1 ? 3 : ($followUpNumber === 2 ? 5 : 7);
                    $scheduleAction = new ScheduleFollowUpAction();
                    $scheduleAction->execute($bookingRequest, now()->addDays($daysToAdd));
                }
                
                return true;
                
            } catch (\Exception $e) {
                // Log the error but don't throw it
                Log::error("Failed to send follow-up email for booking request {$bookingRequest->id}: {$e->getMessage()}");
                return false;
            }
        });
    }
    
    /**
     * Determine if we should send a follow-up email
     */
    private function shouldSendFollowUp(BookingRequest $bookingRequest): bool
    {
        // Don't send if the client has already responded
        if ($bookingRequest->has_responded) {
            return false;
        }
        
        // Don't send if it's not in quoted status
        if ($bookingRequest->status->value !== 'quoted') {
            return false;
        }
        
        // Maximum of 3 follow-ups
        if ($bookingRequest->follow_up_count >= 3) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get the appropriate subject line based on follow-up number
     */
    private function getSubjectLine(int $followUpNumber): string
    {
        return match ($followUpNumber) {
            1 => 'Following up on your booking quote',
            2 => 'Did you receive our DJ booking quote?',
            3 => 'Final follow-up: Your DJ booking quote',
            default => 'Your DJ booking quote',
        };
    }
    
    /**
     * Get the email content based on the booking request and follow-up count
     */
    private function getEmailContent(BookingRequest $bookingRequest, int $followUpNumber): string
    {
        $clientName = $bookingRequest->client_name;
        
        return match ($followUpNumber) {
            1 => "Hi {$clientName},\n\nI wanted to follow up on the DJ booking quote we sent you recently. " .
                 "Have you had a chance to review it? I'm happy to answer any questions you might have.\n\n" .
                 "Looking forward to hearing from you!",
                 
            2 => "Hi {$clientName},\n\nI'm checking in again about the DJ booking quote for your event. " .
                 "I know how busy planning can get, so I wanted to make sure our quote didn't get lost in your inbox.\n\n" .
                 "Please let me know if you'd like to proceed or if you have any questions.",
                 
            3 => "Hi {$clientName},\n\nThis is our final follow-up regarding your DJ booking quote. " .
                 "We've reserved the date for you, but we'll need to confirm soon.\n\n" .
                 "If you're still interested, please let us know. If we don't hear back, we'll assume you've made other arrangements.",
                 
            default => "Hi {$clientName},\n\nJust checking in about your DJ booking quote. " .
                      "Please let us know if you have any questions.",
        };
    }
}
