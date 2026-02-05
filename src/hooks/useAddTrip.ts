// hooks/useAddTrip.ts
import { useState } from 'react';
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
  expenses: Expense[],
  itinerary: TripDay[]
}

export function useAddTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTrip = async (trip: AddTripInput): Promise<PlannedTrip | null> => {
    setLoading(true);
    setError(null);

    try {
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
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as PlannedTrip;
    } catch (err: unknown) {
      console.error('Supabase error:', err);
      if (err instanceof Error) setError(err.message);
      else setError('Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addTrip, loading, error };
}
