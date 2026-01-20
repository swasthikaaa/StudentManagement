import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Clock, Award, Download, ArrowUp, ArrowDown, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, colorClass, change }) => (
    <div className="card p-6 flex items-start justify-between hover:shadow-lg transition-shadow">
        <div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-text-main mb-2">{value}</h3>
            {change && (
                <div className={`flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                    <span>{Math.abs(change)}% from last month</span>
                </div>
            )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        graduatedStudents: 0,
        averageAge: 0
    });

    const data = [
        { name: 'Jan', students: 40 },
        { name: 'Feb', students: 30 },
        { name: 'Mar', students: 20 },
        { name: 'Apr', students: 27 },
        { name: 'May', students: 18 },
        { name: 'Jun', students: 23 },
        { name: 'Jul', students: 34 },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/students');
            const total = data.length;
            const active = data.filter(s => s.status === 'Active').length;
            const graduated = data.filter(s => s.status === 'Graduated').length;
            const avgAge = total > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.age, 0) / total) : 0;

            setStats({
                totalStudents: total,
                activeStudents: active,
                graduatedStudents: graduated,
                averageAge: avgAge
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const downloadReport = () => {
        try {
            if (!data || data.length === 0) {
                toast.error("No data available to export");
                return;
            }

            const doc = new jsPDF();

            const tableColumn = ["Month", "New Enrollments"];
            const tableRows = data.map(item => [item.name, item.students]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
                styles: { fontSize: 10, cellPadding: 5 },
                didDrawPage: function (data) {
                    // Header
                    doc.setFontSize(20);
                    doc.setTextColor(30, 41, 59);
                    doc.text("Enrollment Report", 14, 22);

                    // Date
                    doc.setFontSize(10);
                    doc.setTextColor(100, 116, 139);
                    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
                }
            });

            doc.save("enrollment_report.pdf");
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export report");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Dashboard Overview</h1>
                    <p className="text-text-muted text-sm mt-1">Welcome back, Administrator</p>
                </div>
                <button onClick={downloadReport} className="btn-secondary">
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    colorClass="bg-pink-100 text-pink-600"
                    change={12}
                />
                <StatCard
                    title="Active Students"
                    value={stats.activeStudents}
                    icon={Clock}
                    colorClass="bg-blue-100 text-blue-600"
                    change={-2}
                />
                <StatCard
                    title="Graduates"
                    value={stats.graduatedStudents}
                    icon={GraduationCap}
                    colorClass="bg-purple-100 text-purple-600"
                />
                <StatCard
                    title="Average Age"
                    value={stats.averageAge}
                    icon={Award}
                    colorClass="bg-green-100 text-green-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-text-main">Enrollment Trends</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="students" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={'#4F46E5'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-bold text-text-main mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/admin/students" className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                                    <Users size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-text-main">Manage Students</p>
                                    <p className="text-xs text-text-light">View all records</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/students/add" className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
                                    <UserPlus size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-text-main">Add New Student</p>
                                    <p className="text-xs text-text-light">Create profile</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
