import React, { useState } from "react";
import { Copy, Check, Settings, Code, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "./MultiSelect";
import { useScriptGenerator } from "@/hooks/useScriptGenerator";
import { useToast } from "@/components/ui/use-toast";

export const ScriptGenerator = () => {
  const { config, availableOptions, updateConfig, generateScript } = useScriptGenerator();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyScript = async () => {
    const script = generateScript();
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      toast({
        title: "Script copied!",
        description: "The embed script has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the script manually.",
        variant: "destructive",
      });
    }
  };

  const hasSelections = config.templateIds.length > 0 || config.venueIds.length > 0 || config.categoryIds.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Script Generator
        </CardTitle>
        <CardDescription>
          Configure and generate an embed script for your website. Select the content you want to display and customize the appearance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="script" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Script
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="templates" className="text-base font-medium">
                  Templates (Classes/Shows)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select which types of activities to display
                </p>
                {availableOptions.loading ? (
                  <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                ) : availableOptions.error ? (
                  <Alert>
                    <AlertDescription>{availableOptions.error}</AlertDescription>
                  </Alert>
                ) : (
                  <MultiSelect
                    options={availableOptions.templates}
                    selected={config.templateIds}
                    onSelectionChange={(selected) => updateConfig({ templateIds: selected })}
                    placeholder="Select templates..."
                    searchPlaceholder="Search templates..."
                  />
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="venues" className="text-base font-medium">
                  Venues
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose specific venues to display
                </p>
                {availableOptions.loading ? (
                  <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                ) : (
                  <MultiSelect
                    options={availableOptions.venues}
                    selected={config.venueIds}
                    onSelectionChange={(selected) => updateConfig({ venueIds: selected })}
                    placeholder="Select venues... (leave empty for all)"
                    searchPlaceholder="Search venues..."
                  />
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="categories" className="text-base font-medium">
                  Categories
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Filter by specific categories
                </p>
                {availableOptions.loading ? (
                  <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                ) : (
                  <MultiSelect
                    options={availableOptions.categories}
                    selected={config.categoryIds}
                    onSelectionChange={(selected) => updateConfig({ categoryIds: selected })}
                    placeholder="Select categories... (leave empty for all)"
                    searchPlaceholder="Search categories..."
                  />
                )}
              </div>
            </div>

            {!hasSelections && (
              <Alert>
                <AlertDescription>
                  <strong>Tip:</strong> If you don't select any templates, venues, or categories, all available products will be displayed.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-url" className="text-base font-medium">
                  API URL
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  The endpoint for fetching products
                </p>
                <Input
                  id="api-url"
                  value={config.apiUrl}
                  onChange={(e) => updateConfig({ apiUrl: e.target.value })}
                  placeholder="https://api.dev.culmas.io/"
                />
              </div>

              <div>
                <Label htmlFor="container-selector" className="text-base font-medium">
                  Container Selector
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  The CSS selector where the widget will be inserted
                </p>
                <Input
                  id="container-selector"
                  value={config.containerSelector}
                  onChange={(e) => updateConfig({ containerSelector: e.target.value })}
                  placeholder="#culmas-products"
                />
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Theme customization:</strong> The script will automatically include your current theme settings. 
                Modify the theme using the Theme Customizer above to change the appearance.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="script" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Generated Embed Script</Label>
                  <p className="text-sm text-muted-foreground">
                    Copy this code and paste it into your website
                  </p>
                </div>
                <Button onClick={handleCopyScript} className="flex items-center gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Script"}
                </Button>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  <code>{generateScript()}</code>
                </pre>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Instructions:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Create a div element with the specified ID on your webpage</li>
                    <li>Add the script tag before the closing &lt;/body&gt; tag</li>
                    <li>The widget will automatically load and display your selected products</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};