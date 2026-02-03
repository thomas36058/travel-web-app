import { useMemo } from 'react'
import type { PlannedTrip } from '../types/travel'

export function useTripStats(trips: PlannedTrip[]) {
  return useMemo(() => {
    const now = new Date()

    const totalTrips = trips.length

    const totalBudget = trips.reduce(
      (sum, trip) => sum + trip.budget,
      0
    )

    const totalExpenses = trips.reduce(
      (sum, trip) =>
        sum + trip.expenses.reduce((eSum, e) => eSum + e.amount, 0),
      0
    )

    const availableBudget = totalBudget - totalExpenses

    const upcomingTrips = trips.filter(
      (trip) =>
        trip.status === 'booked' &&
        trip.startDate > now
    ).length

    const tripsByStatus = trips.reduce(
      (acc, trip) => {
        acc[trip.status]++
        return acc
      },
      {
        planning: 0,
        booked: 0,
        completed: 0,
      }
    )

    return {
      totalTrips,
      totalBudget,
      totalExpenses,
      availableBudget,
      upcomingTrips,
      tripsByStatus,
    }
  }, [trips])
}
