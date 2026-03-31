import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sprout, Plus, Trash2, TrendingUp, Calendar, ScanLine,
    X, Loader2, FlaskConical, AlertCircle, Leaf, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { cropService } from '../../services/api';
import { getDiseaseName } from '../../utils/remedyUtils';
import toast from 'react-hot-toast';

const fmtDate = (ds) => {
    try { return new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return ds; }
};

const fmtPlanted = (ds) => {
    if (!ds) return '—';
    try { return new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return ds; }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const isHealthy = d.disease_class?.toLowerCase().includes('healthy');
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-sm">
            <p className="font-bold text-slate-700 mb-1">{label}</p>
            <p className={`font-semibold ${isHealthy ? 'text-emerald-600' : 'text-red-500'}`}>
                {Math.round(d.confidence)}% confidence
            </p>
            <p className="text-slate-500 text-xs mt-0.5">{getDiseaseName(d.disease_class)}</p>
        </div>
    );
};

const AddCropModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ nickname: '', cropType: '', plantedDate: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nickname.trim() || !form.cropType.trim()) { toast.error('Nickname and crop type are required'); return; }
        setLoading(true);
        const result = await cropService.createCrop({ nickname: form.nickname.trim(), cropType: form.cropType.trim(), plantedDate: form.plantedDate || null });
        setLoading(false);
        if (result.success) {
            toast.success(`"${form.nickname}" added!`);
            onCreated(result.data.crop);
            onClose();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <Sprout className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Register New Crop</h3>
                            <p className="text-xs text-slate-400">Track this crop's health over time</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nickname *</label>
                        <input type="text" placeholder="e.g., Backyard Tomatoes" value={form.nickname}
                            onChange={e => setForm({ ...form, nickname: e.target.value })}
                            className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Crop Type *</label>
                        <input type="text" placeholder="e.g., Tomato, Blueberry, Corn" value={form.cropType}
                            onChange={e => setForm({ ...form, cropType: e.target.value })}
                            className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Planted Date (optional)</label>
                        <input type="date" value={form.plantedDate}
                            onChange={e => setForm({ ...form, plantedDate: e.target.value })}
                            className="input-field" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '+ Register Crop'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const TrendPanel = ({ crop, onClose }) => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [injecting, setInjecting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const r = await cropService.getCropTrend(crop.id);
        if (r.success) {
            setTrendData(r.data.trend.map(t => ({
                ...t,
                date: fmtDate(t.created_at),
                isHealthy: t.disease_class?.toLowerCase().includes('healthy')
            })));
        }
        setLoading(false);
    }, [crop.id]);

    useEffect(() => { load(); }, [load]);

    const handleInject = async () => {
        setInjecting(true);
        const r = await cropService.injectTestData(crop.id);
        setInjecting(false);
        if (r.success) {
            toast.success(`Injected ${r.data.data.length} test entries!`);
            load();
        } else {
            toast.error(r.error);
        }
    };

    const lineColor = (d) => {
        if (!d || d.length === 0) return '#059669';
        const latest = d[d.length - 1];
        return latest?.isHealthy ? '#059669' : '#ef4444';
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="card rounded-2xl p-6 border border-emerald-100 shadow-lg"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{crop.nickname} — Health Trend</h3>
                        <p className="text-xs text-slate-400">{crop.crop_type} • Disease confidence over time</p>
                    </div>
                </div>
                <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
            ) : trendData.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center gap-3">
                    <ScanLine className="h-8 w-8 text-slate-200" />
                    <p className="text-slate-400 text-sm font-medium">No scan data yet.</p>
                    <p className="text-slate-300 text-xs">Run analyses linked to this crop, or inject test data below.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                        <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Alert', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="confidence" stroke={lineColor(trendData)}
                            strokeWidth={2.5} dot={{ r: 5, fill: lineColor(trendData), stroke: 'white', strokeWidth: 2 }}
                            activeDot={{ r: 7 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {/* Dev inject panel */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                    <FlaskConical className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-semibold text-amber-600">Dev Mode</span> — Inject backdated test scans to preview the trend chart
                </p>
                <button onClick={handleInject} disabled={injecting}
                    className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                    {injecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FlaskConical className="h-3.5 w-3.5" />}
                    Inject 6 Weeks of Test Data
                </button>
            </div>
        </motion.div>
    );
};

const CropCard = ({ crop, onDelete, onViewTrend }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${crop.nickname}"? This will unlink all its analyses.`)) return;
        setDeleting(true);
        const r = await cropService.deleteCrop(crop.id);
        setDeleting(false);
        if (r.success) { toast.success(`"${crop.nickname}" deleted`); onDelete(crop.id); }
        else toast.error(r.error);
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="card rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">{crop.nickname}</h3>
                        <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mt-0.5">
                            {crop.crop_type}
                        </span>
                    </div>
                </div>
                <button onClick={handleDelete} disabled={deleting}
                    className="h-8 w-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 text-slate-300 transition-all">
                    {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
            </div>

            {crop.planted_date && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                    <Calendar className="h-3.5 w-3.5" /> Planted {fmtPlanted(crop.planted_date)}
                </p>
            )}

            <button onClick={() => onViewTrend(crop)}
                className="w-full mt-2 btn-primary py-2 rounded-xl text-sm gap-2">
                <TrendingUp className="h-4 w-4" /> View Health Trend
            </button>
        </motion.div>
    );
};

const CropsPage = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);

    useEffect(() => {
        cropService.getCrops().then(r => {
            if (r.success) setCrops(r.data);
            else toast.error('Failed to load crops');
            setLoading(false);
        });
    }, []);

    const handleCreated = (newCrop) => {
        setCrops(prev => [{
            id: newCrop.id,
            nickname: newCrop.nickname,
            crop_type: newCrop.cropType,
            planted_date: newCrop.plantedDate
        }, ...prev]);
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-full">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">My Crops</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Track and monitor your registered crop fields</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn-primary px-5 py-2.5 rounded-xl gap-2">
                    <Plus className="h-4 w-4" /> Add Crop
                </button>
            </div>

            {/* Trend Panel */}
            <AnimatePresence>
                {selectedCrop && (
                    <div className="mb-8">
                        <TrendPanel crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
                    </div>
                )}
            </AnimatePresence>

            {/* Crops Grid */}
            {crops.length === 0 ? (
                <div className="card rounded-2xl p-16 text-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sprout className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">No crops registered yet</h3>
                    <p className="text-slate-400 text-sm mb-6">Add your first crop field to start tracking disease trends over time.</p>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary px-8 py-3 rounded-xl">
                        + Register Your First Crop
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {crops.map(crop => (
                        <CropCard key={crop.id} crop={crop}
                            onDelete={(id) => {
                                setCrops(prev => prev.filter(c => c.id !== id));
                                if (selectedCrop?.id === id) setSelectedCrop(null);
                            }}
                            onViewTrend={(c) => setSelectedCrop(prev => prev?.id === c.id ? null : c)}
                        />
                    ))}
                </div>
            )}

            {/* Add Crop Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddCropModal onClose={() => setShowAddModal(false)} onCreated={handleCreated} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CropsPage;
