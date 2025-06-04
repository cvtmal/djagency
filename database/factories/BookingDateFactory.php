<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookingDate>
 */
class BookingDateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private array $weekendDates = [];

    private int $dateIndex = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        if (empty($this->weekendDates)) {
            $this->generateAllWeekendDatesFor2025();
        }

        if ($this->dateIndex >= count($this->weekendDates)) {
            // If we've used all dates, reset to use the first one again
            $this->dateIndex = 0;
        }

        $dateInfo = $this->weekendDates[$this->dateIndex++];

        return [
            'date' => $dateInfo['date'],
            'display_date' => $dateInfo['displayDate'],
            'day_name' => $dateInfo['dayName'],
        ];
    }

    /**
     * Generate all Friday and Saturday dates for 2025, plus December 31
     */
    private function generateAllWeekendDatesFor2025(): void
    {
        // Start from January 1, 2025
        $startDate = new \DateTime('2025-01-01');
        // End at December 31, 2025
        $endDate = new \DateTime('2025-12-31');

        // Set to the first day of the year
        $currentDate = clone $startDate;

        // Loop through all days in 2025
        while ($currentDate <= $endDate) {
            // Check if it's Friday (5) or Saturday (6) or December 31
            $isDecember31 = $currentDate->format('m-d') === '12-31';
            $dayOfWeek = (int) $currentDate->format('w');
            $isWeekend = $dayOfWeek === 5 || $dayOfWeek === 6; // 5 = Friday, 6 = Saturday

            if ($isWeekend || $isDecember31) {
                // Format date as dd.mm.yyyy
                $formattedDate = $currentDate->format('d.m.Y');

                // Determine day name
                $dayName = '';
                if ($isDecember31 && ! $isWeekend) {
                    $dayName = 'New Year\'s Eve';
                } else {
                    $dayName = $dayOfWeek === 5 ? 'Friday' : 'Saturday';
                }

                $this->weekendDates[] = [
                    'date' => $currentDate->format('Y-m-d'),
                    'displayDate' => $formattedDate,
                    'dayName' => $dayName,
                ];
            }

            // Move to next day
            $currentDate->modify('+1 day');
        }
    }
}
