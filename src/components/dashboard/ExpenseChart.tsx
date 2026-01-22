import { motion } from 'framer-motion';
import type { PlannedTrip } from '../../types/travel';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ReactNode } from 'react';

interface ExpenseChartProps {
  trips: PlannedTrip[];
}

const COLORS = {
  accommodation: 'hsl(168, 84%, 35%)',
  transportation: 'hsl(210, 90%, 55%)',
  attractions: 'hsl(25, 95%, 55%)',
  food: 'hsl(270, 70%, 60%)',
  other: 'hsl(150, 70%, 45%)',
};

const LABELS = {
  accommodation: 'Hospedagem',
  transportation: 'Transporte',
  attractions: 'Atrações',
  food: 'Alimentação',
  other: 'Outros',
};

export default function ExpenseChart({ trips }: ExpenseChartProps) {
  // Aggregate all expenses by category
  const expensesByCategory = trips.reduce((acc, trip) => {
    trip.expenses.forEach(expense => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    });
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: LABELS[category as keyof typeof LABELS] || category,
    value,
    color: COLORS[category as keyof typeof COLORS] || '#888',
  }));

  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
      >
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
          Gastos por Categoria
        </h3>
        <p className="py-12 text-center text-muted-foreground">
          Nenhum gasto registrado
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Gastos por Categoria
        </h3>
        <span className="font-display text-2xl font-bold text-primary">
          €{totalExpenses.toLocaleString()}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => value ? `€${value.toLocaleString()}` : '€0'}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-card)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: ReactNode) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
