<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\BookingRequest;
use App\Models\DJ;
use App\Models\DjAvailability;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class AssignDjToBookingRequestAction
{
    public function execute(BookingRequest $bookingRequest, int $djId): void
    {
        DB::transaction(function () use ($bookingRequest, $djId): void {
            $dj = DJ::findOrFail($djId);
            $bookingRequest->dj()->associate($dj);
            $bookingRequest->save();
            
            $date = Carbon::parse($bookingRequest->date);
            
            DjAvailability::updateOrCreate(
                [
                    'dj_id' => $djId,
                    'date' => $bookingRequest->date
                ],
                [
                    'status' => DjAvailabilityStatusEnum::BookedThroughAgency,
                    'is_custom_date' => !($date->isFriday() || $date->isSaturday())
                ]
            );
        });
    }
}
