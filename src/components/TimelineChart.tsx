
import React from 'react';
import { BikeComponent } from '@/pages/Timeline';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineChartProps {
  components: BikeComponent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  components
}) => {
  // Generate months for the timeline
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
          <div className="absolute h-full w-px bg-gray-800 left-[40%] z-10">
            <div className="w-3 h-3 rounded-full bg-black -ml-1.5 -mt-1"></div>
          </div>
          
          {/* Total timeline row */}
          <div className="flex items-center mb-3">
            <div className="w-44 pr-2 font-medium flex-shrink-0">
              Total Timeline
            </div>
            
            <div className="flex-1 h-8 bg-gray-600 rounded-lg flex items-center px-4 text-white">
              90 days period
            </div>
          </div>
          
          {/* Component rows */}
          <div className="space-y-2 mb-4">
            {sortedComponents.map(component => (
              <div key={component.id} className="flex items-center h-10">
                {/* Component info */}
                <div className="w-44 pr-2 flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {component.icon}
                  </div>
                  <span className="font-medium text-sm">{component.name}</span>
                </div>
                
                {/* Timeline bar */}
                <div className="flex-1 relative h-full">
                  <div 
                    style={{
                      left: getWeekPosition(component.startWeek),
                      width: getWidthFromDays(component.days),
                      minWidth: '50px'
                    }} 
                    className={`absolute h-8 ${getComponentColor(component.id)} rounded-full flex items-center px-2`}
                  >
                    <ChevronRight size={16} className="mr-1" />
                    <span className="text-xs font-medium">{component.name}</span>
                    <span className="text-xs ml-1">{component.days} days</span>
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
