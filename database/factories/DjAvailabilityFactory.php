<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DJ;
use App\Models\DjAvailability;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DjAvailability>
 */
class DjAvailabilityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DjAvailability::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isCustomDate = $this->faker->boolean(20); // 20% chance of being a custom date
        
        // Generate a weekend date (Friday or Saturday) or any date if it's a custom date
        $date = $isCustomDate
            ? $this->faker->dateTimeBetween('-1 month', '+3 months')
            : $this->getWeekendDate();

        return [
            'dj_id' => DJ::factory(),
            'date' => $date,
            'status' => $this->faker->randomElement(DjAvailabilityStatusEnum::cases()),
            'is_custom_date' => $isCustomDate,
            'note' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }
    
    /**
     * Generate a weekend date (Friday or Saturday)
     */
    private function getWeekendDate(): Carbon
    {
        $date = Carbon::instance($this->faker->dateTimeBetween('-1 month', '+3 months'));
        
        // If not Friday (5) or Saturday (6), adjust to the next Friday
        if (!in_array($date->dayOfWeek, [5, 6])) {
            $daysUntilFriday = (5 - $date->dayOfWeek + 7) % 7;
            $date->addDays($daysUntilFriday);
        }
        
        return $date;
    }
    
    /**
     * Set the availability status
     */
    public function status(DjAvailabilityStatusEnum $status): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }
    
    /**
     * Mark as a custom date
     */
    public function customDate(bool $isCustom = true): self
    {
        return $this->state(fn (array $attributes) => [
            'is_custom_date' => $isCustom,
        ]);
    }
    
    /**
     * Set a note for this availability
     */
    public function withNote(string $note): self
    {
        return $this->state(fn (array $attributes) => [
            'note' => $note,
        ]);
    }
}
