<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\DB;

final readonly class CreateEmailTemplateAction
{
    /**
     * Create a new email template
     * 
     * @param array{
     *     name: string,
     *     subject: string,
     *     body: string,
     *     is_default?: bool
     * } $data
     */
    public function execute(array $data): EmailTemplate
    {
        /** @var EmailTemplate $template */
        $template = DB::transaction(function () use ($data): EmailTemplate {
            // If this template is marked as default, unmark all others
            if (isset($data['is_default']) && $data['is_default']) {
                EmailTemplate::query()
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
            
            return EmailTemplate::query()->create($data);
        });
        
        return $template;
    }
}
