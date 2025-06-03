import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AvailabilityGrid } from '@/components/booking/availability-grid';
import { DJsManagement } from '@/components/booking/djs-management';
import { RequestsManagement } from '@/components/booking/requests-management';
import { SettingsScreen } from '@/components/booking/settings-screen';
import { ToastProvider } from '@/components/ui/toast';

type BookingTab = 'availability' | 'requests' | 'djs' | 'settings';

export default function BookingIndex() {
  const page = usePage();
  const [activeTab, setActiveTab] = useState<BookingTab>('availability');
  
  // Parse current URL to determine active tab
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/booking/availability')) {
      setActiveTab('availability');
    } else if (path.includes('/booking/requests')) {
      setActiveTab('requests');
    } else if (path.includes('/booking/djs')) {
      setActiveTab('djs');
    } else if (path.includes('/booking/settings')) {
      setActiveTab('settings');
    }
  }, [page.url]);

  // Handle tab change
  const handleTabChange = (tab: BookingTab) => {
    setActiveTab(tab);
    router.visit(`/booking/${tab}`, { 
      preserveState: true,
      preserveScroll: true,
      replace: true 
    });
  };

  // Render active content based on current tab
  const renderContent = () => {
    switch (activeTab) {
      case 'availability':
        return <AvailabilityGrid />;
      case 'requests':
        return <RequestsManagement />;
      case 'djs':
        return <DJsManagement />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <AvailabilityGrid />;
    }
  };

  return (
    <ToastProvider>
      <div className="container mx-auto py-6">
        {/* Tab navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-6">
            <button
              className={`pb-2 px-1 font-medium text-sm ${
                activeTab === 'availability'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('availability')}
            >
              Availability
            </button>
            <button
              className={`pb-2 px-1 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('requests')}
            >
              Requests
            </button>
            <button
              className={`pb-2 px-1 font-medium text-sm ${
                activeTab === 'djs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('djs')}
            >
              DJs
            </button>
            <button
              className={`pb-2 px-1 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('settings')}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content area */}
        <div>
          {renderContent()}
        </div>
      </div>
    </ToastProvider>
  );
}
