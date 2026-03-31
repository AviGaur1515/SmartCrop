import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, LayoutDashboard, ScanLine, Sprout, BookOpen, Users,
    LogOut, User, Lock, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';
import { authService } from '../../services/api';
import ChangePasswordModal from './ChangePasswordModal';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ScanLine, label: 'New Scan', path: '/analyzer' },
    { icon: Sprout, label: 'My Crops', path: '/crops' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
    { icon: Users, label: 'Expert Consult', path: '/consult' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [showPassModal, setShowPassModal] = useState(false);
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="h-screen bg-slate-900 flex flex-col shrink-0 relative z-40 overflow-hidden"
                style={{ minWidth: collapsed ? 72 : 260 }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
                    <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
                                <p className="font-black text-white text-base leading-none">SmartCrop</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Pro Platform</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-5 -right-3 h-6 w-6 bg-slate-700 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors z-50"
                >
                    {collapsed
                        ? <ChevronRight className="h-3.5 w-3.5 text-white" />
                        : <ChevronLeft className="h-3.5 w-3.5 text-white" />}
                </button>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <button key={path} onClick={() => navigate(path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
                                    ${isActive
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="font-semibold text-sm whitespace-nowrap">
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom: User + Actions */}
                <div className="border-t border-slate-800 p-3 space-y-1">
                    {/* User info */}
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800 mb-2">
                            <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate leading-tight">{user?.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </motion.div>
                    )}

                    <button onClick={() => setShowPassModal(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                        <Lock className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="font-semibold text-sm">Change Password</span>}
                    </button>

                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950 hover:text-red-300 transition-all">
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="font-semibold text-sm">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {showPassModal && <ChangePasswordModal onClose={() => setShowPassModal(false)} />}
        </>
    );
};

export default Sidebar;
