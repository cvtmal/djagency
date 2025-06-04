<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DjAvailabilityStatusEnum;
use App\Enums\DjStatus;
use App\Models\BookingRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DJ extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    /**
     * The "booted" method of the model.
     */
    protected static function boot(): void
    {
        parent::boot();
        
        static::creating(function (DJ $dj): void {
            if (empty($dj->unique_identifier)) {
                $dj->unique_identifier = (string) \Illuminate\Support\Str::uuid();
            }
        });
        
        static::created(function (DJ $dj): void {
            static::generateAvailabilitiesForWeekendDates($dj);
        });
    }
    
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
        'unique_identifier' => 'string',
    ];
    
    /**
     * @return HasMany<BookingRequest>
     */
    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class);
    }

    /**
     * @return HasMany<DjAvailability>
     */
    public function availabilities(): HasMany
    {
        return $this->hasMany(DjAvailability::class, 'dj_id');
    }
    
    /**
     * Generate availability records for all Fridays and Saturdays in the current year.
     */
    protected static function generateAvailabilitiesForWeekendDates(DJ $dj): void
    {
        $year = 2025; // Current year (2025)
        $startDate = Carbon::createFromDate($year, 1, 1)->startOfYear();
        $endDate = Carbon::createFromDate($year, 12, 31)->endOfYear();
        
        $availabilities = [];
        $date = clone $startDate;
        
        while ($date->lte($endDate)) {
            // Check if the day is Friday (5) or Saturday (6)
            if ($date->dayOfWeek === Carbon::FRIDAY || $date->dayOfWeek === Carbon::SATURDAY) {
                $availabilities[] = [
                    'dj_id' => $dj->id,
                    'date' => $date->toDateString(),
                    'is_custom_date' => false,
                    'status' => DjAvailabilityStatusEnum::Available->value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            $date->addDay();
        }
        
        DjAvailability::insert($availabilities);
    }
}
