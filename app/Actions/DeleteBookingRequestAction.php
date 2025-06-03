<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\BookingRequest;
use Illuminate\Support\Facades\DB;

final readonly class DeleteBookingRequestAction
{
    public function execute(BookingRequest $bookingRequest): void
    {
        DB::transaction(function () use ($bookingRequest): void {
            $bookingRequest->delete();
        });
    }
}
