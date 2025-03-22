
import { useState } from 'react';
import { Viewport } from './components/Viewport';
import { Sidebar, ComponentItem } from './components/Sidebar';
import { SnapPointTools } from './components/SnapPointTools';
import { StatusBar } from './components/StatusBar';
import './App.css';

function App() {
  const [showSnapPointTools, setShowSnapPointTools] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);

  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
  };

  const toggleSnapPointTools = () => {
    setShowSnapPointTools(!showSnapPointTools);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-app-gray-dark">
      <StatusBar
        onToggleSnapPointTools={toggleSnapPointTools}
        showSnapPointTools={showSnapPointTools}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 h-full">
          <Sidebar onSelectComponent={handleComponentSelected} />
        </div>
        
        <Viewport />
        
        {showSnapPointTools && (
          <div className="w-80">
            <SnapPointTools onClose={() => setShowSnapPointTools(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
