import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Copy, Download, Eye, EyeOff, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Theme } from "@/types/theme";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";

interface EmbedScriptGeneratorProps {
  theme?: Theme;
}

interface TemplateOption {
  id: string;
  title: string;
}

interface VenueOption {
  id: string;
  title: string;
}

export const EmbedScriptGenerator = ({ theme }: EmbedScriptGeneratorProps) => {
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [selectedVenueIds, setSelectedVenueIds] = useState<string[]>([]);
  const [containerId, setContainerId] = useState("culmas-products");
  const [showPreview, setShowPreview] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true);
  const [customWidgetUrl, setCustomWidgetUrl] = useState("");
  
  // API data states
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Fetch template and venue options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        setOptionsError(null);
        
        const graphqlEndpoint = "https://api.dev.culmas.io/";
        const sharedHeaders = {
          "Content-Type": "application/json",
          "domain": "globe-dance.dev.culmas.io",
        };

        const CULMAS_QUERY = `query AllProducts($onlyAvailableForSale: Boolean) {
          allProducts(onlyAvailableForSale: $onlyAvailableForSale) {
            template {
              id
              title
            }
            venue {
              id
              title
            }
          }
        }`;

        const response = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: sharedHeaders,
          body: JSON.stringify({
            query: CULMAS_QUERY,
            variables: { onlyAvailableForSale: true },
          }),
        });

        const result = await response.json();
        const products = result?.data?.allProducts || [];
        
        // Extract unique templates
        const uniqueTemplates = new Map<string, TemplateOption>();
        products.forEach((product: any) => {
          if (product.template?.id && product.template?.title) {
            uniqueTemplates.set(product.template.id, {
              id: product.template.id,
              title: product.template.title
            });
          }
        });

        // Extract unique venues
        const uniqueVenues = new Map<string, VenueOption>();
        products.forEach((product: any) => {
          if (product.venue?.id && product.venue?.title) {
            uniqueVenues.set(product.venue.id, {
              id: product.venue.id,
              title: product.venue.title
            });
          }
        });

        setTemplateOptions(Array.from(uniqueTemplates.values()));
        setVenueOptions(Array.from(uniqueVenues.values()));
        
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setOptionsError("Failed to load template and venue options");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Simple widget embed code generation
  const generateWidgetEmbedCode = () => {
    // Determine the widget URL based on mode
    let widgetJsUrl;
    if (customWidgetUrl.trim()) {
      widgetJsUrl = customWidgetUrl.trim();
    } else if (isDevelopmentMode) {
      // Use current Lovable project URL for development
      const currentUrl = window.location.origin;
      widgetJsUrl = `${currentUrl}/simple-widget.js`;
    } else {
      // CDN URL for production
      widgetJsUrl = "https://cdn.culmas.io/simple-widget.js";
    }

    return `<!-- Culmas Product Widget -->
<div id="${containerId || 'culmas-widget'}"></div>
<script 
  src="${widgetJsUrl}"
  data-culmas-widget="true"
  data-container="#${containerId || 'culmas-widget'}"
  data-api-url="https://api.dev.culmas.io/"
  data-api-key="YOUR_API_KEY_HERE"
  ${selectedTemplateIds.length > 0 ? `data-template-ids="${selectedTemplateIds.join(',')}"` : ''}
  ${selectedVenueIds.length > 0 ? `data-venue-ids="${selectedVenueIds.join(',')}"` : ''}
  ${theme ? `data-theme='${JSON.stringify(theme)}'` : ''}
></script>`;
  };

  // Legacy CSS Generation (kept for reference)
  const generateCSS = () => {
    const themeColors = theme?.colors;
    const primary = themeColors?.primary || 'rgb(139, 92, 246)';
    const primaryForeground = themeColors?.primaryForeground || 'rgb(255, 255, 255)';
    const background = themeColors?.background || 'rgb(255, 255, 255)';
    const foreground = themeColors?.foreground || 'rgb(15, 23, 42)';
    const card = themeColors?.card || 'rgb(255, 255, 255)';
    const cardForeground = themeColors?.cardForeground || 'rgb(15, 23, 42)';
    const border = themeColors?.border || 'rgb(226, 232, 240)';
    const secondary = themeColors?.secondary || 'rgb(241, 245, 249)';
    const secondaryForeground = themeColors?.secondaryForeground || 'rgb(15, 23, 42)';
    const muted = themeColors?.muted || 'rgb(241, 245, 249)';
    const mutedForeground = themeColors?.mutedForeground || 'rgb(100, 116, 139)';
    const accent = themeColors?.accent || 'rgb(241, 245, 249)';
    const accentForeground = themeColors?.accentForeground || 'rgb(15, 23, 42)';
    
    return `
    <style>
      /* Widget CSS is now bundled with the JavaScript - this is kept for legacy support */
      .culmas-widget-container {
        --cw-primary: ${primary};
        --cw-primary-foreground: ${primaryForeground};
        --cw-background: ${background};
        --cw-foreground: ${foreground};
        --cw-card: ${card};
        --cw-card-foreground: ${cardForeground};
        --cw-border: ${border};
        --cw-secondary: ${secondary};
        --cw-secondary-foreground: ${secondaryForeground};
        --cw-muted: ${muted};
        --cw-muted-foreground: ${mutedForeground};
        --cw-accent: ${accent};
        --cw-accent-foreground: ${accentForeground};
        --cw-shadow-glow: 0 0 30px color-mix(in srgb, ${primary} 30%, transparent);
        --cw-gradient-primary: linear-gradient(135deg, ${primary}, color-mix(in srgb, ${primary} 80%, white 20%));
        --cw-gradient-secondary: linear-gradient(180deg, ${background}, ${accent});
        --cw-transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      #${containerId} {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.6;
        color: var(--foreground);
        background-color: var(--background);
        border-radius: 12px;
        padding: 24px;
      }
      
      .culmas-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
      }
      
      /* View Controls */
      .culmas-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }
      
      .culmas-view-switcher {
        display: flex;
        gap: 8px;
      }
      
      .culmas-view-btn {
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--background);
        color: var(--foreground);
        cursor: pointer;
        transition: var(--transition-smooth);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 500;
      }
      
      .culmas-view-btn:hover {
        background: var(--accent);
        border-color: var(--primary);
      }
      
      .culmas-view-btn.active {
        background: var(--primary);
        color: var(--primary-foreground);
        border-color: var(--primary);
      }
      
      /* Filters */
      .culmas-filters {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      
      .culmas-filter {
        padding: 8px 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--background);
        color: var(--foreground);
        cursor: pointer;
        transition: var(--transition-smooth);
        font-size: 14px;
        font-weight: 500;
      }
      
      .culmas-filter:hover {
        background: var(--accent);
        border-color: var(--primary);
      }
      
      .culmas-filter.active {
        background: var(--primary);
        color: var(--primary-foreground);
        border-color: var(--primary);
        box-shadow: var(--shadow-glow);
      }
      
      /* Card View Styles */
      .culmas-products.card-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
      }
      
      .culmas-product-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        transition: var(--transition-smooth);
        cursor: pointer;
        box-shadow: var(--shadow-sm);
        transform: translateZ(0);
      }
      
      .culmas-product-card:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: var(--shadow-lg);
        border-color: color-mix(in srgb, var(--primary) 20%, var(--border) 80%);
      }
      
      .culmas-product-image {
        width: 100%;
        height: 192px;
        background: var(--gradient-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: color-mix(in srgb, var(--muted-foreground) 30%, transparent);
        position: relative;
        overflow: hidden;
      }
      
      .culmas-product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(--transition-smooth);
      }
      
      .culmas-product-card:hover .culmas-product-image img {
        transform: scale(1.1);
      }
      
      .culmas-product-image::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--gradient-primary);
        opacity: 0;
        transition: var(--transition-smooth);
      }
      
      .culmas-product-card:hover .culmas-product-image::before {
        opacity: 0.2;
      }
      
      .culmas-sold-out-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #dc2626;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }
      
      .culmas-product-content {
        padding: 20px;
      }
      
      .culmas-product-header {
        margin-bottom: 12px;
      }
      
      .culmas-product-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--card-foreground);
        transition: var(--transition-smooth);
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .culmas-product-card:hover .culmas-product-title {
        color: var(--primary);
      }
      
      .culmas-product-description {
        font-size: 14px;
        color: var(--muted-foreground);
        margin-bottom: 16px;
        line-height: 1.5;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .culmas-icon {
        width: 16px;
        height: 16px;
        color: var(--primary);
        flex-shrink: 0;
        margin-top: 2px;
      }
      
      .culmas-product-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        color: var(--muted-foreground);
      }
      
      .culmas-product-detail {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .culmas-product-footer {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }
      
      .culmas-price-category {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .culmas-product-price {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary);
      }
      
      .culmas-product-category {
        background: color-mix(in srgb, var(--accent) 50%, transparent);
        color: var(--accent-foreground);
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .culmas-product-button {
        width: 100%;
        background: var(--primary);
        color: var(--primary-foreground);
        border: none;
        padding: 12px 16px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: var(--transition-smooth);
        min-height: 44px;
      }
      
      .culmas-product-button:hover {
        box-shadow: var(--shadow-glow);
        transform: translateY(-1px) scale(1.02);
      }
      
      .culmas-product-button.waitlist {
        background: var(--secondary);
        color: var(--secondary-foreground);
      }
      
      .culmas-product-button.waitlist:hover {
        background: var(--accent);
      }
      
      /* List View Styles */
      .culmas-products.list-view {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }
      
      .culmas-products.list-view .culmas-product-card {
        display: flex;
        align-items: stretch;
        padding: 24px;
        height: auto;
      }
      
      .culmas-products.list-view .culmas-product-image {
        width: 80px;
        height: 80px;
        border-radius: 12px;
        margin-right: 24px;
        flex-shrink: 0;
        font-size: 24px;
      }
      
      .culmas-products.list-view .culmas-product-content {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        padding: 0;
        gap: 24px;
      }
      
      .culmas-list-main-content {
        flex: 1;
        min-width: 0;
      }
      
      .culmas-list-header {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      
      .culmas-list-badges {
        display: flex;
        gap: 8px;
      }
      
      .culmas-list-details {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      
      .culmas-list-action {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        min-width: 120px;
      }
      
      .culmas-list-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
      }
      
      .culmas-list-per-session {
        font-size: 12px;
        color: var(--muted-foreground);
      }
      
      /* Show More Button */
      .culmas-show-more {
        text-align: center;
        margin-top: 24px;
      }
      
      .culmas-show-more button {
        background: var(--secondary);
        color: var(--secondary-foreground);
        border: 1px solid var(--border);
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: var(--transition-smooth);
      }
      
      .culmas-show-more button:hover {
        background: var(--accent);
        border-color: var(--primary);
      }
      
      /* Utility Classes */
      .culmas-hidden {
        display: none !important;
      }
      
      .culmas-sold-out {
        opacity: 0.6;
        filter: grayscale(1);
      }
      
      /* Responsive Design */
      @media (max-width: 1024px) {
        .culmas-products.card-view {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
      }
      
      @media (max-width: 768px) {
        #${containerId} {
          padding: 16px;
        }
        
        .culmas-products.card-view {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .culmas-controls {
          flex-direction: column;
          align-items: stretch;
        }
        
        .culmas-filters {
          justify-content: center;
        }
        
        .culmas-products.list-view .culmas-product-card {
          flex-direction: column;
          padding: 16px;
        }
        
        .culmas-products.list-view .culmas-product-image {
          width: 100%;
          height: 120px;
          margin: 0 0 16px 0;
        }
        
        .culmas-products.list-view .culmas-product-content {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }
        
        .culmas-list-action {
          align-items: stretch;
          min-width: unset;
        }
        
        .culmas-list-price {
          align-items: center;
          text-align: center;
        }
      }
      
      @media (max-width: 480px) {
        .culmas-view-switcher {
          width: 100%;
          justify-content: center;
        }
        
        .culmas-view-btn {
          flex: 1;
          justify-content: center;
        }
      }
    </style>`;
  };

  const generateHTML = () => {
    return `<div id="${containerId}" class="culmas-widget">
  <div class="culmas-container">
    <div class="culmas-loading">
      <div>Loading products...</div>
    </div>
  </div>
</div>`;
  };

  const generateScript = () => {
    const domain = "globe-dance.dev.culmas.io"; // This should be configurable
    const templateIdsString = selectedTemplateIds.join(',');
    const venueIdsString = selectedVenueIds.join(',');
    
    return `<script>
(function() {
  const CONFIG = {
    templateIds: "${templateIdsString}",
    venueIds: "${venueIdsString}",
    containerId: "${containerId}",
    domain: "${domain}"
  };

  function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    const gclid = urlParams.get('gclid');
    return { fbclid, gclid };
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  function formatPrice(price) {
    return '$' + price.toFixed(0);
  }

  function createProductCard(product, viewMode = 'card') {
    const { fbclid, gclid } = getQueryParams();
    let bookingUrl = \`https://\${CONFIG.domain}/product/\${product.id}\`;
    
    if (fbclid || gclid) {
      const url = new URL(bookingUrl);
      if (fbclid) url.searchParams.append('fbclid', fbclid);
      if (gclid) url.searchParams.append('gclid', gclid);
      bookingUrl = url.toString();
    }

    const cardClasses = ['culmas-product-card'];
    if (!product.available) {
      cardClasses.push('culmas-sold-out');
    }

    if (viewMode === 'list') {
      return \`
        <div class="\${cardClasses.join(' ')}" data-product-id="\${product.id}">
          <div class="culmas-product-image">
            \${product.image ? \`<img src="\${product.image}" alt="\${product.title}" />\` : '🎭'}
          </div>
          <div class="culmas-product-content">
            <div class="culmas-list-main-content">
              <div class="culmas-list-header">
                <h3 class="culmas-product-title">\${product.title}</h3>
                <div class="culmas-list-badges">
                  \${!product.available ? '<span class="culmas-sold-out-badge">Sold Out</span>' : ''}
                  <span class="culmas-product-category">\${product.category}</span>
                </div>
              </div>
              <div class="culmas-product-description">
                <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>\${product.description}</span>
              </div>
              <div class="culmas-list-details">
                <div class="culmas-product-detail">
                  <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>\${formatDate(product.date)}</span>
                </div>
                \${product.startTime ? \`
                  <div class="culmas-product-detail">
                    <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>\${product.startTime} - \${product.endTime || ''}</span>
                  </div>
                \` : ''}
                \${product.responsible ? \`
                  <div class="culmas-product-detail">
                    <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>\${product.responsible}</span>
                  </div>
                \` : ''}
              </div>
            </div>
            <div class="culmas-list-action">
              <div class="culmas-list-price">
                <div class="culmas-product-price">
                  <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: inline; width: 20px; height: 20px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  \${formatPrice(product.price)}
                </div>
                <div class="culmas-list-per-session">per session</div>
              </div>
              \${product.available ? \`
                <button class="culmas-product-button" onclick="window.open('\${bookingUrl}', '_blank')">
                  Book Now
                </button>
              \` : (product.waitlistStatus === 'ACTIVE' ? \`
                <button class="culmas-product-button waitlist" onclick="window.open('\${bookingUrl}', '_blank')">
                  Join Waitlist
                </button>
              \` : '')}
            </div>
          </div>
        </div>
      \`;
    }

    return \`
      <div class="\${cardClasses.join(' ')}" data-product-id="\${product.id}">
        <div class="culmas-product-image">
          \${product.image ? \`<img src="\${product.image}" alt="\${product.title}" />\` : '🎭'}
          \${!product.available ? '<div class="culmas-sold-out-badge">Sold Out</div>' : ''}
        </div>
        <div class="culmas-product-content">
          <div class="culmas-product-header">
            <h3 class="culmas-product-title">\${product.title}</h3>
            <div class="culmas-product-description">
              <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>\${product.description}</span>
            </div>
          </div>
          
          <div class="culmas-product-details">
            <div class="culmas-product-detail">
              <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>\${formatDate(product.date)}</span>
            </div>
            
            \${product.startTime ? \`
              <div class="culmas-product-detail">
                <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>\${product.startTime} - \${product.endTime || ''}</span>
              </div>
            \` : ''}
            
            \${product.responsible ? \`
              <div class="culmas-product-detail">
                <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>\${product.responsible}</span>
              </div>
            \` : ''}

            \${product.instructor ? \`
              <div class="culmas-product-detail">
                <svg class="culmas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>\${product.instructor}</span>
              </div>
            \` : ''}
          </div>
          
          <div class="culmas-product-footer">
            <div class="culmas-price-category">
              <span class="culmas-product-price">\${formatPrice(product.price)}</span>
              <span class="culmas-product-category">\${product.category}</span>
            </div>
            
            \${product.available ? \`
              <button class="culmas-product-button" onclick="window.open('\${bookingUrl}', '_blank')">
                Book Now
              </button>
            \` : (product.waitlistStatus === 'ACTIVE' ? \`
              <button class="culmas-product-button waitlist" onclick="window.open('\${bookingUrl}', '_blank')">
                Join Waitlist
              </button>
            \` : '')}
          </div>
        </div>
      </div>
    \`;
  }

  function createControls(products) {
    const venues = [...new Set(products.map(p => p.venue).filter(Boolean))];
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    return \`
      <div class="culmas-controls">
        <div class="culmas-filters">
          <span class="culmas-filter-label">Filters:</span>
          <select class="culmas-filter-select" id="venue-filter">
            <option value="">All Venues</option>
            \${venues.map(venue => \`<option value="\${venue}">\${venue}</option>\`).join('')}
          </select>
          <select class="culmas-filter-select" id="category-filter">
            <option value="">All Categories</option>
            \${categories.map(cat => \`<option value="\${cat}">\${cat}</option>\`).join('')}
          </select>
        </div>
        <div class="culmas-view-switcher">
          <button class="culmas-view-btn active" data-view="card">Cards</button>
          <button class="culmas-view-btn" data-view="list">List</button>
        </div>
      </div>
    \`;
  }

  function renderProducts(products, viewMode = 'card', showCount = 6) {
    const containerClass = viewMode === 'card' ? 'culmas-products card-view' : 'culmas-products list-view';
    const visibleProducts = products.slice(0, showCount);
    const hiddenProducts = products.slice(showCount);
    
    let html = \`<div class="\${containerClass}">\`;
    
    visibleProducts.forEach(product => {
      html += createProductCard(product, viewMode);
    });
    
    hiddenProducts.forEach(product => {
      html += createProductCard(product, viewMode).replace('class="culmas-product-card', 'class="culmas-product-card culmas-hidden');
    });
    
    html += '</div>';
    
    if (products.length > showCount) {
      html += \`
        <div class="culmas-show-more">
          <button onclick="culmasShowMore()">
            Show More (\${products.length - showCount} remaining)
          </button>
          <button class="culmas-hidden" onclick="culmasShowLess()" id="culmas-show-less">
            Show Less
          </button>
        </div>
      \`;
    }
    
    return html;
  }

  async function loadProducts() {
    try {
      const query = \`query AllProducts($category: String, $onlyAvailableForSale: Boolean) {
        allProducts(category: $category, onlyAvailableForSale: $onlyAvailableForSale) {
          id
          title
          template { 
            id
            title 
          }
          responsiblesShown { firstName lastName profileImg }
          category
          descriptionImg
          end
          startTime
          endTime
          nextEventStart
          status
          waitlistStatus
          tickets {
            tickets { numberOfTicketLeft numberOfTicket price ticketType isRecurring }
            totalTickets
            totalTicketsLeft
          }
          venue { 
            id
            title 
            formatted_address 
            geoPoint 
          }
        }
      }\`;

      const response = await fetch('https://api.dev.culmas.io/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'domain': CONFIG.domain
        },
        body: JSON.stringify({
          query: query,
          variables: { onlyAvailableForSale: true }
        })
      });

      const result = await response.json();
      const rawProducts = result?.data?.allProducts || [];
      
      const products = rawProducts.map(p => {
        const startDate = p.nextEventStart ? new Date(p.nextEventStart) : new Date();
        const ticketLines = Array.isArray(p?.tickets?.tickets) ? p.tickets.tickets : [];
        const prices = ticketLines.map(t => Number(t?.price)).filter(n => !isNaN(n));
        const price = prices.length ? Math.min(...prices) : 0;
        const totalLeft = Number(p?.tickets?.totalTicketsLeft ?? 0);
        
        // Extract responsible person info
        const responsibles = Array.isArray(p.responsiblesShown) ? p.responsiblesShown : [];
        const responsible = responsibles.length > 0 
          ? \`\${responsibles[0].firstName || ''} \${responsibles[0].lastName || ''}\`.trim()
          : '';
        
        return {
          id: String(p?.id || Math.random().toString(36).slice(2)),
          title: p?.title || p?.venue?.title || 'Event',
          description: p?.venue?.formatted_address || p?.status || 'No description available',
          image: p?.descriptionImg || null,
          price: price,
          date: startDate.toISOString(),
          startTime: p?.startTime || null,
          endTime: p?.endTime || null,
          venue: p?.venue?.title,
          category: p?.category || 'Event',
          responsible: responsible,
          instructor: responsible, // Using same field for instructor for now
          available: totalLeft > 0,
          waitlistStatus: p?.waitlistStatus || null
        };
      });

      return products;
    } catch (error) {
      console.error('Failed to load products:', error);
      throw error;
    }
  }

  let allProducts = [];
  let filteredProducts = [];
  let currentView = 'card';
  let showCount = 6;

  function applyFilters() {
    const venueFilter = document.getElementById('venue-filter')?.value || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    
    filteredProducts = allProducts.filter(product => {
      const venueMatch = !venueFilter || product.venue === venueFilter;
      const categoryMatch = !categoryFilter || product.category === categoryFilter;
      return venueMatch && categoryMatch;
    });
    
    updateProductsDisplay();
  }

  function updateProductsDisplay() {
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;
    
    const controlsHtml = createControls(allProducts);
    const productsHtml = renderProducts(filteredProducts, currentView, showCount);
    
    container.innerHTML = controlsHtml + productsHtml;
    
    // Attach event listeners
    document.getElementById('venue-filter')?.addEventListener('change', applyFilters);
    document.getElementById('category-filter')?.addEventListener('change', applyFilters);
    
    document.querySelectorAll('.culmas-view-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.culmas-view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentView = this.getAttribute('data-view');
        updateProductsDisplay();
      });
    });
  }

  window.culmasShowMore = function() {
    const hiddenProducts = document.querySelectorAll('.culmas-hidden-product');
    hiddenProducts.forEach(product => product.classList.remove('hidden'));
    
    const showMoreBtn = document.querySelector('.culmas-show-more-btn:not(.hidden)');
    const showLessBtn = document.getElementById('culmas-show-less');
    
    if (showMoreBtn) showMoreBtn.classList.add('hidden');
    if (showLessBtn) showLessBtn.classList.remove('hidden');
  };

  window.culmasShowLess = function() {
    const hiddenProducts = document.querySelectorAll('.culmas-hidden-product');
    hiddenProducts.forEach(product => product.classList.add('hidden'));
    
    const showMoreBtn = document.querySelector('.culmas-show-more-btn:not(#culmas-show-less)');
    const showLessBtn = document.getElementById('culmas-show-less');
    
    if (showLessBtn) showLessBtn.classList.add('hidden');
    if (showMoreBtn) showMoreBtn.classList.remove('hidden');
  };

  // Initialize
  async function init() {
    try {
      const container = document.getElementById(CONFIG.containerId);
      if (!container) {
        console.error('Container element not found:', CONFIG.containerId);
        return;
      }
      
      allProducts = await loadProducts();
      filteredProducts = [...allProducts];
      updateProductsDisplay();
      
    } catch (error) {
      const container = document.getElementById(CONFIG.containerId);
      if (container) {
        container.innerHTML = '<div class="culmas-error">An error occurred while loading the products</div>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>`;
  };

  const generateFullEmbedCode = () => {
    return generateWidgetEmbedCode();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadEmbedCode = () => {
    const embedCode = generateWidgetEmbedCode();
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'culmas-widget-embed.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Widget embed code downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Embed Script</CardTitle>
          <CardDescription>
            Create a React widget that can be embedded on any website to display your products with all features (Card, List, Calendar, Week views) and exact Live Preview styling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Template Selection</Label>
              {loadingOptions ? (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading templates...</span>
                </div>
              ) : optionsError ? (
                <div className="text-sm text-destructive py-2">{optionsError}</div>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedTemplateIds.length === 0
                        ? "Select templates..."
                        : `${selectedTemplateIds.length} template(s) selected`}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-y-auto p-2">
                      <div className="flex items-center space-x-2 px-2 py-1.5 border-b">
                        <Checkbox
                          checked={selectedTemplateIds.length === templateOptions.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTemplateIds(templateOptions.map(t => t.id));
                            } else {
                              setSelectedTemplateIds([]);
                            }
                          }}
                        />
                        <label className="text-sm font-medium">Select All</label>
                      </div>
                      {templateOptions.map((template) => (
                        <div key={template.id} className="flex items-center space-x-2 px-2 py-1.5">
                          <Checkbox
                            checked={selectedTemplateIds.includes(template.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTemplateIds([...selectedTemplateIds, template.id]);
                              } else {
                                setSelectedTemplateIds(selectedTemplateIds.filter(id => id !== template.id));
                              }
                            }}
                          />
                          <label className="text-sm cursor-pointer flex-1">
                            {template.title} 
                            <span className="text-muted-foreground">({template.id})</span>
                          </label>
                        </div>
                      ))}
                      {templateOptions.length === 0 && (
                        <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                          No templates available
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div>
              <Label>Venue Selection</Label>
              {loadingOptions ? (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading venues...</span>
                </div>
              ) : optionsError ? (
                <div className="text-sm text-destructive py-2">{optionsError}</div>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedVenueIds.length === 0
                        ? "Select venues..."
                        : `${selectedVenueIds.length} venue(s) selected`}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-y-auto p-2">
                      <div className="flex items-center space-x-2 px-2 py-1.5 border-b">
                        <Checkbox
                          checked={selectedVenueIds.length === venueOptions.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVenueIds(venueOptions.map(v => v.id));
                            } else {
                              setSelectedVenueIds([]);
                            }
                          }}
                        />
                        <label className="text-sm font-medium">Select All</label>
                      </div>
                      {venueOptions.map((venue) => (
                        <div key={venue.id} className="flex items-center space-x-2 px-2 py-1.5">
                          <Checkbox
                            checked={selectedVenueIds.includes(venue.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedVenueIds([...selectedVenueIds, venue.id]);
                              } else {
                                setSelectedVenueIds(selectedVenueIds.filter(id => id !== venue.id));
                              }
                            }}
                          />
                          <label className="text-sm cursor-pointer flex-1">
                            {venue.title}
                            <span className="text-muted-foreground">({venue.id})</span>
                          </label>
                        </div>
                      ))}
                      {venueOptions.length === 0 && (
                        <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                          No venues available
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="containerId">Container Element ID</Label>
            <Input
              id="containerId"
              placeholder="culmas-products"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Development Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use local build URL for testing (requires building the widget first)
                </p>
              </div>
              <Switch
                checked={isDevelopmentMode}
                onCheckedChange={setIsDevelopmentMode}
              />
            </div>
            
            {isDevelopmentMode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Mode Active:</strong> 
                  <br />1. Build the widget: <code className="bg-muted px-1 rounded">npm run build:widget</code>
                  <br />2. Ensure the built file is accessible at: <code className="bg-muted px-1 rounded">{window.location.origin}/dist/widget/culmas-widget.umd.js</code>
                  <br />3. For production, toggle off Development Mode to use the CDN URL
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="customWidgetUrl">Custom Widget URL (Optional)</Label>
              <Input
                id="customWidgetUrl"
                placeholder="https://your-cdn.com/culmas-widget.umd.js"
                value={customWidgetUrl}
                onChange={(e) => setCustomWidgetUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Override the widget URL for custom CDN hosting
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => copyToClipboard(generateWidgetEmbedCode())}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Widget Embed Code
            </Button>
            <Button variant="outline" onClick={downloadEmbedCode}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>

          {showPreview && (
            <div>
              <Label>Generated Widget Embed Code:</Label>
              <Textarea
                value={generateWidgetEmbedCode()}
                readOnly
                className="h-32 font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};