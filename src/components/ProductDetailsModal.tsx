import { Product } from "./ProductInjector";
import { Calendar, Clock, User, Banknote, Tag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailsModal = ({ product, open, onOpenChange }: ProductDetailsModalProps) => {
  if (!product) return null;

  const handleBookEvent = () => {
    if (product) {
      const bookingUrl = `https://globe-dance.dev.culmas.io/class/${product.id}?from=component-api`;
      window.open(bookingUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Image */}
          {product.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">
                    {product.status === "ONGOING" 
                      ? "Next class" 
                      : product.status === "PUBLISHED" 
                        ? "Starts at" 
                        : "Date & Time"
                    }
                  </div>
                  <div className="text-muted-foreground">
                    {product.date.toLocaleDateString()} from {product.startTime} - {product.endTime}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-muted-foreground">
                    {(() => {
                      if (product.startTime && product.endTime) {
                        const [startHour, startMin] = product.startTime.split(':').map(Number);
                        const [endHour, endMin] = product.endTime.split(':').map(Number);
                        const startMinutes = startHour * 60 + startMin;
                        const endMinutes = endHour * 60 + endMin;
                        const duration = endMinutes - startMinutes;
                        return `${duration}min`;
                      }
                      return product.duration;
                    })()}
                  </div>
                </div>
              </div>

              {product.responsiblesShown && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={product.responsiblesShown.profileImg} 
                        alt="Responsible person"
                      />
                      <AvatarFallback>
                        {product.responsiblesShown.firstName?.[0]}{product.responsiblesShown.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Responsible</div>
                      <div className="text-muted-foreground">
                        {product.responsiblesShown.firstName} {product.responsiblesShown.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {product.instructor && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">Instructor</div>
                    <div className="text-muted-foreground">{product.instructor}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Banknote className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Price</div>
                  <div className="text-2xl font-bold text-primary">{product.price} Kr.</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Category</div>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Availability</div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    product.available 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  )}>
                    {product.available ? "Available" : "Sold Out"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {product.category.toLowerCase() === "class" 
                ? "Class location" 
                : product.category.toLowerCase() === "show" 
                  ? "Venue" 
                  : "Description"
              }
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Button */}
          {(product.available || product.waitlistStatus === "ACTIVE") && (
            <div className="flex justify-end pt-4 border-t">
              <button 
                onClick={handleBookEvent}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                {product.available ? "Book This Event" : "Join Waitlist"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};