<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\CreateDjFeedbackRequestAction;
use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DjAvailability;
use Carbon\Carbon;
use Illuminate\Console\Command;

final class SendWeekendBookingFeedbackRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-weekend-booking-feedback-requests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends feedback request emails to DJs who had bookings over the past weekend';

    /**
     * Execute the console command.
     */
    public function handle(CreateDjFeedbackRequestAction $createDjFeedbackRequestAction): int
    {
        $this->info('Starting to send weekend booking feedback requests...');
        
        // Calculate the dates for the past weekend (Friday to Sunday)
        $now = Carbon::now();
        $lastFriday = $now->copy()->previous(Carbon::FRIDAY);
        $lastSunday = $now->copy()->previous(Carbon::SUNDAY);
        
        // Get all booking availability entries from last weekend that are confirmed
        $djAvailabilities = DjAvailability::query()
            ->whereBetween('date', [
                $lastFriday->startOfDay()->toDateString(),
                $lastSunday->endOfDay()->toDateString(),
            ])
            ->where('status', DjAvailabilityStatusEnum::BookedThroughAgency)
            ->with('dj')
            ->get();
        
        if ($djAvailabilities->isEmpty()) {
            $this->info('No confirmed DJ bookings found for the past weekend.');
            return self::SUCCESS;
        }
        
        $this->info("Found {$djAvailabilities->count()} confirmed DJ bookings from the past weekend.");
        
        $createdCount = 0;
        
        foreach ($djAvailabilities as $availability) {
            if (! $availability->dj) {
                $this->warn("Availability #{$availability->id} has no associated DJ. Skipping.");
                continue;
            }
            
            try {
                $createDjFeedbackRequestAction->execute($availability);
                $createdCount++;
            } catch (\Exception $e) {
                $this->error("Failed to create feedback request for availability #{$availability->id}: {$e->getMessage()}");
            }
        }
        
        $this->info("Successfully created and sent {$createdCount} feedback requests.");
        
        return self::SUCCESS;
    }
}
