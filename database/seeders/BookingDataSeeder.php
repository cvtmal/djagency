<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BookingDate;
use App\Models\BookingRequest;
use App\Models\DJ;
use Illuminate\Database\Seeder;

class BookingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 DJs
        $djs = DJ::factory()->count(50)->create();

        // Create all weekend dates for 2025
        $dates = BookingDate::factory()->count(104)->create(); // ~52 weekends * 2 days

        // Generate booking requests - some cells will be empty, others will have bookings
        // We want approximately 30% of the cells to have a booking
        $totalCells = count($djs) * count($dates);
        $cellsWithBooking = (int) ($totalCells * 0.3);

        // Generate that many random booking requests
        for ($i = 0; $i < $cellsWithBooking; $i++) {
            $dj = $djs->random();
            $date = $dates->random();

            // Check if a booking already exists for this DJ and date
            $existingBooking = BookingRequest::where('dj_id', $dj->id)
                ->where('booking_date_id', $date->id)
                ->exists();

            // If not, create a new booking request
            if (! $existingBooking) {
                BookingRequest::factory()
                    ->create([
                        'dj_id' => $dj->id,
                        'booking_date_id' => $date->id,
                    ]);
            }
        }
    }
}
