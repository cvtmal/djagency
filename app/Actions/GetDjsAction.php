<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\DJ;
use Illuminate\Database\Eloquent\Collection;

final readonly class GetDjsAction
{
    /**
     * Get all DJs with optional status filtering
     *
     * @param  string|null  $status  Filter DJs by status ('active', 'inactive', or null for all)
     * @return Collection<int, DJ>
     */
    public function execute(?string $status = null): Collection
    {
        $query = DJ::query();

        if ($status !== null) {
            $query->where('status', $status);
        }

        return $query->get();
    }
}
