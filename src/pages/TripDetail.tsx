import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft, Calendar, MapPin, Wallet, Plus, Trash2,
  Hotel, Car, Ticket, Utensils, MoreHorizontal,
  Sun, CloudSun, Moon
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import type { DayActivity, Expense, PlannedTrip } from '../types/travel';
import { mockPlannedTrips } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const expenseIcons = {
  accommodation: Hotel,
  transportation: Car,
  attractions: Ticket,
  food: Utensils,
  other: MoreHorizontal,
};

const expenseLabels = {
  accommodation: 'Hospedagem',
  transportation: 'Transporte',
  attractions: 'Atrações',
  food: 'Alimentação',
  other: 'Outros',
};

const periodIcons = {
  morning: Sun,
  afternoon: CloudSun,
  evening: Moon,
};

const periodLabels = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  evening: 'Noite',
};

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const [expenseForm, setExpenseForm] = useState({
    category: 'accommodation' as Expense['category'],
    description: '',
    amount: '',
  });

  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    location: '',
    time: '',
  });

  const [trip, setTrip] = useState<PlannedTrip | null>(() => {
    const foundTrip = mockPlannedTrips.find(t => t.id === id);
    if (!foundTrip) return null;

    if (foundTrip.itinerary.length > 0) return foundTrip;

    const days =
      differenceInDays(foundTrip.endDate, foundTrip.startDate) + 1;

    return {
      ...foundTrip,
      itinerary: Array.from({ length: days }, (_, i) => ({
        id: `day-${i}`,
        date: addDays(foundTrip.startDate, i),
        activities: [],
      })),
    };
  });


  if (!trip) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Viagem não encontrada</p>
      </div>
    );
  }

  const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = trip.budget - totalExpenses;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: Date.now().toString(),
      category: expenseForm.category,
      description: expenseForm.description,
      amount: Number(expenseForm.amount),
      currency: 'EUR',
      date: new Date(),
    };
    setTrip(prev => prev ? { ...prev, expenses: [...prev.expenses, newExpense] } : null);
    setIsExpenseDialogOpen(false);
    setExpenseForm({ category: 'accommodation', description: '', amount: '' });
    toast({ title: 'Gasto adicionado!' });
  };

  const handleDeleteExpense = (expenseId: string) => {
    setTrip(prev => prev ? {
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== expenseId)
    } : null);
    toast({ title: 'Gasto removido' });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: DayActivity = {
      id: Date.now().toString(),
      period: selectedPeriod,
      title: activityForm.title,
      description: activityForm.description,
      location: activityForm.location,
      time: activityForm.time,
    };
    
    setTrip(prev => {
      if (!prev) return null;
      const newItinerary = [...prev.itinerary];
      newItinerary[selectedDayIndex] = {
        ...newItinerary[selectedDayIndex],
        activities: [...newItinerary[selectedDayIndex].activities, newActivity],
      };
      return { ...prev, itinerary: newItinerary };
    });
    
    setIsActivityDialogOpen(false);
    setActivityForm({ title: '', description: '', location: '', time: '' });
    toast({ title: 'Atividade adicionada!' });
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    setTrip(prev => {
      if (!prev) return null;
      const newItinerary = [...prev.itinerary];
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        activities: newItinerary[dayIndex].activities.filter(a => a.id !== activityId),
      };
      return { ...prev, itinerary: newItinerary };
    });
    toast({ title: 'Atividade removida' });
  };

  const openActivityDialog = (dayIndex: number, period: 'morning' | 'afternoon' | 'evening') => {
    setSelectedDayIndex(dayIndex);
    setSelectedPeriod(period);
    setIsActivityDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate('/trips')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <>
          <h1 className="font-display text-4xl font-bold">
            {trip.destination}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{trip.country}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(trip.startDate, "dd MMM", { locale: ptBR })} - {format(trip.endDate, "dd MMM yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </>
      </motion.div>

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orçamento</p>
              <p className="font-display text-2xl font-bold text-foreground">
                €{trip.budget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="stat-icon-orange rounded-xl p-3">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gasto</p>
              <p className="font-display text-2xl font-bold text-foreground">
                €{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="stat-icon-green rounded-xl p-3">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponível</p>
              <p className="font-display text-2xl font-bold text-foreground">
                €{remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="itinerary">Roteiro</TabsTrigger>
        </TabsList>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Gastos da Viagem
            </h2>
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger>
                <Button className="gap-2">
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
                      onValueChange={(v: Expense['category'] | null) =>{
                        if(v === null) return; 
                        setExpenseForm(prev => ({ ...prev, category: v }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(expenseLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ex: Hotel centro histórico"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (€)</Label>
                    <Input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {trip.expenses.length === 0 ? (
              <div className="stat-card py-12 text-center">
                <Wallet className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-muted-foreground">Nenhum gasto registrado</p>
              </div>
            ) : (
              trip.expenses.map((expense, index) => {
                const Icon = expenseIcons[expense.category];
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="stat-card flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {expenseLabels[expense.category]} • {format(expense.date, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg font-semibold text-foreground">
                        €{expense.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary" className="space-y-6">
          <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Nova Atividade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={activityForm.title}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Visitar Coliseu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Local</Label>
                  <Input
                    value={activityForm.location}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ex: Roma, Centro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={activityForm.description}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Notas adicionais..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {trip.itinerary.map((day, dayIndex) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="stat-card"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Dia {dayIndex + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(day.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(['morning', 'afternoon', 'evening'] as const).map((period) => {
                  const PeriodIcon = periodIcons[period];
                  const activities = day.activities.filter(a => a.period === period);
                  
                  return (
                    <div key={period} className="rounded-xl border border-border/50 p-4">
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
                          className="gap-1"
                          onClick={() => openActivityDialog(dayIndex, period)}
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
                            <div
                              key={activity.id}
                              className="flex items-start justify-between rounded-lg bg-muted/50 p-3"
                            >
                              <div>
                                <p className="font-medium text-foreground">{activity.title}</p>
                                {activity.location && (
                                  <p className="text-sm text-muted-foreground">
                                    📍 {activity.location}
                                  </p>
                                )}
                                {activity.time && (
                                  <p className="text-sm text-muted-foreground">
                                    🕐 {activity.time}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteActivity(dayIndex, activity.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
