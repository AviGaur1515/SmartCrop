import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Shield, Zap, Database, Cpu, TrendingUp, Users } from 'lucide-react';

const features = [
    { icon: Zap, title: 'Instant Analysis', desc: 'Lab-grade diagnostics in seconds using advanced computer vision.', color: 'bg-amber-500' },
    { icon: Shield, title: 'Verified Treatments', desc: 'IPM-compliant remedies vetted by certified agricultural experts.', color: 'bg-emerald-600' },
    { icon: Database, title: 'Digital History', desc: 'Automatically log every scan to track disease progression over seasons.', color: 'bg-blue-500' },
    { icon: Cpu, title: 'Smart Advisory', desc: 'Tailored crop recommendations based on your local soil and climate data.', color: 'bg-violet-500' },
    { icon: TrendingUp, title: 'Yield Analytics', desc: 'Visualize health trends with professional charts and downloadable reports.', color: 'bg-rose-500' },
    { icon: Users, title: 'Community Support', desc: 'Connect with a network of agricultural experts for complex cases.', color: 'bg-teal-500' },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const statsRef = useRef(null);
    const isStatsInView = useInView(statsRef, { once: true, margin: '-80px' });
    const [counts, setCounts] = useState({ diseases: 0, accuracy: 0, farmers: 0 });

    useEffect(() => {
        if (!isStatsInView) return;
        const steps = 50, duration = 1500;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const p = step / steps;
            setCounts({ diseases: Math.floor(38 * p), accuracy: Math.floor(965 * p) / 10, farmers: Math.floor(10000 * p) });
            if (step >= steps) clearInterval(timer);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [isStatsInView]);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Nav */}
            <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Leaf className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">SmartCrop</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">Log In</button>
                        <button onClick={() => navigate('/register')} className="btn-primary text-sm px-5 py-2 rounded-lg">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                        AI-Powered Crop Intelligence
                    </span>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6">
                        Protect your<br />
                        harvest with<br />
                        <span className="text-emerald-600">AI diagnostics.</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
                        Scan any crop leaf — get instant disease detection and expert-verified remedies in under 10 seconds.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        <button onClick={() => navigate('/register')} className="btn-primary px-7 py-3.5 rounded-xl text-base">
                            Start Free Scan <ArrowRight className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate('/login')} className="btn-secondary px-7 py-3.5 rounded-xl text-base">
                            Sign In
                        </button>
                    </div>
                </motion.div>

                {/* Right illustration card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
                    className="hidden lg:block"
                >
                    <div className="card p-6 rounded-2xl">
                        <div className="bg-slate-50 rounded-xl aspect-[4/3] flex items-center justify-center">
                            <svg viewBox="0 0 360 270" className="w-full h-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="180" cy="135" r="100" fill="#d1fae5" opacity="0.6" />
                                <circle cx="180" cy="135" r="65" fill="#a7f3d0" opacity="0.5" />
                                <path d="M180 240 L180 105" stroke="#065f46" strokeWidth="5" strokeLinecap="round" />
                                <path d="M180 185 Q158 165 138 155" stroke="#065f46" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                <path d="M180 155 Q202 137 222 128" stroke="#065f46" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                <ellipse cx="122" cy="145" rx="32" ry="15" fill="#34d399" transform="rotate(-30 122 145)" />
                                <ellipse cx="236" cy="118" rx="32" ry="15" fill="#059669" transform="rotate(20 236 118)" />
                                <ellipse cx="180" cy="90" rx="38" ry="18" fill="#065f46" transform="rotate(-8 180 90)" />
                                {/* Scan line */}
                                <line x1="100" y1="70" x2="260" y2="70" stroke="#059669" strokeWidth="1" strokeDasharray="5 4" opacity="0.5">
                                    <animate attributeName="y1" values="70;210;70" dur="3s" repeatCount="indefinite" />
                                    <animate attributeName="y2" values="70;210;70" dur="3s" repeatCount="indefinite" />
                                </line>
                                {/* Corner marks */}
                                <path d="M100 82 L100 70 L120 70" stroke="#059669" strokeWidth="2" fill="none" opacity="0.7" />
                                <path d="M260 82 L260 70 L240 70" stroke="#059669" strokeWidth="2" fill="none" opacity="0.7" />
                                <path d="M100 210 L100 222 L120 222" stroke="#059669" strokeWidth="2" fill="none" opacity="0.7" />
                                <path d="M260 210 L260 222 L240 222" stroke="#059669" strokeWidth="2" fill="none" opacity="0.7" />
                                {/* Dots */}
                                <circle cx="140" cy="143" r="4" fill="#f59e0b"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></circle>
                                <circle cx="220" cy="118" r="4" fill="#f59e0b"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
                                <text x="180" y="252" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">AI Crop Scanner</text>
                            </svg>
                        </div>
                        <div className="mt-4 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-emerald-700">AI Analysis Active</p>
                                <p className="text-sm font-bold text-slate-900">98.4% Accuracy</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats strip */}
            <div ref={statsRef} className="bg-slate-900 py-14">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
                    {[
                        { val: `${counts.diseases}+`, label: 'Disease Classes' },
                        { val: `${counts.accuracy}%`, label: 'Model Accuracy' },
                        { val: `${counts.farmers.toLocaleString()}+`, label: 'Farmers Protected' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={isStatsInView ? { opacity: 1 } : {}} transition={{ delay: i * 0.1 }}>
                            <p className="text-4xl font-black text-white mb-1">{s.val}</p>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Platform Features</p>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Everything your farm needs</h2>
                    <p className="text-slate-500 max-w-md mx-auto">One platform for crop diagnostics, treatment guidance, and farm analytics.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div key={f.title}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                            className="card p-7 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className={`h-11 w-11 ${f.color} rounded-xl flex items-center justify-center mb-5`}>
                                <f.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="bg-slate-900 rounded-2xl p-14 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">Ready to protect your harvest?</h2>
                    <p className="text-slate-400 mb-8">Join 10,000+ farmers already using SmartCrop.</p>
                    <button onClick={() => navigate('/register')} className="btn-primary px-8 py-3.5 rounded-xl text-base mx-auto">
                        Get Started Free <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-8">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-emerald-600 rounded flex items-center justify-center">
                            <Leaf className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">SmartCrop</span>
                    </div>
                    <p className="text-sm text-slate-400">© 2025 SmartCrop. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
