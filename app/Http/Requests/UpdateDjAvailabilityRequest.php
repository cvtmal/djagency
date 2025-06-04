<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DjAvailabilityStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateDjAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', new Enum(DjAvailabilityStatusEnum::class)],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
