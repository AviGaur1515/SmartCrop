import React from 'react';
import { BookOpen, Sparkles, Sprout, Shield, AlertTriangle } from 'lucide-react';

const KnowledgePage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white border text-center border-slate-200 shadow-sm rounded-3xl p-10 max-w-2xl w-full flex flex-col items-center">
                <div className="h-20 w-20 bg-emerald-100 rounded-full flex gap-2 items-center justify-center mb-6">
                    <BookOpen className="h-10 w-10 text-emerald-600" />
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-4">
                    Agricultural Knowledge Base
                </h1>
                
                <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    We are compiling the world's most comprehensive, AI-backed library for crop diseases, pests, and IPMS (Integrated Pest Management Systems).
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full text-left mb-8">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Coming Soon:</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <Sprout className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-slate-600 font-medium">Detailed encyclopedias for all 38+ crop classes we scan.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <Shield className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-slate-600 font-medium">Curated and verified organic prevention techniques.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-slate-600 font-medium">Real-time local pest outbreak alerts based on user scans.</span>
                        </li>
                    </ul>
                </div>

                <div className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full font-bold shadow-sm">
                    <Sparkles className="h-5 w-5" />
                    Expected Release: Next Quarter
                </div>
            </div>
        </div>
    );
};

export default KnowledgePage;
