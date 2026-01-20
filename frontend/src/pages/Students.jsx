import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import api, { deleteStudent } from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';
import StudentViewModal from '../components/StudentViewModal';
import toast from 'react-hot-toast';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // View Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setStudentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleViewClick = (student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await deleteStudent(studentToDelete);
            setStudents(students.filter(student => student._id !== studentToDelete));
            toast.success("Student deleted successfully");
        } catch (error) {
            console.error("Failed to delete student");
            toast.error("Failed to delete student");
        } finally {
            setIsDeleteModalOpen(false);
            setStudentToDelete(null);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Student Directory</h1>
                    <p className="text-sm text-text-muted mt-1">Manage all registered students</p>
                </div>
                <Link to="/admin/students/add" className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Student
                </Link>
            </div>

            <div className="card p-0">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 text-text-light" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="form-input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container border-0 rounded-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Age</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-muted">Loading directory...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-muted">No students found</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img src={student.avatar || 'https://via.placeholder.com/40'} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                                <div>
                                                    <div className="font-semibold text-text-main">{student.name}</div>
                                                    <div className="text-xs text-text-muted">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="text-sm text-text-main">{student.course}</span></td>
                                        <td><span className="text-sm text-text-main">{student.age}</span></td>
                                        <td>
                                            <span className={`badge ${student.status === 'Active' ? 'badge-success' :
                                                student.status === 'Inactive' ? 'badge-error' :
                                                    'badge-info'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewClick(student)}
                                                    className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-primary transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <Link to={`/admin/students/edit/${student._id}`} className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-amber-600 transition-colors">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button onClick={() => handleDeleteClick(student._id)} className="p-1.5 hover:bg-slate-100 rounded text-text-muted hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Student"
                message="Are you sure you want to delete this student? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />

            <StudentViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                student={selectedStudent}
            />
        </div>
    );
};

export default Students;
