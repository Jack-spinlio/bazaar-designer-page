
import React, { useState, useEffect } from 'react';
import { Circle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

interface StatusBarProps {
  onToggleSnapPointTools?: () => void;
  showSnapPointTools?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  onToggleSnapPointTools,
  showSnapPointTools
}) => {
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: '1',
      message: 'Welcome to 3D Component Snap Point Manager',
      type: 'info',
      timestamp: new Date(),
    },
  ]);

  const getStatusColor = (type: LogMessage['type']) => {
    switch (type) {
      case 'info': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      default: return 'text-app-gray-light';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-8 px-4 border-t border-app-gray-light/20 bg-white flex items-center text-xs text-app-gray">
      <div className="flex items-center gap-2">
        <Circle size={8} className={getStatusColor(logs[0]?.type || 'info')} />
        <span>{logs[0]?.message}</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs hover:bg-app-blue/10"
          onClick={onToggleSnapPointTools}
        >
          <MapPin size={12} className="mr-1" />
          {showSnapPointTools ? 'Hide' : 'Show'} Snap Point Tools
        </Button>
        <span className="text-app-gray-light">{formatTime(logs[0]?.timestamp || new Date())}</span>
      </div>
    </div>
  );
};
