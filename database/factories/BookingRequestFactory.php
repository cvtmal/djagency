<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BookingStatusEnum;
use App\Models\BookingDate;
use App\Models\DJ;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookingRequest>
 */
class BookingRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $requestNumber = 1;

        $venues = ['Club Elektra', 'The Basement', 'Sky Lounge', 'Ocean View', 'Downtown Beats'];
        $clients = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sophia Davis', 'Robert Wilson'];
        $genres = ['House', 'Techno', 'Hip-Hop', 'R&B', 'EDM', 'Disco', 'Funk', '80s', '90s'];
        $statuses = [BookingStatusEnum::Free, BookingStatusEnum::Quoted, BookingStatusEnum::Booked, BookingStatusEnum::Blocked];

        // Format the request number with leading zeros (e.g., REQ-00001)
        $formattedRequestNumber = 'REQ-'.str_pad((string) $requestNumber++, 5, '0', STR_PAD_LEFT);

        // Generate random start and end times
        $startHour = rand(18, 22);
        $endHour = min(24, $startHour + rand(2, 6));
        $startTime = sprintf('%02d:00', $startHour);
        $endTime = sprintf('%02d:00', $endHour);

        // Select random genres (2-4)
        $selectedGenres = collect($genres)->random(rand(2, 4))->values()->all();

        // Random notes about the event
        $notes = $this->faker->optional(0.7)->realText(100);

        return [
            'dj_id' => DJ::factory(),
            'booking_date_id' => BookingDate::factory(),
            'client_name' => $this->faker->randomElement($clients),
            'venue' => $this->faker->randomElement($venues),
            'genres' => $selectedGenres,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'notes' => $notes,
            'status' => $this->faker->randomElement($statuses),
            'request_number' => $formattedRequestNumber,
        ];
    }
}
