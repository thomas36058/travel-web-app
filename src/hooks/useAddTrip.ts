import type { Expense, PlannedTrip, TripDay } from '../types/travel';
import { supabase } from '../lib/supabase';

interface AddTripInput {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'booked' | 'completed';
  budget?: number;
  currency?: string;
  expenses: Expense[];
  itinerary: TripDay[];
}

export function useAddTrip() {
  const addTrip = async (trip: AddTripInput): Promise<PlannedTrip> => {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        destination: trip.destination,
        country: trip.country,
        start_date: trip.startDate,
        end_date: trip.endDate,
        status: trip.status,
        budget: trip.budget || 0,
        currency: trip.currency || 'EUR',
        expenses: [],
        itinerary: [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      destination: data.destination,
      country: data.country,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      status: data.status,
      budget: data.budget,
      currency: data.currency,
      expenses: data.expenses ?? [],
      itinerary: data.itinerary ?? [],
      createdAt: new Date(data.created_at),
    };
  };

  return { addTrip };
}
