
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface ColorOption {
  color: string;
  name: string;
}

interface ShapeOption {
  name: string;
  shape: string;
}

export const EditToolbar = () => {
  const [selectedTab, setSelectedTab] = useState('tubing');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [selectedShape, setSelectedShape] = useState('soft-triangle');
  const [expandTopTube, setExpandTopTube] = useState(false);
  const [expandDownTube, setExpandDownTube] = useState(false);
  const [frontWidth, setFrontWidth] = useState([300]);
  const [rearWidth, setRearWidth] = useState([260]);
  const [height, setHeight] = useState([300]);

  const colorOptions: ColorOption[] = [
    { color: 'bg-black', name: 'black' },
    { color: 'bg-gray-400', name: 'gray' },
    { color: 'bg-white border border-gray-300', name: 'white' },
    { color: 'bg-blue-500', name: 'blue' },
    { color: 'bg-sky-300', name: 'light-blue' },
    { color: 'bg-green-800', name: 'green' },
    { color: 'bg-purple-700', name: 'purple' },
    { color: 'bg-pink-200', name: 'pink' },
    { color: 'bg-red-600', name: 'red' },
    { color: 'bg-orange-500', name: 'orange' },
    { color: 'bg-yellow-400', name: 'yellow' },
    { color: 'bg-amber-200', name: 'beige' },
  ];

  const shapeOptions: ShapeOption[] = [
    { name: 'Ovalized', shape: 'ovalized' },
    { name: 'Multi-Ribbed', shape: 'multi-ribbed' },
    { name: 'Soft-Triangle', shape: 'soft-triangle' },
    { name: 'Rectangular', shape: 'rectangular' },
    { name: 'Round', shape: 'round' },
    { name: 'Square', shape: 'square' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm w-full h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Tabs */}
          <Tabs defaultValue="tubing" className="mb-6" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="tubing" className={selectedTab === 'tubing' ? 'bg-black text-white' : ''}>
                Tubing
              </TabsTrigger>
              <TabsTrigger value="geometry">Geometry</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Frame Color */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-3">Frame color:</h3>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.name}
                  className={`w-10 h-10 rounded-full cursor-pointer ${option.color} flex items-center justify-center ${
                    selectedColor === option.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedColor(option.name)}
                >
                  {selectedColor === option.name && option.name === 'blue' && (
                    <div className="text-white">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paint Finish */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-3">Paint finish:</h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer ${
                  selectedFinish === 'matte' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedFinish('matte')}
              >
                <div className="w-14 h-14 bg-black rounded-full mb-2"></div>
                <span className="text-sm">Matte</span>
              </div>
              <div
                className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer ${
                  selectedFinish === 'glossy' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedFinish('glossy')}
              >
                <div className="w-14 h-14 bg-black rounded-full mb-2" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,1) 70%)' }}></div>
                <span className="text-sm">Glossy</span>
              </div>
            </div>
          </div>

          {/* Top Tube */}
          <div className="mb-4">
            <div 
              className="flex items-center bg-gray-100 p-2 rounded-md cursor-pointer mb-2"
              onClick={() => setExpandTopTube(!expandTopTube)}
            >
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-2 text-xs">1</div>
              <span className="font-medium">Top tube</span>
              <div className="ml-auto">
                {expandTopTube ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {expandTopTube && (
              <div className="pl-4">
                {/* Tube settings would go here */}
              </div>
            )}
          </div>

          {/* Shapes */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-3">Shapes:</h3>
            <div className="grid grid-cols-2 gap-3">
              {shapeOptions.map((option) => (
                <div
                  key={option.name}
                  className={`p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                    selectedShape === option.shape.toLowerCase() ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedShape(option.shape.toLowerCase())}
                >
                  <div className="w-full h-8 flex items-center justify-center mb-2">
                    {option.shape === 'ovalized' && (
                      <div className="w-16 h-8 border-2 border-black rounded-full"></div>
                    )}
                    {option.shape === 'multi-ribbed' && (
                      <div className="w-16 h-8 border-2 border-black" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}></div>
                    )}
                    {option.shape === 'soft-triangle' && (
                      <div className="w-16 h-8 border-2 border-black" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
                    )}
                    {option.shape === 'rectangular' && (
                      <div className="w-16 h-8 border-2 border-black rounded-lg"></div>
                    )}
                    {option.shape === 'round' && (
                      <div className="w-10 h-10 border-2 border-black rounded-full"></div>
                    )}
                    {option.shape === 'square' && (
                      <div className="w-10 h-10 border-2 border-black rounded-md"></div>
                    )}
                  </div>
                  <span className="text-sm">{option.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Front width slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <h3 className="text-sm text-gray-500">Front width:</h3>
              <span className="text-sm font-medium">{frontWidth[0]}mm</span>
            </div>
            <Slider
              value={frontWidth}
              min={200}
              max={320}
              step={1}
              onValueChange={setFrontWidth}
              className="mb-1"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">200mm</span>
              <span className="text-xs text-gray-500">320mm</span>
            </div>
          </div>

          {/* Rear width slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <h3 className="text-sm text-gray-500">Rear width:</h3>
              <div className="px-2 py-1 bg-white border border-blue-300 rounded-md text-sm font-medium text-black">
                {rearWidth[0]}mm
              </div>
            </div>
            <Slider
              value={rearWidth}
              min={200}
              max={320}
              step={1}
              onValueChange={setRearWidth}
              className="mb-1"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">200mm</span>
              <span className="text-xs text-gray-500">320mm</span>
            </div>
          </div>

          {/* Height slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <h3 className="text-sm text-gray-500">Height:</h3>
              <span className="text-sm font-medium">{height[0]}mm</span>
            </div>
            <Slider
              value={height}
              min={200}
              max={320}
              step={1}
              onValueChange={setHeight}
              className="mb-1"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">200mm</span>
              <span className="text-xs text-gray-500">320mm</span>
            </div>
          </div>

          {/* Down tube */}
          <div className="mb-4">
            <div 
              className="flex items-center bg-gray-100 p-2 rounded-md cursor-pointer mb-2"
              onClick={() => setExpandDownTube(!expandDownTube)}
            >
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-2 text-xs">2</div>
              <span className="font-medium">Down tube</span>
              <div className="ml-auto">
                {expandDownTube ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {expandDownTube && (
              <div className="pl-4">
                {/* Tube settings would go here */}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditToolbar;
