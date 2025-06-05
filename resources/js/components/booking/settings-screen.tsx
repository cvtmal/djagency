import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { router, usePage } from '@inertiajs/react';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function SettingsScreen() {
  const { showToast } = useToast();
  
  // Email templates state
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Template form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    body: '',
    is_default: false
  });
  
  // Other settings state
  const [settings, setSettings] = useState({
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
  
  // Get email templates from Inertia props
  const { props } = usePage();
  const initialTemplates = props.emailTemplates as EmailTemplate[] | undefined;
  
  // Set initial templates from props
  useEffect(() => {
    if (initialTemplates) {
      setEmailTemplates(initialTemplates);
      setIsLoading(false);
    }
  }, [initialTemplates]);

  const handleInputChange = (
    category: 'bookingSettings' | 'statusColors',
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
  
  const handleTemplateFormChange = (field: string, value: any) => {
    setTemplateForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend for the other settings
    showToast('Settings saved successfully', 'success');
  };
  
  const openCreateTemplateDialog = () => {
    setCurrentTemplate(null);
    setTemplateForm({
      name: '',
      subject: '',
      body: '',
      is_default: false
    });
    setIsDialogOpen(true);
  };
  
  const openEditTemplateDialog = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      is_default: template.is_default
    });
    setIsDialogOpen(true);
  };
  
  const handleSaveTemplate = () => {
    try {
      if (currentTemplate) {
        // Update existing template
        router.put(`/booking/email-templates/${currentTemplate.id}`, templateForm, {
          onSuccess: () => {
            showToast('Template updated successfully');
            setIsDialogOpen(false);
            resetForm();
          },
          onError: () => showToast('Failed to save template', 'error')
        });
      } else {
        // Create new template
        router.post('/booking/email-templates', templateForm, {
          onSuccess: () => {
            showToast('Template created successfully');
            setIsDialogOpen(false);
            resetForm();
          },
          onError: () => showToast('Failed to save template', 'error')
        });
      }
    } catch (error) {
      console.error('Error saving template:', error);
      showToast('Failed to save template', 'error');
    }
  };
  
  const handleDeleteTemplate = (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    router.delete(`/booking/email-templates/${templateId}`, {
      onSuccess: () => {
        showToast('Template deleted successfully');
      },
      onError: () => {
        showToast('Failed to delete template', 'error');
      }
    });
  };

  const resetForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      body: '',
      is_default: false
    });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Configure templates for automated emails. Use braces for dynamic content placeholders like {'{client_name}'}
            </CardDescription>
          </div>
          <Button onClick={openCreateTemplateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">Loading templates...</div>
          ) : emailTemplates.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No email templates found. Click "Add Template" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">{template.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditTemplateDialog(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  {template.is_default && (
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                      Default Template
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Subject:</p>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Body preview:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{template.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Email Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="templateName">Name</Label>
              <Input 
                id="templateName" 
                value={templateForm.name} 
                onChange={(e) => handleTemplateFormChange('name', e.target.value)} 
                placeholder="Template name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="templateSubject">Subject</Label>
              <Input 
                id="templateSubject" 
                value={templateForm.subject} 
                onChange={(e) => handleTemplateFormChange('subject', e.target.value)} 
                placeholder="Email subject"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="templateBody">Body</Label>
              <Textarea 
                id="templateBody" 
                value={templateForm.body} 
                onChange={(e) => handleTemplateFormChange('body', e.target.value)} 
                rows={10}
                placeholder="Email body content"
              />
              <p className="text-xs text-gray-500">
                Available placeholders: {'{client_name}'}, {'{event_date}'}, {'{event_type}'}, {'{dj_list}'}, {'{venue}'}, {'{sender_name}'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isDefault" 
                checked={templateForm.is_default} 
                onCheckedChange={(checked) => handleTemplateFormChange('is_default', checked)}
              />
              <Label htmlFor="isDefault">Set as default template</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
