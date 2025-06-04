<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ClientResponseMethodEnum;
use App\Models\BookingRequest;
use App\Models\ClientInteraction;
use Illuminate\Support\Facades\DB;

final readonly class MarkClientResponseAction
{
    /**
     * Record a client response to a booking request
     * 
     * @param BookingRequest $bookingRequest
     * @param ClientResponseMethodEnum $responseMethod
     * @param string|null $notes
     * @param array<string, mixed> $metadata
     */
    public function execute(
        BookingRequest $bookingRequest, 
        ClientResponseMethodEnum $responseMethod, 
        ?string $notes = null, 
        array $metadata = []
    ): void {
        DB::transaction(function () use ($bookingRequest, $responseMethod, $notes, $metadata): void {
            // Update the booking request with response information
            $bookingRequest->update([
                'has_responded' => true,
                'response_method' => $responseMethod,
                'last_response_at' => now(),
                // Reset follow-up schedule since they've responded
                'next_follow_up_at' => null,
            ]);
            
            // Create a client interaction record
            ClientInteraction::create([
                'booking_request_id' => $bookingRequest->id,
                'interaction_method' => $responseMethod,
                'notes' => $notes,
                'metadata' => $metadata,
                'is_client_response' => true,
                'is_follow_up' => false,
            ]);
        });
    }
}
