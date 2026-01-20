import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, GraduationCap, X, Edit2, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminGrades = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grades, setGrades] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [gradeToDelete, setGradeToDelete] = useState(null);

    const [formData, setFormData] = useState({
        subject: '',
        code: '',
        grade: '',
        score: '',
        semester: 'Semester 1'
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            fetchGrades(selectedStudent._id);
            setFormData(prev => ({ ...prev, semester: selectedStudent.semester || 'Semester 1' }));
        }
    }, [selectedStudent]);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students");
        }
    };

    const fetchGrades = async (studentId) => {
        try {
            const { data } = await api.get(`/grades/student/${studentId}`);
            const studentGrades = data.filter(g => g.studentId === studentId || g.studentId?._id === studentId);
            setGrades(studentGrades);
        } catch (error) {
            console.error("Failed to load grades");
        }
    };

    const resetForm = () => {
        setFormData({ subject: '', code: '', grade: '', score: '', semester: 'Semester 1' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (grade) => {
        setFormData({
            subject: grade.subject,
            code: grade.code,
            grade: grade.grade,
            score: grade.score || '', // handle optional
            semester: grade.semester || 'Semester 1'
        });
        setIsEditing(true);
        setEditId(grade._id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, studentId: selectedStudent._id };

            if (isEditing) {
                const { data } = await api.put(`/grades/${editId}`, payload);
                setGrades(grades.map(g => g._id === editId ? data : g));
                toast.success("Grade updated successfully");
            } else {
                const { data } = await api.post('/grades', payload);
                setGrades([...grades, data]);
                toast.success("Grade added successfully");
            }
            resetForm();
        } catch (error) {
            toast.error(isEditing ? "Failed to update grade" : "Failed to add grade");
        }
    };

    const handleDeleteClick = (id) => {
        setGradeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!gradeToDelete) return;
        try {
            await api.delete(`/grades/${gradeToDelete}`);
            setGrades(grades.filter(g => g._id !== gradeToDelete));
            toast.success("Grade deleted successfully");
        } catch (error) {
            toast.error("Failed to delete grade");
        } finally {
            setIsDeleteModalOpen(false);
            setGradeToDelete(null);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-text-main">Grade Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Selector */}
                <div className="card p-6 h-[80vh] flex flex-col">
                    <h2 className="font-bold mb-4">Select Student</h2>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredStudents.map(student => (
                            <div
                                key={student._id}
                                onClick={() => setSelectedStudent(student)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${selectedStudent?._id === student._id ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudent?._id === student._id ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{student.name}</p>
                                    <p className={`text-xs ${selectedStudent?._id === student._id ? 'text-blue-100' : 'text-text-muted'}`}>{student.studentId}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grade Manager */}
                {selectedStudent ? (
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="card p-6 flex justify-between items-center bg-blue-50 border-blue-100">
                            <div>
                                <h2 className="text-xl font-bold text-text-main">{selectedStudent.name}</h2>
                                <p className="text-text-muted text-sm">{selectedStudent.email}</p>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Add/Edit Form */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                                    {isEditing ? 'Edit Grade' : 'Add Grade'}
                                </h3>
                                {isEditing && (
                                    <button onClick={resetForm} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700">
                                        <RotateCcw size={14} /> Cancel Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Computer Science"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Code</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="CS101"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Grade</label>
                                    <select
                                        className="form-input"
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="A+">A+</option>
                                        <option value="A">A</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B">B</option>
                                        <option value="B-">B-</option>
                                        <option value="C+">C+</option>
                                        <option value="C">C</option>
                                        <option value="C-">C-</option>
                                        <option value="D">D</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Semester</label>
                                    <select
                                        className="form-input"
                                        value={formData.semester}
                                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        required
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={`Semester ${num}`}>Semester {num}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className={`btn-primary h-[42px] flex items-center justify-center ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : ''} md:col-span-1`}>
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="card overflow-hidden">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Subject</th>
                                            <th>Grade</th>
                                            <th>Semester</th>
                                            <th className="w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-6 text-text-muted">No grades recorded yet.</td></tr>
                                        ) : grades.map((g, i) => (
                                            <tr key={i}>
                                                <td className="font-mono text-xs">{g.code}</td>
                                                <td>{g.subject}</td>
                                                <td>
                                                    <span className={`badge ${g.grade.startsWith('A') ? 'badge-success' : g.grade === 'F' ? 'badge-error' : 'badge-warning'}`}>
                                                        {g.grade}
                                                    </span>
                                                </td>
                                                <td className="text-text-muted">{g.semester || 'N/A'}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(g)}
                                                            className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-amber-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(g._id)}
                                                            className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex flex-col items-center justify-center p-12 text-center text-text-muted opacity-50">
                        <GraduationCap size={64} className="mb-4" />
                        <p className="text-lg">Select a student to manage their grades</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Grade"
                message="Are you sure you want to delete this grade record? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminGrades;
