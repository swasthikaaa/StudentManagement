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
        status: 'Active',
        phone: '',
        address: '',
        gender: 'Male',
        dob: '',
        guardian: {
            name: '',
            phone: '',
            relation: ''
        }
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setLoading(true);
            const { data } = await api.post('/students/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, avatar: data.url });
            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error('Upload error:', err);
            const message = err.response?.data?.message || 'Failed to upload image';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name.startsWith('guardian.')) {
            const field = e.target.name.split('.')[1];
            setFormData({
                ...formData,
                guardian: {
                    ...formData.guardian,
                    [field]: e.target.value
                }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
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
                        <div
                            className="relative group cursor-pointer mb-4"
                            onClick={() => document.getElementById('avatar-upload').click()}
                        >
                            <img
                                src={formData.avatar || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                className={`w-40 h-40 rounded-full object-cover border-4 border-slate-100 shadow-sm transition-all group-hover:border-primary ${loading ? 'opacity-50' : ''}`}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                <Upload className="text-white" size={24} />
                            </div>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-sm font-medium text-text-main mb-1">Profile Photo</p>
                        <p className="text-xs text-text-muted mb-4">Click image to upload from your computer</p>
                        <div className="w-full">
                            <label className="text-xs text-text-muted text-left block mb-1 font-semibold uppercase tracking-wider">Or paste Image URL</label>
                            <input
                                type="text"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="form-input text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                        <h3 className="text-lg font-bold text-text-main border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
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
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    className="form-input"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob && !isNaN(new Date(formData.dob)) ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender || 'Male'}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-text-main border-b pb-2 pt-4">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="form-label">Course</label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="form-input"
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
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-text-main border-b pb-2 pt-4">Guardian Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="form-label">Guardian Name</label>
                                <input
                                    type="text"
                                    name="guardian.name"
                                    value={formData.guardian?.name || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="form-label">Guardian Phone</label>
                                <input
                                    type="text"
                                    name="guardian.phone"
                                    value={formData.guardian?.phone || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="form-label">Relation</label>
                                <input
                                    type="text"
                                    name="guardian.relation"
                                    value={formData.guardian?.relation || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
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
