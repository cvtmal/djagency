<?php

declare(strict_types=1);

namespace App\Casts;

use App\Enums\BookingStatusEnum;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use ValueError;

final class BookingStatusCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?BookingStatusEnum
    {
        if ($value === null) {
            return null;
        }

        // Already an enum
        if ($value instanceof BookingStatusEnum) {
            return $value;
        }

        // Handle deprecated status values
        if (in_array($value, ['free', 'Free', 'blocked', 'Blocked'])) {
            return BookingStatusEnum::New;
        }

        // Try to get a valid enum value
        try {
            return BookingStatusEnum::from($value);
        } catch (ValueError $e) {
            // Default to New if we encounter an invalid value
            return BookingStatusEnum::New;
        }
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        // If it's already an enum instance, just get the value
        if ($value instanceof BookingStatusEnum) {
            return $value->value;
        }

        // If it's one of the deprecated values, convert to New
        if (in_array($value, ['free', 'Free', 'blocked', 'Blocked'])) {
            return BookingStatusEnum::New->value;
        }

        // Try to cast the value to an enum
        try {
            return BookingStatusEnum::from($value)->value;
        } catch (ValueError $e) {
            // Default to New if we encounter an invalid value
            return BookingStatusEnum::New->value;
        }
    }
}
