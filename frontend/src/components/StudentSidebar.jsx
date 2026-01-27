import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, User, LogOut, DollarSign } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const StudentSidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
        { name: 'Academics', path: '/portal/academics', icon: BookOpen },
        { name: 'Progression', path: '/portal/progression', icon: Clock },
        { name: 'Finance', path: '/portal/finance', icon: DollarSign },
        { name: 'Profile', path: '/portal/profile', icon: User },
    ];

    return (
        <div className="h-screen w-64 fixed left-0 top-0 z-50 bg-primary-dark text-white hidden md:flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-secondary/30">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'S'
                        )}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">StudentPortal</h1>
                        <p className="text-xs text-slate-400">Welcome, {user?.name?.split(' ')[0]}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-secondary text-white shadow-md font-medium'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon size={20} className={({ isActive }) => isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
