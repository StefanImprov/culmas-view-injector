import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const Test = () => {
  const [scriptContent, setScriptContent] = useState(`<!-- Culmas Product Widget -->
<link rel="stylesheet" href="https://stefanimprov.github.io/culmas-view-injector/widget/culmas-widget.css">
<div id="culmas-products"></div>
<script 
  src="https://stefanimprov.github.io/culmas-view-injector/widget/culmas-widget.js"
  data-culmas-widget="true"
  data-container="#culmas-products"
  data-api-url="https://api.dev.culmas.io/"
  data-theme='{"id":"modern-purple","name":"Modern Purple","style":"modern","colors":{"primary":"262 83% 58%","primaryForeground":"210 40% 98%","primaryGlow":"262 83% 70%","gradientPrimary":"262 83% 65%","secondary":"210 40% 96%","secondaryForeground":"222.2 84% 4.9%","background":"0 0% 100%","foreground":"222.2 84% 4.9%","card":"0 0% 100%","cardForeground":"222.2 84% 4.9%","border":"214.3 31.8% 91.4%","accent":"210 40% 96%","accentForeground":"222.2 84% 4.9%","muted":"210 40% 96%","mutedForeground":"215.4 16.3% 46.9%"},"design":{"borderRadius":"0.75rem","shadowIntensity":"medium","hoverEffects":true,"gradients":true}}'
></script>`);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const testContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearContainer = () => {
    if (testContainerRef.current) {
      testContainerRef.current.innerHTML = '';
    }
    setLogs([]);
    setIsLoaded(false);
    
    // Clean up any existing scripts and styles
    const existingScripts = document.querySelectorAll('script[src*="culmas-widget"]');
    const existingStyles = document.querySelectorAll('link[href*="culmas-widget"]');
    existingScripts.forEach(script => script.remove());
    existingStyles.forEach(style => style.remove());
    
    addLog('Cleared container and removed existing scripts/styles');
  };

  const executeScript = () => {
    if (!testContainerRef.current) return;
    
    clearContainer();
    addLog('Starting script execution...');
    
    try {
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = scriptContent;
      
      // Extract and load CSS link
      const cssLinks = tempDiv.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach((link) => {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = (link as HTMLLinkElement).href;
        cssLink.onload = () => addLog(`CSS loaded: ${cssLink.href}`);
        cssLink.onerror = () => addLog(`CSS failed to load: ${cssLink.href}`);
        document.head.appendChild(cssLink);
      });
      
      // Extract and append div elements
      const divs = tempDiv.querySelectorAll('div');
      divs.forEach((div) => {
        const newDiv = document.createElement('div');
        newDiv.id = div.id;
        newDiv.className = div.className;
        testContainerRef.current?.appendChild(newDiv);
        addLog(`Created container: #${div.id}`);
      });
      
      // Extract and load script
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        newScript.onload = () => {
          addLog(`Script loaded: ${newScript.src}`);
          setIsLoaded(true);
        };
        
        newScript.onerror = () => {
          addLog(`Script failed to load: ${newScript.src}`);
        };
        
        // Add console log interceptor to capture widget logs
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        
        console.log = (...args) => {
          addLog(`[LOG] ${args.join(' ')}`);
          originalConsoleLog.apply(console, args);
        };
        
        console.error = (...args) => {
          addLog(`[ERROR] ${args.join(' ')}`);
          originalConsoleError.apply(console, args);
        };
        
        console.warn = (...args) => {
          addLog(`[WARN] ${args.join(' ')}`);
          originalConsoleWarn.apply(console, args);
        };
        
        document.head.appendChild(newScript);
        addLog(`Appended script with attributes: ${Array.from(newScript.attributes).map(a => `${a.name}="${a.value}"`).join(', ')}`);
      });
      
    } catch (error) {
      addLog(`Error executing script: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Widget Test Environment</h1>
        <p className="text-muted-foreground">Test the production widget script in a controlled environment</p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Script Input */}
        <Card>
          <CardHeader>
            <CardTitle>Script Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Paste your widget script here..."
            />
            <div className="flex gap-2">
              <Button onClick={executeScript} className="flex-1">
                Execute Script
              </Button>
              <Button onClick={clearContainer} variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm max-h-[300px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Test Container */}
      <Card>
        <CardHeader>
          <CardTitle>Widget Test Container</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              The widget will be rendered below. Check the debug logs above for detailed information about loading and execution.
            </AlertDescription>
          </Alert>
          
          <div 
            ref={testContainerRef}
            className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
            style={{ background: 'white' }}
          >
            {!isLoaded && (
              <div className="text-center text-gray-500 py-8">
                Widget will appear here after script execution...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Test;