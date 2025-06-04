import React from 'react';

export default function StatusLegend({ statuses }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-900">Calendar Status Legend</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries(statuses).map(([statusKey, status]) => (
            <div key={statusKey} className={`rounded-md p-2 ${status.color}`}>
              <div className="text-sm font-medium">{status.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
