
import React from 'react';
import { BikeComponent } from '@/pages/Timeline';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineChartProps {
  components: BikeComponent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  components
}) => {
  // Generate months for the timeline - now using three different months
  const months = ['November', 'December', 'January'];
  
  // Generate an array of weeks for 3 months
  const weeks = [];
  for (let month = 0; month < 3; month++) {
    for (let week = 1; week <= 4; week++) {
      weeks.push({
        month: month,
        week: week
      });
    }
  }
  
  // Calculate week positioning
  const getWeekPosition = (startWeek: number) => {
    return `${(startWeek - 1) * (100/12)}%`;
  };
  
  // Calculate width based on days
  const getWidthFromDays = (days: number) => {
    // 90 days = 100% width, so calculate proportionally
    return `${(days / 90) * 100}%`;
  };

  // Get component color based on id to ensure consistency
  const getComponentColor = (id: string) => {
    const colorMap: Record<string, string> = {
      '1': 'bg-blue-100',
      '2': 'bg-purple-100',
      '3': 'bg-green-100',
      '4': 'bg-pink-100', 
      '5': 'bg-cyan-100',
      '6': 'bg-yellow-100',
      '7': 'bg-red-100',
      '8': 'bg-green-100',
      '9': 'bg-blue-100',
      '10': 'bg-orange-100',
      '11': 'bg-pink-100',
      '12': 'bg-teal-200',
      '13': 'bg-amber-400',
      '14': 'bg-red-400',
      '15': 'bg-violet-400',
    };
    
    return colorMap[id] || 'bg-gray-100';
  };

  // Sort components by their order in the list
  const sortedComponents = [...components].sort((a, b) => {
    return components.findIndex(c => c.id === a.id) - components.findIndex(c => c.id === b.id);
  });
  
  return (
    <ScrollArea className="h-full bg-white">
      <div className="flex flex-col p-6">
        <div className="flex mb-2">
          <div className="w-44 pr-2 flex-shrink-0">
            {/* Empty space for component names */}
          </div>
          
          <div className="flex-1 grid grid-cols-12 gap-0">
            {months.map((month, i) => (
              <div key={i} className="col-span-4 text-center font-medium">
                {month}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex mb-2">
          <div className="w-44 pr-2 flex-shrink-0">
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
        
        {/* Current position indicator */}
        <div className="relative flex-1">
          <div className="absolute h-full w-px bg-gray-800 left-[33%] z-10">
            <div className="w-3 h-3 rounded-full bg-black -ml-1.5 -mt-1"></div>
          </div>
          
          {/* Total timeline row - now a continuous bar */}
          <div className="flex mb-4">
            <div className="w-44 pr-2 flex-shrink-0">
              <div className="h-10 bg-gray-600 text-white rounded-l-lg flex items-center pl-4 font-medium">
                Total Timeline
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 h-10 bg-gray-600 rounded-r-lg text-white flex items-center px-4">
                90 days period
              </div>
            </div>
          </div>
          
          {/* Component rows */}
          <div className="space-y-1">
            {sortedComponents.map(component => (
              <div key={component.id} className="flex items-center h-10">
                {/* Component info */}
                <div className="w-44 pr-2 flex-shrink-0 flex items-center">
                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis pl-2">{component.name}</span>
                </div>
                
                {/* Timeline bar - ensuring they all stretch right */}
                <div className="flex-1 relative h-full">
                  <div 
                    style={{
                      left: getWeekPosition(component.startWeek),
                      width: getWidthFromDays(component.days),
                      minWidth: '50px',
                      right: '0'
                    }} 
                    className={`absolute h-8 ${getComponentColor(component.id)} rounded-full flex items-center px-4`}
                  >
                    <span className="text-xs font-medium">{component.days} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
