<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\BookingStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

final class UpdateBookingStatusesSeeder extends Seeder
{
    public function run(): void
    {
        // Get all booking requests with old statuses
        $deprecatedStatuses = ['free', 'Free', 'blocked', 'Blocked'];
        
        // Get records with the old statuses
        $records = DB::table('booking_requests')
            ->whereIn('status', $deprecatedStatuses)
            ->get();
        
        // Update each record individually to handle constraint issues
        foreach ($records as $record) {
            DB::table('booking_requests')
                ->where('id', $record->id)
                ->update([
                    'status' => BookingStatusEnum::New->value,
                ]);
        }
        
        $this->command->info('Updated ' . $records->count() . ' booking request records with deprecated statuses.');
    }
}
