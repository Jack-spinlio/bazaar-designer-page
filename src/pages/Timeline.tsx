
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TimelineChart } from '@/components/TimelineChart';
import { 
  Cog, 
  Disc, 
  Grip, 
  Lightbulb, 
  Shield, 
  Link, 
  Footprints, 
  Frame as FrameIcon, 
  Utensils
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
  // Sample bike components data
  const [bikeComponents] = useState<BikeComponent[]>([
    { id: '1', name: 'Frame', icon: <FrameIcon size={18} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
    { id: '2', name: 'Fork', icon: <Utensils size={18} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
    { id: '3', name: 'Motor', icon: <Cog size={18} />, days: 35, color: 'bg-green-100', startWeek: 11 },
    { id: '4', name: 'Rear Hub', icon: <Disc size={18} />, days: 40, color: 'bg-pink-100', startWeek: 12 },
    { id: '5', name: 'Handlebar', icon: <Grip size={18} />, days: 60, color: 'bg-blue-100', startWeek: 9 },
    { id: '6', name: 'Brakes', icon: <Disc size={18} />, days: 60, color: 'bg-yellow-100', startWeek: 10 },
    { id: '7', name: 'Battery', icon: <Lightbulb size={18} />, days: 12, color: 'bg-pink-100', startWeek: 14 },
    { id: '8', name: 'Tires', icon: <Disc size={18} />, days: 31, color: 'bg-green-100', startWeek: 14 },
    { id: '9', name: 'Grips', icon: <Grip size={18} />, days: 30, color: 'bg-blue-100', startWeek: 14 },
    { id: '10', name: 'Lights', icon: <Lightbulb size={18} />, days: 10, color: 'bg-orange-100', startWeek: 15 },
    { id: '11', name: 'Fenders', icon: <Shield size={18} />, days: 30, color: 'bg-pink-100', startWeek: 15 },
    { id: '12', name: 'Belt Drive', icon: <Link size={18} />, days: 30, color: 'bg-teal-200', startWeek: 14 },
    { id: '13', name: 'Kickstand', icon: <Footprints size={18} />, days: 40, color: 'bg-amber-400', startWeek: 14 },
    { id: '14', name: 'Pedals', icon: <Cog size={18} />, days: 45, color: 'bg-red-400', startWeek: 14 },
    { id: '15', name: 'Crankset', icon: <Cog size={18} />, days: 60, color: 'bg-violet-400', startWeek: 14 },
  ]);

  return (
    <Layout>
      <div className="h-full w-full">
        <TimelineChart components={bikeComponents} />
      </div>
    </Layout>
  );
};

export default Timeline;
