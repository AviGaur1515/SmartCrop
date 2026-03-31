import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Activity } from 'lucide-react';

const AnalyticsCharts = ({ analyses }) => {

    // 1. Process Data for Crop Distribution
    const cropData = useMemo(() => {
        if (!analyses || analyses.length === 0) return [];

        const counts = {};
        analyses.forEach(a => {
            const crop = a.disease_class.split('___')[0].replace(/_/g, ' ');
            counts[crop] = (counts[crop] || 0) + 1;
        });

        return Object.keys(counts).map(crop => ({
            name: crop,
            value: counts[crop]
        })).sort((a, b) => b.value - a.value); // Sort by most frequent
    }, [analyses]);

    // 2. Process Data for Health Status
    const healthData = useMemo(() => {
        if (!analyses || analyses.length === 0) return [];

        let healthy = 0;
        let diseased = 0;

        analyses.forEach(a => {
            if (a.disease_class.toLowerCase().includes('healthy')) {
                healthy++;
            } else {
                diseased++;
            }
        });

        return [
            { name: 'Healthy', value: healthy },
            { name: 'Diseased', value: diseased }
        ];
    }, [analyses]);

    // Professional Colors
    const COLORS_CROPS = ['#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9'];
    const COLORS_HEALTH = ['#4CAF50', '#EF4444']; // Green for Healthy, Red for Diseased

    if (!analyses || analyses.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Crop Distribution Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-[2rem] p-8"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <PieChartIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-800">Crop Distribution</h3>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={cropData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {cropData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_CROPS[index % COLORS_CROPS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Health Status Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-[2rem] p-8"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <Activity className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-800">Health Overview</h3>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={healthData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {healthData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_HEALTH[index % COLORS_HEALTH.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsCharts;
