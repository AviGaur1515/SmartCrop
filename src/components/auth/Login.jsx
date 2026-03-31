import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await authService.login(formData.email, formData.password);
            if (result.success) {
                toast.success(`Welcome back, ${result.user.name}!`);
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 card rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">

                {/* Left — brand panel */}
                <div className="bg-slate-900 p-12 flex flex-col justify-between hidden lg:flex">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white">SmartCrop</span>
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Precision<br />agriculture,<br /><span className="text-emerald-400">simplified.</span>
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-8">
                            AI-powered crop diagnostics trusted by 10,000+ farmers across India.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-2xl font-black text-white">98.4%</p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Accuracy</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">38+</p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Disease Classes</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">© 2025 SmartCrop</p>
                </div>

                {/* Right — form */}
                <div className="bg-white p-10 lg:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-1.5">Welcome back</h3>
                        <p className="text-slate-500 text-sm">Sign in to your SmartCrop account.</p>
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="email" name="email" required
                                    className="input-field" placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="password" name="password" required
                                    className="input-field" placeholder="••••••••"
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg mt-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button onClick={() => toast('Password reset email sent.', { icon: '📧' })}
                            className="text-sm text-slate-400 hover:text-slate-600 hover:underline underline-offset-4 transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        New here?{' '}
                        <button onClick={() => navigate('/register')}
                            className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
