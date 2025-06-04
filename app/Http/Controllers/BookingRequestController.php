<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\DeleteBookingRequestAction;
use App\Actions\SendEmailQuoteAction;
use App\Actions\UpdateBookingRequestAction;
use App\Http\Requests\SendEmailQuoteRequest;
use App\Http\Requests\UpdateBookingRequestRequest;
use App\Models\BookingRequest;
use App\Models\DJ;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BookingRequestController
{
    public function index(): Response
    {
        return Inertia::render('booking/requests', [
            'bookingRequests' => BookingRequest::query()
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function update(
        UpdateBookingRequestRequest $request,
        BookingRequest $bookingRequest,
        UpdateBookingRequestAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest, $request->validated());

        return redirect()->back()->with('success', 'Booking request updated successfully.');
    }

    public function destroy(
        BookingRequest $bookingRequest,
        DeleteBookingRequestAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest);

        return redirect()->route('booking-requests.index')->with('success', 'Booking request deleted successfully.');
    }

    public function showEmailQuote(BookingRequest $bookingRequest): Response
    {
        return Inertia::render('booking/email-quote', [
            'bookingRequest' => $bookingRequest,
            'djs' => DJ::all(),
            // In a production app, you would load actual email templates from a repository or database
            'emailTemplates' => [
                [
                    'id' => 1,
                    'name' => 'Standardangebot',
                    'subject' => 'Ihr DJ-Angebot für {event_type}',
                    'body' => "Sehr geehrte(r) {client_name},\n\nVielen Dank für Ihr Interesse an unseren DJ-Dienstleistungen für Ihre(n) {event_type} am {event_date}.\n\nBasierend auf Ihren Anforderungen möchte ich Ihnen folgende DJs empfehlen:\n{dj_list}\n\nUnser Standardangebot für diese Art von Veranstaltung beträgt CHF XXX.-\n\nBei Fragen stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen,\n{sender_name}",
                ],
                [
                    'id' => 2,
                    'name' => 'Hochzeits-Special',
                    'subject' => 'DJ-Service für die Hochzeit von {client_name}',
                    'body' => "Sehr geehrte(r) {client_name},\n\nHerzlichen Glückwunsch zu Ihrer bevorstehenden Hochzeit! Wir würden uns geehrt fühlen, DJ-Services für Ihren besonderen Tag am {event_date} in {venue} anzubieten.\n\nFür Hochzeiten empfehlen wir die folgenden erfahrenen DJs:\n{dj_list}\n\nUnser Hochzeitspaket beinhaltet:\n- Professionelle Soundanlage\n- Lichtanlage\n- Koordinierte Musik für Zeremonie, Cocktailstunde und Empfang\n\nDie Gesamtkosten für dieses Paket betragen CHF XXX.-.\n\nIch stehe Ihnen gerne für weitere Details zur Verfügung.\n\nMit besten Wünschen,\n{sender_name}",
                ],
                [
                    'id' => 3,
                    'name' => 'Firmenevent',
                    'subject' => 'DJ-Service-Angebot für Ihre Firmenveranstaltung',
                    'body' => "Sehr geehrte(r) {client_name},\n\nVielen Dank für Ihre Anfrage zu unseren DJ-Dienstleistungen für Ihre Firmenveranstaltung am {event_date}.\n\nWir sind spezialisiert auf professionelle Unterhaltung für Firmenfeiern und ich möchte Ihnen folgende DJs empfehlen, die umfangreiche Erfahrung mit Firmenveranstaltungen haben:\n{dj_list}\n\nUnser Firmenpaket beinhaltet:\n- Professionelle Soundanlage\n- Hintergrundmusik\n- Moderationsservice\n- Individuelle Playlist\n\nDie Investition für dieses Paket beträgt CHF XXX.-.\n\nIch freue mich auf die mögliche Zusammenarbeit mit Ihnen.\n\nMit freundlichen Grüßen,\n{sender_name}",
                ],
                [
                    'id' => 4,
                    'name' => 'Standard Quote',
                    'subject' => 'Your DJ Quote for {event_type}',
                    'body' => "Dear {client_name},\n\nThank you for your interest in our DJ services for your {event_type} on {event_date}.\n\nBased on your requirements, I would like to recommend the following DJs:\n{dj_list}\n\nOur standard quote for this type of event is CHF XXX.-.\n\nPlease let me know if you have any questions.\n\nBest regards,\n{sender_name}",
                ],
                [
                    'id' => 5,
                    'name' => 'Wedding Special',
                    'subject' => 'Wedding DJ Services for {client_name}',
                    'body' => "Dear {client_name},\n\nCongratulations on your upcoming wedding! We would be honored to provide DJ services for your special day on {event_date} at {venue}.\n\nFor weddings, we recommend the following experienced DJs:\n{dj_list}\n\nOur wedding package includes:\n- Professional sound equipment\n- Lighting setup\n- Coordinated music for ceremony, cocktail hour, and reception\n\nThe total cost for this package is CHF XXX.-.\n\nI am available to discuss further details at your convenience.\n\nBest wishes,\n{sender_name}",
                ],
                [
                    'id' => 6,
                    'name' => 'Corporate Event',
                    'subject' => 'DJ Services Proposal for Your Corporate Event',
                    'body' => "Dear {client_name},\n\nThank you for inquiring about our DJ services for your corporate event on {event_date}.\n\nWe specialize in providing professional entertainment for corporate functions, and I would like to recommend the following DJs who have extensive experience with corporate events:\n{dj_list}\n\nOur corporate package includes:\n- Professional sound system\n- Background music\n- MC services\n- Custom playlist\n\nThe investment for this package is CHF XXX.-.\n\nI look forward to the possibility of working with you.\n\nBest regards,\n{sender_name}",
                ],
            ],
        ]);
    }

    public function sendEmailQuote(
        SendEmailQuoteRequest $request,
        BookingRequest $bookingRequest,
        SendEmailQuoteAction $action
    ): RedirectResponse {
        $action->execute($bookingRequest, $request->validated());

        return redirect()->route('booking-requests.index')->with('success', 'Email quote sent successfully.');
    }
}
