import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, Search, Filter, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminFinance = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments/all');
            setPayments(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch payments", error);
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const exportReport = () => {
        const doc = new jsPDF();
        doc.text("Financial Report", 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [['Date', 'Student', 'Course/ID', 'Semester', 'Description', 'Amount', 'Status']],
            body: filteredPayments.map(p => [
                new Date(p.date).toLocaleDateString(),
                p.studentName,
                `${p.course || 'N/A'} (${p.rollNumber || 'N/A'})`,
                p.semester || 'N/A',
                p.description,
                `LKR ${p.amount.toLocaleString()}`,
                p.status
            ]),
        });
        doc.save("financial_report.pdf");
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Financial Management</h1>
                    <p className="text-text-muted">Overview of all student payments</p>
                </div>
                <button onClick={exportReport} className="btn-primary flex items-center gap-2">
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-text-main">LKR {totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase">Transactions</p>
                        <h3 className="text-2xl font-bold text-text-main">{payments.length}</h3>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <Filter size={24} />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="card">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-main">Transaction History</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Student</th>
                                <th>Course / ID</th>
                                <th>Semester</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-8">Loading payments...</td></tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-8">No payments found.</td></tr>
                            ) : (
                                filteredPayments.map((payment, index) => (
                                    <tr key={payment._id || index}>
                                        <td className="text-xs">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td>
                                            <div className="font-medium text-text-main">{payment.studentName}</div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold">{payment.course || 'N/A'}</div>
                                            <div className="text-[10px] text-text-muted font-mono">{payment.rollNumber || 'No ID'}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-info text-[10px]">{payment.semester || 'N/A'}</span>
                                        </td>
                                        <td className="text-xs">{payment.description}</td>
                                        <td className="font-bold">LKR {payment.amount.toLocaleString()}</td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${payment.status === 'succeeded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;
