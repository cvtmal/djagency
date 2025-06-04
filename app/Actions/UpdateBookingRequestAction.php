<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\BookingRequest;
use Illuminate\Support\Facades\DB;

final readonly class UpdateBookingRequestAction
{
    public function execute(BookingRequest $bookingRequest, array $data): BookingRequest
    {
        return DB::transaction(function () use ($bookingRequest, $data): BookingRequest {
            $bookingRequest->update($data);

            return $bookingRequest->fresh();
        });
    }
}
