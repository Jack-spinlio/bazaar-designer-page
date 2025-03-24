
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckIcon, Plus, ZoomIn, ZoomOut, Maximize2, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Viewport } from '@/components/Viewport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentItem } from '@/components/Sidebar';
import { SnapPointTools } from '@/components/SnapPointTools';
import { SnapPoint } from '@/components/SnapPointEditor';
import * as THREE from 'three';

export const ProductParameters: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const [isPublic, setIsPublic] = useState(true);
  const [steererDiameter, setSteererDiameter] = useState('1 1/8 to 1 1/2');
  const [intendedUse, setIntendedUse] = useState<string[]>(['E-bike', 'City bike']);
  const [brakeMount, setBrakeMount] = useState('Post mount');
  const [axleType, setAxleType] = useState('Quick-Release');
  const [axleWidth, setAxleWidth] = useState('100mm');
  const [axleDiameter, setAxleDiameter] = useState('9mm');
  const [steererMaxLength, setSteererMaxLength] = useState('300mm');
  const [crownRaceDiameter, setCrownRaceDiameter] = useState('');
  const [maxRotorSize, setMaxRotorSize] = useState('300mm');
  const [brakeHoseRouting, setBrakeHoseRouting] = useState('Internal');
  const [category, setCategory] = useState('Rigid, suspension');
  const [countryOfOrigin, setCountryOfOrigin] = useState('Taiwan');
  const [fenderMounts, setFenderMounts] = useState('Yes');
  const [description, setDescription] = useState('');

  const [activeTab, setActiveTab] = useState('parameters');
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([]);
  const [isSnapPointMode, setIsSnapPointMode] = useState(false);
  const [selectedSnapPointId, setSelectedSnapPointId] = useState<string | null>(null);
  const [activeSnapPoint, setActiveSnapPoint] = useState<SnapPoint | null>(null);

  useEffect(() => {
    const storedProduct = localStorage.getItem('currentUploadedProduct');
    if (storedProduct) {
      try {
        const productData = JSON.parse(storedProduct);
        console.log("Loaded product data:", productData);
        
        const component: ComponentItem = {
          id: productData.id || `product-${Date.now()}`,
          name: productData.name || 'New Product',
          type: productData.type || 'STL',
          thumbnail: productData.thumbnail || '/placeholder.svg',
          folder: productData.folder || 'Default',
          shape: productData.shape || 'box',
          modelUrl: productData.modelUrl || null
        };
        
        setSelectedComponent(component);
        setModelLoaded(true);
        
        if (productData.description) {
          setDescription(productData.description);
        }
        
        if (productData.snapPoints && Array.isArray(productData.snapPoints)) {
          try {
            const formattedSnapPoints: SnapPoint[] = productData.snapPoints.map((point: any) => {
              const snapPoint: SnapPoint = {
                id: point.id || `snap-${Date.now()}`,
                name: point.name || 'Snap Point',
                type: point.type || 'point',
                position: new THREE.Vector3(
                  point.position?.x || 0,
                  point.position?.y || 0,
                  point.position?.z || 0
                ),
                compatibility: point.compatibility || []
              };
              
              if (point.parentId) {
                snapPoint.parentId = point.parentId;
              }
              
              if (point.normal && point.normal.x !== undefined) {
                snapPoint.normal = new THREE.Vector3(
                  point.normal.x,
                  point.normal.y,
                  point.normal.z
                );
              }
              
              if (point.localPosition && point.localPosition.x !== undefined) {
                snapPoint.localPosition = new THREE.Vector3(
                  point.localPosition.x,
                  point.localPosition.y,
                  point.localPosition.z
                );
              }
              
              if (point.localNormal && point.localNormal.x !== undefined) {
                snapPoint.localNormal = new THREE.Vector3(
                  point.localNormal.x,
                  point.localNormal.y,
                  point.localNormal.z
                );
              }
              
              return snapPoint;
            });
            
            setSnapPoints(formattedSnapPoints);
          } catch (error) {
            console.error('Error formatting snap points:', error);
          }
        }
        
        console.log("Created component object:", component);
        toast.success("Product data loaded successfully");
      } catch (error) {
        console.error('Error parsing product data:', error);
        toast.error("Failed to load product data");
      }
    } else {
      console.log("No product data found in local storage");
      toast.error("No product data found. Please upload a product first.");
      navigate('/supplier/upload');
    }
  }, [navigate]);

  const handleIntendedUseChange = (value: string) => {
    setIntendedUse(intendedUse.includes(value) 
      ? intendedUse.filter(item => item !== value) 
      : [...intendedUse, value]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const snapPointsForStorage = snapPoints.map(point => ({
        ...point,
        position: {
          x: point.position.x,
          y: point.position.y,
          z: point.position.z
        },
        normal: point.normal ? {
          x: point.normal.x,
          y: point.normal.y,
          z: point.normal.z
        } : undefined,
        localPosition: point.localPosition ? {
          x: point.localPosition.x,
          y: point.localPosition.y,
          z: point.localPosition.z
        } : undefined,
        localNormal: point.localNormal ? {
          x: point.localNormal.x,
          y: point.localNormal.y,
          z: point.localNormal.z
        } : undefined
      }));
      
      const storedProduct = localStorage.getItem('currentUploadedProduct');
      if (storedProduct) {
        const productData = JSON.parse(storedProduct);
        const updatedProduct = {
          ...productData,
          description,
          snapPoints: snapPointsForStorage,
          parameters: {
            isPublic,
            steererDiameter,
            intendedUse,
            brakeMount,
            axleType,
            axleWidth,
            axleDiameter,
            steererMaxLength,
            crownRaceDiameter,
            maxRotorSize,
            brakeHoseRouting,
            category,
            countryOfOrigin,
            fenderMounts
          }
        };
        
        localStorage.setItem('currentUploadedProduct', JSON.stringify(updatedProduct));
      }
      
      setTimeout(() => {
        setIsSaving(false);
        toast.success('Product parameters saved successfully');
        navigate('/supplier');
      }, 1500);
    } catch (error) {
      console.error('Error saving product data:', error);
      toast.error('Failed to save product parameters');
      setIsSaving(false);
    }
  };

  const handleSnapPointAdded = (snapPoint: SnapPoint) => {
    if (!snapPoint.position) {
      console.error("Invalid snap point - missing position");
      return;
    }
    
    // Stricter duplicate detection with smaller tolerance
    const tolerance = 0.0001;
    const isDuplicate = snapPoints.some(existing => {
      return (
        Math.abs(existing.position.x - snapPoint.position.x) < tolerance &&
        Math.abs(existing.position.y - snapPoint.position.y) < tolerance &&
        Math.abs(existing.position.z - snapPoint.position.z) < tolerance
      );
    });
    
    if (isDuplicate) {
      console.log("Duplicate snap point detected, ignoring");
      toast.error("Duplicate snap point detected at this position");
      return;
    }
    
    // Generate a unique ID with timestamp + random value to ensure uniqueness
    const uniqueId = `snap-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    const newPoint: SnapPoint = {
      ...snapPoint,
      id: uniqueId,
      name: snapPoint.name || 'New Snap Point',
      type: snapPoint.type || 'point',
      compatibility: snapPoint.compatibility || []
    };
    
    // Ensure no duplicates in state update
    setSnapPoints(prevPoints => {
      // Double-check for duplicates one more time
      const alreadyExists = prevPoints.some(point => 
        Math.abs(point.position.x - newPoint.position.x) < tolerance &&
        Math.abs(point.position.y - newPoint.position.y) < tolerance &&
        Math.abs(point.position.z - newPoint.position.z) < tolerance
      );
      
      if (alreadyExists) return prevPoints;
      return [...prevPoints, newPoint];
    });
    
    setSelectedSnapPointId(newPoint.id);
    setActiveSnapPoint(newPoint);
    
    console.log(`Added snap point ${newPoint.id}:`);
    console.log(`- Position: (${newPoint.position.x.toFixed(3)}, ${newPoint.position.y.toFixed(3)}, ${newPoint.position.z.toFixed(3)})`);
    
    if (newPoint.parentId) {
      console.log(`- Attached to component: ${newPoint.parentId}`);
      
      if (newPoint.localPosition) {
        console.log(`- Local position: (${newPoint.localPosition.x.toFixed(3)}, ${newPoint.localPosition.y.toFixed(3)}, ${newPoint.localPosition.z.toFixed(3)})`);
      }
    }
    
    toast.success("Snap point added successfully");
  };

  const handleSnapPointDeleted = (id: string) => {
    setSnapPoints(snapPoints.filter(point => point.id !== id));
    if (selectedSnapPointId === id) {
      setSelectedSnapPointId(null);
      setActiveSnapPoint(null);
    }
  };

  const handleSnapPointUpdated = (updatedPoint: SnapPoint) => {
    setSnapPoints(
      snapPoints.map(point => point.id === updatedPoint.id ? updatedPoint : point)
    );
    if (selectedSnapPointId === updatedPoint.id) {
      setActiveSnapPoint(updatedPoint);
    }
  };

  return (
    <div className="text-left">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">Product Parameters</h1>
      </div>

      <div className="flex h-[calc(100vh-150px)] gap-1">
        <div className="w-[30%] overflow-hidden flex flex-col">
          <Tabs 
            defaultValue="parameters" 
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (value !== 'snap-points') {
                setIsSnapPointMode(false);
              }
            }}
            className="w-full"
          >
            <TabsList className="bg-black text-white w-full rounded-xl">
              <TabsTrigger value="parameters" className="rounded-full">Parameters</TabsTrigger>
              <TabsTrigger value="snap-points" className="rounded-full">
                <MapPin size={14} className="mr-1" />
                Snap points
              </TabsTrigger>
              <TabsTrigger value="surface" className="rounded-full">Surface</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-220px)] pr-2">
              <TabsContent value="parameters" className="pt-2">
                <div className="bg-white rounded-lg shadow-sm p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Public</span>
                      <Switch checked={isPublic} onCheckedChange={setIsPublic} id="visibility" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="steerer-diameter">Steerer Tube Diameter</Label>
                      <Select value={steererDiameter} onValueChange={setSteererDiameter}>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select diameter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 1/8 to 1 1/2">1 1/8 to 1 1/2</SelectItem>
                          <SelectItem value="1 1/8">1 1/8</SelectItem>
                          <SelectItem value="1 1/4">1 1/4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label>Intended Use</Label>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="use-ebike" checked={intendedUse.includes('E-bike')} onCheckedChange={() => handleIntendedUseChange('E-bike')} />
                          <label htmlFor="use-ebike">E-bike</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="use-city" checked={intendedUse.includes('City bike')} onCheckedChange={() => handleIntendedUseChange('City bike')} />
                          <label htmlFor="use-city">City bike</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="use-road" checked={intendedUse.includes('Road bike')} onCheckedChange={() => handleIntendedUseChange('Road bike')} />
                          <label htmlFor="use-road">Road bike</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="brake-mount">Brake Mount Type</Label>
                      <Select value={brakeMount} onValueChange={setBrakeMount}>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select mount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Post mount">Post mount</SelectItem>
                          <SelectItem value="IS mount">IS mount</SelectItem>
                          <SelectItem value="Flat mount">Flat mount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="axle-type">Axel type</Label>
                      <Select value={axleType} onValueChange={setAxleType}>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select axle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quick-Release">Quick-Release</SelectItem>
                          <SelectItem value="Thru-axle">Thru-axle</SelectItem>
                          <SelectItem value="Bolt-on">Bolt-on</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="axle-width">Axel width</Label>
                      <Select value={axleWidth} onValueChange={setAxleWidth}>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100mm">100mm</SelectItem>
                          <SelectItem value="110mm">110mm</SelectItem>
                          <SelectItem value="120mm">120mm</SelectItem>
                          <SelectItem value="150mm">150mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="axle-diameter">Axel diameter</Label>
                      <Select value={axleDiameter} onValueChange={setAxleDiameter}>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select diameter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9mm">9mm</SelectItem>
                          <SelectItem value="12mm">12mm</SelectItem>
                          <SelectItem value="15mm">15mm</SelectItem>
                          <SelectItem value="20mm">20mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="steerer-length">Steerer tube max length</Label>
                      <Input id="steerer-length" value={steererMaxLength} onChange={e => setSteererMaxLength(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="crown-race">Crown race diameter</Label>
                      <Input id="crown-race" value={crownRaceDiameter} onChange={e => setCrownRaceDiameter(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="rotor-size">Maximum rotor size</Label>
                      <Input id="rotor-size" value={maxRotorSize} onChange={e => setMaxRotorSize(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="brake-routing">Brake hose routing</Label>
                      <Input id="brake-routing" value={brakeHoseRouting} onChange={e => setBrakeHoseRouting(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="country">Country of origin</Label>
                      <Input id="country" value={countryOfOrigin} onChange={e => setCountryOfOrigin(e.target.value)} />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" value={category} onChange={e => setCategory(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="fender-mounts">Fender mounts</Label>
                      <Input id="fender-mounts" value={fenderMounts} onChange={e => setFenderMounts(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="h-24 text-left" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => navigate('/supplier')} variant="outline" className="mr-2">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-black hover:bg-black/90">
                      {isSaving ? 'Saving...' : 'Save Product'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="snap-points" className="pt-2">
                {activeTab === 'snap-points' && (
                  <SnapPointTools 
                    onClose={() => setActiveTab('parameters')}
                    onSetActiveSnapPointMode={setIsSnapPointMode}
                    onSnapPointAdded={handleSnapPointAdded}
                    onSnapPointDeleted={handleSnapPointDeleted}
                    onSnapPointUpdated={handleSnapPointUpdated}
                    activeSnapPoint={activeSnapPoint}
                    setActiveSnapPoint={setActiveSnapPoint}
                    snapPoints={snapPoints}
                    setSnapPoints={setSnapPoints}
                  />
                )}
              </TabsContent>

              <TabsContent value="surface" className="pt-2">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => navigate('/supplier')} variant="outline" className="mr-2">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-black hover:bg-black/90">
                      {isSaving ? 'Saving...' : 'Save Product'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="w-[70%] rounded-lg overflow-hidden">
          <Viewport 
            selectedComponent={selectedComponent}
            onComponentPlaced={() => {}}
            snapPoints={snapPoints}
            setSnapPoints={setSnapPoints}
            isSnapPointMode={isSnapPointMode}
            onSnapPointAdded={handleSnapPointAdded}
            selectedSnapPointId={selectedSnapPointId}
            onSelectSnapPoint={setSelectedSnapPointId}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductParameters;

