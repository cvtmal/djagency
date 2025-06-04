<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingDate extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
    ];

    /**
     * @return HasMany<BookingRequest>
     */
    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class);
    }
}
