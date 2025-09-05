import { Product } from "../ProductInjector";
import { Clock, Calendar, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardViewProps {
  products: Product[];
}

export const CardView = ({ products }: CardViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "bg-card border border-border rounded-xl overflow-hidden shadow-md transition-all duration-300",
            "hover:shadow-xl hover:border-primary/20 hover:scale-105 transform",
            "group cursor-pointer",
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
              <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-xs font-semibold">
                Sold Out
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{product.date.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{product.time} • {product.duration}</span>
              </div>
              
              {product.instructor && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{product.instructor}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  ${product.price}
                </span>
                <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              {product.available && (
                <button className="w-full bg-gradient-primary text-primary-foreground px-4 py-2.5 sm:py-2 rounded-lg text-sm font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 min-h-[44px]">
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};