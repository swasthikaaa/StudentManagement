import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { Menu, X, LayoutDashboard, BookOpen, Clock, User, DollarSign } from 'lucide-react';

const StudentLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-bg-main text-text-main">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Controlled by state on mobile, always visible on desktop */}
            <div className={`fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:block`}>
                <StudentSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen flex flex-col min-w-0">
                {/* Mobile Top Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-sm">S</div>
                        <span className="font-bold text-lg tracking-tight">Portal</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer for symmetry */}
                </header>

                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10">
                        <div className="hidden md:flex justify-end">
                            <Navbar />
                        </div>
                        {/* Mobile Navbar placement */}
                        <div className="md:hidden flex justify-end -mt-2 mb-4">
                            <Navbar />
                        </div>

                        {children}
                    </div>
                </div>
            </main>

            <Toaster position="top-right" />
        </div>
    );
};

export default StudentLayout;

export default StudentLayout;
