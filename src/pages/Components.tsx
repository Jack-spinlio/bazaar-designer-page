
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SHIMANO_COMPONENTS } from '@/components/Sidebar';

const Components = () => {
  return (
    <Layout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>
              Browse and select Shimano components for your bike design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Choose a component from the sidebar to add it to your design. These components can be customized after placement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHIMANO_COMPONENTS.map((component) => (
                <div key={component.id} className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="h-40 w-full flex items-center justify-center mb-3">
                    <img 
                      src={component.thumbnail} 
                      alt={component.name}
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                  <h3 className="font-medium text-center">{component.name}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Components;
