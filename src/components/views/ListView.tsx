import { Product } from "../ProductInjector";
import { Clock, Calendar, User, DollarSign } from "lucide-react";
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
            "bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-300",
            "hover:shadow-lg hover:border-primary/20 hover:bg-accent/5",
            "group cursor-pointer",
            !product.available && "opacity-60"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Left content */}
            <div className="flex items-center space-x-6 flex-1">
              {/* Icon/Image */}
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl overflow-hidden group-hover:bg-gradient-primary transition-all duration-300">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl group-hover:text-primary-foreground transition-all duration-300">
                    🎭
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-4">
                  <h3 className="font-bold text-xl text-card-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  {!product.available && (
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-xs font-semibold">
                      Sold Out
                    </span>
                  )}
                  <span className="bg-accent/80 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-muted-foreground max-w-2xl">
                  {product.description}
                </p>

                {/* Details row */}
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{product.date.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{product.time} • {product.duration}</span>
                  </div>
                  
                  {product.instructor && (
                    <div className="flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-primary" />
                      <span>{product.instructor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="flex items-center space-x-6">
              {/* Price */}
              <div className="text-right">
                <div className="flex items-center space-x-1 text-primary">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl font-bold">{product.price}</span>
                </div>
                <div className="text-xs text-muted-foreground">per session</div>
              </div>

              {/* Action */}
              {product.available && (
                <button className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105">
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