import { Product } from "../ProductInjector";
import { ChevronLeft, ChevronRight, Clock, User, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductDetailsModal } from "../ProductDetailsModal";
import { getEventsForDay, getEventsForMonth, formatEventTitle, ProcessedEvent } from "@/utils/eventUtils";

interface CalendarViewProps {
  products: Product[];
}

export const CalendarView = ({ products }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
  // Generate calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const daysInMonth = lastDayOfMonth.getDate();
  const daysFromPrevMonth = firstDayOfWeek;
  const daysFromNextMonth = 42 - daysInMonth - daysFromPrevMonth;

  const calendarDays = [
    // Previous month days
    ...Array.from({ length: daysFromPrevMonth }, (_, i) => {
      const date = new Date(year, month - 1, new Date(year, month - 1, 0).getDate() - daysFromPrevMonth + i + 1);
      return { date, isCurrentMonth: false };
    }),
    // Current month days
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return { date, isCurrentMonth: true };
    }),
    // Next month days
    ...Array.from({ length: daysFromNextMonth }, (_, i) => {
      const date = new Date(year, month + 1, i + 1);
      return { date, isCurrentMonth: false };
    }),
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const getEventsForCalendarDay = (date: Date) => {
    return getEventsForDay(products, date);
  };

  const monthEvents = getEventsForMonth(products, year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayNames.map(day => (
          <div key={day} className="p-2 sm:p-4 text-center font-semibold text-muted-foreground bg-secondary/30 text-xs sm:text-sm">
            <span className="sm:hidden">{day.slice(0, 1)}</span>
            <span className="hidden sm:block">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForCalendarDay(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-border last:border-r-0",
                isCurrentMonth ? "bg-card" : "bg-muted/30",
                isToday && "bg-accent/20"
              )}
            >
              <div className={cn(
                "text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex items-center justify-between",
                isCurrentMonth ? "text-card-foreground" : "text-muted-foreground",
                isToday && "text-primary font-bold"
              )}>
                <span>{date.getDate()}</span>
                {dayEvents.length > 3 && (
                  <span className="text-xs bg-accent text-accent-foreground px-1 rounded">
                    +{dayEvents.length - 3}
                  </span>
                )}
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                   <div
                    key={event.id}
                    onMouseEnter={() => setHoveredProductId(event.productId)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    onClick={() => {
                      // Find the original product for the modal
                      const originalProduct = products.find(p => p.id === event.productId);
                      if (originalProduct) {
                        setSelectedProduct(originalProduct);
                        setSelectedEvent(event);
                      }
                    }}
                    className={cn(
                      "p-1 sm:p-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 relative",
                      event.available 
                        ? "bg-primary text-white hover:shadow-sm" 
                        : "bg-muted text-muted-foreground",
                      hoveredProductId === event.productId && "ring-2 ring-primary/50 shadow-lg scale-105"
                    )}
                  >
                    {event.isRecurring && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full -mt-0.5 -mr-0.5"></div>
                    )}
                    <div className="font-medium truncate text-xs sm:text-xs">
                      {formatEventTitle(event)}
                    </div>
                    <div className="hidden sm:flex items-center space-x-1 opacity-90">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Events List for Selected Month */}
      {monthEvents.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-border bg-secondary/20">
          <h3 className="font-semibold text-base sm:text-lg mb-4 text-card-foreground flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>All Sessions This Month ({monthEvents.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {monthEvents.map((event) => (
              <div
                key={event.id}
                onMouseEnter={() => setHoveredProductId(event.productId)}
                onMouseLeave={() => setHoveredProductId(null)}
                onClick={() => {
                  const originalProduct = products.find(p => p.id === event.productId);
                  if (originalProduct) {
                    setSelectedProduct(originalProduct);
                    setSelectedEvent(event);
                  }
                }}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-all duration-200 cursor-pointer relative",
                  !event.available && "opacity-60",
                  hoveredProductId === event.productId && "ring-2 ring-primary/50 shadow-lg scale-[1.02] bg-primary/5"
                )}
              >
                {event.isRecurring && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-xs text-primary font-medium">Series</span>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className="font-medium text-card-foreground mb-1 text-sm sm:text-base truncate">
                      {formatEventTitle(event)}
                    </h4>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>{event.date.toLocaleDateString()}</span>
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      {event.instructor && (
                        <div className="flex items-center space-x-2">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{event.instructor}</span>
                        </div>
                      )}
                      <div className="text-xs text-accent-foreground">
                        Duration: {event.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="flex items-center space-x-1 text-primary font-semibold">
                      <DollarSign className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span className="text-sm sm:text-base">{event.price} Kr.</span>
                    </div>
                    {!event.available && (
                      <div className={cn(
                        "text-xs mt-1",
                        event.waitlistStatus === "ACTIVE" ? "text-secondary-foreground" : "text-destructive"
                      )}>
                        {event.waitlistStatus === "ACTIVE" ? "Waitlist" : "Sold Out"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      />
    </div>
  );
};