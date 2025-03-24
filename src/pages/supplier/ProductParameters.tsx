
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckIcon, Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Viewport } from '@/components/Viewport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentItem } from '@/components/Sidebar';

// Mock component data for Viewport
const mockForkComponent: ComponentItem = {
  id: 'bicycle-fork',
  name: 'Bicycle Fork',
  type: 'OBJ',
  thumbnail: '/placeholder.svg',
  folder: 'Uploaded Products',
  shape: 'box',
  modelUrl: '/path/to/model.obj' // This would be replaced with actual model URL
};

export const ProductParameters: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponent] = useState<ComponentItem>(mockForkComponent);
  
  // States for form fields
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
  const [description, setDescription] = useState('Project Bike 3d Configurator created so that you can build your existing or future bike with modern technology and 3D graphics. Bike customization has never been so quick and easy, change components, experiment with colors, see how suspension works, show your friends, create the bike of your dream. In the future, we see the project as a online shop or service with which you can easily build and then purchase your bike. Also plans to add other types of bikes, more hardtail, dirt, dh, cross country bikes, road and city bikes.');
  
  const handleIntendedUseChange = (value: string) => {
    setIntendedUse(
      intendedUse.includes(value)
        ? intendedUse.filter(item => item !== value)
        : [...intendedUse, value]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    // Mock saving process
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Product parameters saved successfully');
      navigate('/supplier');
    }, 1500);
  };
  
  return (
    <div className="text-left">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Product Parameters</h1>
      </div>

      <div className="flex h-[calc(100vh-170px)]">
        {/* Left Column - Parameters (30% width) */}
        <div className="w-[30%] pr-6 overflow-hidden flex flex-col">
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="bg-black text-white rounded-full w-full">
              <TabsTrigger value="parameters" className="rounded-full">Parameters</TabsTrigger>
              <TabsTrigger value="snap-points" className="rounded-full">Snap points</TabsTrigger>
              <TabsTrigger value="surface" className="rounded-full">Surface</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-250px)] pr-4">
              <TabsContent value="parameters" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Public</span>
                      <Switch 
                        checked={isPublic} 
                        onCheckedChange={setIsPublic} 
                        id="visibility" 
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
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

                    <div className="space-y-2">
                      <Label>Intended Use</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="use-ebike" 
                            checked={intendedUse.includes('E-bike')} 
                            onCheckedChange={() => handleIntendedUseChange('E-bike')}
                          />
                          <label htmlFor="use-ebike">E-bike</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="use-city" 
                            checked={intendedUse.includes('City bike')} 
                            onCheckedChange={() => handleIntendedUseChange('City bike')}
                          />
                          <label htmlFor="use-city">City bike</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="use-road" 
                            checked={intendedUse.includes('Road bike')} 
                            onCheckedChange={() => handleIntendedUseChange('Road bike')}
                          />
                          <label htmlFor="use-road">Road bike</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="steerer-length">Steerer tube max length</Label>
                        <Input id="steerer-length" value={steererMaxLength} onChange={(e) => setSteererMaxLength(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crown-race">Crown race diameter</Label>
                        <Input id="crown-race" value={crownRaceDiameter} onChange={(e) => setCrownRaceDiameter(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rotor-size">Maximum rotor size</Label>
                        <Input id="rotor-size" value={maxRotorSize} onChange={(e) => setMaxRotorSize(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brake-routing">Brake hose routing</Label>
                        <Input id="brake-routing" value={brakeHoseRouting} onChange={(e) => setBrakeHoseRouting(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country of origin</Label>
                        <Input id="country" value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fender-mounts">Fender mounts</Label>
                      <Input id="fender-mounts" value={fenderMounts} onChange={(e) => setFenderMounts(e.target.value)} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="snap-points" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p>Snap points configuration will be added in future updates.</p>
                </div>
              </TabsContent>

              <TabsContent value="surface" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p>Surface configuration will be added in future updates.</p>
                </div>
              </TabsContent>

              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-32 text-left"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 mb-6">
                <Button 
                  onClick={() => navigate('/supplier')} 
                  variant="outline" 
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-black hover:bg-black/90"
                >
                  {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Right Column - 3D Viewport (70% width) */}
        <div className="w-[70%]">
          <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
            <div className="h-full">
              <Viewport selectedComponent={selectedComponent} onComponentPlaced={() => {}} />
            </div>
            <div className="absolute bottom-4 right-8 flex space-x-2">
              <Button variant="outline" size="sm">
                <ZoomIn size={16} />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut size={16} />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductParameters;
