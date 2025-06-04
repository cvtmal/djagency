<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ClientResponseMethodEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientInteraction extends Model
{
    use HasFactory;

    /**
     * @var array<string, string|class-string>
     */
    protected $casts = [
        'interaction_method' => ClientResponseMethodEnum::class,
        'metadata' => 'array',
    ];

    /**
     * Get the booking request that owns the interaction
     *
     * @return BelongsTo<BookingRequest, ClientInteraction>
     */
    public function bookingRequest(): BelongsTo
    {
        return $this->belongsTo(BookingRequest::class);
    }
}
