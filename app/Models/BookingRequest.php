<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\BookingStatusCast;
use App\Enums\BookingStatusEnum;
use App\Enums\ClientResponseMethodEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingRequest extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    /**
     * @var array<string, string|class-string>
     */
    protected $casts = [
        'genres' => 'array',
        'music_ratings' => 'array',
        'status' => BookingStatusCast::class,
        'guest_count' => 'integer',
        'has_responded' => 'boolean',
        'response_method' => ClientResponseMethodEnum::class,
        'follow_up_history' => 'array',
        'last_response_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
    ];
    
    /**
     * @return BelongsTo<DJ, BookingRequest>
     */
    public function dj(): BelongsTo
    {
        return $this->belongsTo(DJ::class);
    }
    
    /**
     * @return BelongsTo<BookingDate, BookingRequest>
     */
    public function bookingDate(): BelongsTo
    {
        return $this->belongsTo(BookingDate::class);
    }
    
    /**
     * @return HasMany<ClientInteraction>
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(ClientInteraction::class);
    }
    
    /**
     * Check if this booking request needs a follow-up
     */
    public function needsFollowUp(): bool
    {
        // Check if the booking is in 'quoted' status
        if ($this->status !== BookingStatusEnum::Quoted) {
            return false;
        }
        
        // If it has a next_follow_up_at date and that date is in the past
        if ($this->next_follow_up_at !== null && $this->next_follow_up_at->isPast()) {
            return true;
        }
        
        // If it doesn't have a next follow-up date but is quoted and hasn't been responded to
        if (!$this->has_responded && $this->next_follow_up_at === null) {
            // If it's been more than 3 days since created/updated and no response
            return $this->updated_at->diffInDays(now()) >= 3;
        }
        
        return false;
    }
}
