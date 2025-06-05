<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\FeedbackStatusEnum;
use App\Models\BookingRequest;
use App\Models\DJ;
use App\Models\DjFeedbackRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DjFeedbackRequest>
 */
final class DjFeedbackRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string
     */
    protected $model = DjFeedbackRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => BookingRequest::factory(),
            'dj_id' => DJ::factory(),
            'token' => Str::uuid(),
            'status' => FeedbackStatusEnum::Pending,
            'was_party_good' => null,
            'request_review' => null,
            'client_email' => null,
            'additional_comments' => null,
            'sent_at' => now(),
            'responded_at' => null,
            'client_contacted_at' => null,
        ];
    }

    /**
     * Indicate that the feedback request has been completed.
     */
    public function completed(): self
    {
        return $this->state(fn (array $attributes): array => [
            'status' => FeedbackStatusEnum::Completed,
            'was_party_good' => $this->faker->boolean(80), // 80% chance of being true
            'request_review' => $this->faker->boolean(70), // 70% chance of being true
            'client_email' => $this->faker->safeEmail(),
            'additional_comments' => $this->faker->paragraph(),
            'responded_at' => now(),
        ]);
    }

    /**
     * Indicate that the client has been contacted for review.
     */
    public function clientContacted(): self
    {
        return $this->state(fn (array $attributes): array => [
            'status' => FeedbackStatusEnum::ClientContacted,
            'client_contacted_at' => now(),
        ]);
    }
}
