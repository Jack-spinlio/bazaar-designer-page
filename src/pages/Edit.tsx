import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';
import { ComponentItem } from '@/components/Sidebar';
import { SnapPoint } from '@/components/SnapPointEditor';
import * as THREE from 'three';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Edit = () => {
  // Default Shimano motor model
  const defaultShimanoModel: ComponentItem = {
    id: 'shimano-ep800',
    name: 'Shimano EP800',
    type: 'STL',
    thumbnail: '/placeholder.svg',
    folder: 'Default Models',
    modelUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//1742796907092_Shimano_Ep800.stl',
    shape: 'box' // Added the required shape property
  };

  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(defaultShimanoModel);
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([]);
  const [isSnapPointMode, setIsSnapPointMode] = useState(false);
  const [selectedSnapPointId, setSelectedSnapPointId] = useState<string | null>(null);
  
  // Coordinate inputs for manual snap point creation
  const [showSnapPointDialog, setShowSnapPointDialog] = useState(false);
  const [snapPointX, setSnapPointX] = useState("0");
  const [snapPointY, setSnapPointY] = useState("0");
  const [snapPointZ, setSnapPointZ] = useState("0");
  const [snapPointType, setSnapPointType] = useState<'point' | 'plane'>('point');
  const [snapPointName, setSnapPointName] = useState("New Snap Point");
  
  const handleComponentPlaced = () => {
    setSelectedComponent(defaultShimanoModel);
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

  const handleOpenSnapPointDialog = () => {
    setShowSnapPointDialog(true);
  };

  const handleAddManualSnapPoint = () => {
    try {
      const x = parseFloat(snapPointX);
      const y = parseFloat(snapPointY);
      const z = parseFloat(snapPointZ);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        toast.error("Please enter valid numbers for coordinates");
        return;
      }
      
      const newSnapPoint: SnapPoint = {
        id: '', // Will be set by handleAddSnapPoint
        name: snapPointName || "New Snap Point",
        type: snapPointType,
        position: new THREE.Vector3(x, y, z),
        compatibility: []
      };
      
      handleAddSnapPoint(newSnapPoint);
      setShowSnapPointDialog(false);
      
      // Reset form for next time
      setSnapPointX("0");
      setSnapPointY("0");
      setSnapPointZ("0");
      setSnapPointName("New Snap Point");
    } catch (error) {
      console.error("Error adding manual snap point:", error);
      toast.error("Failed to add snap point");
    }
  };

  const handleAddPredefinedSnapPoints = (positions: Array<[number, number, number]>) => {
    let addedCount = 0;
    
    positions.forEach(([x, y, z]) => {
      const newSnapPoint: SnapPoint = {
        id: '', // Will be set by handleAddSnapPoint
        name: `Point ${addedCount + 1}`,
        type: 'point',
        position: new THREE.Vector3(x, y, z),
        compatibility: []
      };
      
      // Check if this point would be a duplicate before adding
      const tolerance = 0.001;
      const isDuplicate = snapPoints.some(existing => 
        Math.abs(existing.position.x - x) < tolerance &&
        Math.abs(existing.position.y - y) < tolerance &&
        Math.abs(existing.position.z - z) < tolerance
      );
      
      if (!isDuplicate) {
        handleAddSnapPoint(newSnapPoint);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} predefined snap points`);
    } else {
      toast.info("No new snap points were added (duplicates detected)");
    }
  };

  const handleAddCornerSnapPoints = () => {
    // Add snap points at standard positions for a bike fork
    // Based on the 200mm x 130mm x 90mm dimensions
    const halfLength = 1.0; // Half of 200mm = 100mm = 1.0 unit
    const halfHeight = 0.65; // Half of 130mm = 65mm = 0.65 unit
    const halfWidth = 0.45; // Half of 90mm = 45mm = 0.45 unit
    
    // Create 8 corner points of a bounding box
    const cornerPositions: Array<[number, number, number]> = [
      [-halfWidth, -halfHeight, -halfLength], // Bottom left back
      [halfWidth, -halfHeight, -halfLength],  // Bottom right back
      [-halfWidth, halfHeight, -halfLength],  // Top left back
      [halfWidth, halfHeight, -halfLength],   // Top right back
      [-halfWidth, -halfHeight, halfLength],  // Bottom left front
      [halfWidth, -halfHeight, halfLength],   // Bottom right front
      [-halfWidth, halfHeight, halfLength],   // Top left front
      [halfWidth, halfHeight, halfLength]     // Top right front
    ];
    
    handleAddPredefinedSnapPoints(cornerPositions);
  };

  const handleAddAxisSnapPoints = () => {
    // Add snap points at the center of each face of a bounding box
    // Based on the 200mm x 130mm x 90mm dimensions
    const halfLength = 1.0; // Half of 200mm = 100mm = 1.0 unit
    const halfHeight = 0.65; // Half of 130mm = 65mm = 0.65 unit
    const halfWidth = 0.45; // Half of 90mm = 45mm = 0.45 unit
    
    // Create 6 axis-aligned points (centers of each face)
    const axisPositions: Array<[number, number, number]> = [
      [0, 0, -halfLength],  // Center of back face
      [0, 0, halfLength],   // Center of front face
      [-halfWidth, 0, 0],   // Center of left face
      [halfWidth, 0, 0],    // Center of right face
      [0, -halfHeight, 0],  // Center of bottom face
      [0, halfHeight, 0]    // Center of top face
    ];
    
    handleAddPredefinedSnapPoints(axisPositions);
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[320px] h-full">
          <EditToolbar 
            isSnapPointMode={isSnapPointMode}
            onToggleSnapPointMode={handleToggleSnapPointMode}
          />
          
          {/* Snap Point Controls */}
          {isSnapPointMode && (
            <div className="p-4 space-y-4 bg-white rounded-lg shadow-sm mt-4">
              <h3 className="font-medium">Snap Point Tools</h3>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleOpenSnapPointDialog} 
                  className="w-full"
                >
                  Add Point Manually
                </Button>
                
                <Button 
                  onClick={handleAddCornerSnapPoints} 
                  className="w-full"
                  variant="outline"
                >
                  Add Corner Points
                </Button>
                
                <Button 
                  onClick={handleAddAxisSnapPoints} 
                  className="w-full"
                  variant="outline"
                >
                  Add Center Points
                </Button>
              </div>
            </div>
          )}
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
      
      {/* Manual Snap Point Dialog */}
      <Dialog open={showSnapPointDialog} onOpenChange={setShowSnapPointDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Snap Point</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="snapPointName">Name</Label>
              <Input
                id="snapPointName"
                value={snapPointName}
                onChange={(e) => setSnapPointName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="snapPointX">X Position</Label>
                <Input
                  id="snapPointX"
                  value={snapPointX}
                  onChange={(e) => setSnapPointX(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snapPointY">Y Position</Label>
                <Input
                  id="snapPointY"
                  value={snapPointY}
                  onChange={(e) => setSnapPointY(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snapPointZ">Z Position</Label>
                <Input
                  id="snapPointZ"
                  value={snapPointZ}
                  onChange={(e) => setSnapPointZ(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={snapPointType === 'point'}
                    onChange={() => setSnapPointType('point')}
                  />
                  <span>Point</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={snapPointType === 'plane'}
                    onChange={() => setSnapPointType('plane')}
                  />
                  <span>Plane</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSnapPointDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddManualSnapPoint}>
              Add Snap Point
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Edit;
