import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { createStudent, getStudent, updateStudent } from '../services/api';
import { Save, X, Upload, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        course: '',
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchStudent();
        }
    }, [id]);

    const fetchStudent = async () => {
        try {
            const { data } = await getStudent(id);
            setFormData(data);
        } catch (err) {
            toast.error('Failed to fetch student details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await updateStudent(id, formData);
                toast.success('Student updated successfully');
            } else {
                await createStudent(formData);
                toast.success('Student added successfully');
            }
            navigate('/admin/students');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/students')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-text-muted">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">
                            {isEditMode ? 'Edit Student' : 'Add New Student'}
                        </h1>
                        <p className="text-sm text-text-muted">Fill in the details below to {isEditMode ? 'update' : 'create'} a student record</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                    <div className="card p-6 flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer mb-4">
                            <img src={formData.avatar} alt="Avatar" className="w-40 h-40 rounded-full object-cover border-4 border-slate-100 shadow-sm group-hover:border-primary-light transition-colors" />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white" size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-text-main mb-1">Profile Photo</p>
                        <p className="text-xs text-text-muted">Click to upload new image</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="20"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Course</label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="form-input cursor-pointer"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-input cursor-pointer"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
                            <button type="button" onClick={() => navigate('/admin/students')} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                <Save size={18} />
                                <span>{loading ? 'Saving...' : 'Save Student'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
