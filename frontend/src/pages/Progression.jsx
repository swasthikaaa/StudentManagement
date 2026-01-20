import React, { useState } from 'react';
import { Send, CheckCircle, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Progression = () => {
    const [status, setStatus] = useState('pending'); // initial, submitted, approved
    const [loading, setLoading] = useState(false);

    const handleApply = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setStatus('submitted');
            setLoading(false);
            toast.success('Application submitted successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-text-main">Student Progression</h1>

            <div className="card p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
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
                                <span className="font-medium text-text-main">Semester 1, 2024</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Academic Standing:</span>
                                <span className="font-medium text-green-600">Good Standing</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Eligibility:</span>
                                <span className="font-medium text-green-600">Eligible to Progress</span>
                            </div>
                        </div>

                        {status === 'pending' && (
                            <button
                                onClick={handleApply}
                                disabled={loading}
                                className="btn-primary w-full md:w-auto mt-4"
                            >
                                {loading ? 'Submitting...' : 'Start Application'}
                                {!loading && <Send size={18} className="ml-2" />}
                            </button>
                        )}

                        {status === 'submitted' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 text-blue-800">
                                <Clock className="text-blue-500" size={24} />
                                <div>
                                    <p className="font-bold">Application Submitted</p>
                                    <p className="text-sm">Your application is under review by the administration.</p>
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
                            <p className="text-xs text-text-muted mt-1">Completed on Jan 15, 2024</p>
                        </div>

                        <div className="relative">
                            <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${status === 'submitted' ? 'bg-blue-500' : 'bg-slate-200'}`}>
                                {status === 'submitted' && <Clock size={12} className="text-white" />}
                            </div>
                            <h3 className={`font-bold text-sm ${status === 'submitted' ? 'text-primary' : 'text-text-light'}`}>Application Submission</h3>
                            <p className="text-xs text-text-muted mt-1">{status === 'submitted' ? 'Just now' : 'Pending'}</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[39px] w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                            <h3 className="font-bold text-text-light text-sm">Admin Approval</h3>
                            <p className="text-xs text-text-muted mt-1">Pending</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[39px] w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                            <h3 className="font-bold text-text-light text-sm">Enrollment Confirmed</h3>
                            <p className="text-xs text-text-muted mt-1">Pending</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progression;
