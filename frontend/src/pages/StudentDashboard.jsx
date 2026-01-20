import React from 'react';
import { DollarSign, Calendar, TrendingUp, AlertCircle, Download, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

const Card = ({ title, children, className = '' }) => (
    <div className={`card p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">{title}</h3>
        </div>
        {children}
    </div>
);

const StudentDashboard = () => {

    const downloadStatement = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text("Financial Statement", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.text(`Student ID: STU-2024-001`, 14, 33);

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("Outstanding Balance: LKR 1,250.00", 14, 45);

        doc.setLineWidth(0.5);
        doc.line(14, 50, 196, 50);

        doc.setFontSize(12);
        doc.text("Transaction History", 14, 60);

        const transactions = [
            { date: '2024-01-15', desc: 'Tuition Fee - Semester 1', amount: 'LKR 2,500.00' },
            { date: '2024-01-20', desc: 'Payment Received', amount: '-LKR 1,250.00' },
        ];

        let y = 70;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        transactions.forEach(t => {
            doc.text(`${t.date} - ${t.desc}`, 14, y);
            doc.text(t.amount, 180, y, { align: 'right' });
            y += 10;
        });

        doc.save("finance_statement.pdf");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-main">My Overview</h1>
                <span className="text-sm text-text-muted">{new Date().toDateString()}</span>
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
                            <h2 className="text-2xl font-bold text-text-main">Rs. 1,250.00</h2>
                        </div>
                    </div>
                    <button onClick={downloadStatement} className="btn-secondary w-full text-xs">
                        <Download size={14} />
                        <span>Download Statement</span>
                    </button>
                </Card>

                {/* Timetable/Next Class */}
                <Card title="Next Class">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-text-main">Data Structures</p>
                            <p className="text-sm text-text-muted">10:00 AM - Lab 304</p>
                        </div>
                    </div>
                    <div className="text-xs text-text-light border-t border-slate-100 pt-3">
                        <span className="font-semibold text-primary-light">Up Next:</span> Web Development (1:00 PM)
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
                            <span className="badge badge-warning">Pending Review</span>
                        </div>
                    </div>
                    <p className="text-xs text-text-muted mb-4 leading-relaxed">
                        Your application for <strong>Semester 2, 2024</strong> has been submitted and is currently being reviewed by the administration.
                    </p>
                    <Link to="/portal/progression" className="btn-primary w-full text-xs py-2">View Details</Link>
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
                            {[
                                { sub: 'Algorithms & Complexity', code: 'CS301', grade: 'A', score: '92%' },
                                { sub: 'Database Systems', code: 'CS302', grade: 'B+', score: '88%' },
                                { sub: 'Linear Algebra', code: 'MATH201', grade: 'A-', score: '89%' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                            <BookOpen size={16} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-text-main">{item.sub}</p>
                                            <p className="text-xs text-text-light">{item.code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-text-main block">{item.grade}</span>
                                        <span className="text-xs text-text-muted">{item.score}</span>
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
                            {[
                                { msg: 'Library books due tomorrow', time: '2h ago', type: 'alert' },
                                { msg: 'New assignment posted in Web Dev', time: '5h ago', type: 'info' },
                                { msg: 'Campus closed for maintenance', time: '1d ago', type: 'info' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <AlertCircle size={18} className={`mt-0.5 ${item.type === 'alert' ? 'text-red-500' : 'text-blue-500'}`} />
                                    <div>
                                        <p className="text-sm text-text-main font-medium leading-snug">{item.msg}</p>
                                        <p className="text-xs text-text-light mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-xs text-text-muted hover:text-text-main text-center">View All Notifications</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
