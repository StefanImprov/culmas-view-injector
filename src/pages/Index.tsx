import { ProductInjector } from "@/components/ProductInjector";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Culmas Product Injector
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A beautiful, multi-view product display system that seamlessly integrates into any website. 
              Switch between card, list, calendar, and week views with smooth animations.
            </p>
          </div>

          {/* Theme Customizer */}
          <div className="max-w-7xl mx-auto mb-16">
            <ThemeCustomizer />
          </div>

          {/* Product Injector Demo */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live Preview</h2>
              <p className="text-muted-foreground">
                See how your customized product injector will look with your chosen theme
              </p>
            </div>
            <ProductInjector />
          </div>

          {/* Integration Example */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Easy Integration
            </h2>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                How it works:
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>1. Customize your theme using the controls above</p>
                <p>2. Download the generated embed code</p>
                <p>3. Add the code to your website where you want the product injector to appear</p>
                <p>4. Your products will automatically display with your custom styling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
