import { useRestaurant } from '@/context/RestaurantContext';
import LoginPage from '@/pages/LoginPage';
import WaiterDashboard from '@/pages/WaiterDashboard';
import ChefDashboard from '@/pages/ChefDashboard';
import KitchenDashboard from '@/pages/KitchenDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import OwnerDashboard from '@/pages/OwnerDashboard';

const Index = () => {
  const { currentUser } = useRestaurant();

  if (!currentUser) return <LoginPage />;

  switch (currentUser.role) {
    case 'waiter': return <WaiterDashboard />;
    case 'chef': return <ChefDashboard />;
    case 'kitchen': return <KitchenDashboard />;
    case 'manager': return <ManagerDashboard />;
    case 'owner': return <OwnerDashboard />;
    default: return <LoginPage />;
  }
};

export default Index;
