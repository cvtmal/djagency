<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DjStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DJ extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    /**
     * The table associated with the model.
     */
    protected $table = 'djs';
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'genres' => 'array',
        'status' => DjStatus::class,
    ];
    
    /**
     * @return HasMany<BookingRequest>
     */
    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class);
    }
}
