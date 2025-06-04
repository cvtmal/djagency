import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/shadcn/ui/button";

export default function DjCalendarStats({ dj, stats, calendarUrl }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head title={`${dj.name}'s Calendar Statistics`} />

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-2xl leading-6 font-medium text-gray-900">{dj.name}'s Calendar Statistics</h3>
          
          <div className="flex space-x-3">
            <Link
              href={route('admin.dj-calendars.index')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to List
            </Link>
            
            <Link
              href={calendarUrl}
              target="_blank"
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Calendar
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* General Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">General Statistics</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Dates:</span>
                <span className="font-semibold">{stats.total_dates}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Weekend Dates:</span>
                <span className="font-semibold">{stats.weekend_dates_count}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Custom Dates:</span>
                <span className="font-semibold">{stats.custom_dates_count}</span>
              </div>
            </div>
          </div>
          
          {/* Status Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h4>
            
            <div className="space-y-3">
              {Object.entries(stats.status_counts).map(([statusKey, statusData]) => (
                <div key={statusKey} className="flex justify-between items-center">
                  <span className={`${statusData.color} px-2 py-1 rounded-md text-sm`}>
                    {statusData.label}
                  </span>
                  <span className="font-semibold">{statusData.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Calendar Link */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Calendar Link</h4>
            
            <div className="text-sm text-gray-500 mb-2">Share this link with the DJ:</div>
            <div className="flex items-center mb-4">
              <input
                type="text"
                readOnly
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm bg-gray-50 py-2 px-3"
                value={calendarUrl}
              />
              <Button
                type="button"
                className="ml-2"
                onClick={() => copyToClipboard(calendarUrl)}
                variant="outline"
                size="sm"
              >
                Copy
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Button
                onClick={() => {
                  post(route('admin.dj-calendars.generate-link', { dj: dj.id }));
                }}
                variant="outline"
              >
                Regenerate Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
