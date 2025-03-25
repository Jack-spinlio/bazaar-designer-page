import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Plus, Cog, Bike, LayoutGrid } from 'lucide-react';
import { Label } from './ui/label';

interface ColorOption {
  color: string;
  name: string;
}

interface ShapeOption {
  name: string;
  shape: string;
}

interface EditToolbarProps {
  isSnapPointMode?: boolean;
  onToggleSnapPointMode?: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({ 
  isSnapPointMode = false,
  onToggleSnapPointMode = () => {}
}) => {
  const [selectedTab, setSelectedTab] = useState('tubing');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [selectedShape, setSelectedShape] = useState('soft-triangle');
  const [expandTopTube, setExpandTopTube] = useState(false);
  const [expandDownTube, setExpandDownTube] = useState(false);
  const [expandWheels, setExpandWheels] = useState(true);
  const [expandForks, setExpandForks] = useState(false);
  const [expandWaterBottles, setExpandWaterBottles] = useState(false);
  const [showOnlyFrame, setShowOnlyFrame] = useState(false);
  const [wheelColor, setWheelColor] = useState('blue');
  const [frontWidth, setFrontWidth] = useState([300]);
  const [rearWidth, setRearWidth] = useState([260]);
  const [height, setHeight] = useState([300]);
  const [seatTubeLength, setSeatTubeLength] = useState([540]);
  const [seatTubeAngle, setSeatTubeAngle] = useState([72]);
  const [topTubeLength, setTopTubeLength] = useState([580]);
  const [headAngle, setHeadAngle] = useState([63]);
  const [headTubeLength, setHeadTubeLength] = useState([80]);
  const [chainStayLength, setChainStayLength] = useState([420]);
  const [bbDrop, setBbDrop] = useState([60]);
  const [wheelSize, setWheelSize] = useState([540]);
  const [rearWheelSpacing, setRearWheelSpacing] = useState([150]);
  const [wheelDepth, setWheelDepth] = useState([27]);
  const [spokeHoles, setSpokeHoles] = useState([20]);
  const [wheelWidth, setWheelWidth] = useState([30]);

  const colorOptions: ColorOption[] = [{
    color: 'bg-black',
    name: 'black'
  }, {
    color: 'bg-gray-400',
    name: 'gray'
  }, {
    color: 'bg-white border border-gray-300',
    name: 'white'
  }, {
    color: 'bg-blue-500',
    name: 'blue'
  }, {
    color: 'bg-sky-300',
    name: 'light-blue'
  }, {
    color: 'bg-green-800',
    name: 'green'
  }, {
    color: 'bg-purple-700',
    name: 'purple'
  }, {
    color: 'bg-pink-200',
    name: 'pink'
  }, {
    color: 'bg-red-600',
    name: 'red'
  }, {
    color: 'bg-orange-500',
    name: 'orange'
  }, {
    color: 'bg-yellow-400',
    name: 'yellow'
  }, {
    color: 'bg-amber-200',
    name: 'beige'
  }];

  const wheelColorOptions: ColorOption[] = [{
    color: 'bg-black',
    name: 'black'
  }, {
    color: 'bg-gray-400',
    name: 'gray'
  }, {
    color: 'bg-white border border-gray-300',
    name: 'white'
  }, {
    color: 'bg-blue-500',
    name: 'blue'
  }, {
    color: 'bg-green-800',
    name: 'green'
  }, {
    color: 'bg-purple-700',
    name: 'purple'
  }, {
    color: 'bg-pink-200',
    name: 'pink'
  }, {
    color: 'bg-red-600',
    name: 'red'
  }, {
    color: 'bg-orange-500',
    name: 'orange'
  }, {
    color: 'bg-yellow-400',
    name: 'yellow'
  }, {
    color: 'bg-amber-200',
    name: 'beige'
  }];

  const shapeOptions: ShapeOption[] = [{
    name: 'Ovalized',
    shape: 'ovalized'
  }, {
    name: 'Multi-Ribbed',
    shape: 'multi-ribbed'
  }, {
    name: 'Soft-Triangle',
    shape: 'soft-triangle'
  }, {
    name: 'Rectangular',
    shape: 'rectangular'
  }, {
    name: 'Round',
    shape: 'round'
  }, {
    name: 'Square',
    shape: 'square'
  }];

  const renderSliderWithValue = (label: string, value: number[], onChange: (value: number[]) => void, min: number, max: number, unit: string = 'mm') => {
    return <div className="mb-6 my-[15px] py-0">
        <div className="flex justify-between mb-1">
          <h3 className="text-sm text-gray-500">{label}</h3>
          <div className="px-2 py-1 bg-white border border-gray-200 rounded-md text-sm font-medium text-black">
            {value[0]}{unit}
          </div>
        </div>
        <Slider value={value} min={min} max={max} step={1} onValueChange={onChange} className="mb-1" />
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">{min}{unit}</span>
          <span className="text-xs text-gray-500">{max}{unit}</span>
        </div>
      </div>;
  };

  const renderTubeContent = () => {
    return <div className="pl-4">
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-3">Color:</h3>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map(option => <div key={option.name} className={`w-10 h-10 rounded-full cursor-pointer ${option.color} flex items-center justify-center ${selectedColor === option.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} onClick={() => setSelectedColor(option.name)}>
                {selectedColor === option.name && option.color !== 'bg-white border border-gray-300' && <div className="text-white">✓</div>}
                {selectedColor === option.name && option.color === 'bg-white border border-gray-300' && <div className="text-black">✓</div>}
              </div>)}
          </div>
        </div>

        <div className="mb-6">
          {renderSliderWithValue("Width:", frontWidth, setFrontWidth, 200, 320)}
          
          {renderSliderWithValue("Height:", height, setHeight, 200, 320)}
          
          {renderSliderWithValue("Diameter:", rearWidth, setRearWidth, 200, 320)}
        </div>
      </div>;
  };

  return <div className="bg-white rounded-2xl shadow-sm w-full h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <Tabs value={selectedTab} defaultValue="tubing" className="mb-6" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-4 w-full">
              <TabsTrigger value="tubing" className={selectedTab === 'tubing' ? 'bg-black text-white' : ''}>
                Tubing
              </TabsTrigger>
              <TabsTrigger value="geometry" className={selectedTab === 'geometry' ? 'bg-black text-white' : ''}>
                Geometry
              </TabsTrigger>
              <TabsTrigger value="parts" className={selectedTab === 'parts' ? 'bg-black text-white' : ''}>
                Parts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tubing" className="space-y-4">
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-3">Frame color:</h3>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map(option => <div key={option.name} className={`w-10 h-10 rounded-full cursor-pointer ${option.color} flex items-center justify-center ${selectedColor === option.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} onClick={() => setSelectedColor(option.name)}>
                      {selectedColor === option.name && option.color !== 'bg-white border border-gray-300' && <div className="text-white">✓</div>}
                      {selectedColor === option.name && option.color === 'bg-white border border-gray-300' && <div className="text-black">✓</div>}
                    </div>)}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-3">Paint finish:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer ${selectedFinish === 'matte' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedFinish('matte')}>
                    <div className="w-14 h-14 bg-black rounded-full mb-2"></div>
                    <span className="text-sm">Matte</span>
                  </div>
                  <div className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer ${selectedFinish === 'glossy' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedFinish('glossy')}>
                    <div className="w-14 h-14 bg-black rounded-full mb-2" style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,1) 70%)'
                  }}></div>
                    <span className="text-sm">Glossy</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center bg-gray-100 p-2 rounded-md cursor-pointer mb-2" onClick={() => setExpandTopTube(!expandTopTube)}>
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-2 text-xs">1</div>
                  <span className="font-medium">Top tube</span>
                  <div className="ml-auto">
                    {expandTopTube ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {expandTopTube && renderTubeContent()}
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-3">Shapes:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {shapeOptions.map(option => <div key={option.name} className={`p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer ${selectedShape === option.shape.toLowerCase() ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedShape(option.shape.toLowerCase())}>
                      <div className="w-full h-8 flex items-center justify-center mb-2">
                        {option.shape === 'ovalized' && <div className="w-16 h-8 border-2 border-black rounded-full"></div>}
                        {option.shape === 'multi-ribbed' && <div className="w-16 h-8 border border-2 border-black overflow-hidden flex items-center justify-center">
                          <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//Polygon.svg" alt="Multi-Ribbed" className="w-14 h-7 object-contain" />
                        </div>}
                        {option.shape === 'soft-triangle' && <div className="w-16 h-8 border border-2 border-black overflow-hidden flex items-center justify-center">
                          <img src="https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/thumbnails//Vector.svg" alt="Soft-Triangle" className="w-14 h-7 object-contain" />
                        </div>}
                        {option.shape === 'rectangular' && <div className="w-16 h-8 border-2 border-black rounded-lg"></div>}
                        {option.shape === 'round' && <div className="w-10 h-10 border-2 border-black rounded-full"></div>}
                        {option.shape === 'square' && <div className="w-10 h-10 border-2 border-black rounded-md"></div>}
                      </div>
                      <span className="text-sm">{option.name}</span>
                    </div>)}
                </div>
              </div>

              <div className="mb-6">
                {renderSliderWithValue("Front width:", frontWidth, setFrontWidth, 200, 320)}
                
                {renderSliderWithValue("Rear width:", rearWidth, setRearWidth, 200, 320)}
                
                {renderSliderWithValue("Height:", height, setHeight, 200, 320)}
              </div>

              <div className="mb-4">
                <div className="flex items-center bg-gray-100 p-2 rounded-md cursor-pointer mb-2" onClick={() => setExpandDownTube(!expandDownTube)}>
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-2 text-xs">2</div>
                  <span className="font-medium">Down tube</span>
                  <div className="ml-auto">
                    {expandDownTube ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {expandDownTube && renderTubeContent()}
              </div>
            </TabsContent>
            
            <TabsContent value="geometry" className="space-y-4">
              {renderSliderWithValue("Seat tube length:", seatTubeLength, setSeatTubeLength, 450, 600)}
              {renderSliderWithValue("Seat tube angle:", seatTubeAngle, setSeatTubeAngle, 65, 77, "°")}
              {renderSliderWithValue("Top tube length:", topTubeLength, setTopTubeLength, 400, 650)}
              {renderSliderWithValue("Head angle:", headAngle, setHeadAngle, 60, 70, "°")}
              {renderSliderWithValue("Head tube length:", headTubeLength, setHeadTubeLength, 60, 200)}
              {renderSliderWithValue("Chain stay length:", chainStayLength, setChainStayLength, 380, 450)}
              {renderSliderWithValue("BB drop:", bbDrop, setBbDrop, 20, 80)}
            </TabsContent>
            
            <TabsContent value="parts" className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center bg-gray-100 p-3 rounded-md cursor-pointer mb-2" onClick={() => setExpandWheels(!expandWheels)}>
                  <Cog className="w-5 h-5 mr-2 text-black" />
                  <span className="font-medium">Wheels</span>
                  <div className="ml-auto">
                    {expandWheels ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                
                {expandWheels && <div className="pl-0 space-y-4">
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-500 mb-3">Color:</h3>
                      <div className="grid grid-cols-6 gap-2">
                        {wheelColorOptions.map(option => <div key={option.name} className={`w-10 h-10 rounded-full cursor-pointer ${option.color} flex items-center justify-center ${wheelColor === option.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} onClick={() => setWheelColor(option.name)}>
                            {wheelColor === option.name && option.color !== 'bg-white border border-gray-300' && <div className="text-white">✓</div>}
                            {wheelColor === option.name && option.color === 'bg-white border border-gray-300' && <div className="text-black">✓</div>}
                          </div>)}
                      </div>
                    </div>
                    
                    {renderSliderWithValue("Size:", wheelSize, setWheelSize, 300, 914)}
                    {renderSliderWithValue("Rear wheel spacing:", rearWheelSpacing, setRearWheelSpacing, 130, 170)}
                    {renderSliderWithValue("Depth:", wheelDepth, setWheelDepth, 10, 50)}
                    {renderSliderWithValue("Spoke holes:", spokeHoles, setSpokeHoles, 16, 48, "")}
                    {renderSliderWithValue("Width:", wheelWidth, setWheelWidth, 20, 50)}
                  </div>}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center bg-gray-100 p-3 rounded-md cursor-pointer mb-2" onClick={() => setExpandForks(!expandForks)}>
                  <Bike className="w-5 h-5 mr-2 text-black" />
                  <span className="font-medium">Forks</span>
                  <div className="ml-auto">
                    {expandForks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {expandForks && <div className="pl-4">
                    {/* Fork settings would go here */}
                  </div>}
              </div>
              
              <div className="mb-6">
                <div className="flex items-center bg-gray-100 p-3 rounded-md cursor-pointer mb-2" onClick={() => setExpandWaterBottles(!expandWaterBottles)}>
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2H16V4H8V2ZM9 6C7.9 6 7 6.9 7 8V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V8C17 6.9 16.1 6 15 6H9ZM15 20H9V8H15V20Z" fill="black" />
                    </svg>
                  </div>
                  <span className="font-medium">Water bottles</span>
                  <div className="ml-auto">
                    {expandWaterBottles ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {expandWaterBottles && <div className="pl-4">
                    {/* Water bottle settings would go here */}
                  </div>}
              </div>
              
              <div className="flex items-center justify-between p-2">
                <span className="font-medium">Show only frame</span>
                <Switch checked={showOnlyFrame} onCheckedChange={setShowOnlyFrame} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>;
};

export default EditToolbar;
