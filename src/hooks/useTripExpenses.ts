import { useEffect, useState } from "react"
import type { Expense, PlannedTrip } from "../types/travel"
import { useTrips } from "./useTrips"
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from "uuid"

export function useTripExpenses(trip: PlannedTrip | null) {
  const { refetch } = useTrips()
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (!trip) return

    async function fetchExpenses() {
      const { data, error } = await supabase
        .from('trips')
        .select('expenses')
        .eq('id', trip?.id)
        .single()

      if (error) {
        console.error("Erro ao buscar expenses:", error)
        return
      }

      setExpenses(data.expenses ?? [])
    }

    fetchExpenses()
  }, [trip])

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const remaining = (trip?.budget ?? 0) - totalExpenses

  async function addExpense( tripId: string, data: Omit<Expense, 'id' | 'date'> ) {
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

    setExpenses(updatedExpenses)
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

    setExpenses(updatedExpenses)
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
