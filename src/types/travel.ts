export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string;
  notes?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  category: 'accommodation' | 'transportation' | 'attractions' | 'food' | 'other';
  description: string;
  amount: number;
  currency: string;
  date: Date;
}

export interface DayActivity {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  description?: string;
  location?: string;
  time?: string;
}

export interface TripDay {
  id: string;
  date: Date;
  activities: DayActivity[];
}

export interface PlannedTrip {
  id: string;
  destination: string;
  country: string;
  countryCode: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'booked' | 'completed';
  budget: number;
  currency: string;
  expenses: Expense[];
  itinerary: TripDay[];
  notes?: string;
}
