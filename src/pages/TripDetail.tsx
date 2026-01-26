import { useMemo, useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

export interface StatCardProps {
  title: string;
  value: string | number;
  iconBg?: string;
}

const expenseIcons = { accommodation: Hotel, transportation: Car, attractions: Ticket, food: Utensils, other: MoreHorizontal };
const expenseLabels = { accommodation: 'Hospedagem', transportation: 'Transporte', attractions: 'Atrações', food: 'Alimentação', other: 'Outros' };
const periodIcons = { morning: Sun, afternoon: CloudSun, evening: Moon };
const periodLabels = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite' };

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

    const days = differenceInDays(foundTrip.endDate, foundTrip.startDate) + 1;

    return {
      ...foundTrip,
      itinerary: Array.from({ length: days }, (_, i) => ({
        id: `day-${i}`,
        date: addDays(foundTrip.startDate, i),
        activities: [],
      })),
    };
  });

  const totalExpenses = useMemo(() => trip?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0, [trip?.expenses]);
const remaining = useMemo(() => (trip?.budget ?? 0) - totalExpenses, [trip?.budget, totalExpenses]);

  if (!trip) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Viagem não encontrada</p>
      </div>
    );
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: uuidv4(),
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
      id: uuidv4(),
      period: selectedPeriod,
      ...activityForm
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
          iconBg="stat-icon-terracotta"
        />
        <StatCard
          title="Disponível" 
          value={`€${remaining.toLocaleString()}`} 
          iconBg="stat-icon-sage"
        />
      </motion.div>

      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="itinerary">Roteiro</TabsTrigger>
        </TabsList>

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
              <div className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card py-12 text-center">
                <Wallet className="mx-auto h-10 w-10 text-muted-foreground/50" />

                <p className="mt-3 text-muted-foreground">Nenhum gasto registrado</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {trip.expenses.map(expense => 
                  <ExpenseCard key={expense.id} expense={expense} onDelete={handleDeleteExpense} />
                )}
              </ul>
            )}
          </div>
        </TabsContent>

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
              className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card"
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
                            <ActivityCard key={activity.id} activity={activity} onDelete={() => handleDeleteActivity(dayIndex, activity.id)} />
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

function StatCard({ title, value, iconBg = 'bg-primary/10' }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ExpenseCard({ expense, onDelete }: { expense: Expense; onDelete: (id: string) => void }) {
  const Icon = expenseIcons[expense.category];
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
              {expenseLabels[expense.category]} • {format(expense.date, 'dd/MM/yyyy')}
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
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </li>
  );
}

function ActivityCard({
  activity,
  onDelete
}: {
  activity: DayActivity;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-start justify-between rounded-lg bg-muted/50 p-3">
      <div>
        <p className="font-medium text-foreground">{activity.title}</p>
        {activity.location && <p className="text-sm text-muted-foreground">📍 {activity.location}</p>}
        {activity.time && <p className="text-sm text-muted-foreground">🕐 {activity.time}</p>}
      </div>
      <Button
        aria-label="Remover atividade"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(activity.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
