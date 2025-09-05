import { useState, useEffect } from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { FilterDropdowns } from "./FilterDropdowns";
import { CardView } from "./views/CardView";
import { ListView } from "./views/ListView";
import { CalendarView } from "./views/CalendarView";
import { WeekView } from "./views/WeekView";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "card" | "list" | "calendar" | "week";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  date: Date;
  time: string;
  duration: string;
  category: string;
  instructor?: string;
  image?: string;
  available: boolean;
  venue?: string;
  responsible?: string;
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
  },
];

interface ProductInjectorProps {
  templateIds?: string[];
  venueIds?: string[];
  apiUrl?: string;
  className?: string;
}

// Define default values outside component to prevent infinite re-renders
const DEFAULT_TEMPLATE_IDS: string[] = [];
const DEFAULT_VENUE_IDS: string[] = [];
const DEFAULT_API_URL = "";

export const ProductInjector = ({ 
  templateIds = DEFAULT_TEMPLATE_IDS, 
  venueIds = DEFAULT_VENUE_IDS, 
  apiUrl = DEFAULT_API_URL,
  className = "" 
}: ProductInjectorProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [showAll, setShowAll] = useState(false);
  
  // Filter states
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call Culmas DEV GraphQL API with the provided query
        const graphqlEndpoint = "https://api.dev.culmas.io/";
        const sharedHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          // Tenant header
          domain: "globe-dance.dev.culmas.io",
        };

        const CULMAS_QUERY = `query allProducts($onlyAvailableForSale: Boolean) {
  allProducts(onlyAvailableForSale: $onlyAvailableForSale) {
    id
    title
    descriptionImg
    end
    endTime
    startTime
    startDate
    nextEventStart
    status
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
      title
      formatted_address
      geoPoint
    }
    responsibleShown {
      firstName
      lastName
    }
  }
}`;

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

            const startTimeStr = p?.startTime || (validStart ? startDate!.toTimeString().slice(0, 5) : "00:00");
            const endTimeStr = p?.endTime || (endDate ? endDate.toTimeString().slice(0, 5) : "");
            const timeStr = endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr;

            let duration = "60min";
            if (validStart && endDate && !isNaN(endDate.getTime())) {
              const mins = Math.max(0, Math.round((endDate.getTime() - startDate!.getTime()) / 60000));
              if (mins > 0) duration = `${mins}min`;
            }

            const responsible = p?.responsibleShown ? 
              `${p.responsibleShown.firstName || ''} ${p.responsibleShown.lastName || ''}`.trim() : 
              undefined;

            const ticketLines = Array.isArray(p?.tickets?.tickets) ? p.tickets.tickets : [];
            const prices = ticketLines
              .map((t: any) => Number(t?.price))
              .filter((n: number) => !isNaN(n));
            const price = prices.length ? Math.min(...prices) : 0;
            const totalLeft = Number(p?.tickets?.totalTicketsLeft ?? 0);
            const available = totalLeft > 0;

            const productTitle = (p?.title ?? "").trim();
            const venueTitle = (p?.venue?.title ?? "").trim();
            const formattedAddress = p?.venue?.formatted_address ?? "";

            // Prefer product title; fallback to venue title then ID
            const title = productTitle || venueTitle || `Event ${p?.id || 'Unknown'}`;
            const description = formattedAddress || (p?.status ?? "No description available");

            console.log(`Mapped product: ${title}`);

            return {
              id: String(p?.id ?? Math.random().toString(36).slice(2)),
              title,
              description,
              price,
              date: validStart ? (startDate as Date) : new Date(),
              time: timeStr,
              duration,
              category: p?.status ?? "Event",
              instructor: undefined,
              image: p?.descriptionImg,
              available,
              venue: venueTitle || undefined,
              responsible,
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

  const handleShowMore = () => setShowAll(true);
  const handleShowLess = () => setShowAll(false);

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
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="text-destructive text-lg font-medium mb-2">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary-glow transition-colors underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Apply filters
  const filteredProducts = products.filter(product => {
    const venueMatch = !selectedVenue || product.venue === selectedVenue;
    const templateMatch = !selectedTemplate || product.category === selectedTemplate;
    return venueMatch && templateMatch;
  });

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 4);

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Filters */}
      <div className="px-4 sm:px-0">
        <FilterDropdowns 
          products={products}
          selectedVenue={selectedVenue}
          selectedTemplate={selectedTemplate}
          onVenueChange={setSelectedVenue}
          onTemplateChange={setSelectedTemplate}
        />
      </div>

      {/* View Switcher */}
      <div className="px-4 sm:px-0">
        <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      
      <div className="transition-all duration-300 ease-in-out">
        {viewMode === "card" && (
          <CardView products={visibleProducts} />
        )}
        {viewMode === "list" && (
          <ListView products={visibleProducts} />
        )}
        {viewMode === "calendar" && (
          <CalendarView products={visibleProducts} />
        )}
        {viewMode === "week" && (
          <WeekView products={visibleProducts} />
        )}
      </div>

      {products.length > 4 && (
        <div className="flex justify-center pt-4 px-4 sm:px-0">
          {!showAll ? (
            <button
              onClick={handleShowMore}
              className="w-full sm:w-auto bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105 min-h-[44px]"
            >
              Show More ({filteredProducts.length - 4} more)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-all duration-300 min-h-[44px]"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};