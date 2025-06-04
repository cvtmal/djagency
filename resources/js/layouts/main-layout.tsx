import React from 'react';
import { Head } from '@inertiajs/react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title = 'DeinDJ Agency' }: MainLayoutProps) {
  return (
    <>
      <Head title={title} />
      
      <div className="min-h-screen bg-gray-50">
        {/* You would typically include navigation, sidebar, and other layout elements here */}
        <main>
          {children}
        </main>
      </div>
    </>
  );
}
