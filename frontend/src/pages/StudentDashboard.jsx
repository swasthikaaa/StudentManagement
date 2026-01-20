import React, { useState, useEffect, useContext } from 'react';
import { DollarSign, Calendar, TrendingUp, AlertCircle, Download, BookOpen, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Card = ({ title, children, className = '' }) => (
    <div className={`card p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">{title}</h3>
        </div>
        {children}
    </div>
);

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [financeData, setFinanceData] = useState({ balance: 0, history: [] });
    const [upcomingClass, setUpcomingClass] = useState(null);
    const [progression, setProgression] = useState(null);
    const [recentGrades, setRecentGrades] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [paymentsRes, appsRes, gradesRes, timetableRes] = await Promise.all([
                    api.get('/payments/history'),
                    api.get('/applications/my'),
                    api.get('/grades'),
                    api.get('/timetable')
                ]);

                // Finance Logic (Simplified: Total Fee 50000 - Payments)
                const totalPaid = paymentsRes.data.reduce((acc, p) => acc + p.amount, 0);
                const totalDue = 50000; // Mock base fee for semester
                setFinanceData({
                    balance: Math.max(0, totalDue - totalPaid),
                    history: paymentsRes.data
                });

                // Progression Logic
                setProgression(appsRes.data[0] || null);

                // Grades Logic
                const myGrades = gradesRes.data
                    .filter(g => g.studentId === user.studentProfile || g.studentId?._id === user.studentProfile)
                    .slice(0, 3);
                setRecentGrades(myGrades);

                // Timetable Logic (Find tomorrow's or today's next class)
                const mySem = user.semester || 'Semester 1';
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const myClasses = timetableRes.data.filter(t => t.semester === mySem && t.day === today);
                setUpcomingClass(myClasses[0] || null);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
                toast.error("Some dashboard data failed to load");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    const downloadStatement = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text("Financial Statement", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.text(`Student: ${user.name}`, 14, 33);
        doc.text(`ID: ${user.studentId || user._id}`, 14, 38);

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text(`Outstanding Balance: LKR ${financeData.balance.toLocaleString()}`, 14, 50);

        doc.setLineWidth(0.5);
        doc.line(14, 55, 196, 55);

        doc.setFontSize(12);
        doc.text("Payment History", 14, 65);

        let y = 75;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        financeData.history.forEach(t => {
            doc.text(`${new Date(t.date).toLocaleDateString()} - ${t.description}`, 14, y);
            doc.text(`LKR ${t.amount.toLocaleString()}`, 180, y, { align: 'right' });
            y += 10;
        });

        doc.save("finance_statement.pdf");
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-text-muted animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-text-muted text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Finance Card */}
                <Card title="Finances">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Outstanding Balance</p>
                            <h2 className="text-2xl font-bold text-text-main">
                                LKR {financeData.balance.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                    <button onClick={downloadStatement} className="btn-secondary w-full text-xs">
                        <Download size={14} />
                        <span>Download Statement</span>
                    </button>
                </Card>

                {/* Timetable/Next Class */}
                <Card title="Next Class Today">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar size={24} />
                        </div>
                        {upcomingClass ? (
                            <div>
                                <p className="text-lg font-bold text-text-main truncate w-40">{upcomingClass.subject}</p>
                                <p className="text-sm text-text-muted">{upcomingClass.startTime} - {upcomingClass.location}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg font-bold text-text-main">No classes today</p>
                                <p className="text-sm text-text-muted">Enjoy your free time!</p>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-text-light border-t border-slate-100 pt-3">
                        <Link to="/portal/academics" className="font-semibold text-primary-light hover:underline">View Full Timetable →</Link>
                    </div>
                </Card>

                {/* Progression Status */}
                <Card title="Progression">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Enrolment Status</p>
                            <span className={`badge ${progression?.status === 'Approved' ? 'badge-success' :
                                progression?.status === 'Rejected' ? 'badge-error' :
                                    'badge-warning'
                                }`}>
                                {progression?.status || 'No Active Application'}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-text-muted mb-4 leading-relaxed line-clamp-2">
                        {progression
                            ? `Your application for ${progression.targetSemester} is ${progression.status.toLowerCase()}.`
                            : "You haven't submitted a progression application for the next semester yet."}
                    </p>
                    <Link to="/portal/progression" className="btn-primary w-full text-xs py-2 text-center">
                        {progression ? 'View Progress' : 'Apply Now'}
                    </Link>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-0">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-text-main">Recent Grades</h3>
                        <Link to="/portal/academics" className="text-xs font-medium text-primary-light hover:underline">View All</Link>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentGrades.length === 0 ? (
                                <div className="text-center py-8 text-text-muted">
                                    <BookOpen size={48} className="mx-auto opacity-10 mb-2" />
                                    <p>No grades recorded yet.</p>
                                </div>
                            ) : recentGrades.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                            <BookOpen size={16} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-text-main">{item.subject}</p>
                                            <p className="text-xs text-text-light">{item.code} • {item.semester}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-text-main block">{item.grade}</span>
                                        <span className="text-xs text-text-muted">{item.score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card p-0">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-text-main">Notifications</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {progression && progression.status === 'Approved' && (
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-main font-medium leading-snug">Progression Approved!</p>
                                        <p className="text-xs text-text-light mt-1">Please pay your semester fee.</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 items-start">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                    <AlertCircle size={16} />
                                </div>
                                <div>
                                    <p className="text-sm text-text-main font-medium leading-snug">New Semester Started</p>
                                    <p className="text-xs text-text-light mt-1">Check your updated timetable.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 text-xs text-text-muted hover:text-text-main text-center">View Dashboard Guidance</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
