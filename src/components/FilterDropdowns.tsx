import { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./ProductInjector";

interface FilterDropdownsProps {
  products: Product[];
  selectedVenue: string | null;
  selectedCategory: string | null;
  selectedTemplate: string | null;
  onVenueChange: (venue: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onTemplateChange: (template: string | null) => void;
}

export const FilterDropdowns = ({ 
  products, 
  selectedVenue, 
  selectedCategory,
  selectedTemplate,
  onVenueChange,
  onCategoryChange,
  onTemplateChange 
}: FilterDropdownsProps) => {
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

  // Extract unique venues, categories, and templates from products
  const venues = Array.from(new Set(products.map(p => p.venue).filter(Boolean)));
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const templates = Array.from(new Set(products.map(p => p.templateTitle).filter(Boolean)));

  const hasActiveFilters = selectedVenue || selectedCategory || selectedTemplate;

  const clearAllFilters = () => {
    onVenueChange(null);
    onCategoryChange(null);
    onTemplateChange(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap min-w-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Venue Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setVenueDropdownOpen(!venueDropdownOpen);
                setCategoryDropdownOpen(false);
                setTemplateDropdownOpen(false);
              }}
              className={cn(
                "flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-out",
                "hover:bg-accent/80 hover:text-accent-foreground",
                "px-3 py-2.5 min-h-[44px] bg-secondary/50 backdrop-blur-sm border border-border",
                "lg:px-4 lg:space-x-2",
                selectedVenue 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-sm font-semibold whitespace-nowrap">
                {selectedVenue || "Venue"}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                venueDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Venue Dropdown Menu */}
            {venueDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 py-2">
                <button
                  onClick={() => {
                    onVenueChange(null);
                    setVenueDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  All Venues
                </button>
                {venues.map((venue) => (
                  <button
                    key={venue}
                    onClick={() => {
                      onVenueChange(venue);
                      setVenueDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      selectedVenue === venue
                        ? "bg-primary text-primary-foreground"
                        : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {venue}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setVenueDropdownOpen(false);
                setTemplateDropdownOpen(false);
              }}
              className={cn(
                "flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-out",
                "hover:bg-accent/80 hover:text-accent-foreground",
                "px-3 py-2.5 min-h-[44px] bg-secondary/50 backdrop-blur-sm border border-border",
                "lg:px-4 lg:space-x-2",
                selectedCategory 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-sm font-semibold whitespace-nowrap">
                {selectedCategory || "Category"}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                categoryDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Category Dropdown Menu */}
            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 py-2">
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    setCategoryDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setCategoryDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setTemplateDropdownOpen(!templateDropdownOpen);
                setVenueDropdownOpen(false);
                setCategoryDropdownOpen(false);
              }}
              className={cn(
                "flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-out",
                "hover:bg-accent/80 hover:text-accent-foreground",
                "px-3 py-2.5 min-h-[44px] bg-secondary/50 backdrop-blur-sm border border-border",
                "lg:px-4 lg:space-x-2",
                selectedTemplate 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-sm font-semibold whitespace-nowrap">
                {selectedTemplate || "Class Type"}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                templateDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Template Dropdown Menu */}
            {templateDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 py-2">
                <button
                  onClick={() => {
                    onTemplateChange(null);
                    setTemplateDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  All Class Types
                </button>
                {templates.map((template) => (
                  <button
                    key={template}
                    onClick={() => {
                      onTemplateChange(template);
                      setTemplateDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      selectedTemplate === template
                        ? "bg-primary text-primary-foreground"
                        : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {template}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Close dropdowns when clicking outside */}
        {(venueDropdownOpen || categoryDropdownOpen || templateDropdownOpen) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setVenueDropdownOpen(false);
              setCategoryDropdownOpen(false);
              setTemplateDropdownOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};