import { motion } from 'framer-motion';
import { Plane, Globe, Wallet, Calendar } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { mockDestinations, mockPlannedTrips, mockStats } from '../data/mockData';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import UpcomingTrips from '../components/dashboard/UpcomingTrips';
import WishlistPreview from '../components/dashboard/WishlistPreview';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Viagens"
          value={mockStats.totalTrips}
          subtitle="Desde 2020"
          icon={<Plane className="h-6 w-6" />}
          iconVariant="terracotta"
          delay={0.1}
        />
        <StatCard
          title="Países Visitados"
          value={mockStats.countriesVisited}
          subtitle="+2 este ano"
          icon={<Globe className="h-6 w-6" />}
          iconVariant="sage"
          delay={0.15}
        />
        <StatCard
          title="Orçamento Total"
          value={`€${mockStats.totalBudget.toLocaleString()}`}
          subtitle="Planejado"
          icon={<Wallet className="h-6 w-6" />}
          iconVariant="amber"
          delay={0.2}
        />
        <StatCard
          title="Próximas Viagens"
          value={mockStats.upcomingTrips}
          subtitle="Confirmadas"
          icon={<Calendar className="h-6 w-6" />}
          iconVariant="navy"
          delay={0.25}
        />
      </div>

      {/* Expense Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseChart trips={mockPlannedTrips} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingTrips trips={mockPlannedTrips} />
        <WishlistPreview destinations={mockDestinations} />
      </div>
    </div>
  );
}
