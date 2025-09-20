import { useState, useEffect } from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { FilterDropdowns } from "./FilterDropdowns";
import { CardView } from "./views/CardView";
import { ListView } from "./views/ListView";
import { CalendarView } from "./views/CalendarView";
import { WeekView } from "./views/WeekView";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ThemeProvider } from "./ThemeProvider";
import { Theme } from "@/types/theme";
import { Button } from "./ui/button";
import { useTenant } from "@/contexts/TenantContext";

export type ViewMode = "card" | "list" | "calendar" | "week";

export interface ProductEvent {
  date: number; // Unix timestamp
  start: number; // Unix timestamp  
  end: number; // Unix timestamp
  startTime: string; // Time string
  endTime: string; // Time string
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  date: Date;
  time: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  category: string;
  instructor?: string;
  image?: string;
  available: boolean;
  venue?: string;
  responsible?: string;
  status?: string;
  waitlistStatus?: string;
  templateTitle?: string;
  events?: ProductEvent[]; // Array of event occurrences
  totalTickets?: number;
  ticketsLeft?: number;
  responsiblesShown?: {
    profileImg?: string;
    firstName?: string;
    lastName?: string;
  };
}

// Mock data simulating API response
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Contemporary Dance Class",
    description: "Expressive contemporary dance for all levels",
    price: 25,
    date: new Date("2024-09-10T18:00:00"),
    time: "18:00",
    duration: "75min",
    category: "Dance",
    instructor: "Sarah Johnson",
    available: true,
    venue: "Studio A",
    totalTickets: 20,
    ticketsLeft: 5,
  },
  {
    id: "2", 
    title: "Ballet Fundamentals",
    description: "Classical ballet technique and positions",
    price: 30,
    date: new Date("2024-09-11T19:30:00"),
    time: "19:30",
    duration: "90min",
    category: "Dance",
    instructor: "Marie Claire",
    available: true,
    venue: "Main Hall",
    totalTickets: 15,
    ticketsLeft: 8,
  },
  {
    id: "3",
    title: "Hip Hop Choreography",
    description: "Urban dance styles and street choreography",
    price: 20,
    date: new Date("2024-09-12T20:00:00"),
    time: "20:00", 
    duration: "60min",
    category: "Dance",
    instructor: "Marcus Davis",
    available: false,
    venue: "Studio B",
    totalTickets: 12,
    ticketsLeft: 0,
    waitlistStatus: "ACTIVE",
  },
  {
    id: "4",
    title: "Jazz Dance Intensive",
    description: "High-energy jazz dance with performance focus",
    price: 28,
    date: new Date("2024-09-13T17:00:00"),
    time: "17:00",
    duration: "75min",
    category: "Workshop",
    instructor: "Lisa Thompson",
    available: true,
    venue: "Studio A",
    totalTickets: 25,
    ticketsLeft: 12,
  },
  {
    id: "5",
    title: "Modern Movement",
    description: "Fluid movement and creative expression",
    price: 22,
    date: new Date("2024-09-14T18:30:00"),
    time: "18:30",
    duration: "60min",
    category: "Dance",
    instructor: "Alex Rivera",
    available: true,
    venue: "Main Hall",
    totalTickets: 18,
    ticketsLeft: 3,
  },
  {
    id: "6",
    title: "Lyrical Dance Workshop",
    description: "Emotional storytelling through movement",
    price: 35,
    date: new Date("2024-09-15T16:00:00"),
    time: "16:00",
    duration: "120min",
    category: "Workshop",
    instructor: "Emma Wilson",
    available: true,
    venue: "Studio C",
    totalTickets: 30,
    ticketsLeft: 15,
  },
];

interface ProductInjectorProps {
  templateIds?: string[];
  venueIds?: string[];
  apiUrl?: string;
  className?: string;
  theme?: Theme;
}

// Define default values outside component to prevent infinite re-renders
const DEFAULT_TEMPLATE_IDS: string[] = [];
const DEFAULT_VENUE_IDS: string[] = [];
const DEFAULT_API_URL = "";

export const ProductInjector = ({ 
  templateIds = DEFAULT_TEMPLATE_IDS, 
  venueIds = DEFAULT_VENUE_IDS, 
  apiUrl = DEFAULT_API_URL,
  className = "",
  theme 
}: ProductInjectorProps) => {
  const { config } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [itemsToShow, setItemsToShow] = useState(6);
  
  // Filter states
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call Culmas GraphQL API with the provided query
        const graphqlEndpoint = config.apiUrl;
        const sharedHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          // Tenant header
          domain: config.domain,
        };

        const CULMAS_QUERY = `query AllProducts($category: String, $onlyAvailableForSale: Boolean) {
  allProducts(category: $category, onlyAvailableForSale: $onlyAvailableForSale) {
  
    id
    events {
          endTime
          end
          date
          startTime
          start
        }
    title
    template {
      id
      title
    }
    responsiblesShown {
      firstName
      lastName
      profileImg
    }
    category
    descriptionImg
    end
    startTime
    endTime
    nextEventStart
    status
    waitlistStatus
    tickets {
      tickets {
        numberOfTicketLeft
        numberOfTicket
        price
        ticketType
        isRecurring
      }
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
}`;

        // First try with onlyAvailableForSale=false to debug missing product
        console.log("🔍 DEBUG: Calling Culmas DEV API with onlyAvailableForSale=false to find product P7ZSijyPxxBc4XyQbRyq");
        const debugResp = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: sharedHeaders,
          body: JSON.stringify({
            query: CULMAS_QUERY,
            variables: { onlyAvailableForSale: false },
          }),
        });

        const debugText = await debugResp.text();
        let debugJson: any;
        try {
          debugJson = JSON.parse(debugText);
        } catch {
          debugJson = { raw: debugText };
        }
        
        const debugProducts = debugJson?.data?.allProducts || [];
        const targetProduct = debugProducts.find((p: any) => p.id === "P7ZSijyPxxBc4XyQbRyq");
        
        if (targetProduct) {
          console.log("🎯 FOUND target product P7ZSijyPxxBc4XyQbRyq:", targetProduct);
          console.log("📅 Target product events count:", targetProduct.events?.length || 0);
          console.log("📋 Target product events:", targetProduct.events);
          console.log("✅ Target product status:", targetProduct.status);
          console.log("🎫 Target product tickets:", targetProduct.tickets);
          console.log("💰 Target product totalTicketsLeft:", targetProduct.tickets?.totalTicketsLeft);
          
          // Debug raw timestamp values and test parsing approaches
          if (targetProduct.events && Array.isArray(targetProduct.events)) {
            console.log("🔍 RAW TIMESTAMP DEBUG FOR P7ZSijyPxxBc4XyQbRyq:");
            console.log("Sample event raw data:", targetProduct.events[0]);
            
            const firstEvent = targetProduct.events[0];
            if (firstEvent) {
              console.log("Raw event.start:", firstEvent.start);
              console.log("Raw event.end:", firstEvent.end);
              console.log("Raw event.date:", firstEvent.date);
              
              // Test both parsing approaches
              const withMultiply = new Date(firstEvent.start * 1000);
              const directParse = new Date(firstEvent.start);
              
              console.log("With * 1000:", withMultiply.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
              console.log("Direct parse:", directParse.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
            }
            
            console.log("📅 CORRECTED EVENT DATES FOR P7ZSijyPxxBc4XyQbRyq:");
            targetProduct.events.forEach((event: any, index: number) => {
              // Fix: Use direct parsing instead of multiplying by 1000
              const eventDate = new Date(event.start);
              const dateStr = eventDate.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              console.log(`  Event ${index + 1}: ${dateStr} at ${event.startTime}-${event.endTime}`);
            });
          }
          
          // Also show main product date
          const mainDate = new Date(targetProduct.nextEventStart);
          console.log(`🗓️ Main product next event: ${mainDate.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} at ${targetProduct.startTime}-${targetProduct.endTime}`);
        } else {
          console.log("❌ Product P7ZSijyPxxBc4XyQbRyq NOT FOUND in API response");
          console.log("📦 Available product IDs:", debugProducts.map((p: any) => p.id));
        }

        // Now call with onlyAvailableForSale=true for normal operation
        console.log("Calling Culmas DEV API allProducts with onlyAvailableForSale=true");
        const resp = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: sharedHeaders,
          body: JSON.stringify({
            query: CULMAS_QUERY,
            variables: { onlyAvailableForSale: true },
          }),
        });

        const text = await resp.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          json = { raw: text };
        }
        console.log("Culmas DEV API raw response (allProducts):", json);

        const arr = json?.data?.allProducts;
        if (Array.isArray(arr) && arr.length > 0) {
          console.log("Mapping API products to display format...");
          const mapped: Product[] = arr.map((p: any) => {
            const startStr: string | null = p?.nextEventStart ?? null;
            const endStr: string | null = p?.end ?? null;
            const startDate = startStr ? new Date(startStr) : null;
            const endDate = endStr ? new Date(endStr) : null;
            const validStart = !!(startDate && !isNaN(startDate.getTime()));

            const timeStr = validStart
              ? startDate!.toTimeString().slice(0, 5)
              : (p?.endTime ?? "00:00");

            let duration = "60min";
            if (validStart && endDate && !isNaN(endDate.getTime())) {
              const mins = Math.max(0, Math.round((endDate.getTime() - startDate!.getTime()) / 60000));
              if (mins > 0) duration = `${mins}min`;
            }

            const ticketLines = Array.isArray(p?.tickets?.tickets) ? p.tickets.tickets : [];
            const prices = ticketLines
              .map((t: any) => Number(t?.price))
              .filter((n: number) => !isNaN(n));
            const price = prices.length ? Math.min(...prices) : 0;
            const totalLeft = Number(p?.tickets?.totalTicketsLeft ?? 0);
            const totalTickets = Number(p?.tickets?.totalTickets ?? 0);
            const available = totalLeft > 0;

            const productTitle = (p?.title ?? "").trim();
            const venueTitle = (p?.venue?.title ?? "").trim();
            const formattedAddress = p?.venue?.formatted_address ?? "";

            // Prefer product title; fallback to venue title then ID
            const title = productTitle || venueTitle || `Event ${p?.id || 'Unknown'}`;
            const description = formattedAddress || (p?.status ?? "No description available");

            // Extract responsible person name
            const responsibleShown = Array.isArray(p?.responsiblesShown) && p.responsiblesShown.length > 0 
              ? p.responsiblesShown[0] 
              : null;
            const responsible = responsibleShown 
              ? `${responsibleShown.firstName || ''} ${responsibleShown.lastName || ''}`.trim()
              : undefined;

            console.log(`Mapped product: ${title}`);

            // Process events array
            const events: ProductEvent[] = Array.isArray(p?.events) 
              ? p.events.map((event: any) => ({
                  date: event.date || 0,
                  start: event.start || 0,
                  end: event.end || 0,
                  startTime: event.startTime || "00:00",
                  endTime: event.endTime || "00:00"
                }))
              : [];

            return {
              id: String(p?.id ?? Math.random().toString(36).slice(2)),
              title,
              description,
              price,
              date: validStart ? (startDate as Date) : new Date(),
              time: timeStr,
              startTime: p?.startTime || timeStr,
              endTime: p?.endTime,
              duration,
              category: p?.category ?? "Event",
              instructor: undefined,
              image: p?.descriptionImg,
              available,
              venue: venueTitle || undefined,
              responsible,
              status: p?.status,
              waitlistStatus: p?.waitlistStatus,
              templateTitle: p?.template?.title,
              events,
              totalTickets,
              ticketsLeft: totalLeft,
              responsiblesShown: responsibleShown,
            } as Product;
          });

          console.log(`Successfully mapped ${mapped.length} products from API`);
          setProducts(mapped);
        } else {
          console.warn("Culmas DEV API allProducts not valid; falling back to mock data", json);
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("An error occurred while loading the products");
        
        // Fallback to mock data for demo purposes
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [templateIds, venueIds]);

  // Global product click handler
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex items-center space-x-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ThemeProvider initialTheme={theme}>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading products: {error}</p>
          <p className="text-muted-foreground">Using mock data instead.</p>
        </div>
      </ThemeProvider>
    );
  }

  // Apply filters
  const filteredProducts = products.filter(product => {
    const venueMatch = !selectedVenue || product.venue === selectedVenue;
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const templateMatch = !selectedTemplate || product.templateTitle === selectedTemplate;
    return venueMatch && categoryMatch && templateMatch;
  });

  const displayedProducts = filteredProducts.slice(0, itemsToShow);

  // For calendar and week views, always show all products
  const getProductsForView = (viewMode: ViewMode) => {
    return (viewMode === "calendar" || viewMode === "week") ? filteredProducts : displayedProducts;
  };

  const content = (
    <div className={cn("w-full max-w-[1400px] mx-auto space-y-6", className)}>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      {!loading && (
        <>
          {/* Controls - aligned with card grid spacing */}
          <div className="mb-6 px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="flex-1 min-w-0">
                <FilterDropdowns
                  products={products}
                  selectedVenue={selectedVenue}
                  selectedCategory={selectedCategory}
                  selectedTemplate={selectedTemplate}
                  onVenueChange={setSelectedVenue}
                  onCategoryChange={setSelectedCategory}
                  onTemplateChange={setSelectedTemplate}
                />
              </div>
              
              <div className="flex-shrink-0">
                <ViewSwitcher 
                  viewMode={viewMode} 
                  onViewModeChange={setViewMode} 
                />
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="min-h-[400px]">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                {viewMode === "card" && <CardView products={getProductsForView(viewMode)} />}
                {viewMode === "list" && <ListView products={getProductsForView(viewMode)} />}
                {viewMode === "calendar" && <CalendarView products={getProductsForView(viewMode)} />}
                {viewMode === "week" && <WeekView products={getProductsForView(viewMode)} />}
                
                {/* Only show pagination buttons for card and list views */}
                {(viewMode === "card" || viewMode === "list") && (
                  <>
                    {filteredProducts.length > itemsToShow && (
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={() => setItemsToShow(itemsToShow + 6)}
                          variant="outline"
                          className="min-w-[120px]"
                        >
                          Show More ({filteredProducts.length - itemsToShow} remaining)
                        </Button>
                      </div>
                    )}
                    
                    {itemsToShow > 6 && filteredProducts.length <= itemsToShow && (
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={() => setItemsToShow(6)}
                          variant="outline"
                          className="min-w-[120px]"
                        >
                          Show Less
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
      
      <ProductDetailsModal 
        product={selectedProduct} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );

  return theme ? (
    <ThemeProvider initialTheme={theme}>
      {content}
    </ThemeProvider>
  ) : (
    content
  );
};