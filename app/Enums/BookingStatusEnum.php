<?php

declare(strict_types=1);

namespace App\Enums;

enum BookingStatusEnum: string
{
    case New = 'new';
    case Quoted = 'quoted';
    case Booked = 'booked';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Quoted => 'Quoted',
            self::Booked => 'Booked',
            self::Cancelled => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::New => 'bg-gray-100 text-gray-600',
            self::Quoted => 'bg-yellow-100 text-yellow-800',
            self::Booked => 'bg-green-100 text-green-800',
            self::Cancelled => 'bg-red-100 text-red-800',
        };
    }
}
