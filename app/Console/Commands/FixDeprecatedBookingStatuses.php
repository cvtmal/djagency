<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\BookingStatusEnum;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

final class FixDeprecatedBookingStatuses extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'booking:fix-statuses';

    /**
     * The console command description.
     */
    protected $description = 'Fix deprecated booking statuses';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Fixing deprecated booking statuses...');

        // We'll temporarily disable foreign key checks to allow direct SQL updates
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Use direct SQL to avoid triggering any constraints or model validation
        $newValue = BookingStatusEnum::New->value;

        $affectedRows = DB::statement("
            UPDATE booking_requests 
            SET status = '{$newValue}' 
            WHERE status IN ('free', 'Free', 'blocked', 'Blocked')
        ");

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->info('Updated booking request records with deprecated statuses.');

        return Command::SUCCESS;
    }
}
