import type { Destination, PlannedTrip } from "../types/travel";

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Tóquio',
    country: 'Japão',
    countryCode: 'JP',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    notes: 'Visitar durante a época das cerejeiras',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Grécia',
    countryCode: 'GR',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    countryCode: 'PE',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Maldivas',
    country: 'Maldivas',
    countryCode: 'MV',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
    createdAt: new Date('2024-04-05'),
  },
];

export const mockPlannedTrips: PlannedTrip[] = [
  {
    id: '1',
    destination: 'Lisboa',
    country: 'Portugal',
    countryCode: 'PT',
    imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-22'),
    status: 'booked',
    budget: 2500,
    currency: 'EUR',
    expenses: [
      { id: 'e1', category: 'accommodation', description: 'Hotel em Alfama', amount: 800, currency: 'EUR', date: new Date('2024-12-01') },
      { id: 'e2', category: 'transportation', description: 'Voo ida e volta', amount: 450, currency: 'EUR', date: new Date('2024-12-01') },
      { id: 'e3', category: 'attractions', description: 'Torre de Belém + Jerónimos', amount: 50, currency: 'EUR', date: new Date('2024-12-05') },
    ],
    itinerary: [
      {
        id: 'd1',
        date: new Date('2025-03-15'),
        activities: [
          { id: 'a1', period: 'morning', title: 'Chegada ao aeroporto', location: 'Aeroporto de Lisboa', time: '10:00' },
          { id: 'a2', period: 'afternoon', title: 'Check-in e passeio em Alfama', location: 'Alfama' },
          { id: 'a3', period: 'evening', title: 'Jantar com Fado', location: 'Bairro Alto', time: '20:00' },
        ],
      },
    ],
    notes: 'Lembrar de reservar o restaurante de Fado',
  },
  {
    id: '2',
    destination: 'Barcelona',
    country: 'Espanha',
    countryCode: 'ES',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop',
    startDate: new Date('2025-06-10'),
    endDate: new Date('2025-06-17'),
    status: 'planning',
    budget: 3000,
    currency: 'EUR',
    expenses: [
      { id: 'e4', category: 'transportation', description: 'Voo ida', amount: 180, currency: 'EUR', date: new Date('2024-11-20') },
    ],
    itinerary: [],
    notes: 'Verificar ingressos para Sagrada Família',
  },
];
