import { useState, useEffect } from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { CardView } from "./views/CardView";
import { ListView } from "./views/ListView";
import { CalendarView } from "./views/CalendarView";
import { WeekView } from "./views/WeekView";
import { Loader2 } from "lucide-react";

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
  },
  {
    id: "4",
    title: "Jazz Dance Intensive",
    description: "High-energy jazz dance with performance focus",
    price: 28,
    date: new Date("2024-09-13T17:00:00"),
    time: "17:00",
    duration: "75min",
    category: "Dance",
    instructor: "Lisa Thompson",
    available: true,
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
  }
];

interface ProductInjectorProps {
  templateIds?: string[];
  venueIds?: string[];
  apiUrl?: string;
  className?: string;
}

export const ProductInjector = ({ 
  templateIds = [], 
  venueIds = [], 
  apiUrl = "",
  className = "" 
}: ProductInjectorProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, use mock data
        // In production, this would fetch from the actual API
        setProducts(mockProducts);
      } catch (err) {
        setError("An error occurred while loading the products");
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [templateIds, venueIds, apiUrl]);

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

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className={`space-y-6 ${className}`}>
      <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
      
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
        <div className="flex justify-center pt-4">
          {!showAll ? (
            <button
              onClick={handleShowMore}
              className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Show More ({products.length - 4} more)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-all duration-300"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};