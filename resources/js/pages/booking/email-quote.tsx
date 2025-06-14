import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { BookingRequestTableItem, DJ, EmailTemplate } from '@/components/booking/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Check, Minus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

type PageWithLayout = React.FC<EmailQuotePageProps> & {
  layout: (page: React.ReactNode) => React.ReactElement;
};

// Helper function to format a list of DJs with their genres
const formatDjList = (djs: DJ[]): string => {
  if (!djs.length) return 'No DJs selected';

  return djs.map(dj => `- ${dj.name} (${dj.genres.join(', ')})`).join('\n');
};

interface EmailQuotePageProps {
  bookingRequest: BookingRequestTableItem;
  djs: DJ[];
  emailTemplates: EmailTemplate[];
}

const EmailQuotePage: PageWithLayout = ({
  bookingRequest,
  djs,
  emailTemplates
}) => {
  const [selectedDjs, setSelectedDjs] = useState<DJ[]>([]);
    // Genre filter state: Map<genre, filterState> where filterState is: 0 = unfiltered, 1 = include, 2 = exclude
  const [genreFilters, setGenreFilters] = useState<Map<string, number>>(new Map());
  const [filteredDjs, setFilteredDjs] = useState<DJ[]>(djs);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(
    emailTemplates.length > 0 ? emailTemplates[0] : null
  );

  const { data, setData, post, processing, errors } = useForm({
    sender_email: 'hallo@deindj.ch',
    cc_email: '',
    subject: selectedTemplate?.subject || '',
    body: selectedTemplate?.body || '',
    dj_ids: [] as number[]
  });

  // Get unique genres from all DJs
  const uniqueGenres = [...new Set(djs.flatMap(dj => dj.genres))].sort();

  // Filter DJs based on genre filters (include/exclude)
  useEffect(() => {
    if (!genreFilters.size) {
      // No filters active
      setFilteredDjs(djs);
    } else {
      const includedGenres = Array.from(genreFilters.entries())
        .filter(([_, state]) => state === 1)
        .map(([genre]) => genre);

      const excludedGenres = Array.from(genreFilters.entries())
        .filter(([_, state]) => state === 2)
        .map(([genre]) => genre);

      setFilteredDjs(
        djs.filter(dj => {
          // Include DJs with selected genres (if any included genres)
          const includeCondition = includedGenres.length === 0 || 
            dj.genres.some(genre => includedGenres.includes(genre));
            
          // Exclude DJs with excluded genres
          const excludeCondition = !dj.genres.some(genre => excludedGenres.includes(genre));
            
          // DJ must satisfy both conditions
          return includeCondition && excludeCondition;
        })
      );
    }
  }, [genreFilters, djs]);

  // Update email content when template or selected DJs change
  useEffect(() => {
    if (!selectedTemplate) return;

    let processedSubject = selectedTemplate.subject;
    let processedBody = selectedTemplate.body;

    // Replace placeholders with actual values
    const replacements: Record<string, string> = {
      '{client_name}': bookingRequest.client_name || '',
      '{event_type}': bookingRequest.event_type || '',
      '{event_date}': bookingRequest.date ? formatDate(bookingRequest.date) : '',
      '{venue}': bookingRequest.venue || '',
      '{dj_list}': formatDjList(selectedDjs),
      '{sender_name}': 'Your Name', // This would normally come from user profile
    };

    // Apply replacements
    Object.entries(replacements).forEach(([key, value]) => {
      processedSubject = processedSubject.replace(new RegExp(key, 'g'), value);
      processedBody = processedBody.replace(new RegExp(key, 'g'), value);
    });

    setData({
      ...data,
      subject: processedSubject,
      body: processedBody,
      dj_ids: selectedDjs.map(dj => dj.id)
    });
  }, [selectedTemplate, selectedDjs, bookingRequest]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id.toString() === templateId) || null;
    setSelectedTemplate(template);
  };

  // Handle tri-state genre filter change
  // Filter states: 0 = unfiltered, 1 = include, 2 = exclude
  const handleGenreChange = (genre: string) => {
    setGenreFilters(prev => {
      const newFilters = new Map(prev);
      const currentState = prev.get(genre) || 0;
      
      // Cycle through states: 0 -> 1 -> 2 -> 0
      const nextState = (currentState + 1) % 3;
      
      if (nextState === 0) {
        newFilters.delete(genre); // Remove filter entirely when unselected
      } else {
        newFilters.set(genre, nextState);
      }
      
      return newFilters;
    });
  };

  // Handle DJ selection
  const handleDjToggle = (dj: DJ) => {
    setSelectedDjs(
      selectedDjs.some(selected => selected.id === dj.id)
        ? selectedDjs.filter(selected => selected.id !== dj.id)
        : [...selectedDjs, dj]
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('booking-requests.send-email-quote', { bookingRequest: bookingRequest.id }));
  };

  return (
    <>
      <Head title={`Email Quote - ${bookingRequest.client_name}`} />

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => router.visit(route('booking-requests.index'))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Email Quote for {bookingRequest.client_name}
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left sidebar - Client details and DJ selection */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              {/* Client Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client:</span>
                    <p>{bookingRequest.client_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Event Type:</span>
                    <p>{bookingRequest.event_type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date:</span>
                    <p>{formatDate(bookingRequest.date)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Time:</span>
                    <p>{bookingRequest.time_range}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Venue:</span>
                    <p>{bookingRequest.venue}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Guest Count:</span>
                    <p>{bookingRequest.guest_count}</p>
                  </div>
                </CardContent>
              </Card>

              {/* DJ Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select DJs</CardTitle>
                  <CardDescription>
                    Filter and select DJs to include in your quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Filter by genres</Label>
                      {genreFilters.size > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setGenreFilters(new Map())}
                          className="h-8 px-2 text-xs"
                        >
                          Reset filters
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {uniqueGenres.map(genre => {
                        const filterState = genreFilters.get(genre) || 0;
                        return (
                          <div 
                            key={genre} 
                            className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded-sm"
                            onClick={() => handleGenreChange(genre)}
                          >
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${filterState > 0 ? 'border-primary' : 'border-primary/50'}`}
                              aria-label={`Toggle ${genre} filter`}
                            >
                              {filterState === 1 && <Check className="h-3 w-3 text-green-600" />}
                              {filterState === 2 && <Minus className="h-3 w-3 text-red-600" />}
                            </div>
                            <span
                              className={`ml-2 text-sm leading-none ${filterState === 1 ? 'font-semibold text-green-700' : filterState === 2 ? 'font-semibold text-red-700' : ''}`}
                            >
                              {genre}
                              {filterState === 1 && <span className="ml-1">(Include)</span>}
                              {filterState === 2 && <span className="ml-1">(Exclude)</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">DJs ({filteredDjs.length})</Label>
                    <div className="mt-2 rounded-md border h-60 overflow-auto">
                      {filteredDjs.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No DJs match the selected genres
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredDjs.map(dj => (
                            <div
                              key={dj.id}
                              className={`flex items-center p-3 cursor-pointer ${selectedDjs.some(selected => selected.id === dj.id)
                                ? 'bg-primary/10'
                                : 'hover:bg-gray-50'
                                }`}
                              onClick={() => handleDjToggle(dj)}
                            >
                              <Checkbox
                                checked={selectedDjs.some(selected => selected.id === dj.id)}
                                onCheckedChange={() => handleDjToggle(dj)}
                              />
                              <div className="ml-2">
                                <div className="text-sm font-medium">{dj.name}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {dj.genres.map(genre => (
                                    <Badge
                                      key={`${dj.id}-${genre}`}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {genre}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.dj_ids && (
                      <p className="text-sm text-red-500 mt-1">{errors.dj_ids}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Email form */}
            <div className="col-span-12 md:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Email Quote</CardTitle>
                  <CardDescription>
                    Customize your email message to the client
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* Email template selector */}
                    <div>
                      <Label htmlFor="template">Email Template</Label>
                      <Select
                        value={selectedTemplate?.id.toString() || ''}
                        onValueChange={handleTemplateChange}
                      >
                        <SelectTrigger id="template" className="w-full">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Email header fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sender_email">From</Label>
                        <Input
                          id="sender_email"
                          type="email"
                          value={data.sender_email}
                          onChange={(e) => setData('sender_email', e.target.value)}
                          required
                        />
                        {errors.sender_email && (
                          <p className="text-sm text-red-500 mt-1">{errors.sender_email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="recipient">To</Label>
                        <Input
                          id="recipient"
                          type="email"
                          value={bookingRequest.contact_email}
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cc_email">CC</Label>
                      <Input
                        id="cc_email"
                        type="email"
                        value={data.cc_email}
                        onChange={(e) => setData('cc_email', e.target.value)}
                        placeholder="cc@example.com"
                      />
                      {errors.cc_email && (
                        <p className="text-sm text-red-500 mt-1">{errors.cc_email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        required
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Email body */}
                    <div>
                      <Label htmlFor="body">Message</Label>
                      <Textarea
                        id="body"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        rows={24}
                        className="font-mono"
                        required
                      />
                      {errors.body && (
                        <p className="text-sm text-red-500 mt-1">{errors.body}</p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.visit(route('booking-requests.index'))}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={processing || !data.subject || !data.body || selectedDjs.length === 0}
                      className="flex items-center"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Quote
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Define breadcrumbs for this page
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Booking Requests', href: route('booking-requests.index') },
  { title: 'Send Email Quote', href: '#' },
];

EmailQuotePage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default EmailQuotePage;
