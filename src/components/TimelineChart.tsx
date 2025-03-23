
import React from 'react';
import { BikeComponent } from '@/pages/Timeline';
import { ChevronRight } from 'lucide-react';

interface TimelineChartProps {
  components: BikeComponent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ components }) => {
  // Generate an array of weeks (W1-W4) for 3 months
  const weeks = [];
  for (let month = 0; month < 3; month++) {
    for (let week = 1; week <= 4; week++) {
      weeks.push({ month: month, week: week });
    }
  }
  
  // Sort components by their order in the list
  const sortedComponents = [...components].sort((a, b) => {
    return components.findIndex(c => c.id === a.id) - components.findIndex(c => c.id === b.id);
  });

  return (
    <div className="flex flex-col">
      {/* Timeline header with months and weeks */}
      <div className="flex mb-4">
        <div className="w-60 pr-4">
          {/* Empty space for component names */}
        </div>
        
        <div className="flex-1 grid grid-cols-12 gap-0">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="col-span-4 text-center font-medium">
              November
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex mb-4">
        <div className="w-60 pr-4">
          {/* Empty space for component names */}
        </div>
        
        <div className="flex-1 grid grid-cols-12 gap-0">
          {weeks.map((week, index) => (
            <div key={index} className="text-center text-sm text-gray-600">
              W{week.week}
            </div>
          ))}
        </div>
      </div>
      
      {/* Total timeline row */}
      <div className="flex items-center mb-4">
        <div className="w-60 pr-4 font-medium">
          Total Timeline
        </div>
        
        <div className="flex-1 h-10 bg-gray-600 rounded-lg flex items-center px-4 text-white">
          90 days period
        </div>
      </div>
      
      {/* Current position indicator */}
      <div className="relative">
        <div className="absolute h-full w-px bg-gray-800 left-[40%] z-10">
          <div className="w-3 h-3 rounded-full bg-black -ml-1.5 -mt-1"></div>
        </div>
      </div>

      {/* Component rows */}
      <div className="space-y-3 mb-4 relative">
        {sortedComponents.map((component) => (
          <div key={component.id} className="flex items-center h-12">
            {/* Component info */}
            <div className="w-60 pr-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {component.icon}
              </div>
              <span className="font-medium">{component.name}</span>
            </div>
            
            {/* Timeline bar */}
            <div className="flex-1 relative h-full">
              <div 
                className={`absolute h-full ${component.color} rounded-lg flex items-center px-3`}
                style={{
                  left: `${(component.startWeek - 1) * 8.33}%`,
                  width: `${component.days * 8.33 / 30}%`,
                  minWidth: '50px'
                }}
              >
                <div className="flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  <span className="text-sm">{component.name}</span>
                  <span className="text-xs ml-2">{component.days} days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
