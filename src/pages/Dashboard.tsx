import { motion } from 'framer-motion';
import { Plane, Wallet, Calendar } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { mockDestinations, mockPlannedTrips } from '../data/mockData';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import UpcomingTrips from '../components/dashboard/UpcomingTrips';
import WishlistPreview from '../components/dashboard/WishlistPreview';
import { useTripStats } from '../hooks/useTripStats';

export default function Dashboard() {
  const trips = mockPlannedTrips
  const stats = useTripStats(trips)
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Olá, Viajante! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Veja o resumo das suas aventuras
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Viagens"
          value={stats.totalTrips}
          icon={<Plane className="h-6 w-6" />}
          variant="terracotta"
        />
        <StatCard
          title="Orçamento Total"
          value={`€${stats.totalBudget.toLocaleString()}`}
          icon={<Wallet className="h-6 w-6" />}
          variant="amber"
        />
        <StatCard
          title="Próximas Viagens"
          value={stats.upcomingTrips}
          subtitle="Confirmadas"
          icon={<Calendar className="h-6 w-6" />}
          variant="navy"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseChart trips={mockPlannedTrips} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingTrips trips={mockPlannedTrips} />
        <WishlistPreview destinations={mockDestinations} />
      </div>
    </div>
  );
}
