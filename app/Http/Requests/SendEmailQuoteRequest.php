<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class SendEmailQuoteRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'sender_email' => ['required', 'email'],
            'cc_email' => ['nullable', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'dj_ids' => ['required', 'array'],
            'dj_ids.*' => ['integer', 'exists:djs,id'],
        ];
    }
}
