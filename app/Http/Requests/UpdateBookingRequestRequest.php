<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateBookingRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => 'sometimes|string|max:255',
            'venue' => 'sometimes|string|max:255',
            'event_type' => 'sometimes|string|max:255',
            'start_time' => 'sometimes|date_format:Y-m-d',
            'status' => 'sometimes|string|in:new,quoted,booked,cancelled',
            'guest_count' => 'sometimes|integer|min:1',
        ];
    }
}
