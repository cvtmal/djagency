import React from 'react';

type StatusInfo = {
  label: string;
  color: string;
};

type StatusLegendProps = {
  statuses: {
    [key: string]: StatusInfo;
  };
};

const StatusLegend = ({ statuses }: StatusLegendProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(statuses).map(([statusKey, statusInfo]) => (
        <div key={statusKey} className="flex items-center">
          <span className={`inline-block w-4 h-4 mr-1 rounded ${statusInfo.color}`}></span>
          <span className="text-sm">{statusInfo.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatusLegend;
