import { motion } from 'framer-motion'
import { Calendar, MapPin, Wallet, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import type { PlannedTrip } from '../../types/travel'
import { cn, getExpensePercent, getTripExpenses } from '../../lib/utils'

type TripStatus = PlannedTrip['status'];

const STATUS_LABELS: Record<TripStatus, string> = {
  planning: 'Planejando',
  booked: 'Confirmada',
  completed: 'Concluída',
};

const STATUS_STYLES: Record<TripStatus, string> = {
  planning: 'bg-accent text-accent-foreground',
  booked: 'bg-primary text-accent-foreground',
  completed: 'bg-muted text-muted-foreground',
};

interface TripCardProps {
  trip: PlannedTrip
  onClick: () => void
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const totalExpenses = getTripExpenses(trip)
  const expensePercent = getExpensePercent(trip)

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={onClick}
      className="group bg-card rounded-2xl duration-300 shadow-card cursor-pointer p-0 text-left transition-all hover:shadow-card-hover"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {trip.destination}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.country}</span>
                  </div>
                </div>
                
                <div className={cn(
                  'my-2 rounded-full px-3 py-1 text-xs font-medium w-fit',
                  STATUS_STYLES[trip.status]
                )}>
                  {STATUS_LABELS[trip.status]}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(trip.startDate, 'dd MMM', { locale: ptBR })} –{' '}
                  {format(trip.endDate, 'dd MMM yyyy', { locale: ptBR })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span>€{trip.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {totalExpenses > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${expensePercent}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                €{totalExpenses.toLocaleString()} gasto
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}
