import React, { useContext, useState } from 'react';
import { Bell } from 'lucide-react';
import SocketContext from '../context/SocketContext';

const Navbar = () => {
    const { notifications, markAsRead } = useContext(SocketContext) || { notifications: [], markAsRead: () => { } };
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex justify-end items-center gap-4 mb-6">
            {/* Notifications */}
            <div className="relative">
                <button
                    onClick={() => { setShowNotifications(!showNotifications); if (notifications.length > 0) markAsRead(); }}
                    className="p-2 rounded-full bg-slate-200 text-slate-800 relative transition-colors hover:bg-slate-300"
                    title="Notifications"
                >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden transform transition-all">
                        <div className="p-3 border-b border-slate-200 font-semibold text-text-main flex justify-between items-center">
                            <span>Notifications</span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-text-muted">{notifications.length} New</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-text-muted flex flex-col items-center gap-2">
                                    <Bell size={24} className="opacity-20" />
                                    <span>No new notifications</span>
                                </div>
                            ) : (
                                notifications.map((notif, index) => (
                                    <div key={index} className="p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm transition-colors">
                                        <p className="font-medium text-text-main">{notif.title}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{notif.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 text-right">{new Date().toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
