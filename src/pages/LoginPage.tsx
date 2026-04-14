import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/RestaurantContext';
import { UserRole } from '@/types/restaurant';
import { UtensilsCrossed, ChefHat, Monitor, BarChart3, Crown, User } from 'lucide-react';
import { sectionLabels } from '@/data/mockData';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { role: 'waiter', label: 'Waiter', icon: <User className="w-8 h-8" />, description: 'Take orders, manage tables', color: 'from-blue-500 to-blue-700' },
  { role: 'chef', label: 'Chef', icon: <ChefHat className="w-8 h-8" />, description: 'Monitor all orders & dishes', color: 'from-orange-500 to-red-600' },
  { role: 'kitchen', label: 'Kitchen', icon: <UtensilsCrossed className="w-8 h-8" />, description: 'Section-wise order management', color: 'from-green-500 to-emerald-700' },
  { role: 'manager', label: 'Manager', icon: <BarChart3 className="w-8 h-8" />, description: 'Track orders & payments', color: 'from-purple-500 to-purple-700' },
  { role: 'owner', label: 'Owner', icon: <Crown className="w-8 h-8" />, description: 'Revenue & business insights', color: 'from-amber-500 to-amber-700' },
];

const sections = Object.entries(sectionLabels);

const LoginPage = () => {
  const { login } = useRestaurant();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showSections, setShowSections] = useState(false);

  const handleRoleClick = (role: UserRole) => {
    if (role === 'kitchen') {
      setSelectedRole(role);
      setShowSections(true);
    } else {
      login(role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-4"
          >
            <UtensilsCrossed className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">RestroFlow</h1>
          <p className="text-muted-foreground text-lg">Restaurant Management System</p>
        </div>

        {!showSections ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r, i) => (
              <motion.button
                key={r.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleRoleClick(r.role)}
                className="glass-card p-6 text-left hover:glow-border transition-all duration-300 group cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${r.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {r.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">{r.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setShowSections(false)} className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2">
              ← Back to roles
            </button>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Select Kitchen Section</h2>
            <div className="grid grid-cols-2 gap-4">
              {sections.map(([key, label]) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => login('kitchen', key)}
                  className="glass-card p-5 hover:glow-border transition-all cursor-pointer"
                >
                  <h3 className="font-heading font-semibold text-foreground">{label}</h3>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
