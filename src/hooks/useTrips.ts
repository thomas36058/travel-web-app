import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PlannedTrip } from '../types/travel';

export function useTrips() {
  const [trips, setTrips] = useState<PlannedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      setTrips(
        (data ?? []).map(trip => ({
          id: trip.id,
          destination: trip.destination,
          country: trip.country,
          startDate: new Date(trip.start_date),
          endDate: new Date(trip.end_date),
          status: trip.status,
          budget: trip.budget,
          currency: trip.currency,
          expenses: trip.expenses ?? [],
          itinerary: trip.itinerary ?? [],
          createdAt: new Date(trip.created_at),
        }))
      );

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao buscar viagens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const removeTrip = useCallback(async (tripId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      setTrips(prev => prev.filter(trip => trip.id !== tripId));

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao remover viagem');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    setTrips,
    loading,
    error,
    refetch: fetchTrips,
    removeTrip
  };
}
