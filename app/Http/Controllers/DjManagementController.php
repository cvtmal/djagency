<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GetDjsAction;
use App\Http\Requests\DJ\CreateDjRequest;
use App\Http\Requests\DJ\DeleteDjRequest;
use App\Http\Requests\DJ\UpdateDjRequest;
use App\Models\DJ;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class DjManagementController
{
    /**
     * Display the DJ management page
     */
    public function index(GetDjsAction $action): Response
    {
        $djs = $action->execute();
        
        return Inertia::render('booking/djs', [
            'djs' => $djs
        ]);
    }

    /**
     * Store a new DJ
     */
    public function store(CreateDjRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        // Convert comma-separated genres string to array
        if (is_string($data['genres'])) {
            $data['genres'] = array_values(array_filter(
                array_map('trim', explode(',', $data['genres']))
            ));
        }
        
        // Convert home_city to snake_case for database
        if (isset($data['homeCity'])) {
            $data['home_city'] = $data['homeCity'];
            unset($data['homeCity']);
        }
        
        DJ::create($data);
        
        return redirect()->back()->with('success', 'DJ created successfully.');
    }

    /**
     * Update an existing DJ
     */
    public function update(UpdateDjRequest $request, DJ $dj): RedirectResponse
    {
        $data = $request->validated();
        
        // Convert comma-separated genres string to array
        if (is_string($data['genres'])) {
            $data['genres'] = array_values(array_filter(
                array_map('trim', explode(',', $data['genres']))
            ));
        }
        
        // Convert home_city to snake_case for database
        if (isset($data['homeCity'])) {
            $data['home_city'] = $data['homeCity'];
            unset($data['homeCity']);
        }
        
        $dj->update($data);
        
        return redirect()->back()->with('success', 'DJ updated successfully.');
    }

    /**
     * Delete a DJ
     */
    public function destroy(DeleteDjRequest $request, DJ $dj): RedirectResponse
    {
        $dj->delete();
        
        return redirect()->back()->with('success', 'DJ deleted successfully.');
    }
}
