<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetAgencyBookedAvailabilitiesStatsAction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request, GetAgencyBookedAvailabilitiesStatsAction $action): Response
    {
        return Inertia::render('dashboard', [
            'agencyBookedStats' => $action->execute(2025),
        ]);
    }
}
