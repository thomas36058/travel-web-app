import { motion } from 'framer-motion';
import { Heart, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Destination } from '../../types/travel';
import { Button } from '../ui/button';

interface WishlistPreviewProps {
  destinations: Destination[];
}

const priorityColors = {
  high: 'text-destructive',
  medium: 'text-stat-orange',
  low: 'text-muted-foreground',
};

export default function WishlistPreview({ destinations }: WishlistPreviewProps) {
  const navigate = useNavigate();
  const topDestinations = destinations.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Lista de Desejos
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/wishlist')}>
          Ver todos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {topDestinations.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="group relative overflow-hidden rounded-xl"
          >
            <div className="aspect-4/3 overflow-hidden">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="font-medium text-card">{dest.name}</h4>
              <p className="text-sm text-card/70">{dest.country}</p>
            </div>
            <div className="absolute right-2 top-2">
              <Star className={`h-4 w-4 ${priorityColors[dest.priority]} fill-current`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
