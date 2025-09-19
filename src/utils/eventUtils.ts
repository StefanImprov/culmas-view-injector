import { Product, ProductEvent } from "@/components/ProductInjector";

export interface ProcessedEvent {
  id: string;
  productId: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  instructor?: string;
  image?: string;
  available: boolean;
  venue?: string;
  responsible?: string;
  status?: string;
  waitlistStatus?: string;
  templateTitle?: string;
  price: number;
  description: string;
  isRecurring: boolean;
  eventIndex?: number;
  totalEvents?: number;
  responsiblesShown?: {
    profileImg?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const getAllEventsFromProducts = (products: Product[]): ProcessedEvent[] => {
  const allEvents: ProcessedEvent[] = [];

  products.forEach(product => {
    // Add main product event (original date/time)
    allEvents.push({
      id: `${product.id}-main`,
      productId: product.id,
      title: product.title,
      date: product.date,
      startTime: product.startTime || product.time,
      endTime: product.endTime || product.time,
      duration: product.duration,
      category: product.category,
      instructor: product.instructor,
      image: product.image,
      available: product.available,
      venue: product.venue,
      responsible: product.responsible,
      status: product.status,
      waitlistStatus: product.waitlistStatus,
      templateTitle: product.templateTitle,
      price: product.price,
      description: product.description,
      isRecurring: !!(product.events && product.events.length > 0),
      eventIndex: 0,
      totalEvents: (product.events?.length || 0) + 1,
      responsiblesShown: product.responsiblesShown,
    });

    // Add events from events array
    if (product.events && product.events.length > 0) {
      product.events.forEach((event, index) => {
        const eventDate = new Date(event.start * 1000); // Convert Unix timestamp to Date
        
        allEvents.push({
          id: `${product.id}-event-${index}`,
          productId: product.id,
          title: product.title,
          date: eventDate,
          startTime: event.startTime,
          endTime: event.endTime,
          duration: calculateDuration(event.startTime, event.endTime),
          category: product.category,
          instructor: product.instructor,
          image: product.image,
          available: product.available,
          venue: product.venue,
          responsible: product.responsible,
          status: product.status,
          waitlistStatus: product.waitlistStatus,
          templateTitle: product.templateTitle,
          price: product.price,
          description: product.description,
          isRecurring: true,
          eventIndex: index + 1,
          totalEvents: product.events.length + 1,
          responsiblesShown: product.responsiblesShown,
        });
      });
    }
  });

  return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getEventsForDay = (products: Product[], date: Date): ProcessedEvent[] => {
  const allEvents = getAllEventsFromProducts(products);
  return allEvents.filter(event => 
    event.date.toDateString() === date.toDateString()
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const getEventsForMonth = (products: Product[], year: number, month: number): ProcessedEvent[] => {
  const allEvents = getAllEventsFromProducts(products);
  return allEvents.filter(event => 
    event.date.getFullYear() === year && event.date.getMonth() === month
  );
};

const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const duration = endMinutes - startMinutes;
    
    if (duration <= 0) return "60min";
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${duration}min`;
    }
  } catch {
    return "60min";
  }
};

export const formatEventTitle = (event: ProcessedEvent): string => {
  if (!event.isRecurring) {
    return event.title;
  }
  
  if (event.eventIndex !== undefined && event.totalEvents !== undefined) {
    return `${event.title} (${event.eventIndex + 1}/${event.totalEvents})`;
  }
  
  return event.title;
};