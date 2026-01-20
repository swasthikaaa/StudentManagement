import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut, ChevronLeft, GraduationCap, ClipboardList, DollarSign, Calendar, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'All Students', path: '/admin/students', icon: Users },
        { name: 'Enroll Student', path: '/admin/students/add', icon: UserPlus },
        { name: 'Timetable', path: '/admin/timetable', icon: Calendar },
        { name: 'Grades', path: '/admin/grades', icon: GraduationCap },
        { name: 'Results', path: '/admin/results', icon: ClipboardList },
        { name: 'Progression', path: '/admin/progression', icon: Clock },
        { name: 'Finance', path: '/admin/finance', icon: DollarSign },
    ];

    return (
        <div className="h-screen w-64 fixed left-0 top-0 z-50 bg-primary-dark text-white flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-secondary/30">
                        A
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">AdminPortal</h1>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin/students'} // Only exact match for list to avoid active state on sub-routes if needed, or adjust logic
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-secondary text-white shadow-md font-medium'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon size={20} className={({ isActive }) => isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                        <span>{item.name}</span>
                        {/* Active Indicator */}
                        {/* {isActive && <ChevronLeft size={16} className="ml-auto" />} */}
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

export default Sidebar;
