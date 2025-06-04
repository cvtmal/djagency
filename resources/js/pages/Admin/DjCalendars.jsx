import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/shadcn/ui/button";
import { Loader2 } from 'lucide-react';

export default function DjCalendars({ djs }) {
  const { post, processing } = useForm();

  const generateLink = (djId) => {
    post(route('admin.dj-calendars.generate-link', { dj: djId }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head title="DJ Calendar Management" />

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-2xl leading-6 font-medium text-gray-900">DJ Calendar Management</h3>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {djs.map((dj) => (
                <li key={dj.id}>
                  <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{dj.name}</h4>
                      {dj.unique_identifier ? (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500">Calendar URL:</div>
                          <div className="mt-1 flex items-center">
                            <input
                              type="text"
                              readOnly
                              className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm bg-gray-50 py-2 px-3"
                              value={route('dj-calendar.show', { uniqueIdentifier: dj.unique_identifier })}
                            />
                            <Button
                              type="button"
                              className="ml-2"
                              onClick={() => copyToClipboard(route('dj-calendar.show', { uniqueIdentifier: dj.unique_identifier }))}
                              variant="outline"
                              size="sm"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">No calendar link generated yet</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {dj.unique_identifier && (
                        <Link
                          href={route('admin.dj-calendars.stats', { dj: dj.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Stats
                        </Link>
                      )}
                      
                      <Button
                        onClick={() => generateLink(dj.id)}
                        disabled={processing}
                        variant={dj.unique_identifier ? 'outline' : 'default'}
                      >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {dj.unique_identifier ? 'Regenerate Link' : 'Generate Link'}
                      </Button>
                      
                      {dj.unique_identifier && (
                        <Link
                          href={route('dj-calendar.show', { uniqueIdentifier: dj.unique_identifier })}
                          target="_blank"
                          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Open Calendar
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
