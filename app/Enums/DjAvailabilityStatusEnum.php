<?php

declare(strict_types=1);

namespace App\Enums;

enum DjAvailabilityStatusEnum: string
{
    case Available = 'available';
    case Blocked = 'blocked';
    case PendingAgencyRequest = 'pending_agency_request';
    case BookedThroughAgency = 'booked_through_agency';
    case EventuallyAvailable = 'eventually_available';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Available',
            self::Blocked => 'Blocked',
            self::PendingAgencyRequest => 'Pending Agency Request',
            self::BookedThroughAgency => 'Booked Through Agency',
            self::EventuallyAvailable => 'Eventually Available',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Available => 'bg-gray-100 text-gray-600',
            self::Blocked => 'bg-red-100 text-red-800',
            self::PendingAgencyRequest => 'bg-green-100 text-green-800',
            self::BookedThroughAgency => 'bg-green-50 text-green-600',
            self::EventuallyAvailable => 'bg-blue-50 text-blue-600',
        };
    }
}
