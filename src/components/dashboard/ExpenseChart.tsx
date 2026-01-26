import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import type { PlannedTrip } from '../../types/travel';
import { calculateExpenseData } from '../../lib/utils';

interface ExpenseChartProps {
  trips: PlannedTrip[];
}

const CATEGORY_LABELS = {
  accommodation: 'Hospedagem',
  transportation: 'Transporte',
  attractions: 'Atrações',
  food: 'Alimentação',
  other: 'Outros',
} as const;

const CATEGORY_COLORS = {
  accommodation: 'var(--color-stat-sage)',
  transportation: 'var(--color-stat-navy)',
  attractions: 'var(--color-stat-amber)',
  food: 'var(--color-stat-terracotta)',
  other: 'var(--color-muted-foreground)',
} as const;

type Category = keyof typeof CATEGORY_LABELS;

interface ChartDataItem {
  category: Category;
  value: number;
  fill: string;
}

const currency = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});

export default function ExpenseChart({ trips }: ExpenseChartProps) {
  const data: ChartDataItem[] = useMemo(() => {
    return calculateExpenseData(trips).map(item => ({
      category: item.category as Category,
      value: item.value,
      fill: CATEGORY_COLORS[item.category as Category],
    }));
  }, [trips]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) return <EmptyState />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-semibold">Gastos por Categoria</h3>
          <p className="text-sm text-muted-foreground">
            Distribuição total de custos
          </p>
        </div>

        <div className="text-right">
          <span className="block text-xs uppercase text-muted-foreground">
            Total
          </span>
          <span className="text-2xl font-bold text-primary">
            {currency.format(total)}
          </span>
        </div>
      </header>

      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
            />

            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const { category, value } = payload[0].payload as ChartDataItem;

                return (
                  <div className="bg-popover border p-3 rounded-xl shadow">
                    <p className="text-xs uppercase text-muted-foreground">
                      {CATEGORY_LABELS[category]}
                    </p>
                    <p className="font-bold">
                      {currency.format(value)}
                    </p>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="bottom"
              content={({ payload }) => (
                <ul className="flex flex-wrap justify-center gap-4 mt-6">
                  {payload?.map(entry => {
                    if (typeof entry.value !== 'string') return null;
                    const category = entry.value as Category;

                    return (
                      <li
                        key={category}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        {CATEGORY_LABELS[category]}
                      </li>
                    );
                  })}
                </ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-dashed flex flex-col items-center text-center">
      <span className="text-2xl mb-2">📊</span>
      <h3 className="font-semibold">Sem dados de gastos</h3>
      <p className="text-sm text-muted-foreground">
        Adicione despesas às viagens para visualizar o gráfico.
      </p>
    </div>
  );
}
