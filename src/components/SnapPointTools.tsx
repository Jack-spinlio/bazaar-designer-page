
import React, { useState, useEffect } from 'react';
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
  Save,
  Crosshair
} from 'lucide-react';
import { toast } from 'sonner';
import * as THREE from 'three';
import { SnapPoint } from './SnapPointEditor';

interface SnapPointToolsProps {
  onClose: () => void;
  onSetActiveSnapPointMode: (active: boolean) => void;
  onSnapPointAdded: (snapPoint: SnapPoint) => void;
  onSnapPointDeleted: (id: string) => void;
  onSnapPointUpdated: (snapPoint: SnapPoint) => void;
  activeSnapPoint: SnapPoint | null;
  setActiveSnapPoint: (snapPoint: SnapPoint | null) => void;
  snapPoints: SnapPoint[];
  setSnapPoints: (snapPoints: SnapPoint[]) => void;
}

export const SnapPointTools: React.FC<SnapPointToolsProps> = ({ 
  onClose, 
  onSetActiveSnapPointMode, 
  onSnapPointAdded, 
  onSnapPointDeleted, 
  onSnapPointUpdated,
  activeSnapPoint,
  setActiveSnapPoint,
  snapPoints,
  setSnapPoints
}) => {
  const [newSnapPointName, setNewSnapPointName] = useState('');
  const [newSnapPointType, setNewSnapPointType] = useState<'point' | 'plane'>('point');
  const [isPickingMode, setIsPickingMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  // Reset picking mode when switching tabs
  useEffect(() => {
    if (activeTab !== 'add') {
      setIsPickingMode(false);
      onSetActiveSnapPointMode(false);
    }
  }, [activeTab, onSetActiveSnapPointMode]);
  
  const handleSelectSnapPoint = (snapPoint: SnapPoint) => {
    setActiveSnapPoint(snapPoint);
    toast.info(`Selected snap point: ${snapPoint.name}`);
  };
  
  const handleAddSnapPoint = () => {
    if (!newSnapPointName.trim()) {
      toast.error('Please enter a name for the snap point');
      return;
    }
    
    setIsPickingMode(true);
    onSetActiveSnapPointMode(true);
    toast.info('Click on the model to place the snap point');
  };
  
  const handleCreateSnapPoint = (position: THREE.Vector3, normal?: THREE.Vector3) => {
    const newSnapPoint: SnapPoint = {
      id: Date.now().toString(),
      name: newSnapPointName,
      type: normal ? 'plane' : 'point',
      position: position,
      normal: normal,
      compatibility: [],
    };
    
    setSnapPoints([...snapPoints, newSnapPoint]);
    setActiveSnapPoint(newSnapPoint);
    onSnapPointAdded(newSnapPoint);
    
    // Reset state
    setNewSnapPointName('');
    setIsPickingMode(false);
    onSetActiveSnapPointMode(false);
    setActiveTab('list');
    
    toast.success(`Added new snap point: ${newSnapPointName}`);
  };
  
  const handleDeleteSnapPoint = (id: string) => {
    setSnapPoints(snapPoints.filter(sp => sp.id !== id));
    if (activeSnapPoint?.id === id) {
      setActiveSnapPoint(null);
    }
    onSnapPointDeleted(id);
    toast.success('Snap point deleted');
  };
  
  const handleUpdateSnapPoint = (updatedSnapPoint: SnapPoint) => {
    setSnapPoints(snapPoints.map(sp => 
      sp.id === updatedSnapPoint.id ? updatedSnapPoint : sp
    ));
    onSnapPointUpdated(updatedSnapPoint);
  };
  
  const handleAddCompatibility = (snapPointId: string, compatibilityItem: string) => {
    if (!compatibilityItem.trim()) return;
    
    const updatedSnapPoints = snapPoints.map(sp => {
      if (sp.id === snapPointId && !sp.compatibility.includes(compatibilityItem)) {
        return {
          ...sp,
          compatibility: [...sp.compatibility, compatibilityItem]
        };
      }
      return sp;
    });
    
    setSnapPoints(updatedSnapPoints);
    if (activeSnapPoint?.id === snapPointId) {
      const updatedActivePoint = updatedSnapPoints.find(sp => sp.id === snapPointId);
      if (updatedActivePoint) {
        setActiveSnapPoint(updatedActivePoint);
        onSnapPointUpdated(updatedActivePoint);
      }
    }
  };
  
  const handleRemoveCompatibility = (snapPointId: string, compatibilityItem: string) => {
    const updatedSnapPoints = snapPoints.map(sp => {
      if (sp.id === snapPointId) {
        return {
          ...sp,
          compatibility: sp.compatibility.filter(item => item !== compatibilityItem)
        };
      }
      return sp;
    });
    
    setSnapPoints(updatedSnapPoints);
    if (activeSnapPoint?.id === snapPointId) {
      const updatedActivePoint = updatedSnapPoints.find(sp => sp.id === snapPointId);
      if (updatedActivePoint) {
        setActiveSnapPoint(updatedActivePoint);
        onSnapPointUpdated(updatedActivePoint);
      }
    }
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
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col"
      >
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
                            onChange={(e) => {
                              const updatedPoint = {
                                ...snapPoint,
                                name: e.target.value
                              };
                              handleUpdateSnapPoint(updatedPoint);
                            }}
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
                              onClick={() => {
                                const updatedPoint = {
                                  ...snapPoint,
                                  type: 'point' as const
                                };
                                handleUpdateSnapPoint(updatedPoint);
                              }}
                            >
                              <MapPin size={14} className="mr-1" />
                              Point
                            </Button>
                            <Button 
                              variant={snapPoint.type === 'plane' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1 h-8"
                              onClick={() => {
                                const updatedPoint = {
                                  ...snapPoint,
                                  type: 'plane' as const
                                };
                                handleUpdateSnapPoint(updatedPoint);
                              }}
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
                                <X 
                                  size={12} 
                                  className="ml-1 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCompatibility(snapPoint.id, item);
                                  }}
                                />
                              </div>
                            ))}
                            <div className="flex items-center gap-1 mt-1">
                              <Input 
                                placeholder="Add compatibility"
                                className="h-6 text-xs"
                                id={`compat-${snapPoint.id}`}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.currentTarget;
                                    handleAddCompatibility(snapPoint.id, input.value);
                                    input.value = '';
                                  }
                                }}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const input = document.getElementById(`compat-${snapPoint.id}`) as HTMLInputElement;
                                  if (input) {
                                    handleAddCompatibility(snapPoint.id, input.value);
                                    input.value = '';
                                  }
                                }}
                              >
                                <Plus size={10} className="mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs mb-1 block">Position</Label>
                          <div className="grid grid-cols-3 gap-1">
                            <div>
                              <Label htmlFor={`pos-x-${snapPoint.id}`} className="text-xs">X</Label>
                              <Input
                                id={`pos-x-${snapPoint.id}`}
                                value={snapPoint.position.x.toFixed(2)}
                                readOnly
                                className="h-7 text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`pos-y-${snapPoint.id}`} className="text-xs">Y</Label>
                              <Input
                                id={`pos-y-${snapPoint.id}`}
                                value={snapPoint.position.y.toFixed(2)}
                                readOnly
                                className="h-7 text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`pos-z-${snapPoint.id}`} className="text-xs">Z</Label>
                              <Input
                                id={`pos-z-${snapPoint.id}`}
                                value={snapPoint.position.z.toFixed(2)}
                                readOnly
                                className="h-7 text-xs"
                              />
                            </div>
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
              <Button 
                onClick={handleAddSnapPoint}
                className="w-full gap-2"
                disabled={isPickingMode || !newSnapPointName.trim()}
              >
                {isPickingMode ? (
                  <>
                    <Crosshair size={16} className="animate-pulse" />
                    Click on model to place
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Snap Point
                  </>
                )}
              </Button>
              
              {isPickingMode && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    setIsPickingMode(false);
                    onSetActiveSnapPointMode(false);
                  }}
                >
                  Cancel
                </Button>
              )}
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
