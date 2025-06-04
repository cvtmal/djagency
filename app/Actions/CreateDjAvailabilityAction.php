<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DJ;
use App\Models\DjAvailability;
use Illuminate\Support\Facades\DB;

final readonly class CreateDjAvailabilityAction
{
    /**
     * @param array{
     *     date: string,
     *     status: string,
     *     is_custom_date?: bool,
     *     note?: ?string
     * } $data
     */
    public function execute(DJ $dj, array $data): DjAvailability
    {
        return DB::transaction(function () use ($dj, $data): DjAvailability {
            $availability = new DjAvailability;
            $availability->dj_id = $dj->id;
            $availability->date = $data['date'];
            $availability->status = DjAvailabilityStatusEnum::from($data['status']);
            $availability->is_custom_date = $data['is_custom_date'] ?? false;
            $availability->note = $data['note'] ?? null;
            $availability->save();

            return $availability;
        });
    }
}
