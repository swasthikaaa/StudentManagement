import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Academics from './pages/Academics';
import Progression from './pages/Progression';
import Profile from './pages/Profile';
import AdminGrades from './pages/AdminGrades';
import AdminResults from './pages/AdminResults';
import AdminProgression from './pages/AdminProgression';
import AdminTimetable from './pages/AdminTimetable';

import AdminFinance from './pages/AdminFinance';
import StudentFinance from './pages/StudentFinance';
import AuthContext from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard'} replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRole="admin">
                    <AdminLayout>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="students" element={<Students />} />
                            <Route path="students/add" element={<StudentForm />} />
                            <Route path="students/edit/:id" element={<StudentForm />} />
                            <Route path="timetable" element={<AdminTimetable />} />
                            <Route path="grades" element={<AdminGrades />} />
                            <Route path="results" element={<AdminResults />} />
                            <Route path="progression" element={<AdminProgression />} />
                            <Route path="finance" element={<AdminFinance />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </AdminLayout>
                </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/portal/*" element={
                <ProtectedRoute allowedRole="student">
                    <StudentLayout>
                        <Routes>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="academics" element={<Academics />} />
                            <Route path="progression" element={<Progression />} />
                            <Route path="finance" element={<StudentFinance />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </StudentLayout>
                </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
