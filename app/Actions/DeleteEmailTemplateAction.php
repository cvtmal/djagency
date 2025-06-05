<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\DB;

final readonly class DeleteEmailTemplateAction
{
    /**
     * Delete an email template
     */
    public function execute(EmailTemplate $template): void
    {
        DB::transaction(function () use ($template): void {
            if ($template->is_default) {
                // If we're deleting the default template, we should
                // not leave the system without a default template
                $otherTemplate = EmailTemplate::query()
                    ->where('id', '!=', $template->id)
                    ->first();
                
                if ($otherTemplate) {
                    $otherTemplate->update(['is_default' => true]);
                }
            }
            
            $template->delete();
        });
    }
}
