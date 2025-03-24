
import React, { useState } from 'react';
import { TimelineChart } from '@/components/TimelineChart';
import { 
  Cog, 
  Disc, 
  Grip, 
  Lightbulb, 
  Shield, 
  Link, 
  Footprints, 
  FrameIcon, 
  Utensils,
  Battery,
  Steering,
  ChevronRight
} from 'lucide-react';

// Bike component types
export interface BikeComponent {
  id: string;
  name: string;
  icon: React.ReactNode;
  days: number;
  color: string;
  startWeek: number;
}

const Timeline = () => {
  // Sample bike components data with improved timing and positioning
  const [bikeComponents] = useState<BikeComponent[]>([
    { id: '1', name: 'Frame', icon: <ChevronRight size={18} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
    { id: '2', name: 'Fork', icon: <ChevronRight size={18} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
    { id: '3', name: 'Motor', icon: <ChevronRight size={18} />, days: 35, color: 'bg-green-100', startWeek: 11 },
    { id: '4', name: 'Rear Hub', icon: <ChevronRight size={18} />, days: 40, color: 'bg-pink-100', startWeek: 9 },
    { id: '5', name: 'Handlebar', icon: <ChevronRight size={18} />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
    { id: '6', name: 'Brakes', icon: <ChevronRight size={18} />, days: 60, color: 'bg-yellow-100', startWeek: 8 },
    { id: '7', name: 'Battery', icon: <ChevronRight size={18} />, days: 12, color: 'bg-red-100', startWeek: 11 },
    { id: '8', name: 'Tires', icon: <ChevronRight size={18} />, days: 31, color: 'bg-green-100', startWeek: 10 },
    { id: '9', name: 'Grips', icon: <ChevronRight size={18} />, days: 30, color: 'bg-blue-100', startWeek: 10 },
    { id: '10', name: 'Lights', icon: <ChevronRight size={18} />, days: 10, color: 'bg-orange-100', startWeek: 11 },
    { id: '11', name: 'Fenders', icon: <ChevronRight size={18} />, days: 30, color: 'bg-pink-100', startWeek: 10 },
    { id: '12', name: 'Belt Drive', icon: <ChevronRight size={18} />, days: 30, color: 'bg-teal-200', startWeek: 10 },
    { id: '13', name: 'Kickstand', icon: <ChevronRight size={18} />, days: 40, color: 'bg-amber-400', startWeek: 9 },
    { id: '14', name: 'Pedals', icon: <ChevronRight size={18} />, days: 45, color: 'bg-red-400', startWeek: 9 },
    { id: '15', name: 'Crankset', icon: <ChevronRight size={18} />, days: 60, color: 'bg-violet-400', startWeek: 8 },
  ]);

  return (
    <div className="h-screen w-full bg-white">
      <TimelineChart components={bikeComponents} />
    </div>
  );
};

export default Timeline;
