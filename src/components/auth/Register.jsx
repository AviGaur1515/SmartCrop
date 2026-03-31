import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../../services/api';

// Defined OUTSIDE the Register component so React keeps a stable reference
// and does not remount the <input> (losing focus) on every keystroke.
const Field = ({ label, icon: Icon, ...props }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input-field" {...props} />
        </div>
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { const m = 'Passwords do not match'; setError(m); toast.error(m); return; }
        if (formData.password.length < 8) { const m = 'Password must be at least 8 characters'; setError(m); toast.error(m); return; }
        setLoading(true);
        try {
            const result = await authService.register({ name: formData.name, email: formData.email, password: formData.password });
            if (result.success) { toast.success(`Welcome, ${result.user.name}!`); navigate('/dashboard'); }
            else { setError(result.error || 'Registration failed'); }
        } catch { setError('An unexpected error occurred'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 card rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">

                {/* Left — form */}
                <div className="bg-white p-10 lg:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6 lg:hidden">
                            <div className="h-7 w-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Leaf className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-slate-900">SmartCrop</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1.5">Create your account</h3>
                        <p className="text-slate-500 text-sm">Get started with SmartCrop for free.</p>
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Full Name" icon={User} type="text" name="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
                        <Field label="Email" icon={Mail} type="email" name="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Password" icon={Lock} type="password" name="password" required placeholder="Min. 8 chars" value={formData.password} onChange={handleChange} />
                            <Field label="Confirm" icon={Lock} type="password" name="confirmPassword" required placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg mt-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Sign In</button>
                    </p>
                </div>

                {/* Right — brand */}
                <div className="bg-slate-900 p-12 hidden lg:flex flex-col justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white">SmartCrop</span>
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Start your<br />journey<br /><span className="text-emerald-400">with AI.</span>
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-8">
                            Gain instant access to advanced crop intelligence and protect your harvest season after season.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-2xl font-black text-white">10K+</p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Farmers Protected</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">2M+</p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Scans Completed</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">© 2025 SmartCrop</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
