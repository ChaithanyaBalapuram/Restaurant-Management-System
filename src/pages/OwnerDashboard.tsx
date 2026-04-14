import { useMemo } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import DashboardLayout from '@/components/DashboardLayout';
import { mockRevenue } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, AlertCircle, Star } from 'lucide-react';

const COLORS = ['hsl(36, 95%, 54%)', 'hsl(142, 71%, 45%)', 'hsl(217, 91%, 60%)', 'hsl(280, 67%, 60%)'];

const OwnerDashboard = () => {
  const { orders } = useRestaurant();

  const stats = useMemo(() => {
    const todayRev = mockRevenue[mockRevenue.length - 1];
    const yesterdayRev = mockRevenue[mockRevenue.length - 2];
    const change = todayRev && yesterdayRev ? ((todayRev.revenue - yesterdayRev.revenue) / yesterdayRev.revenue * 100) : 0;
    const monthTotal = mockRevenue.slice(-30).reduce((s, d) => s + d.revenue, 0);
    const complaints = orders.filter(o => o.complaint).length;
    const compliments = orders.filter(o => o.compliment).length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;

    const paymentBreakdown = [
      { name: 'Cash', value: mockRevenue.slice(-7).reduce((s, d) => s + d.cashPayments, 0) },
      { name: 'Card', value: mockRevenue.slice(-7).reduce((s, d) => s + d.cardPayments, 0) },
      { name: 'Online', value: mockRevenue.slice(-7).reduce((s, d) => s + d.onlinePayments, 0) },
    ];

    // Unavailable dishes times
    const dishActivity = orders.flatMap(o =>
      o.items.filter(i => i.status === 'cancelled').map(i => ({ dish: i.dishName, time: o.createdAt }))
    );

    return { todayRev: todayRev?.revenue || 0, change, monthTotal, complaints, compliments, cancelled, paymentBreakdown, dishActivity };
  }, [orders]);

  const weeklyData = mockRevenue.slice(-7).map(d => ({
    day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    revenue: d.revenue,
    orders: d.orderCount,
  }));

  const monthlyData = mockRevenue.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
  }));

  return (
    <DashboardLayout title="Owner Dashboard">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card p-5">
          <span className="text-sm text-muted-foreground">Today's Revenue</span>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">₹{stats.todayRev.toLocaleString()}</p>
          <span className={`text-sm flex items-center gap-1 mt-1 ${stats.change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {stats.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(stats.change).toFixed(1)}% vs yesterday
          </span>
        </div>
        <div className="glass-card p-5">
          <span className="text-sm text-muted-foreground">Monthly Revenue</span>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">₹{(stats.monthTotal / 1000).toFixed(0)}K</p>
        </div>
        <div className="glass-card p-5">
          <span className="text-sm text-muted-foreground">Compliments / Complaints</span>
          <p className="text-3xl font-heading font-bold text-foreground mt-1 flex items-center gap-3">
            <span className="text-success flex items-center gap-1"><Star className="w-5 h-5" />{stats.compliments}</span>
            <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-5 h-5" />{stats.complaints}</span>
          </p>
        </div>
        <div className="glass-card p-5">
          <span className="text-sm text-muted-foreground">Cancelled Orders</span>
          <p className="text-3xl font-heading font-bold text-destructive mt-1">{stats.cancelled}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Revenue Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', color: 'hsl(40, 20%, 95%)' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(36, 95%, 54%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {stats.paymentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', color: 'hsl(40, 20%, 95%)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(220, 10%, 55%)' }} />
              <YAxis tick={{ fill: 'hsl(220, 10%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', color: 'hsl(40, 20%, 95%)' }} />
              <Bar dataKey="revenue" fill="hsl(36, 95%, 54%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Customer Feedback</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {orders.filter(o => o.compliment || o.complaint).map(order => (
              <div key={order.id} className={`p-3 rounded-lg ${order.complaint ? 'bg-destructive/10 border border-destructive/20' : 'bg-success/10 border border-success/20'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{order.id} · Table {order.tableNumber}</span>
                  <span className={`text-xs ${order.complaint ? 'text-destructive' : 'text-success'}`}>
                    {order.complaint ? 'Complaint' : 'Compliment'}
                  </span>
                </div>
                <p className="text-sm text-foreground">{order.complaint || order.compliment}</p>
              </div>
            ))}
            {orders.filter(o => o.compliment || o.complaint).length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No feedback yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
