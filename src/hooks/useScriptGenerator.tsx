import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useTenant } from "@/contexts/TenantContext";

export interface ScriptConfig {
  apiUrl: string;
  containerSelector: string;
  templateIds: string[];
  venueIds: string[];
  categoryIds: string[];
}

export const useScriptGenerator = () => {
  const { theme } = useTheme();
  const { config: tenantConfig } = useTenant();
  const [config, setConfig] = useState<ScriptConfig>({
    apiUrl: tenantConfig.apiUrl,
    containerSelector: "#culmas-products",
    templateIds: [],
    venueIds: [],
    categoryIds: [],
  });

  const [availableOptions, setAvailableOptions] = useState({
    templates: [] as Array<{ value: string; label: string }>,
    venues: [] as Array<{ value: string; label: string }>,
    categories: [] as Array<{ value: string; label: string }>,
    loading: true,
    error: null as string | null,
  });

  // Update config when tenant config changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      apiUrl: tenantConfig.apiUrl,
    }));
  }, [tenantConfig.apiUrl]);

  // Fetch available options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setAvailableOptions(prev => ({ ...prev, loading: true, error: null }));
        
        const graphqlEndpoint = tenantConfig.apiUrl;
        const headers = {
          "Content-Type": "application/json",
          domain: tenantConfig.domain,
        };

        const query = `query AllProducts($onlyAvailableForSale: Boolean) {
          allProducts(onlyAvailableForSale: $onlyAvailableForSale) {
            id
            title
            category
            venue
            templateTitle
            templateId
          }
        }`;

        const response = await fetch(graphqlEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query,
            variables: { onlyAvailableForSale: true }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "GraphQL error");
        }

        const products = data.data?.allProducts || [];
        
        // Extract unique options
        const templates = Array.from(new Set(
          products.map((p: any) => ({ id: p.templateId, title: p.templateTitle }))
            .filter((t: any) => t.id && t.title)
        )).map((t: any) => ({ value: t.id, label: t.title }));

        const venues = Array.from(new Set(
          products.map((p: any) => p.venue).filter(Boolean)
        )).map((v: string) => ({ value: v, label: v }));

        const categories = Array.from(new Set(
          products.map((p: any) => p.category).filter(Boolean)
        )).map((c: string) => ({ value: c, label: c }));

        setAvailableOptions({
          templates,
          venues,
          categories,
          loading: false,
          error: null,
        });

      } catch (error) {
        setAvailableOptions(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch options"
        }));
      }
    };

    fetchOptions();
  }, [tenantConfig.apiUrl, tenantConfig.domain]);

  const generateScript = (): string => {
    const scriptData: Record<string, string> = {
      "data-culmas-widget": "true",
      "data-container": config.containerSelector,
      "data-api-url": config.apiUrl,
    };

    if (config.templateIds.length > 0) {
      scriptData["data-template-ids"] = config.templateIds.join(",");
    }

    if (config.venueIds.length > 0) {
      scriptData["data-venue-ids"] = config.venueIds.join(",");
    }

    if (config.categoryIds.length > 0) {
      scriptData["data-category-ids"] = config.categoryIds.join(",");
    }

    // Add theme data
    scriptData["data-theme"] = JSON.stringify(theme);

    const scriptAttributes = Object.entries(scriptData)
      .map(([key, value]) => `  ${key}="${value}"`)
      .join("\n");

    return `<!-- Container on your website -->
<div id="${config.containerSelector.replace('#', '')}"></div>

<!-- Culmas Product Injector Script -->
<script
  defer
  src="https://stefanimprov.github.io/culmas-view-injector/embed/culmas-embed.js?v=1"
${scriptAttributes}
></script>`;
  };

  const updateConfig = (updates: Partial<ScriptConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return {
    config,
    availableOptions,
    updateConfig,
    generateScript,
  };
};