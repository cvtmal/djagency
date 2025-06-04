<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\BookingStatusEnum;
use App\Mail\BookingQuote;
use App\Models\BookingRequest;
use App\Models\DJ;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final readonly class SendEmailQuoteAction
{
    /**
     * Send an email quote for a booking request.
     *
     * @param  BookingRequest  $bookingRequest  The booking request to quote
     * @param array{
     *     sender_email: string,
     *     cc_email: ?string,
     *     subject: string,
     *     body: string,
     *     dj_ids: array<int>
     * } $data The email data
     */
    public function execute(BookingRequest $bookingRequest, array $data): void
    {
        DB::transaction(function () use ($bookingRequest, $data): void {
            // Update the booking request status to 'quoted'
            $bookingRequest->status = BookingStatusEnum::Quoted;
            $bookingRequest->save();

            // Log the quote email details
            // In a real implementation, this would send an actual email
            // For now, we just log it in a way that's compatible with your system
            $selectedDjs = DJ::query()->whereIn('id', $data['dj_ids'])->get();

            $emailDetails = [
                'to' => $bookingRequest->contact_email,
                'from' => $data['sender_email'],
                'cc' => $data['cc_email'] ?? null,
                'subject' => $data['subject'],
                'body' => $data['body'],
                'djs' => $selectedDjs->pluck('name')->join(', '),
                'booking_request_id' => $bookingRequest->id,
            ];

            // Send the email using our BookingQuote mailable
            try {
                Mail::to($bookingRequest->contact_email)
                    ->send(new BookingQuote($emailDetails));

                // Log successful email sending
                Log::info('Email quote sent', $emailDetails);
            } catch (\Exception $e) {
                // Log any errors that occur during email sending
                Log::error('Failed to send email quote', [
                    'error' => $e->getMessage(),
                    'booking_request_id' => $bookingRequest->id,
                ]);

                throw $e; // Re-throw to trigger transaction rollback
            }
        });
    }
}
