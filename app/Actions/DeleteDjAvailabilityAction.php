<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DjAvailability;
use Illuminate\Support\Facades\DB;

final readonly class DeleteDjAvailabilityAction
{
    public function execute(DjAvailability $availability): bool
    {
        return DB::transaction(function () use ($availability): bool {
            return (bool) $availability->delete();
        });
    }
}
