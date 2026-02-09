import { useState, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Heart, MapPin, Trash2, Edit2 } from 'lucide-react'
import type { Destination } from '../types/travel'
import { useToast } from '../hooks/use-toast'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { useWishlist } from '../hooks/useWishlist'

const DEFAULT_IMAGE_URL =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828'

interface DestinationCardProps {
  destination: Destination
  onEdit: (destination: Destination) => void
  onDelete: (id: string) => void
}

type FormData = Omit<Destination, 'id' | 'created_at'>

export default function Wishlist() {
  const { destinations, addDestination, removeDestination, updateDestination, loading } = useWishlist();
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)

  const { toast } = useToast()

  const initialFormState: FormData = useMemo(
    () => ({
      name: '',
      country: '',
      imageUrl: '',
      notes: '',
    }),
    []
  )

  const [formData, setFormData] = useState<FormData>(initialFormState)

  const handleOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData({ name: '', country: '', imageUrl: '', notes: '' });
      setEditingDestination(null);
    }
  }, []);

  const handleEdit = useCallback((dest: Destination) => {
    setEditingDestination(dest);
    setFormData({ name: dest.name, country: dest.country, imageUrl: dest.imageUrl || '', notes: '' });
    setIsDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDestination) {
      const { error } = await updateDestination(editingDestination.id, formData);
      if (!error) toast({ title: 'Atualizado!', description: 'Destino atualizado com sucesso.' });
    } else {
      const { error } = await addDestination(formData);
      if (!error) toast({ title: 'Adicionado!', description: `${formData.name} foi adicionado à lista.` });
    }
    handleOpenChange(false);
  }, [formData, editingDestination, addDestination, updateDestination, toast, handleOpenChange]);

  const handleDelete = useCallback(async (id: string) => {
    const result = await removeDestination(id);
    
    if (!result?.error) {
      toast({ title: 'Removido', description: 'Destino removido.', variant: 'destructive' });
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  }, [removeDestination, toast]);


  const destinationCount = useMemo(
    () => destinations.length,
    [destinations.length]
  )

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Heart className="h-8 w-8" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">
              Wishlist
            </h1>
            <p className="text-muted-foreground">
              {destinationCount} {destinationCount === 1 ? 'lugar' : 'lugares'}{' '}
              no seu radar
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger>
            <Button
              size="lg"
              className="rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="mr-2 h-5 w-5" /> Adicionar Destino
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDestination ? 'Editar Destino' : 'Novo Destino'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={formData.country} onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas e Dicas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Adicione suas observações..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                {editingDestination ? 'Atualizar' : 'Adicionar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {destinationCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />

          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            Nenhum destino ainda
          </h2>

          <p className="text-muted-foreground">
            Comece adicionando seus destinos dos sonhos!
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

const DestinationCard = memo<DestinationCardProps>(
  ({ destination, onEdit, onDelete }) => {
    const handleEdit = useCallback(
      () => onEdit(destination),
      [onEdit, destination]
    )
    const handleDelete = useCallback(
      () => onDelete(destination.id),
      [onDelete, destination.id]
    )

    return (
      <motion.li
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={destination.imageUrl || DEFAULT_IMAGE_URL}
            alt={destination.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute right-3 top-12 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 cursor-pointer"
              onClick={handleEdit}
              aria-label={`Editar ${destination.name}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 cursor-pointer"
              onClick={handleDelete}
              aria-label={`Remover ${destination.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 p-4 text-white">
            <h3 className="font-display text-lg font-bold leading-tight">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <MapPin className="h-3 w-3" />
              {destination.country}
            </div>
          </div>
        </div>
        {destination.notes && (
          <div className="p-3 text-sm text-muted-foreground line-clamp-2 italic">
            "{destination.notes}"
          </div>
        )}
      </motion.li>
    )
  }
)
