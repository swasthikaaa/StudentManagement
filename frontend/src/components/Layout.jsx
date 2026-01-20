import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast'; // Assuming we might add toast notifications later

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen text-white font-sans selection:bg-primary selection:text-white">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
