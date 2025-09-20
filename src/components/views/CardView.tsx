import { Product } from "../ProductInjector";
import { Clock, Calendar, User, MapPin, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTenant } from "@/contexts/TenantContext";
interface CardViewProps {
  products: Product[];
}

export const CardView = ({ products }: CardViewProps) => {
  const { config } = useTenant();
  
  const handleCardClick = (product: Product) => {
    window.open(`${config.bookingUrl}/class/${product.id}?from=component-api`, '_blank');
  };

  const handleBookClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    window.open(`${config.bookingUrl}/class/${product.id}?from=component-api`, '_blank');
  };

  return (
    <div className="px-4 md:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-[1400px] mx-auto auto-rows-fr">
        {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleCardClick(product)}
          className={cn(
            "bg-card border border-border rounded-xl overflow-hidden shadow-md transition-all duration-300",
            "hover:shadow-xl hover:border-primary/20 hover:scale-105 transform",
            "group cursor-pointer flex flex-col h-full",
            !product.available && "opacity-60 grayscale"
          )}
        >
          {/* Product Image */}
          <div className="h-40 sm:h-48 bg-gradient-secondary relative overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300">
                  🎭
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            {!product.available && (
              <div className={cn(
                "absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold",
                product.waitlistStatus === "ACTIVE" 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-destructive text-destructive-foreground"
              )}>
                {product.waitlistStatus === "ACTIVE" ? "Waitlist" : "Sold Out"}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 flex flex-col flex-grow">
            {/* Header */}
            <div className="space-y-2 mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
              <div className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{product.description}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-sm text-muted-foreground flex-grow mb-3 sm:mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{product.date.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {product.startTime && product.endTime 
                    ? `${product.startTime} - ${product.endTime}`
                    : `${product.time} • ${product.duration}`
                  }
                </span>
              </div>
              
              {product.responsible && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{product.responsible}</span>
                </div>
              )}
              
              {product.instructor && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{product.instructor}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3 pt-3 border-t border-border mt-auto">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <Banknote className="w-4 h-4 text-primary" />
                   <span className="text-xl sm:text-2xl font-bold text-primary">
                     {product.price} Kr.
                   </span>
                 </div>
                 <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
                   {product.category}
                 </span>
               </div>
              
              {product.available ? (
                <button 
                  onClick={(e) => handleBookClick(e, product)}
                  className="w-full bg-primary text-primary-foreground px-4 py-2.5 sm:py-2 rounded-lg text-sm font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 min-h-[44px]"
                >
                  Book Now
                </button>
              ) : product.waitlistStatus === "ACTIVE" ? (
                <button 
                  onClick={(e) => handleBookClick(e, product)}
                  className="w-full bg-secondary text-secondary-foreground px-4 py-2.5 sm:py-2 rounded-lg text-sm font-semibold hover:bg-accent transition-all duration-300 min-h-[44px]"
                >
                  Join Waitlist
                </button>
              ) : null}
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};