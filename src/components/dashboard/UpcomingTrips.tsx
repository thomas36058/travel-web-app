import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PlannedTrip } from '../../types/travel';
import { Button } from '../ui/button';

interface UpcomingTripsProps {
  trips: PlannedTrip[];
}

export default function UpcomingTrips({ trips }: UpcomingTripsProps) {
  const navigate = useNavigate();
  const upcomingTrips = trips.filter(t => t.status !== 'completed').slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Próximas Viagens
        </h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/trips')}>
          Ver todas
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {upcomingTrips.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Nenhuma viagem planejada ainda
          </p>
        ) : (
          upcomingTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-accent/50"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <img
                  src={trip.imageUrl}
                  alt={trip.destination}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-foreground">
                    {trip.destination}, {trip.country}
                  </h4>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(trip.startDate, "dd MMM", { locale: ptBR })} - {format(trip.endDate, "dd MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-semibold text-foreground">
                  €{trip.budget.toLocaleString()}
                </p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  trip.status === 'booked' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-accent text-accent-foreground'
                }`}>
                  {trip.status === 'booked' ? 'Confirmada' : 'Planejando'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
