import React, { useState } from 'react';
import { BookOpen, Calendar, Award } from 'lucide-react';

const Academics = () => {
    const [activeTab, setActiveTab] = useState('timetable');

    const timetable = [
        { day: 'Monday', time: '09:00 - 11:00', course: 'Database Systems', room: 'Lab 304', type: 'Lecture' },
        { day: 'Monday', time: '13:00 - 15:00', course: 'Web Development', room: 'Lab 201', type: 'Lab' },
        { day: 'Tuesday', time: '10:00 - 12:00', course: 'Algorithms', room: 'Hall A', type: 'Lecture' },
        { day: 'Wednesday', time: '09:00 - 11:00', course: 'Linear Algebra', room: 'Hall B', type: 'Lecture' },
        { day: 'Thursday', time: '14:00 - 16:00', course: 'Data Structures', room: 'Lab 304', type: 'Lab' },
        { day: 'Friday', time: '11:00 - 13:00', course: 'Ethics in CS', room: 'Hall C', type: 'Seminar' },
    ];

    const grades = [
        { code: 'CS301', course: 'Algorithms & Complexity', credits: 4, score: 92, grade: 'A', status: 'Pass' },
        { code: 'CS302', course: 'Database Systems', credits: 4, score: 88, grade: 'B+', status: 'Pass' },
        { code: 'CS303', course: 'Web Development', credits: 3, score: 95, grade: 'A+', status: 'Pass' },
        { code: 'MATH201', course: 'Linear Algebra', credits: 3, score: 89, grade: 'A-', status: 'Pass' },
        { code: 'CS304', course: 'Operating Systems', credits: 4, score: 76, grade: 'B', status: 'Pass' },
    ];

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
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.map((t, i) => (
                                    <tr key={i}>
                                        <td className="font-medium text-text-main">{t.day}</td>
                                        <td className="text-text-muted">{t.time}</td>
                                        <td className="font-semibold text-primary">{t.course}</td>
                                        <td>{t.room}</td>
                                        <td>
                                            <span className={`badge ${t.type === 'Lecture' ? 'badge-info' : t.type === 'Lab' ? 'badge-warning' : 'badge-success'}`}>
                                                {t.type}
                                            </span>
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
                            <strong>GPA:</strong> 3.82
                        </div>
                    </div>
                    <div className="table-container border-0 rounded-none">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Credits</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((g, i) => (
                                    <tr key={i}>
                                        <td className="text-text-muted font-mono text-xs">{g.code}</td>
                                        <td className="font-medium text-text-main">{g.course}</td>
                                        <td>{g.credits}</td>
                                        <td className="font-semibold">{g.score}%</td>
                                        <td className={`font-bold ${g.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'}`}>{g.grade}</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {g.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academics;
