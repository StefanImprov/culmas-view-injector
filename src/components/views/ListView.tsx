import { Product } from "../ProductInjector";
import { Clock, Calendar, User, DollarSign, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListViewProps {
  products: Product[];
}

export const ListView = ({ products }: ListViewProps) => {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm transition-all duration-300",
            "hover:shadow-lg hover:border-primary/20 hover:bg-accent/5",
            "group cursor-pointer",
            !product.available && "opacity-60"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            {/* Left content */}
            <div className="flex items-start sm:items-center space-x-4 sm:space-x-6 flex-1">
              {/* Icon/Image */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-secondary rounded-xl overflow-hidden group-hover:bg-gradient-primary transition-all duration-300 flex-shrink-0">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl group-hover:text-primary-foreground transition-all duration-300">
                    🎭
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <h3 className="font-bold text-lg sm:text-xl text-card-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!product.available && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-xs font-semibold">
                        Sold Out
                      </span>
                    )}
                    <span className="bg-accent/80 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="text-muted-foreground text-sm sm:text-base flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="line-clamp-2 sm:line-clamp-none">{product.description}</span>
                </div>

                {/* Details row */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{product.date.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>
                      {product.startTime && product.endTime 
                        ? `${product.startTime} - ${product.endTime}`
                        : `${product.time} • ${product.duration}`
                      }
                    </span>
                  </div>
                  
                  {product.responsible && (
                    <div className="flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{product.responsible}</span>
                    </div>
                  )}
                  
                  {product.instructor && (
                    <div className="flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{product.instructor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              {/* Price */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right">
                <div className="flex items-center space-x-1 text-primary">
                  <DollarSign className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">{product.price}</span>
                </div>
                <div className="text-xs text-muted-foreground">per session</div>
              </div>

              {/* Action */}
              {product.available ? (
                <button className="w-full sm:w-auto bg-gradient-primary text-primary-foreground px-4 sm:px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 min-h-[44px]">
                  Book Now
                </button>
              ) : product.waitlistStatus === "ACTIVE" ? (
                <button className="w-full sm:w-auto bg-secondary text-secondary-foreground px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-all duration-300 min-h-[44px]">
                  Join Waitlist
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};