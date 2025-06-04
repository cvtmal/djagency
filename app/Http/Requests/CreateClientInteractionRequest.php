<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ClientResponseMethodEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class CreateClientInteractionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'interaction_method' => ['required', new Enum(ClientResponseMethodEnum::class)],
            'notes' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
            'metadata.*' => ['string'],
        ];
    }
}
