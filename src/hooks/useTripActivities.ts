import { useEffect, useState, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import type { DayActivity, PlannedTrip } from "../types/travel"
import { supabase } from "../lib/supabase"
import { useTrips } from "./useTrips"

type Period = "morning" | "afternoon" | "evening"

export function useTripActivities(trip: PlannedTrip | null) {
  const { refetch } = useTrips()
  const initialItinerary = useMemo(() => trip?.itinerary ?? [], [trip?.itinerary])
  const [itinerary, setItinerary] = useState(initialItinerary)

  useEffect(() => {
    setItinerary(initialItinerary)
  }, [initialItinerary])

  async function addActivity(
    dayIndex: number,
    period: Period,
    data: Omit<DayActivity, "id" | "period">
  ) {
    if (!trip) throw new Error("Trip is null in addActivity")

    const newActivity: DayActivity = { ...data, id: uuidv4(), period }

    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: [...updatedItinerary[dayIndex].activities, newActivity],
    }

    const { error } = await supabase
      .from("trips")
      .update({ itinerary: updatedItinerary })
      .eq("id", trip.id)

    if (error) throw error

    setItinerary(updatedItinerary)
    await refetch()
  }

  async function removeActivity(dayIndex: number, activityId: string) {
    if (!trip) throw new Error("Trip is null in removeActivity")

    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: updatedItinerary[dayIndex].activities.filter(
        (a) => a.id !== activityId
      ),
    }

    const { error } = await supabase
      .from("trips")
      .update({ itinerary: updatedItinerary })
      .eq("id", trip.id)

    if (error) throw error

    setItinerary(updatedItinerary)
    await refetch()
  }

  return {
    itinerary,
    addActivity,
    removeActivity,
  }
}
