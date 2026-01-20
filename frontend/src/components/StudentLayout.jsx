import React from 'react';
import StudentSidebar from './StudentSidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const StudentLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-bg-main text-text-main pb-20">
            <StudentSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto space-y-8 pb-10">
                    <Navbar />
                    {children}
                </div>
            </main>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1E293B',
                        color: '#fff',
                        borderRadius: '8px',
                    }
                }}
            />
        </div>
    );
};

export default StudentLayout;
