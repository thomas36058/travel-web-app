import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PlannedTrip } from "../types/travel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateExpenseData = (trips: PlannedTrip[]) => {
  const aggregated = trips.reduce((acc, trip) => {
    trip.expenses.forEach(expense => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(aggregated).map(([category, value]) => ({
    category,
    value,
  }));
};