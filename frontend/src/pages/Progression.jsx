import React, { useState, useEffect, useContext } from 'react';
import { Send, CheckCircle, Clock, FileText, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Progression = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [hasPaid, setHasPaid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const [appsRes, paymentsRes] = await Promise.all([
                    api.get('/applications/my'),
                    api.get('/payments/history')
                ]);

                setApplications(appsRes.data);

                const latest = appsRes.data[0];
                if (latest && latest.status === 'Approved') {
                    // Check if there's a payment for this target semester
                    const paid = paymentsRes.data.some(p =>
                        p.semester === latest.targetSemester &&
                        (p.description.toLowerCase().includes('semester') || p.description.toLowerCase().includes('full'))
                    );
                    setHasPaid(paid);
                }
            } catch (error) {
                console.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []);

    const fetchApplications = async () => {
        // ... handled in loadPageData ...
    };

    const handleApply = async () => {
        setSubmitting(true);
        try {
            const currentSem = user.semester || 'Semester 1';
            const semNum = parseInt(currentSem.split(' ')[1]) || 1;
            const targetSemester = `Semester ${semNum + 1}`;

            const { data } = await api.post('/applications', { targetSemester });
            setApplications([data, ...applications]);
            toast.success('Application submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const latestApp = applications[0]; // Most recent
    const status = latestApp ? latestApp.status.toLowerCase() : 'pending';

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-text-main">Student Progression</h1>

            <div className="card p-4 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-text-main mb-2">Semester 2, 2024 Enrollment</h2>
                            <p className="text-text-muted leading-relaxed">
                                Applications are now open for the upcoming semester. Please review your details and confirm your intent to continue your studies.
                                Ensure all outstanding fees are cleared before applying.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Current Semester:</span>
                                <span className="font-medium text-text-main">{user.semester || 'Semester 1'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Eligibility:</span>
                                <span className="font-medium text-green-600">Eligible to Progress</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-4 text-text-muted italic">Checking status...</div>
                        ) : status === 'pending' && !latestApp ? (
                            <button
                                onClick={handleApply}
                                disabled={submitting}
                                className="btn-primary w-full md:w-auto mt-4"
                            >
                                {submitting ? 'Submitting...' : 'Start Application'}
                                {!submitting && <Send size={18} className="ml-2" />}
                            </button>
                        ) : status === 'pending' ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 text-blue-800">
                                <Clock className="text-blue-500" size={24} />
                                <div>
                                    <p className="font-bold">Application Pending</p>
                                    <p className="text-sm">Applying for: <strong>{latestApp.targetSemester}</strong>. Currently under review.</p>
                                </div>
                            </div>
                        ) : status === 'approved' ? (
                            <div className={`border rounded-lg p-4 flex items-center gap-3 ${hasPaid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                                {hasPaid ? <CheckCircle className="text-emerald-500" size={24} /> : <AlertCircle className="text-amber-500" size={24} />}
                                <div>
                                    <p className="font-bold">{hasPaid ? 'Progression Complete!' : 'Action Required: Payment Pending'}</p>
                                    <p className="text-sm">
                                        {hasPaid
                                            ? `You have successfully enrolled in ${latestApp.targetSemester}.`
                                            : `Your application for ${latestApp.targetSemester} is approved! Please complete your semester fee payment to confirm enrollment.`}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3 text-rose-800">
                                <XCircle className="text-rose-500" size={24} />
                                <div>
                                    <p className="font-bold">Application Rejected</p>
                                    <p className="text-sm">{latestApp.remarks || 'Please contact administration for details.'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Timeline */}
                    <div className="w-full md:w-80 border-l border-slate-200 pl-8 ml-4 py-2 space-y-8 relative">
                        <div className="relative">
                            <div className="absolute -left-[39px] w-5 h-5 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center">
                                <CheckCircle size={12} className="text-white" />
                            </div>
                            <h3 className="font-bold text-text-main text-sm">Eligibility Check</h3>
                            <p className="text-xs text-text-muted mt-1">Status: Eligible</p>
                        </div>

                        <div className="relative">
                            <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${latestApp ? 'bg-blue-500' : 'bg-slate-200'}`}>
                                {latestApp && <Clock size={12} className="text-white" />}
                            </div>
                            <h3 className={`font-bold text-sm ${latestApp ? 'text-primary' : 'text-text-light'}`}>Application Submission</h3>
                            <p className="text-xs text-text-muted mt-1">{latestApp ? `Submitted on ${new Date(latestApp.createdAt).toLocaleDateString()}` : 'Pending'}</p>
                        </div>

                        <div className="relative">
                            <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${status === 'approved' ? 'bg-green-500' : status === 'rejected' ? 'bg-rose-500' : 'bg-slate-200'}`}>
                                {status === 'approved' ? <CheckCircle size={12} className="text-white" /> : status === 'rejected' ? <XCircle size={12} className="text-white" /> : null}
                            </div>
                            <h3 className={`font-bold text-sm ${status === 'approved' || status === 'rejected' ? 'text-text-main' : 'text-text-light'}`}>Admin Review</h3>
                            <p className="text-xs text-text-muted mt-1">{status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Under Review'}</p>
                        </div>

                        <div className="relative">
                            <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${hasPaid ? 'bg-green-500' : 'bg-slate-200'}`}>
                                {hasPaid && <CheckCircle size={12} className="text-white" />}
                            </div>
                            <h3 className={`font-bold text-sm ${hasPaid ? 'text-text-main' : 'text-text-light'}`}>Enrollment Confirmed</h3>
                            <p className="text-xs text-text-muted mt-1">{hasPaid ? 'Paid & Enrolled' : 'Awaiting Payment'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progression;
