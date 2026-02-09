import { useMemo } from "react"
import type { Expense, PlannedTrip } from "../types/travel"
import { useTrips } from "./useTrips"
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from "uuid"

export function useTripExpenses(trip: PlannedTrip | null) {
  const { refetch } = useTrips()

  const expenses = useMemo(() => trip?.expenses ?? [], [trip?.expenses])

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  )

  const remaining = useMemo(
    () => (trip?.budget ?? 0) - totalExpenses,
    [trip?.budget, totalExpenses]
  )

  async function addExpense(
    tripId: string,
    data: Omit<Expense, 'id' | 'date'>
  ) {
    if (!trip) throw new Error('Trip is null in addExpense')

    const newExpense: Expense = {
      id: uuidv4(),
      ...data,
      date: new Date().toISOString(),
    }

    const updatedExpenses = [...expenses, newExpense]

    const { error } = await supabase
      .from('trips')
      .update({ expenses: updatedExpenses })
      .eq('id', tripId)

    if (error) throw error

    await refetch()
  }

  async function removeExpense(tripId: string, expenseId: string) {
    if (!trip) throw new Error('Trip is null in removeExpense')

    const updatedExpenses = expenses.filter(e => e.id !== expenseId)

    const { error } = await supabase
      .from('trips')
      .update({ expenses: updatedExpenses })
      .eq('id', tripId)

    if (error) throw error

    await refetch()
  }

  return {
    expenses,
    totalExpenses,
    remaining,
    addExpense,
    removeExpense,
  }
}
