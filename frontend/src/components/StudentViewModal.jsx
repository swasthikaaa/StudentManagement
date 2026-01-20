import React from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Phone, MapPin, Calendar, User, BookOpen, Fingerprint } from 'lucide-react';

const StudentViewModal = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header with Cover */}
                <div className="relative h-32 bg-gradient-to-r from-primary to-primary-dark">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                            <img
                                src={student.avatar || 'https://via.placeholder.com/150'}
                                alt={student.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="pt-16 px-8 pb-8 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                        <p className="text-slate-500 font-medium">{student.course} Student</p>
                        <div className="flex gap-2 mt-2">
                            <span className={`badge ${student.status === 'Active' ? 'badge-success' : student.status === 'Inactive' ? 'badge-error' : 'badge-info'}`}>
                                {student.status}
                            </span>
                            <span className="badge badge-info">{student.semester || 'Semester 1'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Details</h3>

                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Fingerprint size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Student ID</p>
                                    <p className="font-medium font-mono">{student.studentId || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Email Address</p>
                                    <p className="font-medium">{student.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Age & Gender</p>
                                    <p className="font-medium">{student.age} Years • {student.gender}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Contact & Info</h3>

                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Phone</p>
                                    <p className="font-medium">{student.phone || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Address</p>
                                    <p className="font-medium truncate max-w-[200px]" title={student.address}>{student.address || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mt-1">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Guardian</p>
                                    <p className="font-medium">{student.guardian?.name || "N/A"}</p>
                                    <p className="text-xs text-slate-500">{student.guardian?.relation} • {student.guardian?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StudentViewModal;
