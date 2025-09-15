(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.CulmasSimpleWidget) return;

  const CSS = `
    .culmas-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.5;
      color: #374151;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    .culmas-widget * { box-sizing: border-box; }
    
    .culmas-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      color: #6b7280;
    }
    
    .culmas-error {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      color: #ef4444;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    
    .culmas-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      padding: 1rem 0;
    }
    
    .culmas-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .culmas-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .culmas-card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }
    
    .culmas-card-content {
      padding: 1.25rem;
    }
    
    .culmas-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #111827;
    }
    
    .culmas-card-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    
    .culmas-card-price {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0.75rem 0;
    }
    
    .culmas-card-button {
      background: var(--primary-color, #8b5cf6);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      font-size: 0.875rem;
    }
    
    .culmas-card-button:hover {
      background: var(--primary-hover, #7c3aed);
      transform: translateY(-1px);
    }
    
    .culmas-show-more {
      display: flex;
      justify-content: center;
      margin: 2rem 0;
    }
    
    .culmas-show-more button {
      background: transparent;
      color: var(--primary-color, #8b5cf6);
      border: 2px solid var(--primary-color, #8b5cf6);
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .culmas-show-more button:hover {
      background: var(--primary-color, #8b5cf6);
      color: white;
    }
    
    @media (max-width: 640px) {
      .culmas-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .culmas-card-content {
        padding: 1rem;
      }
    }
  `;

  function injectCSS(css) {
    if (document.getElementById('culmas-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'culmas-widget-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function applyTheme(container, theme) {
    if (!theme || !theme.colors) return;
    
    const colors = theme.colors;
    const root = container;
    
    // Convert HSL colors to proper CSS values
    if (colors.primary) {
      root.style.setProperty('--primary-color', `hsl(${colors.primary})`);
      root.style.setProperty('--primary-hover', `hsl(${colors.primary.replace(/(\d+)%/, (match, p1) => (parseInt(p1) - 10) + '%')})`);
    }
  }

  async function fetchProducts(apiUrl, templateIds, venueIds) {
    try {
      const query = `
        query GetProducts($templateIds: [String!], $venueIds: [String!]) {
          products(templateIds: $templateIds, venueIds: $venueIds) {
            id
            title
            description
            price
            currency
            images
            available
            templateId
            venueId
          }
        }
      `;

      const headers = {
        'Content-Type': 'application/json',
        'domain': 'globe-dance.dev.culmas.io'
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables: {
            templateIds: templateIds || [],
            venueIds: venueIds || []
          }
        })
      });

      const data = await response.json();
      return data.data?.products || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  function createProductCard(product) {
    const imageUrl = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

    return `
      <div class="culmas-card">
        <img src="${imageUrl}" alt="${product.title}" class="culmas-card-image" loading="lazy">
        <div class="culmas-card-content">
          <h3 class="culmas-card-title">${product.title}</h3>
          ${product.description ? `<p class="culmas-card-description">${product.description}</p>` : ''}
          <div class="culmas-card-price">${formatPrice(product.price, product.currency)}</div>
          <button class="culmas-card-button" onclick="window.open('https://culmas.io/book/${product.id}', '_blank')">
            Book Now
          </button>
        </div>
      </div>
    `;
  }

  function renderProducts(container, products, showCount = 6) {
    const visibleProducts = products.slice(0, showCount);
    const hasMore = products.length > showCount;

    const html = `
      <div class="culmas-grid">
        ${visibleProducts.map(createProductCard).join('')}
      </div>
      ${hasMore ? `
        <div class="culmas-show-more">
          <button onclick="CulmasSimpleWidget.showMore('${container.id}')">
            Show More (${products.length - showCount} remaining)
          </button>
        </div>
      ` : ''}
    `;

    container.innerHTML = html;
  }

  function showError(container, message) {
    container.innerHTML = `<div class="culmas-error">Error: ${message}</div>`;
  }

  function showLoading(container) {
    container.innerHTML = '<div class="culmas-loading">Loading products...</div>';
  }

  async function initWidget(config) {
    const container = document.querySelector(config.container);
    if (!container) {
      console.error('Culmas Widget: Container not found:', config.container);
      return;
    }

    container.className = 'culmas-widget';
    
    // Apply theme
    if (config.theme) {
      applyTheme(container, config.theme);
    }

    showLoading(container);

    try {
      const products = await fetchProducts(config.apiUrl, config.templateIds, config.venueIds);
      
      if (products.length === 0) {
        showError(container, 'No products found');
        return;
      }

      renderProducts(container, products);
      
      // Store data for show more functionality
      container._culmasData = {
        products,
        showCount: 6
      };
      
    } catch (error) {
      showError(container, 'Failed to load products');
    }
  }

  function showMore(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !container._culmasData) return;

    const data = container._culmasData;
    data.showCount += 6;
    renderProducts(container, data.products, data.showCount);
  }

  function parseDataAttributes(script) {
    return {
      container: script.getAttribute('data-container') || '#culmas-widget',
      apiUrl: script.getAttribute('data-api-url') || 'https://api.dev.culmas.io/',
      templateIds: (script.getAttribute('data-template-ids') || '').split(',').filter(id => id.trim()),
      venueIds: (script.getAttribute('data-venue-ids') || '').split(',').filter(id => id.trim()),
      theme: script.getAttribute('data-theme') ? JSON.parse(script.getAttribute('data-theme')) : null
    };
  }

  function autoInit() {
    const scripts = document.querySelectorAll('script[data-culmas-widget="true"]');
    scripts.forEach(script => {
      const config = parseDataAttributes(script);
      initWidget(config);
    });
  }

  // Global API
  window.CulmasSimpleWidget = {
    init: initWidget,
    showMore: showMore
  };

  // Inject CSS
  injectCSS(CSS);

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();