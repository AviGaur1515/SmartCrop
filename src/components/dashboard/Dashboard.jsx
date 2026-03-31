import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LogOut, ScanLine, LayoutDashboard, History, CloudSun } from 'lucide-react';
import { authService, analysisService } from '../../services/api';
import StatsCards from './StatsCards';
import WeatherWidget from './WeatherWidget';
import CropHistory from './CropHistory';
import AnalyticsCharts from './AnalyticsCharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [analyses, setAnalyses] = useState([]);

    const handleLogout = () => { authService.logout(); navigate('/login'); };

    useEffect(() => {
        const load = async () => {
            const result = await analysisService.getHistory(50);
            if (result.success) setAnalyses(result.data);
        };
        load();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome card */}
                <div className="bg-slate-900 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">{greeting},</p>
                        <h2 className="text-3xl font-black text-white mb-2">{user?.name?.split(' ')[0] || 'Farmer'} 👋</h2>
                        <p className="text-slate-400 text-sm max-w-xs">Your farm analytics are ready. Review conditions and recent scans below.</p>
                    </div>
                    <button onClick={() => navigate('/analyzer')}
                        className="btn-primary px-6 py-3 rounded-xl text-sm shrink-0"
                    >
                        <ScanLine className="h-4 w-4" /> New Scan
                    </button>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <WeatherWidget />
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4 text-emerald-600" /> Farm Analytics
                            </h3>
                            <AnalyticsCharts analyses={analyses} />
                        </div>
                    </div>
                    <div>
                        <StatsCards />
                    </div>
                </div>

                {/* History */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <History className="h-4 w-4 text-emerald-600" /> Recent Inspections
                    </h3>
                    <CropHistory />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
