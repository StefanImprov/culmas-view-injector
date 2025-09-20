import React from "react";
import { Building2, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTenant } from "@/contexts/TenantContext";

export const TenantConfig = () => {
  const { config, updateConfig } = useTenant();

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
                value={config.name}
                onChange={(e) => updateConfig({ name: e.target.value })}
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
                value={config.apiUrl}
                onChange={(e) => updateConfig({ apiUrl: e.target.value })}
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
                value={config.domain}
                onChange={(e) => updateConfig({ domain: e.target.value })}
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
                value={config.bookingUrl}
                onChange={(e) => updateConfig({ bookingUrl: e.target.value })}
                placeholder="https://icc.culmas.io"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};