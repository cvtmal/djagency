<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DJ>
 */
class DJFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Base real DJ names from the original frontend mock data
        $djNames = [
            'DJ Marc', 'DJ Damian', 'DJ Junus', 'DJ Toni', 'DJ Mike', 'DJ Sarah', 'DJ Alex', 'DJ Chris',
            'DJ Emma', 'DJ David', 'DJ Lisa', 'DJ Kevin', 'DJ Anna', 'DJ James', 'DJ Laura', 'DJ Tom',
            'DJ Nina', 'DJ Rick', 'DJ Sofia', 'DJ Jack', 'DJ Lucas', 'DJ Maya', 'DJ Oscar', 'DJ Rachel',
            'DJ Sam', 'DJ Tina', 'DJ Victor', 'DJ Wendy', 'DJ Xander', 'DJ Yara', 'DJ Zack', 'DJ Alice',
            'DJ Bob', 'DJ Chloe', 'DJ Diego', 'DJ Eva', 'DJ Frank', 'DJ Grace', 'DJ Henry', 'DJ Ivy',
            'DJ Jacob', 'DJ Kate', 'DJ Leo', 'DJ Mia', 'DJ Noah', 'DJ Olivia',
        ];

        // Use a known name for sequential creation, otherwise generate systematic names
        static $index = 0;

        if ($index < count($djNames)) {
            $name = $djNames[$index++];
        } else {
            // For DJs beyond our real name list, generate names like DJ A1, DJ B1, DJ C1, etc.
            $letterIndex = ($index - count($djNames)) % 26;
            $numberIndex = floor(($index - count($djNames)) / 26) + 1;
            $name = 'DJ '.chr(65 + $letterIndex).$numberIndex;
            $index++;
        }

        $genres = [
            'House', 'Techno', 'Hip-Hop', 'R&B', 'EDM', 'Disco', 'Funk', '80s', '90s', 'Reggaeton', 'Dance', 'Commercial',
        ];

        $cities = ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'];

        // Create 2-4 random genres for each DJ
        $djGenres = array_values(array_unique(
            $this->faker->randomElements($genres, $this->faker->numberBetween(2, 4))
        ));

        return [
            'name' => $name,
            'genres' => $djGenres,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'home_city' => $this->faker->randomElement($cities),
        ];
    }
}
