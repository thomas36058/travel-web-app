import { memo, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { PlannedTrip } from '../../types/travel';
import { Button } from '../ui/button';
import { ptBR } from 'date-fns/locale';

interface UpcomingTripsProps {
  trips: PlannedTrip[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

type TripStatus = PlannedTrip['status'];

const STATUS_LABELS: Record<TripStatus, string> = {
  booked: 'Confirmada',
  planning: 'Planejando',
  completed: 'Concluída',
};

export default function UpcomingTrips({ trips }: UpcomingTripsProps) {
  const navigate = useNavigate();

  const upcomingTrips = useMemo(
    () => trips
      .filter(t => t.status !== 'completed')
      .slice(0, 3) , [trips]
    );

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <Header onNavigate={() => navigate('/trips')} />

      <div className="space-y-3">
        {upcomingTrips.length === 0 ? (
          <EmptyTripsState />
        ) : (
          upcomingTrips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onNavigate={() => navigate(`/trips/${trip.id}`)}
            />
          ))
        )}
      </div>
    </motion.section>
  );
}

function Header({ onNavigate }: { onNavigate: () => void }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Próximas Viagens</h3>
        <p className="text-xs text-muted-foreground">
          Suas aventuras mais recentes
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigate}
        className="hover:text-primary"
      >
        Ver todas
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );
}

const TripCard = memo(({ trip, onNavigate }: { 
  trip: PlannedTrip, 
  onNavigate: () => void
}) => {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onNavigate}
      className="group cursor-pointer w-full flex items-center gap-4 rounded-xl border border-border/40 p-3 text-left transition-all hover:border-primary/30 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary outline-none"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow-sm">
        <img
          src={trip.imageUrl}
          alt={`Foto de ${trip.destination}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <h4 className="truncate font-semibold text-sm sm:text-base">
            {trip.destination}
          </h4>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span className="truncate">
            {format(new Date(trip.startDate), 'dd MMM', { locale: ptBR })} –{' '}
            {format(new Date(trip.endDate), 'dd MMM yyyy', { locale: ptBR })}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-display text-base font-bold text-foreground">
          €{trip.budget.toLocaleString('pt-PT')}
        </p>

        <StatusBadge status={trip.status} />
      </div>
    </motion.button>
  );
})

function StatusBadge({ status }: { status: TripStatus }) {
  const isBooked = status === 'booked';

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
        isBooked
          ? 'bg-stat-terracotta/15 text-stat-terracotta'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function EmptyTripsState() {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-muted-foreground italic">Nenhuma viagem planejada ainda.</p>
    </div>
  );
}