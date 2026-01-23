import { 
  LayoutDashboard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plane
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { NavLink } from '../NavLink';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Plane, label: 'Viagens', path: '/trips' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        {!isCollapsed && (
          <span className="font-display text-xl font-bold text-foreground">
            Voyager
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isCollapsed && "justify-center px-2"
              )}
              activeClassName="bg-primary text-primary-foreground"
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-3 rounded-xl bg-muted p-3",
          isCollapsed && "justify-center p-2"
        )}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            V
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">Viajante</p>
              <p className="text-sm text-muted-foreground truncate">Plano Free</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted transition-colors"
        title={isCollapsed ? "Expandir" : "Recolher"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
