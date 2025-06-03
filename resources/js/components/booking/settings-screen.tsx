import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function SettingsScreen() {
  const { showToast } = useToast();
  
  // Mock settings state
  const [settings, setSettings] = useState({
    emailTemplates: {
      quoteSubject: 'Your DJ quote for {{event_date}}',
      quoteBody: 'Dear {{client_name}},\n\nThank you for your inquiry about booking a DJ for your event on {{event_date}}.\n\nWe are pleased to offer you a quote for {{dj_name}} at {{venue}} for {{hours}} hours.\n\nPlease let us know if you would like to proceed with this booking.\n\nBest regards,\nThe DJ Agency Team',
      confirmationSubject: 'Booking Confirmation - {{event_date}}',
      confirmationBody: 'Dear {{client_name}},\n\nThis email confirms your booking of {{dj_name}} for your event on {{event_date}} at {{venue}}.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards,\nThe DJ Agency Team',
    },
    bookingSettings: {
      quoteValidityDays: 7,
      defaultBookingDuration: 4,
      autoDeclineAfterDays: 14,
    },
    statusColors: {
      free: '#e5e7eb',  // gray-200
      quoted: '#fef3c7', // yellow-100
      booked: '#d1fae5', // green-100
      blocked: '#fee2e2', // red-100
    }
  });

  const handleInputChange = (
    category: 'emailTemplates' | 'bookingSettings' | 'statusColors',
    field: string,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Configure templates for automated emails. Use double curly braces for dynamic content placeholders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Quote Email</h3>
            <div className="space-y-2">
              <label className="text-sm">Subject</label>
              <input
                type="text"
                value={settings.emailTemplates.quoteSubject}
                onChange={(e) => handleInputChange('emailTemplates', 'quoteSubject', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Body</label>
              <textarea
                value={settings.emailTemplates.quoteBody}
                onChange={(e) => handleInputChange('emailTemplates', 'quoteBody', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={5}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Booking Confirmation Email</h3>
            <div className="space-y-2">
              <label className="text-sm">Subject</label>
              <input
                type="text"
                value={settings.emailTemplates.confirmationSubject}
                onChange={(e) => handleInputChange('emailTemplates', 'confirmationSubject', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Body</label>
              <textarea
                value={settings.emailTemplates.confirmationBody}
                onChange={(e) => handleInputChange('emailTemplates', 'confirmationBody', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Settings</CardTitle>
          <CardDescription>
            Configure default timeframes and behaviors for bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quote Validity (days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.bookingSettings.quoteValidityDays}
              onChange={(e) => handleInputChange('bookingSettings', 'quoteValidityDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <p className="text-xs text-gray-500">Number of days before a quote expires</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Booking Duration (hours)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={settings.bookingSettings.defaultBookingDuration}
              onChange={(e) => handleInputChange('bookingSettings', 'defaultBookingDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <p className="text-xs text-gray-500">Default duration when creating new bookings</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Auto-Decline After (days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.bookingSettings.autoDeclineAfterDays}
              onChange={(e) => handleInputChange('bookingSettings', 'autoDeclineAfterDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <p className="text-xs text-gray-500">Number of days of inactivity before auto-decline</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Status Colors</CardTitle>
          <CardDescription>
            Customize colors for different booking statuses
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(settings.statusColors).map(([status, color]) => (
            <div key={status} className="space-y-2">
              <label className="text-sm font-medium capitalize">{status}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleInputChange('statusColors', status, e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleInputChange('statusColors', status, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div 
                className="w-full h-8 rounded-md mt-1" 
                style={{ backgroundColor: color as string }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
