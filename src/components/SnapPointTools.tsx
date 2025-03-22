
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plus, 
  X, 
  CheckSquare, 
  Tag, 
  Layers, 
  Move, 
  Trash, 
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface SnapPoint {
  id: string;
  name: string;
  type: 'point' | 'plane';
  compatibility: string[];
}

interface SnapPointToolsProps {
  onClose: () => void;
}

export const SnapPointTools: React.FC<SnapPointToolsProps> = ({ onClose }) => {
  const [activeSnapPoint, setActiveSnapPoint] = useState<SnapPoint | null>(null);
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([
    { id: '1', name: 'Left Grip Mount', type: 'plane', compatibility: ['Grip'] },
    { id: '2', name: 'Right Grip Mount', type: 'plane', compatibility: ['Grip'] },
    { id: '3', name: 'Stem Clamp', type: 'plane', compatibility: ['Stem'] },
  ]);
  
  const [newSnapPointName, setNewSnapPointName] = useState('');
  const [newSnapPointType, setNewSnapPointType] = useState<'point' | 'plane'>('point');
  
  const handleSelectSnapPoint = (snapPoint: SnapPoint) => {
    setActiveSnapPoint(snapPoint);
    toast.info(`Selected snap point: ${snapPoint.name}`);
  };
  
  const handleAddSnapPoint = () => {
    if (!newSnapPointName.trim()) {
      toast.error('Please enter a name for the snap point');
      return;
    }
    
    const newSnapPoint: SnapPoint = {
      id: Date.now().toString(),
      name: newSnapPointName,
      type: newSnapPointType,
      compatibility: [],
    };
    
    setSnapPoints([...snapPoints, newSnapPoint]);
    setNewSnapPointName('');
    setActiveSnapPoint(newSnapPoint);
    toast.success(`Added new snap point: ${newSnapPointName}`);
  };
  
  const handleDeleteSnapPoint = (id: string) => {
    setSnapPoints(snapPoints.filter(sp => sp.id !== id));
    if (activeSnapPoint?.id === id) {
      setActiveSnapPoint(null);
    }
    toast.success('Snap point deleted');
  };
  
  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
  };

  return (
    <div className="h-full border-l border-app-gray-light/20 bg-white flex flex-col">
      <div className="p-4 border-b border-app-gray-light/20 flex justify-between items-center">
        <h2 className="text-lg font-medium">Snap Point Tools</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="list" className="flex-1">
              <Layers size={16} className="mr-1" />
              Snap Points
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">
              <Plus size={16} className="mr-1" />
              Add New
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="list" className="flex-1 overflow-auto p-4 mt-0">
          {snapPoints.length > 0 ? (
            <div className="space-y-2">
              {snapPoints.map(snapPoint => (
                <div 
                  key={snapPoint.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    activeSnapPoint?.id === snapPoint.id
                      ? 'border-app-blue bg-app-blue/5'
                      : 'border-app-gray-light/20 hover:border-app-blue/30'
                  }`}
                  onClick={() => handleSelectSnapPoint(snapPoint)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {snapPoint.type === 'point' ? (
                        <MapPin size={16} className="text-app-blue" />
                      ) : (
                        <Layers size={16} className="text-app-blue" />
                      )}
                      <span className="font-medium">{snapPoint.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-red-50 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSnapPoint(snapPoint.id);
                      }}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                  
                  {activeSnapPoint?.id === snapPoint.id && (
                    <div className="mt-2 pt-2 border-t border-app-gray-light/20">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="snapPointName" className="text-xs">Name</Label>
                          <Input
                            id="snapPointName"
                            value={snapPoint.name}
                            className="h-8 text-sm"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs mb-1 block">Type</Label>
                          <div className="flex gap-2">
                            <Button 
                              variant={snapPoint.type === 'point' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1 h-8"
                            >
                              <MapPin size={14} className="mr-1" />
                              Point
                            </Button>
                            <Button 
                              variant={snapPoint.type === 'plane' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1 h-8"
                            >
                              <Layers size={14} className="mr-1" />
                              Plane
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs mb-1 block">Compatible With</Label>
                          <div className="flex flex-wrap gap-1">
                            {snapPoint.compatibility.map((item, i) => (
                              <div key={i} className="bg-app-blue/10 text-app-blue text-xs px-2 py-1 rounded-full flex items-center">
                                {item}
                                <X size={12} className="ml-1 cursor-pointer" />
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              <Plus size={10} className="mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-app-gray-light">
              <MapPin size={40} className="mb-2 opacity-50" />
              <p className="mb-2">No snap points added yet</p>
              <TabsTrigger value="add" className="mt-2" asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Snap Point
                </Button>
              </TabsTrigger>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add" className="flex-1 overflow-auto p-4 mt-0">
          <div className="space-y-4">
            <div>
              <Label htmlFor="newSnapPointName">Snap Point Name</Label>
              <Input
                id="newSnapPointName"
                value={newSnapPointName}
                onChange={(e) => setNewSnapPointName(e.target.value)}
                placeholder="e.g., Left Grip Mount"
              />
            </div>
            
            <div>
              <Label className="mb-1 block">Snap Point Type</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={newSnapPointType === 'point' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setNewSnapPointType('point')}
                >
                  <MapPin size={16} className="mr-2" />
                  Point
                </Button>
                <Button 
                  type="button"
                  variant={newSnapPointType === 'plane' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setNewSnapPointType('plane')}
                >
                  <Layers size={16} className="mr-2" />
                  Plane
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleAddSnapPoint} className="w-full">
                <Plus size={16} className="mr-2" />
                Add Snap Point
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-app-gray-light/20">
        <Button onClick={handleSaveChanges} className="w-full">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
