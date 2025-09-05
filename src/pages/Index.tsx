import { ProductInjector } from "@/components/ProductInjector";

const Index = () => {
  return (
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

        {/* Product Injector Demo */}
        <div className="max-w-7xl mx-auto">
          <ProductInjector />
        </div>

        {/* Integration Example */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Easy Integration
          </h2>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">
              Add this to your website:
            </h3>
            <div className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-foreground">
                {`<div id="culmas-products"></div>
<script>
  // Culmas product injector will load here
  // Supports multiple view modes and smooth transitions
</script>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
