import { Users, DollarSign, Package, Truck, CreditCard, Activity, PlusCircle, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { API_BASE_URL } from '../config';


export default function Dashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);

            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        }
    });

    const kpis = [
        { title: 'Total Customers', value: isLoading ? '...' : stats?.totalCustomers || '0', icon: Users, trend: '+4.5%' },
        { title: 'Active Customers', value: isLoading ? '...' : stats?.activeCustomers || '0', icon: Activity, trend: '+2.1%' },
        { title: 'Total Revenue', value: isLoading ? '...' : `$${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, trend: '+12.5%' },
        { title: 'Pending Orders', value: isLoading ? '...' : stats?.pendingOrders || '0', icon: Package, trend: '-2' },
        { title: 'Today’s Deliveries', value: '315', icon: Truck, trend: '' }, // still mock
        { title: 'Pending Payments', value: '$1,200', icon: CreditCard, trend: '+3' }, // still mock
    ];

    const quickActions = [
        { label: 'Add New Customer', icon: PlusCircle, color: 'bg-primary text-white' },
        { label: 'Manage Deliveries', icon: Truck, color: 'bg-gray-100 hover:bg-gray-200' },
        { label: 'View Daily Items', icon: Package, color: 'bg-gray-100 hover:bg-gray-200' },
        { label: 'Shopify Orders', icon: ShoppingBag, color: 'bg-gray-100 hover:bg-gray-200' },
    ];

    const recentActivity = [
        { user: 'Admin', action: 'Approved order #40921', time: '10 mins ago' },
        { user: 'System', action: 'Auto-assigned 315 deliveries', time: '1 hr ago' },
        { user: 'Sarah J.', action: 'Paused subscription plan (Vacation)', time: '2 hrs ago' },
        { user: 'Admin', action: 'Added new meal plan: Keto Standard', time: '4 hrs ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                    <p className="text-gray-500">Overview of your business metrics</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="shadow-sm border-gray-200 rounded-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">{kpi.title}</CardTitle>
                            <kpi.icon className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text">{kpi.value}</div>
                            {kpi.trend && (
                                <p className={`text-xs mt-1 ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {kpi.trend} from last month
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, idx) => (
                            <Button key={idx} variant="outline" className={`h-24 flex flex-col items-center justify-center space-y-2 rounded-card shadow-sm border-gray-200 transition-colors ${action.color}`}>
                                <action.icon className="w-6 h-6" />
                                <span className="font-medium">{action.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text">System Health</h2>
                    <Card className="rounded-card shadow-sm border-gray-200">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Shopify Sync</span>
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Connected
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Stripe Payments</span>
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Healthy
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Database Load</span>
                                <div className="flex items-center text-yellow-600 text-sm font-medium">
                                    <Activity className="w-4 h-4 mr-1" />
                                    Moderate (45%)
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Email Delivery</span>
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Operational
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text">Recent Activity</h2>
                    <Card className="rounded-card shadow-sm border-gray-200">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                        <div>
                                            <p className="text-sm font-medium text-text">{activity.user}</p>
                                            <p className="text-xs text-gray-500">{activity.action}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
