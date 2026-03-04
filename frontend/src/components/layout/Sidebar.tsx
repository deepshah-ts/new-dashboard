import { Link, NavLink } from 'react-router-dom';
import { HomeIcon, UploadIcon, UsersIcon, CalendarIcon, ShoppingCartIcon, TruckIcon, SettingsIcon, BarChartIcon, RefreshCcwIcon, HelpCircleIcon } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Upload', path: '/upload', icon: UploadIcon },
    { name: 'Customers', path: '/customers', icon: UsersIcon },
    { name: 'Meal Plans', path: '/meal-plans', icon: CalendarIcon },
    { name: 'Shopify Orders', path: '/shopify-orders', icon: ShoppingCartIcon },
    { name: 'Daily Items', path: '/daily-items', icon: RefreshCcwIcon },
    { name: 'Connections', path: '/connections', icon: HelpCircleIcon },
    { name: 'Deliveries', path: '/deliveries', icon: TruckIcon },
    { name: 'Analytics', path: '/analytics', icon: BarChartIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#DE5200' }}>TiffinStash</h2>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-md hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-2" />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
