<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
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
        $cc = $this->emailDetails['cc'] ? [new Address($this->emailDetails['cc'])] : [];
        
        return new Envelope(
            subject: $this->emailDetails['subject'],
            from: new Address($this->emailDetails['from']),
            cc: $cc,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Using raw text email with proper Content::raw method
        return new Content(
            text: 'emails.plain-text',
            with: [
                'body' => $this->emailDetails['body']
            ],
        );
    }
}
