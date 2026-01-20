import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Calendar, Edit2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    const [formData, setFormData] = useState({
        day: 'Monday',
        subject: '',
        startTime: '',
        endTime: '',
        location: '',
        semester: 'Semester 1'
    });

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get('/timetable');
            setTimetable(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load timetable");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ day: 'Monday', subject: '', startTime: '', endTime: '', location: '', semester: 'Semester 1' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (entry) => {
        setFormData({
            day: entry.day,
            subject: entry.subject,
            startTime: entry.startTime,
            endTime: entry.endTime,
            location: entry.location,
            semester: entry.semester || 'Semester 1'
        });
        setIsEditing(true);
        setEditId(entry._id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const { data } = await api.put(`/timetable/${editId}`, formData);
                setTimetable(timetable.map(t => t._id === editId ? data : t));
                toast.success("Schedule updated successfully");
            } else {
                const { data } = await api.post('/timetable', formData);
                setTimetable([...timetable, data]);
                toast.success("Schedule added successfully");
            }
            resetForm();
        } catch (error) {
            toast.error(isEditing ? "Failed to update entry" : "Failed to add entry");
        }
    };

    const handleDeleteClick = (id) => {
        setEntryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;
        try {
            await api.delete(`/timetable/${entryToDelete}`);
            setTimetable(timetable.filter(t => t._id !== entryToDelete));
            toast.success("Entry deleted successfully");
        } catch (error) {
            toast.error("Failed to delete entry");
        } finally {
            setIsDeleteModalOpen(false);
            setEntryToDelete(null);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-text-main">Timetable Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="card p-6 h-fit sticky top-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">
                            {isEditing ? 'Edit Entry' : 'Add Entry'}
                        </h2>
                        {isEditing && (
                            <button onClick={resetForm} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700">
                                <RotateCcw size={14} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Day</label>
                            <select
                                className="form-input"
                                value={formData.day}
                                onChange={e => setFormData({ ...formData, day: e.target.value })}
                            >
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <button type="submit" className={`btn-primary w-full flex items-center justify-center gap-2 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
                            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Update Schedule' : 'Add to Schedule'}
                        </button>
                    </form>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 space-y-6">
                    {days.map(day => {
                        const daySchedule = timetable.filter(t => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                        if (daySchedule.length === 0) return null;
                        return (
                            <div key={day} className="card p-6">
                                <h3 className="font-bold text-lg mb-4 text-primary border-b border-slate-100 pb-2">{day}</h3>
                                <div className="space-y-3">
                                    {daySchedule.map(item => (
                                        <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 group transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="text-text-muted font-mono text-sm w-24">
                                                    {item.startTime} - {item.endTime}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-main">{item.subject}</p>
                                                    <p className="text-xs text-text-muted flex items-center gap-1">
                                                        <Calendar size={12} /> {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 bg-white text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded shadow-sm transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item._id)}
                                                    className="p-1.5 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 rounded shadow-sm transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                    {timetable.length === 0 && !loading && (
                        <div className="text-center text-text-muted py-12">No schedule entries found. Add one to get started.</div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Schedule Entry"
                message="Are you sure you want to delete this timetable entry?"
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminTimetable;
