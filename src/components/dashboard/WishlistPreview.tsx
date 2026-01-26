import { useMemo, memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Destination } from '../../types/travel';
import { Button } from '../ui/button';

interface WishlistPreviewProps {
  destinations: Destination[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.4 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export default function WishlistPreview({ destinations }: WishlistPreviewProps) {
  const navigate = useNavigate();

  const topDestinations = useMemo(() => destinations.slice(0, 4), [destinations]);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <Header onNavigate={() => navigate('/wishlist')} />

      <div className="grid grid-cols-2 gap-4">
        {topDestinations.length === 0 ? (
          <EmptyState />
        ) : (
          topDestinations.map((dest) => (
            <DestinationCard 
              key={dest.id} 
              destination={dest} 
              onClick={() => navigate(`/destinations/${dest.id}`)} 
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
      <div className="flex items-center gap-2">
        <div>
          <h3 className="text-lg font-semibold leading-tight">
            Lista de Desejos
          </h3>
          <p className="text-xs text-muted-foreground">
            Destinos para o futuro
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigate}
        className="cursor-pointer"
      >
        Ver todos
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );
}

const DestinationCard = memo(({ destination, onClick }: { destination: Destination, onClick: () => void }) => {
  return (
    <motion.button
      variants={cardVariants}
      onClick={onClick}
      className="group relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border/10 outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
    >
      <img
        src={destination.imageUrl}
        alt={destination.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      <div className="absolute inset-0 p-3 flex flex-col justify-end">
        <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
          {destination.name}
        </h4>
        <p className="text-[11px] text-white/80 font-medium truncate uppercase tracking-wider">
          {destination.country}
        </p>
      </div>
    </motion.button>
  );
});

function EmptyState() {
  return (
    <p className="col-span-2 py-8 text-center text-sm text-muted-foreground italic">
      Sua lista está vazia.
    </p>
  );
}