<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\DjFeedbackRequest;
use App\Models\DjAvailability;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class DjWeekendBookingFeedbackRequestMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly DjFeedbackRequest $feedbackRequest,
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Get the availability directly since booking_id now refers to DjAvailability
        $availability = DjAvailability::find($this->feedbackRequest->booking_id);
        $bookingDate = $availability ? $availability->date->format('F j, Y') : 'recent';

        return new Envelope(
            subject: "We'd like your feedback on your {$bookingDate} booking",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.dj-weekend-booking-feedback',
            with: [
                'availability' => DjAvailability::find($this->feedbackRequest->booking_id),
                'dj' => $this->feedbackRequest->dj,
                'feedbackUrl' => route('dj-feedback.show', ['token' => $this->feedbackRequest->token]),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
