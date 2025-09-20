import React, { useState } from "react";
import { Building2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/components/ui/use-toast";

export const TenantConfig = () => {
  const { config, updateConfig } = useTenant();
  const { toast } = useToast();
  const [localConfig, setLocalConfig] = useState(config);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateConfig(localConfig);
    
    toast({
      title: "Configuration Updated",
      description: "The live preview has been updated with your new settings.",
    });
    
    setIsUpdating(false);
  };

  const hasChanges = JSON.stringify(config) !== JSON.stringify(localConfig);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Tenant Configuration
        </CardTitle>
        <CardDescription>
          Configure the theatre/organization settings for your product injector.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenant-name" className="text-base font-medium">
                Theatre/Organization Name
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Display name shown in the header
              </p>
              <Input
                id="tenant-name"
                value={localConfig.name}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Globe Theatre"
              />
            </div>

            <div>
              <Label htmlFor="api-url" className="text-base font-medium">
                API URL
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                GraphQL endpoint for data fetching
              </p>
              <Input
                id="api-url"
                value={localConfig.apiUrl}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                placeholder="https://api.culmas.io/"
              />
            </div>

            <div>
              <Label htmlFor="domain" className="text-base font-medium">
                Domain
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Tenant domain for API requests
              </p>
              <Input
                id="domain"
                value={localConfig.domain}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="icc.culmas.io"
              />
            </div>

            <div>
              <Label htmlFor="booking-url" className="text-base font-medium">
                Booking URL
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Base URL for booking links
              </p>
              <Input
                id="booking-url"
                value={localConfig.bookingUrl}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, bookingUrl: e.target.value }))}
                placeholder="https://icc.culmas.io"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleUpdate} 
              disabled={!hasChanges || isUpdating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              {isUpdating ? 'Updating...' : 'Update Live Preview'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};