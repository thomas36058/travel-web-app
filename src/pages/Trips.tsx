import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Plane, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockPlannedTrips } from '../data/mockData';
import type { PlannedTrip } from '../types/travel';
import TripCard from '../components/pages/TripCard';

export default function Trips() {
  const [trips, setTrips] = useState<PlannedTrip[]>(mockPlannedTrips);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'planning' | 'booked' | 'completed'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    destination: '',
    country: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning' as 'planning' | 'booked' | 'completed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTrip: PlannedTrip = {
      id: Date.now().toString(),
      destination: formData.destination,
      country: formData.country,
      countryCode: 'XX',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
      budget: Number(formData.budget) || 0,
      currency: 'EUR',
      expenses: [],
      itinerary: [],
    };
    
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
  };

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(t => t.status === filter);

  const summary = useMemo(() => {
    const totalBudget = trips.reduce((s, t) => s + t.budget, 0);
    const totalExpenses = trips.reduce(
      (s, t) => s + t.expenses.reduce((es, e) => es + e.amount, 0),
      0
    );

    return {
      totalBudget,
      totalExpenses,
      available: totalBudget - totalExpenses,
    };
  }, [trips]);

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
              {trips.length} viagens • €{summary.totalBudget.toLocaleString()} orçamento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(v: typeof filter | null) => { if(!v) return; setFilter(v) }}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />

              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="planning">Planejando</SelectItem>
              <SelectItem value="booked">Confirmadas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button className="gap-2">
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

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da imagem</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
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
                      onValueChange={(value: 'planning' | 'booked' | 'completed' | null) => {
                        if(!value) return;
                        setFormData(prev => ({ ...prev, status: value }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planejando</SelectItem>
                        <SelectItem value="booked">Confirmada</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>

                  <Button type="submit">Criar Viagem</Button>
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
            €{summary.totalBudget.toLocaleString()}
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
            €{summary.totalExpenses.toLocaleString()}
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
            €{(summary.totalBudget - summary.totalExpenses).toLocaleString()}
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
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Criar primeira viagem
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
