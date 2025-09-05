import { Product } from "../ProductInjector";
import { ChevronLeft, ChevronRight, Clock, User, DollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  products: Product[];
}

export const CalendarView = ({ products }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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

  const getProductsForDay = (date: Date) => {
    return products.filter(product => 
      product.date.toDateString() === date.toDateString()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-secondary px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayNames.map(day => (
          <div key={day} className="p-4 text-center font-semibold text-muted-foreground bg-secondary/30">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayProducts = getProductsForDay(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] p-2 border-b border-r border-border last:border-r-0",
                isCurrentMonth ? "bg-card" : "bg-muted/30",
                isToday && "bg-accent/20"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-2",
                isCurrentMonth ? "text-card-foreground" : "text-muted-foreground",
                isToday && "text-primary font-bold"
              )}>
                {date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayProducts.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "p-1.5 rounded-md text-xs cursor-pointer transition-colors",
                      product.available 
                        ? "bg-gradient-primary text-primary-foreground hover:shadow-sm" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <div className="font-medium truncate">{product.title}</div>
                    <div className="flex items-center space-x-1 opacity-90">
                      <Clock className="w-3 h-3" />
                      <span>{product.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Products List for Selected Month */}
      {products.length > 0 && (
        <div className="p-6 border-t border-border bg-secondary/20">
          <h3 className="font-semibold text-lg mb-4 text-card-foreground">
            Classes This Month
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors",
                  !product.available && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-card-foreground mb-1">
                      {product.title}
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>{product.date.toLocaleDateString()}</span>
                        <Clock className="w-3 h-3" />
                        <span>{product.time}</span>
                      </div>
                      {product.instructor && (
                        <div className="flex items-center space-x-2">
                          <User className="w-3 h-3" />
                          <span>{product.instructor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-primary font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{product.price}</span>
                    </div>
                    {!product.available && (
                      <div className="text-xs text-destructive mt-1">
                        Sold Out
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};