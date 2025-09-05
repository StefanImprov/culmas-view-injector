import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Copy, Download, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Theme } from "@/types/theme";

interface EmbedScriptGeneratorProps {
  theme?: Theme;
}

export const EmbedScriptGenerator = ({ theme }: EmbedScriptGeneratorProps) => {
  const [templateIds, setTemplateIds] = useState("");
  const [venueIds, setVenueIds] = useState("");
  const [containerId, setContainerId] = useState("culmas-products");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const generateCSS = () => {
    const primaryHsl = theme?.colors.primary || "222.2 84% 4.9%";
    const primaryForegroundHsl = theme?.colors.primaryForeground || "210 40% 98%";
    const cardHsl = theme?.colors.card || "0 0% 100%";
    const borderHsl = theme?.colors.border || "214.3 31.8% 91.4%";
    
    return `
<style>
.culmas-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.culmas-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .culmas-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.culmas-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.culmas-filter-label {
  color: hsl(${theme?.colors.mutedForeground || "215.4 16.3% 46.9%"});
  font-size: 0.875rem;
  font-weight: 500;
}

.culmas-filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid hsl(${borderHsl});
  border-radius: 0.375rem;
  background: hsl(${cardHsl});
  font-size: 0.875rem;
  cursor: pointer;
}

.culmas-view-switcher {
  display: flex;
  gap: 0.25rem;
  background: hsl(${theme?.colors.muted || "210 40% 96%"});
  padding: 0.25rem;
  border-radius: 0.375rem;
}

.culmas-view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.culmas-view-btn.active {
  background: hsl(${cardHsl});
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.culmas-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.culmas-products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.culmas-product-card {
  border: 1px solid hsl(${borderHsl});
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: hsl(${cardHsl});
  transition: all 0.2s;
  cursor: pointer;
}

.culmas-product-card:hover {
  border-color: hsl(${primaryHsl});
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.culmas-product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: hsl(${theme?.colors.foreground || "222.2 84% 4.9%"});
}

.culmas-product-description {
  color: hsl(${theme?.colors.mutedForeground || "215.4 16.3% 46.9%"});
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.culmas-product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.culmas-product-price {
  font-weight: 600;
  color: hsl(${primaryHsl});
}

.culmas-product-time {
  color: hsl(${theme?.colors.mutedForeground || "215.4 16.3% 46.9%"});
}

.culmas-product-book-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: hsl(${primaryHsl});
  color: hsl(${primaryForegroundHsl});
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.culmas-product-book-btn:hover {
  background: hsl(${primaryHsl} / 0.9);
}

.culmas-product-book-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.culmas-show-more-btn {
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 1.5rem;
  border: 1px solid hsl(${borderHsl});
  background: hsl(${cardHsl});
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.culmas-show-more-btn:hover {
  background: hsl(${theme?.colors.accent || "210 40% 96%"});
}

.hidden {
  display: none !important;
}

.culmas-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: hsl(${theme?.colors.mutedForeground || "215.4 16.3% 46.9%"});
}

.culmas-error {
  text-align: center;
  padding: 3rem;
  color: hsl(0 84.2% 60.2%);
}
</style>`;
  };

  const generateHTML = () => {
    return `<div id="${containerId}">
  <div class="culmas-loading">
    <div>Loading products...</div>
  </div>
</div>`;
  };

  const generateScript = () => {
    const domain = "globe-dance.dev.culmas.io"; // This should be configurable
    
    return `<script>
(function() {
  const CONFIG = {
    templateIds: "${templateIds}",
    venueIds: "${venueIds}",
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

    return \`
      <div class="culmas-product-card" data-product-id="\${product.id}">
        <div class="culmas-product-title">\${product.title}</div>
        <div class="culmas-product-description">\${product.description}</div>
        <div class="culmas-product-details">
          <span class="culmas-product-price">\${formatPrice(product.price)}</span>
          <span class="culmas-product-time">\${formatDate(product.date)}</span>
        </div>
        <button class="culmas-product-book-btn" 
                onclick="window.open('\${bookingUrl}', '_blank')"
                \${!product.available ? 'disabled' : ''}>
          \${product.available ? 'Book Now' : 'Sold Out'}
        </button>
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
    const containerClass = viewMode === 'card' ? 'culmas-products-grid' : 'culmas-products-list';
    const visibleProducts = products.slice(0, showCount);
    const hiddenProducts = products.slice(showCount);
    
    let html = \`<div class="\${containerClass}">\`;
    
    visibleProducts.forEach(product => {
      html += createProductCard(product, viewMode);
    });
    
    hiddenProducts.forEach(product => {
      html += createProductCard(product, viewMode).replace('class="culmas-product-card"', 'class="culmas-product-card hidden culmas-hidden-product"');
    });
    
    html += '</div>';
    
    if (products.length > showCount) {
      html += \`
        <button class="culmas-show-more-btn" onclick="culmasShowMore()">
          Show More (\${products.length - showCount} remaining)
        </button>
        <button class="culmas-show-more-btn hidden" onclick="culmasShowLess()" id="culmas-show-less">
          Show Less
        </button>
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
          template { title }
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
          venue { title formatted_address geoPoint }
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
        
        return {
          id: String(p?.id || Math.random().toString(36).slice(2)),
          title: p?.title || p?.venue?.title || 'Event',
          description: p?.venue?.formatted_address || p?.status || 'No description available',
          price: price,
          date: startDate.toISOString(),
          venue: p?.venue?.title,
          category: p?.category || 'Event',
          available: totalLeft > 0
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
    return generateCSS() + '\n\n' + generateHTML() + '\n\n' + generateScript();
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
    const embedCode = generateFullEmbedCode();
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'culmas-embed.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Embed code downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Embed Script</CardTitle>
          <CardDescription>
            Create a script that can be embedded on any website to display your products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="templateIds">Template IDs (comma-separated)</Label>
              <Input
                id="templateIds"
                placeholder="DdBMJDXGaxogjGXphbtr,another-id"
                value={templateIds}
                onChange={(e) => setTemplateIds(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="venueIds">Venue IDs (comma-separated)</Label>
              <Input
                id="venueIds"
                placeholder="venue1,venue2"
                value={venueIds}
                onChange={(e) => setVenueIds(e.target.value)}
              />
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

          <div className="flex gap-2">
            <Button onClick={() => copyToClipboard(generateFullEmbedCode())}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Embed Code
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
              <Label>Generated Embed Code:</Label>
              <Textarea
                value={generateFullEmbedCode()}
                readOnly
                className="h-96 font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};