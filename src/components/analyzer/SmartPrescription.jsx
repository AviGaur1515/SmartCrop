import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Droplet, Shield, Sprout, Leaf } from 'lucide-react';
import { remediesData } from '../../data/remedies';

const SmartPrescription = ({ diseaseClass }) => {
    const remedy = remediesData[diseaseClass] || {
        diagnosis: 'Comprehensive pathological data currently unavailable for this specific specimen variant.',
        immediateAction: 'Implement isolation protocols and consult with a regional agronomist for targeted intervention.',
        prevention: 'Maintain high biological security and optimize environmental monitoring parameters.'
    };

    const sections = [
        {
            icon: AlertCircle,
            title: 'Pathology Insight',
            content: remedy.diagnosis,
            color: 'text-sky-600',
            bg: 'bg-sky-50',
            iconBg: 'bg-sky-100',
            borderColor: 'border-sky-100'
        },
        {
            icon: Droplet,
            title: 'Critical Intervention',
            content: remedy.immediateAction,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-100',
            borderColor: 'border-amber-100'
        },
        {
            icon: Shield,
            title: 'Stability Protocol',
            content: remedy.prevention,
            color: 'text-primary',
            bg: 'bg-primary/10',
            iconBg: 'bg-primary/20',
            borderColor: 'border-primary/10'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-[3rem] p-10 shadow-2xl overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16"></div>

            <div className="relative z-10">
                <div className="flex items-center space-x-5 mb-10">
                    <div className="h-16 w-16 bg-primary gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sprout className="h-9 w-9 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-black text-slate-950 tracking-tight">Expert <span className="text-primary italic">Prescription</span></h2>
                        <p className="text-sm font-medium text-slate-500 tracking-tight">AI-Generated biological containment & recovery strategy</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className={`group relative overflow-hidden rounded-[2rem] p-8 border-2 ${section.borderColor} ${section.bg}/50 backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-xl hover:shadow-slate-200/50`}
                        >
                            <div className="flex items-start space-x-6 relative z-10">
                                <div className={`${section.iconBg} h-14 w-14 rounded-2xl flex items-center justify-center border border-white shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                                    <section.icon className={`h-7 w-7 ${section.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-display font-black ${section.color} mb-3 tracking-tight`}>
                                        {section.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Technical Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 p-6 rounded-2xl bg-slate-900 text-slate-400 border border-slate-800 flex items-start space-x-4"
                >
                    <div className="h-2 w-2 bg-primary rounded-full mt-1.5 animate-pulse"></div>
                    <p className="text-[11px] leading-relaxed font-bold uppercase tracking-widest text-slate-400">
                        <span className="text-white">Specimen Advisory:</span> These readouts are synthesized via high-density neural networks. Validate all critical bio-interventions with a certified agricultural consultant. System Node v2.0.4 - Secure Diagnostic Channel.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SmartPrescription;
