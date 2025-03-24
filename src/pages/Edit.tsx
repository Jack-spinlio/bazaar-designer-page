
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
    // Use a small but reasonable tolerance for duplicate detection
    const tolerance = 0.001; // 1mm in our scale
    const isDuplicate = snapPoints.some(existing => {
      return (
        Math.abs(existing.position.x - snapPoint.position.x) < tolerance &&
        Math.abs(existing.position.y - snapPoint.position.y) < tolerance &&
        Math.abs(existing.position.z - snapPoint.position.z) < tolerance
      );
    });
    
    if (isDuplicate) {
      toast.error("A snap point already exists at this position");
      return;
    }
    
    // Create a unique ID with timestamp + random component to ensure uniqueness
    const uniqueId = `snap-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const newPoint = {
      ...snapPoint,
      id: uniqueId
    };
    
    // Before adding, one final check to avoid duplicates
    setSnapPoints(prevPoints => {
      // Check for duplicates with the latest state
      const alreadyExists = prevPoints.some(point => 
        Math.abs(point.position.x - newPoint.position.x) < tolerance &&
        Math.abs(point.position.y - newPoint.position.y) < tolerance &&
        Math.abs(point.position.z - newPoint.position.z) < tolerance
      );
      
      if (alreadyExists) {
        toast.error("A snap point already exists at this position");
        return prevPoints; // Return unchanged if duplicate
      }
      
      toast.success(`Added snap point${newPoint.parentId ? ' to component' : ''}`);
      return [...prevPoints, newPoint]; // Add the new point
    });
    
    setSelectedSnapPointId(newPoint.id);
  };

  const handleToggleSnapPointMode = () => {
    setIsSnapPointMode(!isSnapPointMode);
    if (!isSnapPointMode) {
      toast.info('Snap point mode activated. Click on meshes to add snap points.');
    } else {
      toast.info('Snap point mode deactivated.');
      // Clear selected snap point when exiting mode
      setSelectedSnapPointId(null);
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
