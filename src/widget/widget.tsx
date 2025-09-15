// Add immediate script loading detection
console.log('🚀 Culmas Widget script loaded successfully');
console.log('🌐 Environment check:', {
  userAgent: navigator.userAgent,
  isWebflow: document.querySelector('[data-wf-site]') !== null,
  domReady: document.readyState
});


// Enhanced CSS Loading Detection with Critical CSS Injection
function ensureCSSLoaded(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('🔍 Enhanced CSS loading check with injection');
    
    // Check if widget CSS is loaded by testing for specific widget styles
    const testElement = document.createElement('div');
    testElement.className = 'culmas-widget-container';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden'; 
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const hasWidgetCSS = computedStyle.boxSizing === 'border-box' && 
                        computedStyle.fontFamily.includes('Inter');
    
    document.body.removeChild(testElement);
    
    if (hasWidgetCSS) {
      console.log('✅ Widget CSS already loaded');
      resolve(true);
    } else {
      console.log('📝 Injecting critical widget CSS');
      injectCriticalCSS();
      resolve(true);
    }
  });
}

// Inject comprehensive critical CSS for widget styling
function injectCriticalCSS() {
  if (document.getElementById('culmas-widget-critical-css')) return;
  
  const style = document.createElement('style');
  style.id = 'culmas-widget-critical-css';
  style.innerHTML = `
    /* Critical Widget Container Styles */
    .culmas-widget-container {
      box-sizing: border-box !important;
      font-family: Inter, system-ui, -apple-system, sans-serif !important;
      line-height: 1.5 !important;
      color: hsl(222.2 84% 4.9%) !important;
      width: 100% !important;
      max-width: 100% !important;
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --primary: 262 83% 58%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96%;
      --secondary-foreground: 222.2 84% 4.9%;
      --muted: 210 40% 96%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96%;
      --accent-foreground: 222.2 84% 4.9%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 262 83% 58%;
      --radius: 0.75rem;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)));
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
      --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
      --shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      --shadow-glow: 0 0 30px hsl(var(--primary) / 0.3);
      --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .culmas-widget-container *,
    .culmas-widget-container *::before,
    .culmas-widget-container *::after {
      box-sizing: border-box !important;
    }
    
    /* Grid System */
    .culmas-widget-container .grid {
      display: grid !important;
    }
    .culmas-widget-container .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
    }
    .culmas-widget-container .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .culmas-widget-container .grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
    .culmas-widget-container .grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }
    .culmas-widget-container .grid-cols-7 {
      grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
    }
    
    /* Responsive Grid */
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
    }
    @media (min-width: 768px) {
      .culmas-widget-container .md\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .culmas-widget-container .md\\:gap-6 {
        gap: 1.5rem !important;
      }
    }
    @media (min-width: 1024px) {
      .culmas-widget-container .lg\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      .culmas-widget-container .lg\\:flex-row {
        flex-direction: row !important;
      }
      .culmas-widget-container .lg\\:items-center {
        align-items: center !important;
      }
      .culmas-widget-container .lg\\:px-4 {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .culmas-widget-container .lg\\:space-x-2 > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem !important;
      }
      .culmas-widget-container .lg\\:block {
        display: block !important;
      }
    }
    @media (min-width: 1280px) {
      .culmas-widget-container .xl\\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
    }
    
    /* Layout */
    .culmas-widget-container .flex {
      display: flex !important;
    }
    .culmas-widget-container .items-center {
      align-items: center !important;
    }
    .culmas-widget-container .items-stretch {
      align-items: stretch !important;
    }
    .culmas-widget-container .justify-between {
      justify-content: space-between !important;
    }
    .culmas-widget-container .justify-center {
      justify-content: center !important;
    }
    .culmas-widget-container .flex-col {
      flex-direction: column !important;
    }
    .culmas-widget-container .flex-shrink-0 {
      flex-shrink: 0 !important;
    }
    .culmas-widget-container .w-full {
      width: 100% !important;
    }
    .culmas-widget-container .w-4 {
      width: 1rem !important;
    }
    .culmas-widget-container .h-4 {
      height: 1rem !important;
    }
    .culmas-widget-container .h-40 {
      height: 10rem !important;
    }
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:h-48 {
        height: 12rem !important;
      }
    }
    .culmas-widget-container .min-h-\\[400px\\] {
      min-height: 400px !important;
    }
    .culmas-widget-container .min-h-\\[44px\\] {
      min-height: 44px !important;
    }
    .culmas-widget-container .min-h-\\[80px\\] {
      min-height: 80px !important;
    }
    .culmas-widget-container .min-h-\\[120px\\] {
      min-height: 120px !important;
    }
    .culmas-widget-container .min-w-\\[44px\\] {
      min-width: 44px !important;
    }
    .culmas-widget-container .min-w-\\[120px\\] {
      min-width: 120px !important;
    }
    
    /* Spacing */
    .culmas-widget-container .space-y-6 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1.5rem !important;
    }
    .culmas-widget-container .space-y-4 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1rem !important;
    }
    .culmas-widget-container .space-y-3 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.75rem !important;
    }
    .culmas-widget-container .space-y-2 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.5rem !important;
    }
    .culmas-widget-container .space-y-1 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.25rem !important;
    }
    .culmas-widget-container .space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.125rem !important;
    }
    .culmas-widget-container .space-x-2 > :not([hidden]) ~ :not([hidden]) {
      margin-left: 0.5rem !important;
    }
    .culmas-widget-container .space-x-1 > :not([hidden]) ~ :not([hidden]) {
      margin-left: 0.25rem !important;
    }
    .culmas-widget-container .space-x-3 > :not([hidden]) ~ :not([hidden]) {
      margin-left: 0.75rem !important;
    }
    .culmas-widget-container .gap-2 {
      gap: 0.5rem !important;
    }
    .culmas-widget-container .gap-4 {
      gap: 1rem !important;
    }
    .culmas-widget-container .gap-6 {
      gap: 1.5rem !important;
    }
    .culmas-widget-container .p-1 {
      padding: 0.25rem !important;
    }
    .culmas-widget-container .p-1\\.5 {
      padding: 0.375rem !important;
    }
    .culmas-widget-container .p-4 {
      padding: 1rem !important;
    }
    .culmas-widget-container .p-6 {
      padding: 1.5rem !important;
    }
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:p-5 {
        padding: 1.25rem !important;
      }
      .culmas-widget-container .sm\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem !important;
      }
    }
    .culmas-widget-container .px-2 {
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
    }
    .culmas-widget-container .px-3 {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }
    .culmas-widget-container .px-4 {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
    .culmas-widget-container .py-1 {
      padding-top: 0.25rem !important;
      padding-bottom: 0.25rem !important;
    }
    .culmas-widget-container .py-2 {
      padding-top: 0.5rem !important;
      padding-bottom: 0.5rem !important;
    }
    .culmas-widget-container .py-2\\.5 {
      padding-top: 0.625rem !important;
      padding-bottom: 0.625rem !important;
    }
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:py-2 {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
      }
    }
    .culmas-widget-container .py-12 {
      padding-top: 3rem !important;
      padding-bottom: 3rem !important;
    }
    .culmas-widget-container .pt-3 {
      padding-top: 0.75rem !important;
    }
    .culmas-widget-container .mb-4 {
      margin-bottom: 1rem !important;
    }
    .culmas-widget-container .mb-6 {
      margin-bottom: 1.5rem !important;
    }
    .culmas-widget-container .mt-8 {
      margin-top: 2rem !important;
    }
    .culmas-widget-container .ml-3 {
      margin-left: 0.75rem !important;
    }
    
    /* Borders and Radius */
    .culmas-widget-container .rounded-lg {
      border-radius: calc(var(--radius) - 2px) !important;
    }
    .culmas-widget-container .rounded-xl {
      border-radius: calc(var(--radius) + 2px) !important;
    }
    .culmas-widget-container .rounded-full {
      border-radius: 9999px !important;
    }
    .culmas-widget-container .border {
      border-width: 1px !important;
      border-style: solid !important;
      border-color: hsl(var(--border)) !important;
    }
    .culmas-widget-container .border-t {
      border-top-width: 1px !important;
      border-style: solid !important;
      border-color: hsl(var(--border)) !important;
    }
    .culmas-widget-container .border-b {
      border-bottom-width: 1px !important;
      border-style: solid !important;
      border-color: hsl(var(--border)) !important;
    }
    .culmas-widget-container .border-r {
      border-right-width: 1px !important;
      border-style: solid !important;
      border-color: hsl(var(--border)) !important;
    }
    .culmas-widget-container .last\\:border-r-0:last-child {
      border-right-width: 0 !important;
    }
    .culmas-widget-container .overflow-hidden {
      overflow: hidden !important;
    }
    
    /* Backgrounds and Colors */
    .culmas-widget-container .bg-card {
      background-color: hsl(var(--card)) !important;
    }
    .culmas-widget-container .bg-primary {
      background-color: hsl(var(--primary)) !important;
    }
    .culmas-widget-container .bg-secondary {
      background-color: hsl(var(--secondary)) !important;
    }
    .culmas-widget-container .bg-secondary\\/50 {
      background-color: hsl(var(--secondary) / 0.5) !important;
    }
    .culmas-widget-container .bg-accent\\/50 {
      background-color: hsl(var(--accent) / 0.5) !important;
    }
    .culmas-widget-container .bg-gradient-primary {
      background: var(--gradient-primary) !important;
    }
    .culmas-widget-container .bg-gradient-secondary {
      background: var(--gradient-secondary, hsl(var(--secondary))) !important;
    }
    .culmas-widget-container .text-foreground {
      color: hsl(var(--foreground)) !important;
    }
    .culmas-widget-container .text-card-foreground {
      color: hsl(var(--card-foreground)) !important;
    }
    .culmas-widget-container .text-primary {
      color: hsl(var(--primary)) !important;
    }
    .culmas-widget-container .text-primary-foreground {
      color: hsl(var(--primary-foreground)) !important;
    }
    .culmas-widget-container .text-secondary-foreground {
      color: hsl(var(--secondary-foreground)) !important;
    }
    .culmas-widget-container .text-muted-foreground {
      color: hsl(var(--muted-foreground)) !important;
    }
    .culmas-widget-container .text-destructive {
      color: hsl(var(--destructive)) !important;
    }
    .culmas-widget-container .text-destructive-foreground {
      color: hsl(var(--destructive-foreground)) !important;
    }
    
    /* Shadows */
    .culmas-widget-container .shadow-sm {
      box-shadow: var(--shadow-sm) !important;
    }
    .culmas-widget-container .shadow-md {
      box-shadow: var(--shadow-md) !important;
    }
    .culmas-widget-container .shadow-lg {
      box-shadow: var(--shadow-lg) !important;
    }
    .culmas-widget-container .shadow-xl {
      box-shadow: var(--shadow-xl) !important;
    }
    .culmas-widget-container .shadow-glow {
      box-shadow: var(--shadow-glow) !important;
    }
    
    /* Typography */
    .culmas-widget-container .text-xs {
      font-size: 0.75rem !important;
      line-height: 1rem !important;
    }
    .culmas-widget-container .text-sm {
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
    }
    .culmas-widget-container .text-base {
      font-size: 1rem !important;
      line-height: 1.5rem !important;
    }
    .culmas-widget-container .text-lg {
      font-size: 1.125rem !important;
      line-height: 1.75rem !important;
    }
    .culmas-widget-container .text-xl {
      font-size: 1.25rem !important;
      line-height: 1.75rem !important;
    }
    .culmas-widget-container .text-2xl {
      font-size: 1.5rem !important;
      line-height: 2rem !important;
    }
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:text-lg {
        font-size: 1.125rem !important;
        line-height: 1.75rem !important;
      }
      .culmas-widget-container .sm\\:text-2xl {
        font-size: 1.5rem !important;
        line-height: 2rem !important;
      }
    }
    .culmas-widget-container .font-medium {
      font-weight: 500 !important;
    }
    .culmas-widget-container .font-semibold {
      font-weight: 600 !important;
    }
    .culmas-widget-container .font-bold {
      font-weight: 700 !important;
    }
    .culmas-widget-container .leading-relaxed {
      line-height: 1.625 !important;
    }
    .culmas-widget-container .whitespace-nowrap {
      white-space: nowrap !important;
    }
    .culmas-widget-container .truncate {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    
    /* Line Clamp */
    .culmas-widget-container .line-clamp-2 {
      display: -webkit-box !important;
      -webkit-box-orient: vertical !important;
      -webkit-line-clamp: 2 !important;
      overflow: hidden !important;
    }
    
    /* Transitions and Transforms */
    .culmas-widget-container .transition-all {
      transition-property: all !important;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
      transition-duration: 150ms !important;
    }
    .culmas-widget-container .transition-colors {
      transition-property: color, background-color, border-color !important;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
      transition-duration: 150ms !important;
    }
    .culmas-widget-container .transition-transform {
      transition-property: transform !important;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
      transition-duration: 150ms !important;
    }
    .culmas-widget-container .duration-300 {
      transition-duration: 300ms !important;
    }
    .culmas-widget-container .ease-out {
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
    }
    .culmas-widget-container .transform {
      transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)) !important;
    }
    .culmas-widget-container .scale-105 {
      --tw-scale-x: 1.05 !important;
      --tw-scale-y: 1.05 !important;
      transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
    }
    
    /* Interactive Elements and States */
    .culmas-widget-container .cursor-pointer {
      cursor: pointer !important;
    }
    .culmas-widget-container .backdrop-blur-sm {
      backdrop-filter: blur(4px) !important;
    }
    .culmas-widget-container .group:hover .group-hover\\:scale-105 {
      --tw-scale-x: 1.05 !important;
      --tw-scale-y: 1.05 !important;
      transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
    }
    .culmas-widget-container .group:hover .group-hover\\:scale-110 {
      --tw-scale-x: 1.1 !important;
      --tw-scale-y: 1.1 !important;
      transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
    }
    .culmas-widget-container .group:hover .group-hover\\:text-primary {
      color: hsl(var(--primary)) !important;
    }
    
    /* Hover States */
    .culmas-widget-container .hover\\:shadow-xl:hover {
      box-shadow: var(--shadow-xl) !important;
    }
    .culmas-widget-container .hover\\:shadow-glow:hover {
      box-shadow: var(--shadow-glow) !important;
    }
    .culmas-widget-container .hover\\:scale-105:hover {
      --tw-scale-x: 1.05 !important;
      --tw-scale-y: 1.05 !important;
      transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
    }
    .culmas-widget-container .hover\\:border-primary\\/20:hover {
      border-color: hsl(var(--primary) / 0.2) !important;
    }
    .culmas-widget-container .hover\\:bg-accent\\/80:hover {
      background-color: hsl(var(--accent) / 0.8) !important;
    }
    .culmas-widget-container .hover\\:bg-accent:hover {
      background-color: hsl(var(--accent)) !important;
    }
    .culmas-widget-container .hover\\:text-accent-foreground:hover {
      color: hsl(var(--accent-foreground)) !important;
    }
    .culmas-widget-container .hover\\:text-foreground:hover {
      color: hsl(var(--foreground)) !important;
    }
    
    /* Display */
    .culmas-widget-container .hidden {
      display: none !important;
    }
    .culmas-widget-container .block {
      display: block !important;
    }
    @media (min-width: 640px) {
      .culmas-widget-container .sm\\:hidden {
        display: none !important;
      }
      .culmas-widget-container .hidden.sm\\:block {
        display: block !important;
      }
    }
    
    /* Position */
    .culmas-widget-container .relative {
      position: relative !important;
    }
    .culmas-widget-container .absolute {
      position: absolute !important;
    }
    .culmas-widget-container .inset-0 {
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
    }
    .culmas-widget-container .top-3 {
      top: 0.75rem !important;
    }
    .culmas-widget-container .right-3 {
      right: 0.75rem !important;
    }
    
    /* Opacity and Effects */
    .culmas-widget-container .opacity-0 {
      opacity: 0 !important;
    }
    .culmas-widget-container .opacity-20 {
      opacity: 0.2 !important;
    }
    .culmas-widget-container .opacity-60 {
      opacity: 0.6 !important;
    }
    .culmas-widget-container .grayscale {
      filter: grayscale(100%) !important;
    }
    
    /* Object Fit */
    .culmas-widget-container .object-cover {
      object-fit: cover !important;
    }
    
    /* Text Center */
    .culmas-widget-container .text-center {
      text-align: center !important;
    }
  `;
  document.head.appendChild(style);
  console.log('✅ Comprehensive critical CSS injected successfully');
}


import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductInjector } from '../components/ProductInjector';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';
import { TooltipProvider } from '../components/ui/tooltip';
import './widget-styles.css';

// Widget configuration interface
interface WidgetConfig {
  container: string;
  apiUrl?: string;
  templateIds?: string[];
  venueIds?: string[];
  theme?: any;
}

// Global initialization state with race condition prevention
const initializationState = {
  initializedContainers: new Set<string>(),
  initializingContainers: new Set<string>(),
  isInitializing: false,
  timeouts: new Set<number>(),
  observer: null as MutationObserver | null,
  initCounter: 0
};

// Global widget class
class CulmasWidget {
  private queryClient: QueryClient;
  private mountedInstances: Map<string, any> = new Map();

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  // Apply theme to widget container with complete CSS variable coverage
  private applyWidgetTheme(container: HTMLElement, theme: any) {
    console.log('🎨 Applying comprehensive widget theme:', theme);
    
    if (!theme?.colors) {
      console.warn('No theme colors provided, applying default theme');
      // Apply default theme colors
      const defaultVars = {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--primary': '262 83% 58%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 96%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '262 83% 58%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--radius': '0.75rem'
      };
      
      Object.entries(defaultVars).forEach(([key, value]) => {
        container.style.setProperty(key, value);
      });
    } else {
      // Apply provided theme colors with proper CSS variable names
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        console.log(`Setting --${cssVarName}: ${value}`);
        container.style.setProperty(`--${cssVarName}`, value as string);
      });
    }
    
    // Apply design variables
    if (theme?.design) {
      console.log('🔧 Applying design settings:', theme.design);
      container.style.setProperty('--radius', theme.design.borderRadius || '0.75rem');
      
      // Apply shadow intensity with comprehensive coverage
      const shadowIntensity = theme.design.shadowIntensity || 'medium';
      switch (shadowIntensity) {
        case 'subtle':
          container.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
          container.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-xl', '0 20px 25px -5px rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-glow', '0 0 20px hsl(var(--primary) / 0.2)');
          break;
        case 'medium':
          container.style.setProperty('--shadow-sm', '0 1px 3px 0 rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)');
          container.style.setProperty('--shadow-lg', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)');
          container.style.setProperty('--shadow-xl', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
          container.style.setProperty('--shadow-glow', '0 0 30px hsl(var(--primary) / 0.3)');
          break;
        case 'strong':
          container.style.setProperty('--shadow-sm', '0 2px 4px 0 rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-md', '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)');
          container.style.setProperty('--shadow-lg', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
          container.style.setProperty('--shadow-xl', '0 35px 60px -12px rgb(0 0 0 / 0.3)');
          container.style.setProperty('--shadow-glow', '0 0 40px hsl(var(--primary) / 0.4)');
          break;
      }
      
      // Apply gradients with fallbacks
      if (theme.design.gradients && theme.colors.primary) {
        const primary = theme.colors.primary;
        const primaryGlow = theme.colors.primaryGlow || theme.colors.gradientPrimary || primary;
        const accent = theme.colors.accent || primary;
        
        const gradientValue = `linear-gradient(135deg, hsl(${primary}), hsl(${primaryGlow}))`;
        container.style.setProperty('--gradient-primary', gradientValue);
        container.style.setProperty('--gradient-hero', `linear-gradient(135deg, hsl(${primary}), hsl(${primaryGlow}), hsl(${accent}))`);
        container.style.setProperty('--gradient-secondary', `linear-gradient(180deg, hsl(var(--secondary)), hsl(var(--muted)))`);
      } else if (theme.colors.primary) {
        container.style.setProperty('--gradient-primary', `hsl(${theme.colors.primary})`);
        container.style.setProperty('--gradient-hero', `hsl(${theme.colors.primary})`);
        container.style.setProperty('--gradient-secondary', 'hsl(var(--secondary))');
      }
      
      // Apply transitions
      if (theme.design.hoverEffects) {
        container.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
        container.style.setProperty('--transition-fast', 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)');
      } else {
        container.style.setProperty('--transition-smooth', 'all 0.15s ease');
        container.style.setProperty('--transition-fast', 'all 0.1s ease');
      }
    }

    // Debug: Show all applied CSS variables
    console.log('🎯 Final computed styles:', {
      primary: getComputedStyle(container).getPropertyValue('--primary'),
      secondary: getComputedStyle(container).getPropertyValue('--secondary'),
      background: getComputedStyle(container).getPropertyValue('--background'),
      accent: getComputedStyle(container).getPropertyValue('--accent'),
      radius: getComputedStyle(container).getPropertyValue('--radius')
    });
  }

  // Initialize widget in a container with race condition prevention
  async init(config: WidgetConfig) {
    const initId = ++initializationState.initCounter;
    console.log(`🚀 [Init ${initId}] Starting initialization for container: ${config.container}`);
    
    try {
      // SYNCHRONOUS LOCK: Check if container is already initialized or currently initializing
      if (initializationState.initializedContainers.has(config.container)) {
        console.log(`🚫 [Init ${initId}] Container already initialized, skipping:`, config.container);
        return;
      }
      
      if (initializationState.initializingContainers.has(config.container)) {
        console.log(`🚫 [Init ${initId}] Container already being initialized, skipping:`, config.container);
        return;
      }

      // Check if container already has a rendered widget
      const existingContainer = document.querySelector(config.container);
      if (existingContainer?.querySelector('.culmas-widget-container')) {
        console.log(`🚫 [Init ${initId}] Container already has rendered widget, marking as initialized:`, config.container);
        initializationState.initializedContainers.add(config.container);
        return;
      }

      // IMMEDIATELY add to initializing set and disconnect observer
      initializationState.initializingContainers.add(config.container);
      this.disconnectObserver(); // Prevent MutationObserver from triggering during init
      console.log(`🔒 [Init ${initId}] Container locked for initialization:`, config.container);

      console.log(`🔧 [Init ${initId}] Initializing Culmas Widget with config:`, config);
      
      // Ensure CSS is loaded before proceeding
      const cssLoaded = await ensureCSSLoaded();
      if (!cssLoaded) {
        console.log('📝 Using fallback CSS injection');
      }
      
      const container = document.querySelector(config.container);
      if (!container) {
        console.error(`CulmasWidget: Container ${config.container} not found`);
        console.log('Available containers:', document.querySelectorAll('[id], [class]'));
        return;
      }

      console.log('✅ Container found:', container);

      // Create properly configured widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'culmas-widget-container';
      
      // Add essential attributes for CSS scoping and Webflow compatibility
      widgetContainer.setAttribute('data-culmas-widget-instance', 'true');
      widgetContainer.setAttribute('data-widget-version', '1.0.0');
      
      // Apply essential container styles
      widgetContainer.style.position = 'relative';
      widgetContainer.style.zIndex = '1';
      widgetContainer.style.width = '100%';
      widgetContainer.style.maxWidth = '100%';
      widgetContainer.style.minHeight = '200px';
      
      // Apply critical inline styles as fallback
      this.applyInlineStyleFallbacks(widgetContainer);
      
      container.appendChild(widgetContainer);

      // Apply theme to widget container
      if (config.theme) {
        console.log('🎨 Theme provided, applying...');
        this.applyWidgetTheme(widgetContainer, config.theme);
      } else {
        console.warn('⚠️ No theme provided');
      }

      const root = createRoot(widgetContainer);
      
      const WidgetApp = () => (
        <QueryClientProvider client={this.queryClient}>
          <TooltipProvider>
            <ProductInjector
              templateIds={config.templateIds}
              venueIds={config.venueIds}
              apiUrl={config.apiUrl}
              className="culmas-widget"
              theme={config.theme}
            />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      );

      root.render(<WidgetApp />);
      this.mountedInstances.set(config.container, root);
      
      // Mark container as initialized and clear locks
      initializationState.initializedContainers.add(config.container);
      initializationState.initializingContainers.delete(config.container);
      this.clearAllTimeouts();
      
      console.log(`✅ [Init ${initId}] Widget initialized successfully for container:`, config.container);
    } catch (error) {
      // CRITICAL: Always release the lock on error
      initializationState.initializingContainers.delete(config.container);
      console.error(`❌ [Init ${initId}] Failed to initialize Culmas Widget:`, error);
      console.error(`❌ [Init ${initId}] Error details:`, {
        message: error.message,
        stack: error.stack,
        config
      });
    }
  }

  // Apply critical inline styles as absolute fallback
  private applyInlineStyleFallbacks(container: HTMLElement) {
    const fallbackStyles = {
      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      'line-height': '1.5',
      'color': 'rgb(14, 17, 47)',
      'background-color': 'rgb(255, 255, 255)',
      'box-sizing': 'border-box'
    };
    
    Object.entries(fallbackStyles).forEach(([property, value]) => {
      container.style.setProperty(property, value, 'important');
    });
    
    console.log('🔧 Applied inline style fallbacks');
  }

  // Clear all pending timeouts
  private clearAllTimeouts() {
    initializationState.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    initializationState.timeouts.clear();
  }

  // Disconnect MutationObserver
  private disconnectObserver() {
    if (initializationState.observer) {
      initializationState.observer.disconnect();
      initializationState.observer = null;
    }
  }

  // Destroy widget instance
  destroy(container: string) {
    const root = this.mountedInstances.get(container);
    if (root) {
      root.unmount();
      this.mountedInstances.delete(container);
      initializationState.initializedContainers.delete(container);
    }
  }
}

// Enhanced auto-initialization with race condition prevention
function autoInit() {
  const autoInitId = ++initializationState.initCounter;
  console.log(`🔍 [AutoInit ${autoInitId}] Starting auto-initialization check...`);
  
  try {
    // Prevent concurrent global initialization
    if (initializationState.isInitializing) {
      console.log(`🚫 [AutoInit ${autoInitId}] Global initialization already in progress, skipping`);
      return;
    }
    
    initializationState.isInitializing = true;

    // Enhanced environment detection
    const isWebflow = !!document.querySelector('[data-wf-site]') || 
                     !!document.querySelector('.w-webflow-badge') ||
                     !!(window as any).Webflow;
    
    const isWebflowDesigner = !!(window as any).Webflow && (window.location.hostname.includes('webflow.io'));
    
    console.log(`🔍 [AutoInit ${autoInitId}] Enhanced auto-initialization...`, {
      isWebflow,
      isWebflowDesigner,
      userAgent: navigator.userAgent.substring(0, 100),
      domReady: document.readyState,
      hasWebflowCSS: !!document.querySelector('link[href*="webflow"]'),
      webflowVersion: (window as any).Webflow?.version,
      initializedContainers: Array.from(initializationState.initializedContainers),
      initializingContainers: Array.from(initializationState.initializingContainers)
    });
    
    // Don't initialize in Webflow Designer
    if (isWebflowDesigner) {
      console.log('🚫 Webflow Designer detected - skipping initialization');
      initializationState.isInitializing = false;
      return;
    }
    
    const scripts = document.querySelectorAll('script[data-culmas-widget]');
    console.log('📜 Found scripts with data-culmas-widget:', scripts.length);
    
    if (scripts.length === 0) {
      console.warn('⚠️ No scripts found with data-culmas-widget attribute');
      if (isWebflow) {
        console.log('🌊 Webflow environment - scripts might be loaded differently');
        // Try alternative detection methods for Webflow
        const allScripts = Array.from(document.querySelectorAll('script'));
        const culmasScripts = allScripts.filter(script => 
          script.src?.includes('culmas') || 
          script.textContent?.includes('culmas') ||
          script.textContent?.includes('data-culmas-widget')
        );
        console.log('🔍 Alternative Culmas script detection:', culmasScripts.length);
      }
    }
    
    scripts.forEach((script, index) => {
      try {
        console.log(`🔧 Processing script ${index + 1}:`, script);
        
        const container = script.getAttribute('data-container');
        const apiUrl = script.getAttribute('data-api-url');
        const templateIds = script.getAttribute('data-template-ids')?.split(',');
        const venueIds = script.getAttribute('data-venue-ids')?.split(',');
        const themeData = script.getAttribute('data-theme');
        
        console.log('📋 Script attributes:', {
          container,
          apiUrl,
          templateIds,
          venueIds,
          themeData
        });
        
        let theme;
        if (themeData) {
          try {
            theme = JSON.parse(themeData);
            console.log('🎨 Parsed theme:', theme);
          } catch (e) {
            console.error('❌ Invalid theme data:', e);
          }
        }

        if (container) {
          // Skip if container already initialized or currently initializing
          if (initializationState.initializedContainers.has(container)) {
            console.log(`🚫 [AutoInit ${autoInitId}] Container already initialized, skipping:`, container);
            return;
          }
          
          if (initializationState.initializingContainers.has(container)) {
            console.log(`🚫 [AutoInit ${autoInitId}] Container already being initialized, skipping:`, container);
            return;
          }
          
          console.log(`🚀 [AutoInit ${autoInitId}] Initializing widget for container: ${container}`);
          const widget = new CulmasWidget();
          widget.init({
            container,
            apiUrl: apiUrl || undefined,
            templateIds,
            venueIds,
            theme
          });
        } else {
          console.error(`❌ [AutoInit ${autoInitId}] No container specified in script attributes`);
        }
      } catch (error) {
        console.error(`❌ Error processing script ${index + 1}:`, error);
      }
    });
  } catch (error) {
    console.error(`❌ [AutoInit ${autoInitId}] Critical error in autoInit:`, error);
  } finally {
    initializationState.isInitializing = false;
    console.log(`🏁 [AutoInit ${autoInitId}] Auto-initialization completed`);
  }
}

// Manual initialization method for Webflow environments
function manualInit(config: WidgetConfig) {
  console.log('🔧 Manual initialization called with config:', config);
  try {
    const widget = new CulmasWidget();
    widget.init(config);
    return widget;
  } catch (error) {
    console.error('❌ Manual initialization failed:', error);
    return null;
  }
}

// Enhanced debug mode for troubleshooting
function enableDebugMode() {
  console.log('🔍 Debug mode enabled');
  
  // Log environment details
  console.log('Environment:', {
    userAgent: navigator.userAgent,
    isWebflow: !!document.querySelector('[data-wf-site]'),
    domReady: document.readyState,
    stylesheets: Array.from(document.styleSheets).map(s => s.href),
    scripts: Array.from(document.scripts).map(s => s.src)
  });
  
  // Monitor CSS loading
  const observer = new MutationObserver(() => {
    const widgetContainers = document.querySelectorAll('.culmas-widget-container');
    widgetContainers.forEach(container => {
      const styles = getComputedStyle(container);
      console.log('Widget container styles:', {
        backgroundColor: styles.backgroundColor,
        fontFamily: styles.fontFamily,
        color: styles.color
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Enhanced initialization with comprehensive Webflow support
console.log('📄 Document ready state:', document.readyState);

function safeInit() {
  const isWebflow = !!document.querySelector('[data-wf-site]') || !!(window as any).Webflow;
  console.log('🔄 Running safe initialization...', { isWebflow });
  
  autoInit();
  
  // Only add fallbacks if no widgets initialized or being initialized
  if (initializationState.initializedContainers.size === 0 && initializationState.initializingContainers.size === 0) {
    // Reduced and simplified fallback timing
    const fallbackDelay = isWebflow ? 2000 : 1000;
    
    const timeoutId = setTimeout(() => {
      // Only initialize if no widgets exist yet and none are being initialized
      if (initializationState.initializedContainers.size === 0 && initializationState.initializingContainers.size === 0) {
        console.log(`🔄 Fallback initialization attempt after ${fallbackDelay}ms`);
        autoInit();
      } else {
        console.log('🚫 Fallback cancelled - widgets already exist or initializing');
      }
      initializationState.timeouts.delete(timeoutId);
    }, fallbackDelay) as unknown as number;
    
    initializationState.timeouts.add(timeoutId);
    
    // Simplified MutationObserver - only observe if NO widgets exist at all
    const hasAnyWidgets = initializationState.initializedContainers.size > 0 || 
                         initializationState.initializingContainers.size > 0 ||
                         document.querySelectorAll('.culmas-widget-container').length > 0;
    
    if (!hasAnyWidgets && !initializationState.observer) {
      console.log('🔍 Setting up MutationObserver for new widget detection');
      initializationState.observer = new MutationObserver(() => {
        // Only trigger if new widget scripts are added and no widgets exist yet
        const widgets = document.querySelectorAll('script[data-culmas-widget]');
        const currentWidgets = initializationState.initializedContainers.size + 
                             initializationState.initializingContainers.size +
                             document.querySelectorAll('.culmas-widget-container').length;
        
        if (widgets.length > 0 && currentWidgets === 0) {
          console.log('🔄 New widget scripts detected in DOM, triggering initialization...');
          autoInit();
        }
      });
      
      initializationState.observer.observe(document, {
        childList: true,
        subtree: true
      });
      
      // Auto-disconnect observer after 15 seconds if no widgets initialized
      const observerTimeoutId = setTimeout(() => {
        if (initializationState.observer && initializationState.initializedContainers.size === 0) {
          console.log('🚫 MutationObserver auto-disconnect after 15s');
          initializationState.observer.disconnect();
          initializationState.observer = null;
        }
        initializationState.timeouts.delete(observerTimeoutId);
      }, 15000) as unknown as number;
      initializationState.timeouts.add(observerTimeoutId);
    }
  }
}

if (document.readyState === 'loading') {
  console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  console.log('✅ Document already ready, initializing immediately...');
  safeInit();
}

// Additional Webflow-specific initialization
if ((window as any).Webflow) {
  console.log('🌊 Webflow detected, adding Webflow-specific initialization...');
  (window as any).Webflow.push(() => {
    // Only initialize if no widgets exist yet
    if (initializationState.initializedContainers.size === 0) {
      console.log('🌊 Webflow ready callback triggered');
      autoInit();
    }
  });
}

// Export for manual initialization and debugging
(window as any).CulmasWidget = CulmasWidget;
(window as any).initCulmasWidget = manualInit;
(window as any).debugCulmasWidget = enableDebugMode;

export default CulmasWidget;