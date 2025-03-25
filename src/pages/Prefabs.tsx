
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrefabSidebar, PrefabItem } from '@/components/PrefabSidebar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Prefabs = () => {
  const navigate = useNavigate();
  const [selectedPrefab, setSelectedPrefab] = useState<PrefabItem | null>(null);

  const handlePrefabSelected = (prefab: PrefabItem) => {
    console.log('Selected prefab:', prefab);
    setSelectedPrefab(prefab);
    
    // Navigate to the edit page with the selected prefab
    if (prefab.modelUrl) {
      navigate('/edit', { state: { selectedPrefab: prefab } });
      toast.success(`Loading ${prefab.name} in the editor`);
    } else {
      toast.error(`No model URL found for ${prefab.name}`);
    }
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
