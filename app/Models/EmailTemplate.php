<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class EmailTemplate extends Model
{
    protected $casts = [
        'is_default' => 'boolean',
    ];
    
    /**
     * Get the template with placeholders replaced by actual values
     */
    public function getRenderedBody(array $replacements): string
    {
        return $this->replacePlaceholders($this->body, $replacements);
    }
    
    /**
     * Get the subject with placeholders replaced by actual values
     */
    public function getRenderedSubject(array $replacements): string
    {
        return $this->replacePlaceholders($this->subject, $replacements);
    }
    
    /**
     * Replace placeholders in text with actual values
     */
    private function replacePlaceholders(string $text, array $replacements): string
    {
        foreach ($replacements as $key => $value) {
            $text = str_replace('{' . $key . '}', $value, $text);
        }
        
        return $text;
    }
}
