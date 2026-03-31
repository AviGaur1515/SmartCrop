import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ResultsDisplay = ({ results, imagePreview }) => {
    const { class: diseaseClass, confidence } = results;

    // Parse the disease class name (format: "Crop___Disease")
    const [crop, disease] = diseaseClass.split('___');
    const cropName = crop.replace(/_/g, ' ');
    const diseaseName = disease.replace(/_/g, ' ');

    // Determine confidence level and styling
    const getConfidenceStyle = () => {
        if (confidence >= 90) {
            return {
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                icon: CheckCircle,
                label: 'High Fidelity Detection',
                barColor: 'from-emerald-400 to-emerald-600'
            };
        } else if (confidence >= 70) {
            return {
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                icon: AlertTriangle,
                label: 'Standard Confidence',
                barColor: 'from-amber-400 to-amber-600'
            };
        } else {
            return {
                color: 'text-red-600',
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Anomalous Readout',
                barColor: 'from-red-400 to-red-600'
            };
        }
    };

    const confidenceStyle = getConfidenceStyle();
    const ConfidenceIcon = confidenceStyle.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[3rem] p-10 shadow-2xl overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Preview */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Input Specimen</h3>
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                    </div>
                    {imagePreview && (
                        <div className="rounded-[2.5rem] overflow-hidden bg-slate-50 border-4 border-white shadow-inner relative group">
                            <img
                                src={imagePreview}
                                alt="Analyzed crop"
                                className="w-full h-full object-contain max-h-96"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <p className="text-white text-xs font-bold tracking-widest uppercase">Validated Sample</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-display font-black text-slate-950 mb-2 tracking-tight">Diagnostic <span className="text-primary italic">Report</span></h2>
                            <p className="text-slate-500 font-medium tracking-tight">Neural analysis of agricultural biological markers completed successfully.</p>
                        </div>

                        {/* Crop & Disease Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-slate-50/50 backdrop-blur-sm rounded-[2rem] p-6 border border-white">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Specimen</p>
                                <p className="text-3xl font-display font-black text-slate-950 tracking-tight capitalize">{cropName}</p>
                            </div>

                            <div className={`${confidenceStyle.bg}/30 backdrop-blur-sm rounded-[2rem] p-6 border border-white shadow-sm`}>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Identified Pathology</p>
                                <p className={`text-3xl font-display font-black tracking-tight capitalize ${confidenceStyle.color}`}>
                                    {diseaseName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="mt-12 bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-inner">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Confidence Index</h4>
                                <span className={`text-sm font-black ${confidenceStyle.color} uppercase tracking-widest`}>
                                    {confidenceStyle.label}
                                </span>
                            </div>
                            <span className={`text-4xl font-display font-black ${confidenceStyle.color}`}>
                                {confidence.toFixed(1)}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${confidence}%` }}
                                transition={{ duration: 1.5, ease: 'circOut' }}
                                className={`h-full bg-gradient-to-r ${confidenceStyle.barColor}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultsDisplay;
