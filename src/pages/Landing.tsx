import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductInjector } from "@/components/ProductInjector";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ScriptGenerator } from "@/components/ScriptGenerator";

const Landing = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              Culmas Product Injector
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A beautiful, multi-view product display system that seamlessly integrates
              into any website. Switch between card, list, calendar, and week views with
              smooth animations.
            </p>
          </div>

          <ThemeCustomizer />
          
          <div className="mt-12">
            <ScriptGenerator />
          </div>
          
          <div className="mt-12">
            <ProductInjector />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Landing;