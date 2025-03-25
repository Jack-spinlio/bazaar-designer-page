
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { HelpCircle, Award, ArrowRight } from 'lucide-react';

export const FileTypeGuide = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 my-4">
      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
        <HelpCircle size={18} className="text-blue-600" />
        3D File Type Guide
      </h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="best-formats">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span>Recommended File Formats</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                <div className="font-semibold text-green-600">GLB/GLTF</div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">Best option</span> - Optimized format that includes
                  geometry, materials, and textures in a single file.
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                <div className="font-semibold text-blue-600">OBJ</div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">Very good</span> - Widely compatible format that
                  supports geometry and basic materials.
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                <div className="font-semibold text-blue-600">STL</div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">Good</span> - Simple format with just geometry,
                  commonly used for 3D printing.
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                <div className="font-semibold text-orange-600">STEP/STP</div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">Limited support</span> - Displays as placeholder in viewport, 
                  but good for precision engineering.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="conversion-tips">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <ArrowRight size={16} className="text-blue-500" />
              <span>How to Convert Your Models</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>For <strong>STEP/STP files</strong>: Convert to OBJ or GLB using CAD software like FreeCAD or Blender</li>
              <li>For <strong>IGES files</strong>: Convert to OBJ or STL using CAD conversion tools</li>
              <li>For <strong>Solidworks/Fusion 360</strong>: Export directly to OBJ or STL format</li>
              <li>Use online converters like <span className="text-blue-600">OnShape</span> or <span className="text-blue-600">TinkerCAD</span> for simple conversions</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
