<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\SendFollowUpEmailAction;
use App\Actions\ScheduleFollowUpAction;
use App\Enums\BookingStatusEnum;
use App\Models\BookingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessPendingFollowUps implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Starting to process pending follow-ups');
        
        // Get all booking requests in 'quoted' status that need follow-up
        $pendingRequests = BookingRequest::query()
            ->where('status', BookingStatusEnum::Quoted)
            ->where(function ($query) {
                // Either they have a next_follow_up_at date in the past
                $query->whereNotNull('next_follow_up_at')
                      ->where('next_follow_up_at', '<=', now())
                      ->where('has_responded', false);
            })
            ->orWhere(function ($query) {
                // Or they haven't responded, don't have a scheduled follow-up,
                // but it's been at least 3 days since their last update
                $query->where('status', BookingStatusEnum::Quoted)
                      ->whereNull('next_follow_up_at')
                      ->where('has_responded', false)
                      ->where('updated_at', '<=', now()->subDays(3));
            })
            ->get();
        
        Log::info("Found {$pendingRequests->count()} booking requests needing follow-up");
        
        $sendFollowUpAction = new SendFollowUpEmailAction();
        $scheduleFollowUpAction = new ScheduleFollowUpAction();
        
        // Process each pending request
        foreach ($pendingRequests as $request) {
            // If they've never had a follow-up, schedule their first one
            if ($request->follow_up_count === 0) {
                Log::info("Scheduling first follow-up for booking request {$request->id}");
                $scheduleFollowUpAction->execute($request);
                continue;
            }
            
            // Check if this booking request is set for automated follow-up
            if ($request->automated_follow_up) {
                // If automated, send the follow-up email automatically
                Log::info("Sending automated follow-up #{$request->follow_up_count} for booking request {$request->id}");
                $sendFollowUpAction->execute($request);
            } else {
                // If not automated, just log it to notify the admin dashboard
                Log::info("Manual follow-up reminder created for booking request {$request->id}");
                
                // Create a client interaction record as a reminder without sending an email
                $request->interactions()->create([
                    'method' => 'reminder',
                    'notes' => "Manual follow-up reminder for booking request #{$request->id}",
                    'is_follow_up' => true,
                    'is_client_response' => false,
                ]);
            }
        }
        
        Log::info('Completed processing pending follow-ups');
    }
}
