<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

final class CreateContactBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Public form, no auth required
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
            'eventType' => ['required', 'string', 'in:wedding,corporate,birthday,other'],
            'date' => ['required', 'date', 'after:today'],
            'timeRange' => ['required', 'string', 'max:50'],
            'guestCount' => ['required', 'integer', 'min:1'],
            'location' => ['required', 'string', 'max:255'],
            'equipment' => ['required', 'string', 'in:dj,available,unclear'],
            'musicRatings' => ['required', 'json'],
            'additionalMusic' => ['nullable', 'string'],
            'contact' => ['required', 'json'],
            'contactOption' => ['required', 'string', 'in:email,whatsapp,callback'],
        ];
    }
    
    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $data = $validator->validated();
            
            // Parse and validate JSON fields
            if (isset($data['musicRatings'])) {
                $musicRatings = json_decode($data['musicRatings'], true);
                if (!is_array($musicRatings)) {
                    $validator->errors()->add('musicRatings', 'Invalid music ratings format');
                }
            }
            
            if (isset($data['contact'])) {
                $contact = json_decode($data['contact'], true);
                if (!is_array($contact)) {
                    $validator->errors()->add('contact', 'Invalid contact information format');
                }
            }
        });
    }
    
    /**
     * Get the validated data from the request.
     *
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated($key, $default);
        
        // Handle nested validation for musicRatings after JSON decoding
        if (isset($validated['musicRatings']) && is_array($validated['musicRatings'])) {
            $validator = validator($validated['musicRatings'], [
                'oldies' => ['required', 'integer', 'between:0,5'],
                'hits90s' => ['required', 'integer', 'between:0,5'],
                'modern' => ['required', 'integer', 'between:0,5'],
                'hipHop' => ['required', 'integer', 'between:0,5'],
                'latin' => ['required', 'integer', 'between:0,5'],
                'electro' => ['required', 'integer', 'between:0,5'],
                'rock' => ['required', 'integer', 'between:0,5'],
                'mundart' => ['required', 'integer', 'between:0,5'],
                'schlager' => ['required', 'integer', 'between:0,5'],
            ]);
            
            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }
        }
        
        // Handle nested validation for contact after JSON decoding
        if (isset($validated['contact']) && is_array($validated['contact'])) {
            $validator = validator($validated['contact'], [
                'name' => ['required', 'string', 'max:255'],
                'street' => ['required', 'string', 'max:255'],
                'city' => ['required', 'string', 'max:255'],
                'postalCode' => ['required', 'string', 'max:20'],
                'email' => ['required', 'email', 'max:255'],
                'phone' => ['required', 'string', 'max:50'],
            ]);
            
            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }
        }
        
        return $validated;
    }
    
    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'eventType' => 'Event type',
            'timeRange' => 'Time range',
            'guestCount' => 'Number of guests',
            'equipment' => 'DJ equipment',
            'musicRatings' => 'Music preferences',
            'contact.name' => 'Contact name',
            'contact.street' => 'Street',
            'contact.city' => 'City',
            'contact.postalCode' => 'Postal code',
            'contact.email' => 'Email',
            'contact.phone' => 'Phone number',
            'contactOption' => 'Contact method',
        ];
    }
}
