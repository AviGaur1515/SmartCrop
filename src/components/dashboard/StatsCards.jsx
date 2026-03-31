import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Activity, AlertTriangle } from 'lucide-react';
import { analysisService } from '../../services/api';

const StatsCards = () => {
    const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analysisService.getStats()
            .then(r => { if (r.success) setStats(r.data); })
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Analyses', value: stats.total, icon: Leaf, bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700' },
        { label: 'Healthy Scans', value: stats.healthy, icon: Activity, bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-700' },
        { label: 'Issues Found', value: stats.diseased, icon: AlertTriangle, bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700' },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> Quick Stats
            </h3>
            {cards.map((c, i) => (
                <motion.div key={c.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card p-5 rounded-xl flex items-center gap-4"
                >
                    <div className={`${c.bg} h-12 w-12 rounded-xl flex items-center justify-center shrink-0`}>
                        <c.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
                        {loading
                            ? <div className="h-7 w-10 bg-slate-100 rounded animate-pulse mt-1" />
                            : <p className="text-3xl font-black text-slate-900">{c.value}</p>
                        }
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;
