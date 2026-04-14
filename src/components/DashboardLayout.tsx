import { useRestaurant } from '@/context/RestaurantContext';
import { LogOut, UtensilsCrossed } from 'lucide-react';
import { UserRole } from '@/types/restaurant';

const roleColors: Record<UserRole, string> = {
  waiter: 'bg-blue-500/20 text-blue-400',
  chef: 'bg-orange-500/20 text-orange-400',
  kitchen: 'bg-green-500/20 text-green-400',
  manager: 'bg-purple-500/20 text-purple-400',
  owner: 'bg-amber-500/20 text-amber-400',
};

const DashboardLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const { currentUser, logout } = useRestaurant();
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${roleColors[currentUser.role]}`}>
              {currentUser.role}
            </span>
            <span className="text-sm text-muted-foreground">{currentUser.name}</span>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
