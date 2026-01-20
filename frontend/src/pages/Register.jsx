import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
    const { login } = useContext(AuthContext); // Login after register
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Sending registration data:", formData);
            const { data } = await registerUser(formData);
            // login(data); // Removed auto-login
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-main mb-2">Create Account</h1>
                    <p className="text-text-muted">Register for the Student Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. john@student.com"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Choose a strong password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-text-muted mb-2">Already have an account?</p>
                    <Link to="/login" className="text-primary hover:text-primary-dark font-medium text-sm">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
