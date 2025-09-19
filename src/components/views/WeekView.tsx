import { Product } from "../ProductInjector";
import { ChevronLeft, ChevronRight, Clock, User, DollarSign, Calendar, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getEventsForDay, formatEventTitle, ProcessedEvent } from "@/utils/eventUtils";

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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);

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

  const getEventsForWeekDay = (date: Date) => {
    return getEventsForDay(products, date);
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
      <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
            Week View
          </h2>
          <div className="flex items-center justify-between sm:justify-end space-x-4">
            <span className="text-sm sm:text-lg text-muted-foreground">
              {formatWeekRange()}
            </span>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid - Mobile and Desktop versions */}
      <div className="block sm:hidden">
        {/* Mobile: List view of events */}
        <div className="p-4 space-y-3">
          {weekDays.map((date, dayIndex) => {
            const dayEvents = getEventsForWeekDay(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={dayIndex} className="space-y-2">
                <div className={cn(
                  "font-semibold text-sm p-2 rounded-lg flex items-center justify-between",
                  isToday ? "bg-accent text-primary" : "text-muted-foreground"
                )}>
                  <span>{dayNames[dayIndex]}, {date.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {dayEvents.length} session{dayEvents.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {dayEvents.length > 0 ? (
                  <div className="space-y-2 pl-4">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          const originalProduct = products.find(p => p.id === event.productId);
                          if (originalProduct) {
                            setSelectedProduct(originalProduct);
                            setSelectedEvent(event);
                          }
                        }}
                        className={cn(
                          "p-3 rounded-lg text-sm cursor-pointer transition-all duration-300 relative",
                          event.available
                            ? "bg-primary text-white hover:shadow-md"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {event.isRecurring && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></div>
                        )}
                        <div className="font-medium mb-2">{formatEventTitle(event)}</div>
                        <div className="space-y-1 opacity-90 text-xs">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>{event.startTime} - {event.endTime} • {event.duration}</span>
                          </div>
                          {event.instructor && (
                            <div className="flex items-center space-x-2">
                              <User className="w-3 h-3" />
                              <span>{event.instructor}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            <span>${event.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground pl-4">No events</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid week-grid border-b border-border">
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
            <div key={timeSlot} className="grid week-grid border-b border-border last:border-b-0">
              {/* Time Label */}
              <div className="p-3 bg-secondary/30 border-r border-border text-center text-sm font-medium text-muted-foreground">
                {timeSlot}
              </div>

              {/* Day Columns */}
              {weekDays.map((date, dayIndex) => {
                const dayEvents = getEventsForWeekDay(date);
                const timeEvents = dayEvents.filter(event => 
                  event.startTime <= timeSlot && event.endTime > timeSlot
                );

                return (
                  <div
                    key={dayIndex}
                    className="w-full min-h-[80px] p-2 border-l border-border relative overflow-hidden"
                  >
                    {timeEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          const originalProduct = products.find(p => p.id === event.productId);
                          if (originalProduct) {
                            setSelectedProduct(originalProduct);
                            setSelectedEvent(event);
                          }
                        }}
                        className={cn(
                          "w-full max-w-full p-2 rounded-lg text-xs cursor-pointer transition-all duration-300 mb-1 last:mb-0 overflow-hidden relative",
                          event.available
                            ? "bg-primary text-white hover:shadow-md hover:scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {event.isRecurring && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full -mt-0.5 -mr-0.5"></div>
                        )}
                        <div className="font-medium mb-1 truncate text-ellipsis whitespace-nowrap overflow-hidden">
                          {formatEventTitle(event)}
                        </div>
                        <div className="space-y-1 opacity-90">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.instructor && (
                            <div className="flex items-center space-x-1 min-w-0">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate text-ellipsis whitespace-nowrap overflow-hidden">{event.instructor}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            <span>{event.price}</span>
                          </div>
                        </div>
                        {!event.available && (
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

      {/* Event Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProduct.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Event Image */}
                {selectedProduct.image && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title}
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
                        <div className="font-semibold">Date & Time</div>
                        <div className="text-muted-foreground">
                          {selectedProduct.date.toLocaleDateString()} at {selectedProduct.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Duration</div>
                        <div className="text-muted-foreground">{selectedProduct.duration}</div>
                      </div>
                    </div>

                    {selectedProduct.instructor && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold">Instructor</div>
                          <div className="text-muted-foreground">{selectedProduct.instructor}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Price</div>
                        <div className="text-2xl font-bold text-primary">${selectedProduct.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Category</div>
                        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {selectedProduct.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Availability</div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          selectedProduct.available 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        )}>
                          {selectedProduct.available ? "Available" : "Sold Out"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Action Button */}
                {selectedProduct.available && (
                  <div className="flex justify-end pt-4 border-t">
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                      Book This Event
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};