<?php

declare(strict_types=1);

namespace App\Http\Requests\DJ;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateDjRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'genres' => ['required'], // Will handle array or string in controller
            'status' => ['required', 'string', 'in:active,inactive'],
            'homeCity' => ['required', 'string', 'max:255'],
        ];
    }
}
