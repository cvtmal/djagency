<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only create test user if it doesn't exist
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }
        
        // Truncate booking tables before seeding to avoid duplicate data
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('booking_requests')->truncate();
        DB::table('booking_dates')->truncate();
        DB::table('djs')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        $this->call([
            BookingDataSeeder::class,
        ]);
    }
}
