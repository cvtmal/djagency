<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class BookingQuote extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly array $emailDetails
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailDetails['subject'],
            from: $this->emailDetails['from'],
            cc: $this->emailDetails['cc'] ? [$this->emailDetails['cc']] : [],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // For simplicity, we'll use a raw text email
        // In a production app, you might want to use a blade template
        return new Content(
            text: $this->emailDetails['body'],
        );
    }
}
