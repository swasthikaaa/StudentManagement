import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProgression = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/applications');
            setApplications(data);
        } catch (error) {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const remarks = status === 'Rejected' ? prompt("Enter rejection reason:") : "";
            if (status === 'Rejected' && remarks === null) return;

            const { data } = await api.put(`/applications/${id}/status`, { status, remarks });

            setApplications(applications.map(app => app._id === id ? { ...app, status: data.status, remarks: data.remarks } : app));

            const targetApp = applications.find(a => a._id === id);
            toast.success(`Application for ${targetApp?.studentId?.name || 'Student'} ${status.toLowerCase()}`);

            if (status === 'Approved') {
                toast.success(`${targetApp?.studentId?.name || 'Student'} has been promoted!`);
                fetchApplications(); // Refresh list to get updated data if needed
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.studentId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.studentId?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-main">Progression Requests</h1>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="form-input pl-10 py-2 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-input py-2 text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Applying For</th>
                                <th>Date Submitted</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : filteredApps.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-text-muted">No progression requests found.</td></tr>
                            ) : filteredApps.map(app => (
                                <tr key={app._id}>
                                    <td>
                                        <div className="font-bold text-text-main">{app.studentId?.name}</div>
                                        <div className="text-xs text-text-muted font-mono">{app.studentId?.studentId}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{app.targetSemester}</span>
                                    </td>
                                    <td className="text-sm text-text-muted">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge ${app.status === 'Approved' ? 'badge-success' :
                                            app.status === 'Rejected' ? 'badge-error' :
                                                'badge-warning'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        {app.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-text-muted italic">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProgression;
