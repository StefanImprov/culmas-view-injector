import { Product } from "../ProductInjector";
import { Clock, Calendar, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardViewProps {
  products: Product[];
}

export const CardView = ({ products }: CardViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          {/* Image placeholder */}
          <div className="h-48 bg-gradient-secondary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="text-6xl text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300">
              🎭
            </div>
            {!product.available && (
              <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-xs font-semibold">
                Sold Out
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
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
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
                <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              {product.available && (
                <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105">
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