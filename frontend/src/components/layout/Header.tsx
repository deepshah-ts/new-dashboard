import { Search, Calendar, User, Store, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
            {/* Global Search */}
            <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search customers, orders..."
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
                {/* Store Switcher */}
                <select className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Store A</option>
                    <option>Store B</option>
                </select>
                {/* Date Range Picker (placeholder) */}
                <div className="flex items-center space-x-1">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <input type="date" className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <span>–</span>
                    <input type="date" className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                {/* User Avatar */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 cursor-pointer">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-sm text-gray-700">{user?.name || 'Admin'}</span>
                    </div>
                    <button onClick={logout} className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm bg-gray-100 hover:bg-red-50 px-2 py-1 border border-gray-200 hover:border-red-200 rounded-md transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
