import { Product } from "../ProductInjector";
import { ChevronLeft, ChevronRight, Clock, User, DollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  products: Product[];
}

export const WeekView = ({ products }: WeekViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return startOfWeek;
  });

  const generateWeekDays = (startDate: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const weekDays = generateWeekDays(currentWeek);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getProductsForDay = (date: Date) => {
    return products.filter(product => 
      product.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(currentWeek);
    endOfWeek.setDate(currentWeek.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric'
    };
    
    return `${currentWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}, ${currentWeek.getFullYear()}`;
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Week Header */}
      <div className="bg-gradient-secondary px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            Week View
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg text-muted-foreground">
              {formatWeekRange()}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-4 bg-secondary/30"></div>
            {weekDays.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 text-center border-l border-border",
                    isToday && "bg-accent/20"
                  )}
                >
                  <div className="font-semibold text-card-foreground">
                    {dayNames[index]}
                  </div>
                  <div className={cn(
                    "text-sm",
                    isToday ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-border last:border-b-0">
              {/* Time Label */}
              <div className="p-3 bg-secondary/30 border-r border-border text-center text-sm font-medium text-muted-foreground">
                {timeSlot}
              </div>

              {/* Day Columns */}
              {weekDays.map((date, dayIndex) => {
                const dayProducts = getProductsForDay(date);
                const timeProducts = dayProducts.filter(product => 
                  product.time === timeSlot
                );

                return (
                  <div
                    key={dayIndex}
                    className="min-h-[80px] p-2 border-l border-border relative"
                  >
                    {timeProducts.map((product) => (
                      <div
                        key={product.id}
                        className={cn(
                          "p-2 rounded-lg text-xs cursor-pointer transition-all duration-300 mb-1 last:mb-0",
                          product.available
                            ? "bg-gradient-primary text-primary-foreground hover:shadow-md hover:scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="font-medium mb-1 truncate">
                          {product.title}
                        </div>
                        <div className="space-y-1 opacity-90">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{product.duration}</span>
                          </div>
                          {product.instructor && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span className="truncate">{product.instructor}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            <span>{product.price}</span>
                          </div>
                        </div>
                        {!product.available && (
                          <div className="text-center mt-1 text-xs font-semibold">
                            Sold Out
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Week Summary */}
      <div className="p-6 border-t border-border bg-secondary/20">
        <h3 className="font-semibold text-lg mb-4 text-card-foreground">
          This Week Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">
              {products.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Classes</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">
              {products.filter(p => p.available).length}
            </div>
            <div className="text-sm text-muted-foreground">Available Spots</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">
              ${Math.min(...products.map(p => p.price))} - ${Math.max(...products.map(p => p.price))}
            </div>
            <div className="text-sm text-muted-foreground">Price Range</div>
          </div>
        </div>
      </div>
    </div>
  );
};