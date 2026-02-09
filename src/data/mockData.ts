import type { Destination } from "../types/travel";

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Tóquio',
    country: 'Japão',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    notes: 'Visitar durante a época das cerejeiras',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Grécia',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Maldivas',
    country: 'Maldivas',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
    createdAt: new Date('2024-04-05'),
  },
];
