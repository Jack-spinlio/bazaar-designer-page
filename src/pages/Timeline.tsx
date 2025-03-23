
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TimelineChart } from '@/components/TimelineChart';
import { 
  Engine, 
  Disc, 
  Grip, 
  Lightbulb, 
  Shield, 
  Link, 
  Footprints, 
  Cog, 
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
    { id: '1', name: 'Frame', icon: <FrameIcon size={20} />, days: 90, color: 'bg-blue-100', startWeek: 1 },
    { id: '2', name: 'Fork', icon: <Utensils size={20} />, days: 42, color: 'bg-purple-100', startWeek: 8 },
    { id: '3', name: 'Motor', icon: <Engine size={20} />, days: 35, color: 'bg-green-100', startWeek: 11 },
    { id: '4', name: 'Rear Hub', icon: <Disc size={20} />, days: 40, color: 'bg-pink-100', startWeek: 12 },
    { id: '5', name: 'Handlebar', icon: <Grip size={20} />, days: 60, color: 'bg-blue-100', startWeek: 9 },
    { id: '6', name: 'Brakes', icon: <Disc size={20} />, days: 60, color: 'bg-yellow-100', startWeek: 10 },
    { id: '7', name: 'Battery', icon: <Lightbulb size={20} />, days: 12, color: 'bg-pink-100', startWeek: 14 },
    { id: '8', name: 'Tires', icon: <Disc size={20} />, days: 31, color: 'bg-green-100', startWeek: 14 },
    { id: '9', name: 'Grips', icon: <Grip size={20} />, days: 30, color: 'bg-blue-100', startWeek: 14 },
    { id: '10', name: 'Lights', icon: <Lightbulb size={20} />, days: 10, color: 'bg-orange-100', startWeek: 15 },
    { id: '11', name: 'Fenders', icon: <Shield size={20} />, days: 30, color: 'bg-pink-100', startWeek: 15 },
    { id: '12', name: 'Belt Drive', icon: <Link size={20} />, days: 30, color: 'bg-teal-200', startWeek: 14 },
    { id: '13', name: 'Kickstand', icon: <Footprints size={20} />, days: 40, color: 'bg-amber-400', startWeek: 14 },
    { id: '14', name: 'Pedals', icon: <Cog size={20} />, days: 45, color: 'bg-red-400', startWeek: 14 },
    { id: '15', name: 'Crankset', icon: <Cog size={20} />, days: 60, color: 'bg-violet-400', startWeek: 14 },
  ]);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Timeline</h1>
          <p className="text-gray-600">Track the timeline of your bike design components</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <TimelineChart components={bikeComponents} />
        </div>
      </div>
    </Layout>
  );
};

export default Timeline;
