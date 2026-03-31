import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

const ChangePasswordModal = ({ onClose }) => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match'); return; }
        if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        const result = await authService.changePassword(form.currentPassword, form.newPassword);
        setLoading(false);
        if (result.success) {
            toast.success('Password changed successfully!');
            onClose();
        } else {
            setError(result.error);
        }
    };

    const InputField = ({ label, name, showKey }) => (
        <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
            <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type={show[showKey] ? 'text' : 'password'}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="input-field pr-10"
                    required
                    placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                <Lock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Change Password</h3>
                                <p className="text-xs text-slate-400">Keep your account secure</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <InputField label="Current Password" name="currentPassword" showKey="current" />
                        <InputField label="New Password" name="newPassword" showKey="new" />
                        <InputField label="Confirm New Password" name="confirmPassword" showKey="confirm" />
                        <p className="text-xs text-slate-400">Must be at least 8 characters with uppercase, lowercase, and a number.</p>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full py-3 rounded-xl mt-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChangePasswordModal;
