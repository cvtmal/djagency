<?php

declare(strict_types=1);

use App\Jobs\ProcessPendingFollowUps;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ProcessPendingFollowUps)->dailyAt('09:00');

// Additional command to manually trigger follow-up processing
Artisan::command('booking-requests:process-follow-ups', function () {
    $this->info('Processing booking follow-ups...');
    ProcessPendingFollowUps::dispatch();
    $this->info('Follow-up processing has been queued.');
})->purpose('Process booking request follow-ups');
