
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrefabSidebar } from '@/components/PrefabSidebar';

const Prefabs = () => {
  const handlePrefabSelected = (prefab) => {
    console.log('Selected prefab:', prefab);
  };

  return (
    <Layout>
      <div className="p-6 flex">
        <div className="w-[320px] mr-6">
          <PrefabSidebar onSelectPrefab={handlePrefabSelected} />
        </div>
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Prefabs Library</CardTitle>
              <CardDescription>
                Browse and select pre-made bike components for your design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Choose a prefab from the sidebar to add it to your design. These pre-made components can be customized after placement.
              </p>
              <p>
                Select a 3D model from the left sidebar to view details and add it to your project.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Prefabs;
