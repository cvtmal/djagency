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
     * @param  Carbon|null  $followUpDate  Optional specific date for follow-up, default is 3 days from now
     * @param  string|null  $notes  Optional notes for this follow-up
     * @param  bool  $isUpdate  Whether this is an update to an existing follow-up (defaults to false)
     * @return Carbon The scheduled follow-up date
     *
     * @throws \Throwable
     */
    public function execute(BookingRequest $bookingRequest, ?Carbon $followUpDate = null, ?string $notes = null, bool $isUpdate = false): Carbon
    {
        // Default to 3 days in the future if no specific date is provided
        $followUpDate = $followUpDate ?? now()->addDays(3);

        DB::transaction(function () use ($bookingRequest, $followUpDate, $notes, $isUpdate): void {
            // Only increment follow-up count if this is a new follow-up, not an update
            $followUpCount = $isUpdate ? $bookingRequest->follow_up_count : $bookingRequest->follow_up_count + 1;

            // Create or update the follow-up history array
            /** @var array<int, array{date: string, scheduled_at: string, notes?: string}> $history */
            $history = $bookingRequest->follow_up_history ?? [];
            
            $historyEntry = [
                'date' => $followUpDate->toDateString(),
                'scheduled_at' => now()->toDateTimeString(),
            ];
            
            if ($notes) {
                $historyEntry['notes'] = $notes;
            }
            
            $history[] = $historyEntry;

            $bookingRequest->update([
                'next_follow_up_at' => $followUpDate,
                'follow_up_count' => $followUpCount,
                'follow_up_history' => $history,
            ]);
        });

        return $followUpDate;
    }
}
