<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\BookingStatusCast;
use App\Enums\BookingStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    ];
    
    // Status is handled by the BookingStatusCast class
    
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
}
