<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\BookingRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class ScheduleFollowUpAction
{
    /**
     * Schedule the next follow-up for a booking request
     *
     * @param BookingRequest $bookingRequest
     * @param Carbon|null $followUpDate Optional specific date for follow-up, default is 3 days from now
     * @return Carbon The scheduled follow-up date
     * @throws \Throwable
     */
    public function execute(BookingRequest $bookingRequest, ?Carbon $followUpDate = null): Carbon
    {
        // Default to 3 days in the future if no specific date is provided
        $followUpDate = $followUpDate ?? now()->addDays(3);
        
        DB::transaction(function () use ($bookingRequest, $followUpDate): void {
            // Calculate the new follow-up count
            $followUpCount = $bookingRequest->follow_up_count + 1;
            
            // Create or update the follow-up history array
            /** @var array<int, array{date: string, scheduled_at: string}> $history */
            $history = $bookingRequest->follow_up_history ?? [];
            $history[] = [
                'date' => $followUpDate->toDateString(),
                'scheduled_at' => now()->toDateTimeString(),
            ];
            
            $bookingRequest->update([
                'next_follow_up_at' => $followUpDate,
                'follow_up_count' => $followUpCount,
                'follow_up_history' => $history,
            ]);
        });
        
        return $followUpDate;
    }
}
