<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateDjFeedbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // This is a public form accessed via a unique token, so we allow it
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'was_party_good' => ['required', 'boolean'],
            'request_review' => ['required', 'boolean'],
            'client_email' => ['nullable', 'email'],
            'additional_comments' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
