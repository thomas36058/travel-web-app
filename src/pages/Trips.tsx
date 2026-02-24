import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Plane, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import TripCard from '../components/pages/TripCard';
import { useTripStats } from '../hooks/useTripStats';
import { useAddTrip } from '../hooks/useAddTrip';
import { useTrips } from '../hooks/useTrips';

const STATUS_LABELS = {
  planning: 'Planejando',
  booked: 'Confirmada',
  completed: 'Concluída',
} as const;

type Status = keyof typeof STATUS_LABELS;

export default function Trips() {
  const { trips, setTrips, loading } = useTrips()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'planning' | 'booked' | 'completed'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { addTrip } = useAddTrip();
  const { removeTrip } = useTrips();
  const navigate = useNavigate();
  const { toast } = useToast();
  const stats = useTripStats(trips)

  const [formData, setFormData] = useState({
    destination: '',
    country: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning' as 'planning' | 'booked' | 'completed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const newTrip = await addTrip({
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        budget: Number(formData.budget) || 0,
        expenses: [],
        itinerary: []
      });
      
      setTrips(prev => [newTrip, ...prev]);
      setIsDialogOpen(false);
      setFormData({
        destination: '',
        country: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'planning',
      });
      toast({ title: 'Viagem criada com sucesso!' });
    } catch (err) {
      setSubmitError(
        err instanceof Error
        ? err.message
        : 'Erro ao criar viagem. Tente novamente'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveTrip = async (tripId: string) => {
    if (!confirm("Tem certeza que deseja remover esta viagem?")) return;

    try {
      await removeTrip(tripId);
      toast({ title: 'Viagem removida com sucesso!' });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao remover viagem',
        variant: 'destructive',
      });
    }
  };

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Carregando viagens...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Minhas Viagens
            </h1>
            <p className="text-muted-foreground">
              {trips.length} viagens • €{stats.totalBudget} orçamento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select 
            value={filter}
            onValueChange={(v: typeof filter | null) => {
              if (!v) return;
              setFilter(v);
            }}
          >
            <SelectTrigger className="w-40" style={{ height: 'stretch' }}>
              <Filter className="mr-2 w-4" />

              <SelectValue>
                {filter === 'all' ? 'Todas' : STATUS_LABELS[filter]}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>

              {(Object.keys(STATUS_LABELS) as Status[]).map(status => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setSubmitError(null);
            }}
          >
            <DialogTrigger>
              <Button className="gap-2 cursor-pointer">
                <Plus className="h-5 w-5" />
                Nova Viagem
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Nova Viagem</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Ex: Roma"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Ex: Itália"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Orçamento (€)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="2000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Status | null) => {
                        if (!value) return;
                        setFormData(prev => ({ ...prev, status: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {STATUS_LABELS[formData.status]}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {submitError && (
                  <p className="text-red-500 text-sm text-right">
                    {submitError}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <Button className='cursor-pointer' type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>

                  <Button type="submit" className='cursor-pointer' disabled={isSubmitting}>
                    {isSubmitting ? 'Criando viagem...' : 'Criar Viagem'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card"
        >
          <p className="text-sm text-muted-foreground">Orçamento Total</p>

          <p className="mt-1 font-display text-3xl font-bold text-foreground">
            €{stats.totalBudget}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card"
        >
          <p className="text-sm text-muted-foreground">Gastos Totais</p>

          <p className="mt-1 font-display text-3xl font-bold text-primary">
            €{stats.totalExpenses}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card"
        >
          <p className="text-sm text-muted-foreground">Disponível</p>

          <p className="mt-1 font-display text-3xl font-bold text-stat-green">
            €{stats.totalBudget - stats.totalExpenses}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => navigate(`/trips/${trip.id}`)}
              onDelete={() => handleRemoveTrip(trip.id)}
            />
          ))}
        </AnimatePresence>

        {filteredTrips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <Plane className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg text-muted-foreground">
              Nenhuma viagem encontrada
            </p>
            <Button className="mt-4 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
              Criar primeira viagem
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
