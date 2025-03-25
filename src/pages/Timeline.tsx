
import React, { useState } from 'react';
import { TimelineChart } from '@/components/TimelineChart';
import { 
  Lightbulb, 
  Shield, 
  Link, 
  Footprints, 
  FrameIcon
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
    { id: '1', name: 'Frame', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//frame_image.png" alt="Frame" className="w-[24px] h-[24px] object-cover" />, days: 90, color: 'bg-blue-100', startWeek: 1 },
    { id: '2', name: 'Fork', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//fork.png" alt="Fork" className="w-[24px] h-[24px] object-cover" />, days: 42, color: 'bg-purple-100', startWeek: 8 },
    { id: '3', name: 'Motor', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//hub.png" alt="Motor" className="w-[24px] h-[24px] object-cover" />, days: 35, color: 'bg-green-100', startWeek: 11 },
    { id: '4', name: 'Rear Hub', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//rear_hub.png" alt="Rear Hub" className="w-[24px] h-[24px] object-cover" />, days: 40, color: 'bg-pink-100', startWeek: 9 },
    { id: '5', name: 'Handlebar', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//handlebar.png" alt="Handlebar" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-cyan-100', startWeek: 8 },
    { id: '6', name: 'Brakes', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//brakes.png" alt="Brakes" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-yellow-100', startWeek: 8 },
    { id: '7', name: 'Battery', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//battery.png" alt="Battery" className="w-[24px] h-[24px] object-cover" />, days: 12, color: 'bg-red-100', startWeek: 11 },
    { id: '8', name: 'Tires', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//tyre.png" alt="Tires" className="w-[24px] h-[24px] object-cover" />, days: 31, color: 'bg-green-100', startWeek: 10 },
    { id: '9', name: 'Grips', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//grips.png" alt="Grips" className="w-[24px] h-[24px] object-cover" />, days: 30, color: 'bg-blue-100', startWeek: 10 },
    { id: '10', name: 'Lights', icon: <Lightbulb size={18} />, days: 10, color: 'bg-orange-100', startWeek: 11 },
    { id: '11', name: 'Fenders', icon: <Shield size={18} />, days: 30, color: 'bg-pink-100', startWeek: 10 },
    { id: '12', name: 'Belt Drive', icon: <Link size={18} />, days: 30, color: 'bg-teal-200', startWeek: 10 },
    { id: '13', name: 'Kickstand', icon: <Footprints size={18} />, days: 40, color: 'bg-amber-400', startWeek: 9 },
    { id: '14', name: 'Pedals', icon: <Footprints size={18} />, days: 45, color: 'bg-red-400', startWeek: 9 },
    { id: '15', name: 'Crankset', icon: <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//hub.png" alt="Crankset" className="w-[24px] h-[24px] object-cover" />, days: 60, color: 'bg-violet-400', startWeek: 8 },
  ]);

  return (
    <div className="h-screen w-full bg-white">
      <TimelineChart components={bikeComponents} />
    </div>
  );
};

export default Timeline;
