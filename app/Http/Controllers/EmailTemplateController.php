<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateEmailTemplateAction;
use App\Actions\DeleteEmailTemplateAction;
use App\Actions\UpdateEmailTemplateAction;
use App\Http\Requests\CreateEmailTemplateRequest;
use App\Http\Requests\UpdateEmailTemplateRequest;
use App\Models\EmailTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class EmailTemplateController
{

    public function index(): Response
    {
        return Inertia::render('booking/email-templates', [
            'emailTemplates' => EmailTemplate::query()->orderBy('id')->get(),
        ]);
    }

    public function store(
        CreateEmailTemplateRequest $request,
        CreateEmailTemplateAction $action
    ): RedirectResponse {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Email template created successfully.');
    }

    public function update(
        UpdateEmailTemplateRequest $request,
        EmailTemplate $emailTemplate,
        UpdateEmailTemplateAction $action
    ): RedirectResponse {
        $action->execute($emailTemplate, $request->validated());

        return redirect()->back()->with('success', 'Email template updated successfully.');
    }

    public function destroy(
        EmailTemplate $emailTemplate,
        DeleteEmailTemplateAction $action
    ): RedirectResponse {
        $action->execute($emailTemplate);

        return redirect()->back()->with('success', 'Email template deleted successfully.');
    }
}
