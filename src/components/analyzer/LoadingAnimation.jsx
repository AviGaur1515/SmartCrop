import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Microscope, Cpu } from 'lucide-react';

const LoadingAnimation = () => {
    const steps = [
        { icon: Microscope, label: 'Scanning Leaf Architecture', delay: 0 },
        { icon: Brain, label: 'Deep Neural Patterning', delay: 0.2 },
        { icon: Cpu, label: 'Cross-Referencing Database', delay: 0.4 }
    ];

    return (
        <div className="glass-card rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary/20 rounded-full blur-[100px]"
                ></motion.div>
            </div>

            <div className="relative z-10 text-center">
                {/* Main Loading Indicator */}
                <div className="relative mx-auto h-32 w-32 mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"
                    ></motion.div>
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 border-2 border-primary/50 border-t-transparent rounded-full"
                    ></motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 bg-primary gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Cpu className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl font-display font-black text-slate-950 mb-3 tracking-tight">AI Diagnostics in Progress</h2>
                <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">
                    The neural network is processing your specimen against millions of agricultural data points.
                </p>

                {/* Analysis Steps */}
                <div className="space-y-4 max-w-md mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: step.delay, duration: 0.5 }}
                            className="flex items-center space-x-5 bg-white/50 backdrop-blur-md border border-white rounded-[1.5rem] p-5 shadow-sm"
                        >
                            <div className="bg-primary/10 rounded-xl p-3 border border-primary/10">
                                <step.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-slate-800 tracking-tight">{step.label}</p>
                                <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: step.delay }}
                                        className="h-full w-1/2 bg-primary rounded-full"
                                    ></motion.div>
                                </div>
                            </div>
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: step.delay }}
                                className="h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Overall Progress */}
                <div className="mt-16 max-w-sm mx-auto">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sequence Lock</span>
                        <span className="text-xs font-bold text-primary">System Online</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-white">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4, ease: 'easeInOut' }}
                            className="h-full gradient-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
