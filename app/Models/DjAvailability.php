<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DjAvailabilityStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DjAvailability extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'is_custom_date' => 'boolean',
        'status' => DjAvailabilityStatusEnum::class,
    ];

    /**
     * @return BelongsTo<DJ, DjAvailability>
     */
    public function dj(): BelongsTo
    {
        return $this->belongsTo(DJ::class, 'dj_id');
    }
}
