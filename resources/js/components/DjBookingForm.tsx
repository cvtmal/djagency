import React, { useState, ChangeEvent } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useToast } from './ui/toast';
import { RatingInput } from '@/components/RatingInput';
import { router } from '@inertiajs/react';

interface FormState {
  eventType: string;
  date: string;
  timeRange: string;
  guestCount: number;
  location: string;
  equipment: string;
  musicRatings: {
    [key: string]: number;
  };
  additionalMusic: string;
  contact: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
  };
  contactOption: string;
}

export function DjBookingForm() {
  const [formData, setFormData] = useState<FormState>({
    eventType: '',
    date: '',
    timeRange: '',
    guestCount: 0,
    location: '',
    equipment: '',
    musicRatings: {
      oldies: 0,
      hits90s: 0,
      modern: 0,
      hipHop: 0,
      latin: 0,
      electro: 0,
      rock: 0,
      mundart: 0,
      schlager: 0,
    },
    additionalMusic: '',
    contact: {
      name: '',
      street: '',
      city: '',
      postalCode: '',
      email: '',
      phone: '',
    },
    contactOption: '',
  });

  const eventTypes = [
    { value: 'wedding', label: 'Hochzeit' },
    { value: 'corporate', label: 'Firmenevent' },
    { value: 'birthday', label: 'Geburtstag' },
    { value: 'other', label: 'Anderes' },
  ];

  const equipmentOptions = [
    { value: 'dj', label: 'vom DJ' },
    { value: 'available', label: 'ist vorhanden' },
    { value: 'unclear', label: 'unklar' },
  ];

  const contactOptions = [
    { value: 'email', label: 'Mail' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'callback', label: 'Rückruf' },
  ];

  const musicGenres = [
    { id: 'oldies', label: 'Oldies' },
    { id: 'hits90s', label: '90er Hits' },
    { id: '2000s', label: '2000er bis heute' },
    { id: 'hipHop', label: 'Hip Hop' },
    { id: 'latin', label: 'Latin' },
    { id: 'electro', label: 'Elektro' },
    { id: 'rock', label: 'Rock' },
    { id: 'mundart', label: 'Mundart' },
    { id: 'schlager', label: 'Schlager' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        if (parent === 'contact') {
          return {
            ...prev,
            contact: {
              ...prev.contact,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRatingChange = (genre: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      musicRatings: {
        ...prev.musicRatings,
        [genre]: value,
      },
    }));
  };

  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert FormState to a plain object format that Laravel can process
    const submissionData = {
      ...formData,
      // Stringify nested objects for proper transmission
      musicRatings: JSON.stringify(formData.musicRatings),
      contact: JSON.stringify(formData.contact)
    };
    
    // Submit the form data to the backend using Inertia.js
    router.post('/contact', submissionData as Record<string, any>, {
      onSuccess: () => {
        // Toast is displayed from the flash message on redirect
        showToast("Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.", "success");
        
        // Reset form after successful submission
        setFormData({
          eventType: '',
          date: '',
          timeRange: '',
          guestCount: 0,
          location: '',
          equipment: '',
          musicRatings: {
            oldies: 0,
            hits90s: 0,
            modern: 0,
            hipHop: 0,
            latin: 0,
            electro: 0,
            rock: 0,
            mundart: 0,
            schlager: 0,
          },
          additionalMusic: '',
          contact: {
            name: '',
            street: '',
            city: '',
            postalCode: '',
            email: '',
            phone: '',
          },
          contactOption: '',
        });
      },
      onError: (errors) => {
        // Display validation errors
        console.error(errors);
        showToast("Bitte überprüfen Sie das Formular auf Fehler.", "error");
      }
    });
  };

  return (
    <Card className="p-6 shadow-lg rounded-xl bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Details Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event wählen</Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Bitte wählen</option>
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeRange">Zeit von bis</Label>
              <Input
                id="timeRange"
                name="timeRange"
                placeholder="z.B. 18:00 - 02:00"
                value={formData.timeRange}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestCount">Anzahl Gäste</Label>
              <Input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                value={formData.guestCount || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location + Ort</Label>
              <Input
                id="location"
                name="location"
                placeholder="Name und Adresse der Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipment">DJ Technik</Label>
              <select
                id="equipment"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Bitte wählen</option>
                {equipmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Music Preferences Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Musikwünsche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            {musicGenres.map((genre) => (
              <div key={genre.id} className="flex items-center justify-between">
                <Label htmlFor={genre.id} className="w-1/3">{genre.label}</Label>
                <RatingInput 
                  id={genre.id}
                  value={formData.musicRatings[genre.id]} 
                  onChange={(value) => handleRatingChange(genre.id, value)}
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="additionalMusic">Zusätzliche Musik</Label>
            <textarea
              id="additionalMusic"
              name="additionalMusic"
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary resize-none bg-white p-3 border"
              placeholder="Spezielle Musikwünsche oder Anmerkungen"
              value={formData.additionalMusic}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Kontaktperson</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact.name">Name</Label>
              <Input
                id="contact.name"
                name="contact.name"
                value={formData.contact.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact.street">Strasse</Label>
              <Input
                id="contact.street"
                name="contact.street"
                value={formData.contact.street}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact.city">Ort</Label>
              <Input
                id="contact.city"
                name="contact.city"
                value={formData.contact.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact.postalCode">PLZ</Label>
              <Input
                id="contact.postalCode"
                name="contact.postalCode"
                value={formData.contact.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact.email">Email</Label>
              <Input
                id="contact.email"
                name="contact.email"
                type="email"
                value={formData.contact.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact.phone">Telefon</Label>
              <Input
                id="contact.phone"
                name="contact.phone"
                type="tel"
                value={formData.contact.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactOption">Kontaktoption</Label>
              <select
                id="contactOption"
                name="contactOption"
                value={formData.contactOption}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Bitte wählen</option>
                {contactOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transition-all duration-200 transform hover:scale-[1.01]"
          >
            Abschicken
          </Button>
        </div>
      </form>
    </Card>
  );
}
