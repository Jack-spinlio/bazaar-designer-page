
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';
import { SnapPoint } from '@/components/SnapPointEditor';
import * as THREE from 'three';
import { toast } from 'sonner';

const Edit = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([]);
  const [isSnapPointMode, setIsSnapPointMode] = useState(false);
  const [selectedSnapPointId, setSelectedSnapPointId] = useState<string | null>(null);
  
  const handleComponentPlaced = () => {
    setSelectedComponent(null);
  };

  const handleAddSnapPoint = (snapPoint: SnapPoint) => {
    setSnapPoints([...snapPoints, snapPoint]);
    setSelectedSnapPointId(snapPoint.id);
    toast.success(`Added snap point${snapPoint.parentId ? ' to component' : ''}`);
  };

  const handleToggleSnapPointMode = () => {
    setIsSnapPointMode(!isSnapPointMode);
    if (!isSnapPointMode) {
      toast.info('Snap point mode activated. Click on meshes to add snap points.');
    } else {
      toast.info('Snap point mode deactivated.');
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[320px] h-full">
          <EditToolbar 
            isSnapPointMode={isSnapPointMode}
            onToggleSnapPointMode={handleToggleSnapPointMode}
          />
        </div>
        <div className="flex-1 h-full">
          <Viewport 
            selectedComponent={selectedComponent}
            onComponentPlaced={handleComponentPlaced}
            snapPoints={snapPoints}
            setSnapPoints={setSnapPoints}
            isSnapPointMode={isSnapPointMode}
            onSnapPointAdded={handleAddSnapPoint}
            selectedSnapPointId={selectedSnapPointId}
            onSelectSnapPoint={setSelectedSnapPointId}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
