import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminResults = () => {
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToPromote, setStudentToPromote] = useState(null);

    const [actionType, setActionType] = useState('promote');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, gradesRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/grades') // Returns all grades
                ]);
                setStudents(studentsRes.data);
                setGrades(gradesRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateGPA = (studentId, currentSemester) => {
        const studentGrades = grades.filter(g =>
            (g.studentId === studentId || g.studentId?._id === studentId) &&
            g.semester === currentSemester
        );
        if (!studentGrades.length) return null;

        const points = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        const totalPoints = studentGrades.reduce((acc, g) => acc + (points[g.grade] || 0), 0);
        return (totalPoints / studentGrades.length).toFixed(2);
    };

    const handleActionClick = (student, type) => {
        setStudentToPromote(student);
        setActionType(type);
        setIsModalOpen(true);
    };

    const fetchLatestData = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error("Failed to refresh data");
        }
    };

    const confirmAction = async () => {
        if (!studentToPromote) return;

        try {
            const currentSemStr = studentToPromote.semester || 'Semester 1';
            const currentSem = parseInt(currentSemStr.split(' ')[1]) || 1;

            let nextSemNum = currentSem;
            if (actionType === 'promote') {
                nextSemNum = currentSem + 1;
            } else {
                nextSemNum = Math.max(1, currentSem - 1);
                if (nextSemNum === currentSem) {
                    toast.error("Cannot demote below Semester 1");
                    setIsModalOpen(false);
                    setStudentToPromote(null);
                    return;
                }
            }

            const nextSem = `Semester ${nextSemNum}`;

            await api.put(`/students/${studentToPromote._id}`, { semester: nextSem });

            // Optimistic update
            setStudents(prevStudents => prevStudents.map(s =>
                s._id === studentToPromote._id ? { ...s, semester: nextSem } : s
            ));

            toast.success(`Successfully ${actionType}d ${studentToPromote.name} to ${nextSem}`);

            // Refresh explicitly to be safe
            fetchLatestData();

        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${actionType} student`);
        } finally {
            setIsModalOpen(false);
            setStudentToPromote(null);
        }
    };

    const processData = () => {
        return students.map(s => {
            const currentSem = s.semester || 'Semester 1';
            const gpa = calculateGPA(s._id, currentSem);
            let status = 'Good Standing';

            if (gpa !== null) {
                status = parseFloat(gpa) >= 2.0 ? 'Good Standing' : 'At Risk';
            } else {
                status = 'No Grades'; // Or default to Good Standing
            }

            return { ...s, gpa, status };
        });
    };

    const studentData = processData();

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-text-main">Results & Progression</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center justify-between bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100">
                    <div>
                        <p className="text-emerald-700 text-xs font-bold uppercase">Avg. Current GPA</p>
                        <h3 className="text-3xl font-bold text-emerald-800">
                            {(studentData.filter(s => s.gpa !== null).reduce((acc, s) => acc + parseFloat(s.gpa), 0) / (studentData.filter(s => s.gpa !== null).length || 1)).toFixed(2)}
                        </h3>
                    </div>
                    <div className="p-3 rounded-full bg-white text-emerald-600 shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>ID</th>
                                <th>Current Semester</th>
                                <th>GPA</th>
                                <th>Academic Standing</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                            ) : studentData.map(student => (
                                <tr key={student._id}>
                                    <td className="font-bold text-text-main">{student.name}</td>
                                    <td className="text-text-muted font-mono text-xs">{student.studentId}</td>
                                    <td>
                                        <span className="badge badge-info">{student.semester || 'Semester 1'}</span>
                                    </td>
                                    <td className="font-semibold text-center">
                                        {student.gpa === null ? (
                                            <span className="text-text-muted text-xs italic">N/A</span>
                                        ) : (
                                            student.gpa
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${student.status === 'Good Standing' ? 'badge-success' :
                                            student.status === 'At Risk' ? 'badge-error' :
                                                'badge-info'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleActionClick(student, 'demote')}
                                            className="btn-danger px-3 py-1 text-xs gap-1 h-8"
                                            title="Signal to take a semester back"
                                        >
                                            Demote
                                        </button>
                                        <button
                                            onClick={() => handleActionClick(student, 'promote')}
                                            className="btn-primary px-3 py-1 text-xs gap-1 h-8"
                                            title="Promote to next semester"
                                        >
                                            Promote <ArrowRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmAction}
                title={`${actionType === 'promote' ? 'Promote' : 'Demote'} Student`}
                message={`Are you sure you want to ${actionType} ${studentToPromote?.name}?`}
                confirmText={actionType === 'promote' ? 'Promote' : 'Demote'}
                type={actionType === 'promote' ? 'info' : 'danger'}
            />
        </div>
    );
};

export default AdminResults;
