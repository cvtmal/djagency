<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\DjFeedbackRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class ClientReviewRequestMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly DjFeedbackRequest $feedbackRequest,
        public readonly ?string $customMessage = null,
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $djName = $this->feedbackRequest->dj->name;
        $eventDate = $this->feedbackRequest->availability->date->format('F j');

        return new Envelope(
            subject: "How was your experience with DJ {$djName} on {$eventDate}?",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.client-review-request',
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
