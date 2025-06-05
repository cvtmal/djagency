<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FeedbackStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DjFeedbackRequest extends Model
{
    use HasFactory;

    /**
     * @var array<string, string|class-string>
     */
    protected $casts = [
        'was_party_good' => 'boolean',
        'request_review' => 'boolean',
        'status' => FeedbackStatusEnum::class,
        'sent_at' => 'datetime',
        'responded_at' => 'datetime',
        'client_contacted_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<DjAvailability, DjFeedbackRequest>
     */
    public function availability(): BelongsTo
    {
        return $this->belongsTo(DjAvailability::class, 'booking_id');
    }

    /**
     * @return BelongsTo<DJ, DjFeedbackRequest>
     */
    public function dj(): BelongsTo
    {
        return $this->belongsTo(DJ::class, 'dj_id');
    }
}
