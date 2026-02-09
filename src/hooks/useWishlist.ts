import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Destination } from '../types/travel';

export function useWishlist() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await supabase
        .from('wishlist')
        .select('*')
        .order('created_at', { ascending: false });

      setDestinations(
        (data ?? []).map(destination => ({
          id: destination.id,
          name: destination.name,
          country: destination.country,
          imageUrl: destination.imageUrl || '',
          notes: destination.notes || '',
          created_at: new Date(destination.created_at),
        }))
      );
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao buscar destinos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addDestination = useCallback(
    async (destination: Omit<Destination, 'id' | 'created_at'>) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: insertError } = await supabase
          .from('wishlist')
          .insert([destination])
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setDestinations(prev => [
            {
              id: data.id,
              name: data.name,
              country: data.country,
              imageUrl: data.imageUrl || '',
              notes: data.notes || '',
              created_at: new Date(data.created_at),
            },
            ...prev,
          ]);
        }

        return { data, error: null };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao adicionar destino';
        setError(errorMessage);
        return { data: null, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDestination = useCallback(
    async (id: string, updates: Partial<Omit<Destination, 'id' | 'created_at'>>) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: updateError } = await supabase
          .from('wishlist')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (data) {
          setDestinations(prev =>
            prev.map(d =>
              d.id === id
                ? {
                    id: data.id,
                    name: data.name,
                    country: data.country,
                    imageUrl: data.imageUrl || '',
                    notes: data.notes || '',
                    created_at: new Date(data.created_at),
                  }
                : d
            )
          );
        }

        return { data, error: null };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao atualizar destino';
        setError(errorMessage);
        return { data: null, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeDestination = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao remover destino';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    destinations,
    setDestinations,
    loading,
    error,
    refetch: fetchWishlist,
    addDestination,
    updateDestination,
    removeDestination,
  };
}
