
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SHIMANO_COMPONENTS } from '@/components/Sidebar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';

const Components = () => {
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentItem | null>(null);
  
  const handleComponentSelect = (component: ComponentItem) => {
    setSelectedComponent(component);
  };
  
  const handleComponentPlaced = () => {
    setSelectedComponent(null);
  };
  
  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[320px] h-full overflow-y-auto">
          <Card className="h-full border-0 shadow-none">
            <CardHeader>
              <CardTitle>Component Library</CardTitle>
              <CardDescription>
                Browse and select Shimano components for your bike design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Choose a component from below to add it to your design. These components can be customized after placement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SHIMANO_COMPONENTS.map((component) => (
                  <div 
                    key={component.id} 
                    className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleComponentSelect(component)}
                  >
                    <div className="h-32 w-full flex items-center justify-center mb-3">
                      <img 
                        src={component.thumbnail} 
                        alt={component.name}
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <h3 className="font-medium text-center text-sm">{component.name}</h3>
                    <span className="text-xs text-gray-500">{component.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 h-full ml-4">
          <Viewport 
            selectedComponent={selectedComponent}
            onComponentPlaced={handleComponentPlaced}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Components;
