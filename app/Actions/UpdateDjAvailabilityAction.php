<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\DjAvailabilityStatusEnum;
use App\Models\DjAvailability;
use Illuminate\Support\Facades\DB;

final readonly class UpdateDjAvailabilityAction
{
    /**
     * @param array{
     *     status?: string,
     *     note?: ?string
     * } $data
     */
    public function execute(DjAvailability $availability, array $data): DjAvailability
    {
        return DB::transaction(function () use ($availability, $data): DjAvailability {
            if (isset($data['status'])) {
                $availability->status = DjAvailabilityStatusEnum::from($data['status']);
            }

            if (array_key_exists('note', $data)) {
                $availability->note = $data['note'];
            }

            $availability->save();

            return $availability;
        });
    }
}
