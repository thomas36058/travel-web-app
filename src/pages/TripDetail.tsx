import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, differenceInDays, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  Plus,
  Trash2,
  Hotel,
  Car,
  Ticket,
  Utensils,
  MoreHorizontal,
  Sun,
  CloudSun,
  Moon,
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import type { DayActivity, Expense } from '../types/travel'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useTripExpenses } from '../hooks/useTripExpenses'
import { useTripActivities } from '../hooks/useTripActivities'
import { useTrips } from '../hooks/useTrips'

export interface StatCardProps {
  title: string
  value: string | number
  iconBg?: string
}

const EXPENSE_CATEGORIES = {
  accommodation: {
    label: 'Hospedagem',
    icon: Hotel,
  },
  transportation: {
    label: 'Transporte',
    icon: Car,
  },
  attractions: {
    label: 'Atrações',
    icon: Ticket,
  },
  food: {
    label: 'Alimentação',
    icon: Utensils,
  },
  other: {
    label: 'Outros',
    icon: MoreHorizontal,
  },
} as const;

type ExpenseCategory = keyof typeof EXPENSE_CATEGORIES;

const periodIcons = { morning: Sun, afternoon: CloudSun, evening: Moon }
const periodLabels = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite' }

export default function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const { trips, loading } = useTrips()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0)
  const [selectedPeriod, setSelectedPeriod] = useState<
    'morning' | 'afternoon' | 'evening'
  >('morning')

  const [expenseForm, setExpenseForm] = useState({
    category: 'accommodation' as ExpenseCategory,
    description: '',
    amount: '',
  })

  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    location: '',
    time: '',
  })

  const trip = useMemo(() => {
    if (!trips || trips.length === 0) return null

    const foundTrip = trips.find(t => t.id === id)
    if (!foundTrip) return null

    const startDate = new Date(foundTrip.startDate)
    const endDate = new Date(foundTrip.endDate)
    const days = differenceInDays(endDate, startDate) + 1

    return {
      ...foundTrip,
      startDate,
      endDate,
      itinerary: Array.from({ length: days }, (_, i) => ({
        id: `day-${i}`,
        date: addDays(startDate, i),
        activities: foundTrip.itinerary?.[i]?.activities ?? [],
      })),
    }
  }, [trips, id])

  const {
    expenses,
    totalExpenses,
    remaining,
    addExpense,
    removeExpense,
  } = useTripExpenses(trip)

  const {
    itinerary,
    addActivity,
    removeActivity,
  } = useTripActivities(trip)

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Viagem não encontrada</p>
      </div>
    )
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addExpense(trip.id, {
        category: expenseForm.category,
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        currency: 'EUR',
      })

      setIsExpenseDialogOpen(false)
      setExpenseForm({ category: 'accommodation', description: '', amount: '' })

      toast({ title: 'Gasto adicionado!' })
    } catch (error) {
      console.error(error)

      toast({
        title: 'Erro ao adicionar gasto',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    await removeExpense(trip.id, expenseId)
    toast({ title: 'Gasto removido' })
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDayIndex === null) return

    try {
      await addActivity(selectedDayIndex, selectedPeriod, activityForm)
      setActivityForm({ title: "", description: "", location: "", time: "" })
      setIsActivityDialogOpen(false)
      toast({ title: "Atividade adicionada!" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro ao adicionar atividade", variant: "destructive" })
    }
  }

  const handleDeleteActivity = async (dayIndex: number, activityId: string) => {
    try {
      await removeActivity(dayIndex, activityId)
      toast({ title: "Atividade removida" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro ao remover atividade", variant: "destructive" })
    }
  }


  const openActivityDialog = (
    dayIndex: number,
    period: 'morning' | 'afternoon' | 'evening'
  ) => {
    setSelectedDayIndex(dayIndex)
    setSelectedPeriod(period)
    setIsActivityDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          className="mb-4 gap-2 cursor-pointer"
          onClick={() => navigate('/trips')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <h1 className="font-display text-4xl font-bold">{trip.destination}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{trip.country}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(trip.startDate, 'dd MMM', { locale: ptBR })} -{' '}
              {format(trip.endDate, 'dd MMM yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          title="Orçamento"
          value={`€${trip.budget.toLocaleString()}`}
        />
        <StatCard
          title="Gasto"
          value={`€${totalExpenses.toLocaleString()}`}
          iconBg="stat-icon-sage"
        />
        <StatCard
          title="Disponível"
          value={`€${remaining.toLocaleString()}`}
          iconBg="stat-icon-terracotta"
        />
      </motion.div>

      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-4 w-full p-0 bg-transparent">
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 bg-muted hover:data-[state=active]:text-white hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Gastos
          </TabsTrigger>

          <TabsTrigger
            value="itinerary"
            className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 bg-muted hover:data-[state=active]:text-white hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Roteiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Gastos da Viagem
            </h2>

            <Dialog
              open={isExpenseDialogOpen}
              onOpenChange={setIsExpenseDialogOpen}
            >
              <DialogTrigger>
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Adicionar Gasto
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Novo Gasto</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(v: ExpenseCategory | null) => {
                        if (!v) return;
                        setExpenseForm((prev) => ({ ...prev, category: v }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {EXPENSE_CATEGORIES[expenseForm.category].label}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {(Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[]).map(
                          (category) => {
                            const Icon = EXPENSE_CATEGORIES[category].icon;
                            
                            return (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {EXPENSE_CATEGORIES[category].label}
                                </div>
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={expenseForm.description}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Ex: Hotel centro histórico"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (€)</Label>
                    <Input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="100"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className='cursor-pointer'
                      onClick={() => setIsExpenseDialogOpen(false)}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" className='cursor-pointer'>Adicionar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card py-12 text-center">
                <Wallet className="mx-auto h-10 w-10 text-muted-foreground/50" />

                <p className="mt-3 text-muted-foreground">
                  Nenhum gasto registrado
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {expenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-muted-foreground">
                Selecionar dia:
              </Label>

              <Select
                value={
                  selectedDayIndex !== null ? selectedDayIndex.toString() : undefined
                }
                onValueChange={(v) => setSelectedDayIndex(Number(v))}
              >
                <SelectTrigger className="w-70">
                  <SelectValue>
                    {selectedDayIndex !== null && itinerary[selectedDayIndex]
                      ? format(
                          itinerary[selectedDayIndex].date,
                          "EEEE, dd 'de' MMMM",
                          { locale: ptBR }
                        )
                      : "Selecionar dia"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {itinerary.map((day, index) => (
                    <SelectItem key={day.id} value={index.toString()}>
                      Dia {index + 1} -{" "}
                      {format(day.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>

          <Dialog
            open={isActivityDialogOpen}
            onOpenChange={setIsActivityDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Nova Atividade
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={activityForm.title}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Ex: Visitar Coliseu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Local</Label>
                  <Input
                    value={activityForm.location}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Ex: Roma, Centro"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={activityForm.time}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={activityForm.description}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Notas adicionais..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className='cursor-pointer'
                    onClick={() => setIsActivityDialogOpen(false)}
                  >
                    Cancelar
                  </Button>

                  <Button type="submit" className='cursor-pointer'>Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {selectedDayIndex !== null && itinerary[selectedDayIndex] && (
            <motion.div
              key={itinerary[selectedDayIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Dia {selectedDayIndex + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      itinerary[selectedDayIndex].date,
                      "EEEE, dd 'de' MMMM",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(['morning', 'afternoon', 'evening'] as const).map(
                  (period) => {
                    const PeriodIcon = periodIcons[period]
                    const selectedDay = itinerary[selectedDayIndex]
                    const activities = selectedDay.activities.filter(
                      (a) => a.period === period
                    )

                    return (
                      <div
                        key={period}
                        className="rounded-xl border border-border/50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <PeriodIcon className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">
                              {periodLabels[period]}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() =>
                              selectedDayIndex !== null &&
                              openActivityDialog(selectedDayIndex, period)
                            }
                          >
                            <Plus className="h-4 w-4" />
                            Adicionar
                          </Button>
                        </div>

                        {activities.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma atividade planejada
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {activities.map((activity) => (
                              <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onDelete={() =>
                                  handleDeleteActivity(
                                    selectedDayIndex,
                                    activity.id
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }
                )}
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, iconBg = 'bg-primary/10' }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function ExpenseCard({
  expense,
  onDelete,
}: {
  expense: Expense
  onDelete: (id: string) => void
}) {
  const Icon = EXPENSE_CATEGORIES[expense.category].icon

  return (
    <li>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {EXPENSE_CATEGORIES[expense.category].label}
               •{' '}
              {format(new Date(expense.date), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-semibold text-foreground">
            €{expense.amount.toLocaleString()}
          </span>
          <Button
            aria-label="Remover gasto"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </li>
  )
}

function ActivityCard({
  activity,
  onDelete,
}: {
  activity: DayActivity
  onDelete: (id: string) => void
}) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
      <div>
        <p className="font-medium text-foreground">{activity.title}</p>
        {activity.location && (
          <p className="text-sm text-muted-foreground">
            📍 {activity.location}
          </p>
        )}
        {activity.time && (
          <p className="text-sm text-muted-foreground">🕐 {activity.time}</p>
        )}
      </div>
      <Button
        aria-label="Remover atividade"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
        onClick={() => onDelete(activity.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}
