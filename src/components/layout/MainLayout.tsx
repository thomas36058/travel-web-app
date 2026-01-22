import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <main className={cn(
        "min-h-screen p-8 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        {children}
      </main>
    </div>
  );
}
