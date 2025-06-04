<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('contact page can be rendered', function () {
    $response = $this->get(route('contact'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page->component('BookingForm'));
});

test('booking form can be submitted successfully', function () {
    $musicRatings = [
        'oldies' => 4,
        'hits90s' => 3,
        'modern' => 5,
        'hipHop' => 2,
        'latin' => 1,
        'electro' => 4,
        'rock' => 5,
        'mundart' => 2,
        'schlager' => 1,
    ];

    $contact = [
        'name' => 'Test User',
        'street' => 'Test Street 123',
        'city' => 'Test City',
        'postalCode' => '12345',
        'email' => 'test@example.com',
        'phone' => '+41791234567',
    ];

    $response = $this->post(route('contact.store'), [
        'eventType' => 'wedding',
        'date' => now()->addMonth()->format('Y-m-d'),
        'timeRange' => '18:00 - 02:00',
        'guestCount' => 100,
        'location' => 'Test Venue',
        'equipment' => 'dj',
        'musicRatings' => json_encode($musicRatings),
        'contact' => json_encode($contact),
        'additionalMusic' => 'Some special song requests',
        'contactOption' => 'email',
    ]);

    $response->assertRedirect(route('contact'));
    $response->assertSessionHas('success');

    // Verify that booking was created in the database
    $this->assertDatabaseHas('booking_requests', [
        'client_name' => 'Test User',
        'contact_email' => 'test@example.com',
        'venue' => 'Test Venue',
        'event_type' => 'wedding',
    ]);
});

test('booking form validates required fields', function () {
    $response = $this->post(route('contact.store'), [
        // Missing required fields
    ]);

    $response->assertSessionHasErrors(['eventType', 'date', 'timeRange', 'guestCount', 'location', 'equipment', 'musicRatings', 'contact', 'contactOption']);
});
