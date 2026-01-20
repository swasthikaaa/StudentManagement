import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, Calendar, Award } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Academics = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('timetable');
    const [timetable, setTimetable] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [timetableRes, gradesRes] = await Promise.all([
                    api.get('/timetable'),
                    api.get(`/grades/student/${user._id}`)
                ]);
                setTimetable(timetableRes.data);

                // Filter grades for current student just in case (though endpoint should handle it)
                const studentGrades = gradesRes.data.filter(g => g.studentId === user._id || g.studentId?._id === user._id);
                setGrades(studentGrades);
            } catch (error) {
                console.error("Failed to fetch academic data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    // Calculate GPA only for the current semester
    const calculateGPA = () => {
        const currentSemester = user.semester || 'Semester 1';
        const currentGrades = grades.filter(g => g.semester === currentSemester);

        if (!currentGrades.length) return "N/A";

        const points = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        const totalPoints = currentGrades.reduce((acc, g) => acc + (points[g.grade] || 0), 0);
        return (totalPoints / currentGrades.length).toFixed(2);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-main">Academics</h1>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('timetable')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'timetable' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Timetable
                    </button>
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'grades' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Grades & Results
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card p-12 text-center text-text-muted">Loading academic data...</div>
            ) : (
                <>
                    {activeTab === 'timetable' && (
                        <div className="card p-0">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-text-main flex items-center gap-2">
                                    <Calendar className="text-primary" size={20} />
                                    Weekly Schedule
                                </h2>
                            </div>
                            <div className="table-container border-0 rounded-none">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Time</th>
                                            <th>Course</th>
                                            <th>Location</th>
                                            <th>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-8 text-text-muted">No schedule available.</td></tr>
                                        ) : timetable.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((t, i) => (
                                            <tr key={i}>
                                                <td className="font-medium text-text-main">{t.day}</td>
                                                <td className="text-text-muted">{t.startTime} - {t.endTime}</td>
                                                <td className="font-semibold text-primary">{t.subject}</td>
                                                <td>{t.location}</td>
                                                <td>
                                                    <span className="badge badge-info">{t.semester || 'N/A'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'grades' && (
                        <div className="card p-0">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-text-main flex items-center gap-2">
                                    <Award className="text-primary" size={20} />
                                    Academic History
                                </h2>
                                <div className="text-sm bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                                    <strong>GPA:</strong> {calculateGPA()}
                                </div>
                            </div>
                            <div className="table-container border-0 rounded-none">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Score</th>
                                            <th>Grade</th>
                                            <th>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-8 text-text-muted">No grades recorded.</td></tr>
                                        ) : grades.map((g, i) => (
                                            <tr key={i}>
                                                <td className="text-text-muted font-mono text-xs">{g.code}</td>
                                                <td className="font-medium text-text-main">{g.subject}</td>
                                                <td className="font-semibold">{g.score ? `${g.score}%` : 'N/A'}</td>
                                                <td className={`font-bold ${g.grade.startsWith('A') ? 'text-green-600' : g.grade === 'F' ? 'text-red-500' : 'text-blue-600'}`}>{g.grade}</td>
                                                <td>
                                                    <span className="badge badge-success">
                                                        {g.semester || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Academics;
