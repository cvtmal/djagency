<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\BookingStatusEnum;
use App\Models\BookingRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class CreateBookingRequestAction
{
    public function execute(array $data): BookingRequest
    {
        return DB::transaction(function () use ($data): BookingRequest {
            // Parse JSON strings from form data
            $musicRatings = json_decode($data['musicRatings'], true);
            $contact = json_decode($data['contact'], true);
            // Map the frontend field names to database field names
            $requestData = [
                'client_name' => $contact['name'],
                'contact_street' => $contact['street'],
                'contact_city' => $contact['city'],
                'contact_postal_code' => $contact['postalCode'],
                'contact_email' => $contact['email'],
                'contact_phone' => $contact['phone'],
                'contact_option' => $data['contactOption'],
                'venue' => $data['location'],
                'event_type' => $data['eventType'],
                'time_range' => $data['timeRange'],
                'guest_count' => $data['guestCount'],
                'equipment' => $data['equipment'],
                'music_ratings' => $musicRatings,
                'additional_music' => $data['additionalMusic'] ?? null,
                'genres' => $this->extractGenresFromRatings($musicRatings),
                'status' => BookingStatusEnum::New,
                'request_number' => $this->generateRequestNumber(),
                'date' => $data['date'],
            ];

            return BookingRequest::query()->create($requestData);
        });
    }

    /**
     * Generate a unique request number for the booking
     */
    private function generateRequestNumber(): string
    {
        return 'REQ-'.Str::upper(Str::random(8));
    }

    /**
     * Extract preferred genres from the ratings (ratings > 3)
     *
     * @param  array<string, int>  $ratings
     * @return array<int, string>
     */
    private function extractGenresFromRatings(array $ratings): array
    {
        $preferredGenres = [];

        foreach ($ratings as $genre => $rating) {
            if ($rating > 3) {
                $preferredGenres[] = $genre;
            }
        }

        return $preferredGenres;
    }
}
