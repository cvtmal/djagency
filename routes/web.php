<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // DJ Booking Tool Routes
    Route::get('booking', function () {
        return Inertia::render('booking');
    })->name('booking');
    
    Route::get('booking/availability', function () {
        return Inertia::render('booking/availability');
    })->name('booking.availability');
    
    Route::get('booking/requests', function () {
        return Inertia::render('booking/requests');
    })->name('booking.requests');
    
    Route::get('booking/djs', function () {
        return Inertia::render('booking');
    })->name('booking.djs');
    
    Route::get('booking/settings', function () {
        return Inertia::render('booking');
    })->name('booking.settings');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
