<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\DB;

final readonly class UpdateEmailTemplateAction
{
    /**
     * Update an existing email template
     * 
     * @param EmailTemplate $template
     * @param array{
     *     name?: string,
     *     subject?: string,
     *     body?: string,
     *     is_default?: bool
     * } $data
     */
    public function execute(EmailTemplate $template, array $data): EmailTemplate
    {
        DB::transaction(function () use ($template, $data): void {
            // If this template is marked as default, unmark all others
            if (isset($data['is_default']) && $data['is_default']) {
                EmailTemplate::query()
                    ->where('id', '!=', $template->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
            
            $template->update($data);
        });
        
        return $template->fresh();
    }
}
