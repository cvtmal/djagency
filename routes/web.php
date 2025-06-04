<?php

use App\Http\Controllers\BookingContactController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingRequestController;
use App\Http\Controllers\ClientInteractionController;
use App\Http\Controllers\DjAvailabilityController;
use App\Http\Controllers\DjManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::controller(BookingContactController::class)->group(function () {
    Route::get('contact', 'create')->name('contact');
    Route::post('contact', 'store')->name('contact.store');
});

// Public DJ Calendar Routes - accessible via unique identifier
Route::prefix('dj-calendar/{uniqueIdentifier}')->name('dj-calendar.')->controller(DjAvailabilityController::class)->group(function () {
    Route::get('/', 'show')->name('show');
    Route::post('/', 'store')->name('store');
    Route::put('/{djAvailability}', 'update')->name('update');
    Route::delete('/{djAvailability}', 'destroy')->name('destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // DJ Booking Tool Routes
    Route::get('booking', function () {
        return Inertia::render('booking');
    })->name('booking');

    Route::get('booking/availability', BookingController::class)->name('booking.availability');

    // Booking Requests
    Route::controller(BookingRequestController::class)->prefix('booking-requests')->name('booking-requests.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{bookingRequest}/email-quote', 'showEmailQuote')->name('email-quote');
        Route::post('/{bookingRequest}/email-quote', 'sendEmailQuote')->name('send-email-quote');
        Route::put('/{bookingRequest}', 'update')->name('update');
        Route::delete('/{bookingRequest}', 'destroy')->name('destroy');

        // Client Interactions
        Route::controller(ClientInteractionController::class)->prefix('{bookingRequest}/interactions')->name('interactions.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('/schedule-follow-up', 'showScheduleFollowUp')->name('schedule-follow-up');
            Route::post('/schedule-follow-up', 'scheduleFollowUp')->name('schedule-follow-up.store');
            Route::post('/update-follow-up', 'updateFollowUp')->name('update-follow-up');
        });
    });

    // Legacy route - redirect to new booking requests page
    Route::get('booking/requests', function () {
        return redirect()->route('booking-requests.index');
    })->name('booking.requests');

    Route::controller(DjManagementController::class)->prefix('booking/djs')->name('booking.djs')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store')->name('.store');
        Route::put('/{dj}', 'update')->name('.update');
        Route::delete('/{dj}', 'destroy')->name('.destroy');
    });

    // DJ Calendar Management for Admins
    Route::prefix('admin/dj-calendars')->name('admin.dj-calendars.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DjCalendarAdminController::class, 'index'])->name('index');
        Route::post('/{dj}/generate-link', [\App\Http\Controllers\Admin\DjCalendarAdminController::class, 'generateLink'])->name('generate-link');
        Route::get('/{dj}/stats', [\App\Http\Controllers\Admin\DjCalendarAdminController::class, 'showCalendarStats'])->name('stats');
    });

    Route::get('booking/settings', function () {
        return Inertia::render('booking/settings');
    })->name('booking.settings');

    Route::get('booking/dj-calendar', function () {
        return Inertia::render('booking/dj-calendar');
    })->name('booking.dj-calendar');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
