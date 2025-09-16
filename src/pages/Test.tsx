import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Test = () => {
  const [scriptContent, setScriptContent] = useState('');

  const loadScript = () => {
    // Create a container div for the script content
    const container = document.getElementById('script-output');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Insert the raw HTML (this will execute any scripts)
    container.innerHTML = scriptContent;
    
    // Find and re-execute any script tags (needed for dynamic loading)
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      
      // Copy all attributes
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy inline content if any
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      
      // Replace the old script with the new one to trigger execution
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  };

  return (
    <div className="w-full py-6">
      <h1 className="text-2xl font-bold mb-6 px-6">Script Test Page</h1>
      
      <div className="space-y-4 mb-8 px-6">
        <div>
          <label htmlFor="script-input" className="block text-sm font-medium mb-2">
            Paste your script here:
          </label>
          <Textarea
            id="script-input"
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Paste your widget script here..."
          />
        </div>
        
        <Button onClick={loadScript} className="w-full">
          Load Script
        </Button>
      </div>
      
      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold mb-4 px-6">Output:</h2>
        <div 
          id="script-output" 
          className="w-full min-h-[300px] border rounded-lg p-4 bg-background"
        >
          <p className="text-muted-foreground text-center py-8">
            Script output will appear here...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Test;