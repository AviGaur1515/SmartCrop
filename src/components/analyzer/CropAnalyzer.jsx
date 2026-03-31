import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, ArrowLeft, XCircle, Cpu, Sprout, Plus, X, ChevronDown,
    CheckCircle2, AlertTriangle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analysisService, cropService } from '../../services/api';
import UploadZone from './UploadZone';
import LoadingAnimation from './LoadingAnimation';
import ResultsDisplay from './ResultsDisplay';
import SmartPrescription from './SmartPrescription';

// ── Validation Modal ──────────────────────────────────────────
const ValidationModal = ({ result, selectedCrop, imageFile, onConfirm, onReject }) => {
    const [saving, setSaving] = useState(false);
    const aiCrop = result.cropName || result.class?.split('___')[0] || 'Unknown';
    const registeredName = selectedCrop?.nickname || null;
    const mismatch = registeredName && aiCrop.toLowerCase() !== (selectedCrop?.crop_type || '').toLowerCase();

    const handleYes = async () => {
        setSaving(true);
        // Use registered crop's type as the display name if farmer linked a crop
        const cropName = selectedCrop ? selectedCrop.crop_type : result.cropName;
        const saveResult = await analysisService.saveAnalysis({
            diseaseClass: result.class,
            confidence: result.confidence,
            cropName: cropName,
            cropId: selectedCrop?.id || null,
            imageFilename: imageFile?.name || 'upload.jpg'
        });
        setSaving(false);
        if (saveResult.success) {
            toast.success('Analysis saved to your history!');
            onConfirm();
        } else {
            toast.error('Failed to save: ' + saveResult.error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Header */}
                <div className="bg-emerald-600 px-6 py-5 flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-lg leading-tight">Analysis Complete</h3>
                        <p className="text-emerald-100 text-xs">Please verify the result before saving</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* AI result */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Detected</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                                ${result.confidence >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    result.confidence >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                {Math.round(result.confidence)}% confidence
                            </span>
                        </div>
                        <p className="font-bold text-slate-900 text-lg">
                            {aiCrop} <span className="text-slate-400 font-normal text-sm">— {result.class?.split('___')[1]?.replace(/_/g, ' ') || 'Unknown condition'}</span>
                        </p>
                    </div>

                    {/* Registered crop comparison */}
                    {registeredName ? (
                        <div className={`rounded-xl p-4 border ${mismatch ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {mismatch
                                    ? <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                <span className={`text-xs font-bold uppercase tracking-wide ${mismatch ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {mismatch ? 'Possible Mismatch Detected' : 'Matches Your Registered Crop'}
                                </span>
                            </div>
                            <p className="text-slate-700 font-semibold">
                                Your field: <span className="text-slate-900">{registeredName}</span>
                                <span className="text-slate-400 font-normal ml-2">({selectedCrop.crop_type})</span>
                            </p>
                            {mismatch && (
                                <p className="text-amber-700 text-xs mt-2 leading-relaxed">
                                    The AI identified the plant as <strong>{aiCrop}</strong>, but you registered this as <strong>{selectedCrop.crop_type}</strong>.
                                    If the image is clear and from the right crop, click Yes. Otherwise, upload a clearer photo.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <p className="text-slate-500 text-sm">No crop registered for this scan. The result will be saved unlinked.</p>
                        </div>
                    )}

                    <div className="h-px bg-slate-100" />

                    <p className="text-sm font-semibold text-slate-700 text-center">
                        Does this analysis match your actual crop?
                    </p>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onReject}
                            className="py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                            <X className="h-4 w-4" /> No — Try Again
                        </button>
                        <button onClick={handleYes} disabled={saving}
                            className="py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            {saving ? 'Saving…' : 'Yes, Save It'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── CropAnalyzer ──────────────────────────────────────────────
const CropAnalyzer = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [pendingResult, setPendingResult] = useState(null); // awaiting farmer validation
    const [confirmedResult, setConfirmedResult] = useState(null); // after Yes
    const [error, setError] = useState('');

    // Crop tracking state
    const [crops, setCrops] = useState([]);
    const [selectedCropId, setSelectedCropId] = useState('');
    const [showNewCropForm, setShowNewCropForm] = useState(false);
    const [newCrop, setNewCrop] = useState({ nickname: '', cropType: '', plantedDate: '' });
    const [cropsLoading, setCropsLoading] = useState(false);

    useEffect(() => {
        cropService.getCrops().then(r => { if (r.success) setCrops(r.data); });
    }, []);

    const selectedCropObj = crops.find(c => String(c.id) === String(selectedCropId)) || null;

    const handleImageSelect = (file) => { setSelectedImage(file); setPendingResult(null); setConfirmedResult(null); setError(''); };

    const handleAnalyze = async () => {
        if (!selectedImage) { const m = 'Please select an image first'; setError(m); toast.error(m); return; }
        setIsAnalyzing(true); setError('');
        try {
            const result = await analysisService.predict(selectedImage);
            if (result.success) {
                setPendingResult(result.data); // show validation modal
            } else {
                const m = result.error || 'Failed to analyze image';
                setError(m); toast.error(m);
            }
        } catch {
            const m = 'Failed to analyze. Ensure backend is running.';
            setError(m); toast.error(m);
        } finally { setIsAnalyzing(false); }
    };

    const handleConfirm = () => {
        setConfirmedResult(pendingResult);
        setPendingResult(null);
    };

    const handleReject = () => {
        setPendingResult(null);
        setSelectedImage(null);
        toast('Upload a clearer image of your plant', { icon: '📷' });
    };

    const handleReset = () => { setSelectedImage(null); setPendingResult(null); setConfirmedResult(null); setError(''); };

    const handleCreateCrop = async () => {
        if (!newCrop.nickname.trim() || !newCrop.cropType.trim()) { toast.error('Nickname and crop type are required'); return; }
        setCropsLoading(true);
        const result = await cropService.createCrop({
            nickname: newCrop.nickname.trim(), cropType: newCrop.cropType.trim(), plantedDate: newCrop.plantedDate || null
        });
        setCropsLoading(false);
        if (result.success) {
            const created = result.data.crop;
            setCrops(prev => [{ id: created.id, nickname: created.nickname, crop_type: created.cropType, planted_date: created.plantedDate }, ...prev]);
            setSelectedCropId(String(created.id));
            setNewCrop({ nickname: '', cropType: '', plantedDate: '' });
            setShowNewCropForm(false);
            toast.success(`Crop "${created.nickname}" registered!`);
        } else { toast.error(result.error); }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Validation Modal */}
            <AnimatePresence>
                {pendingResult && (
                    <ValidationModal
                        result={pendingResult}
                        selectedCrop={selectedCropObj}
                        imageFile={selectedImage}
                        onConfirm={handleConfirm}
                        onReject={handleReject}
                    />
                )}
            </AnimatePresence>

            {/* Page header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Leaf className="h-[18px] w-[18px] text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm leading-none">AI Diagnostics</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Crop Analyzer</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {error && (
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0" /> {error}
                    </motion.div>
                )}

                {isAnalyzing ? (
                    <LoadingAnimation />
                ) : confirmedResult ? (
                    <div className="space-y-6 pb-12">
                        <ResultsDisplay results={confirmedResult}
                            imagePreview={selectedImage ? URL.createObjectURL(selectedImage) : null} />
                        <SmartPrescription diseaseClass={confirmedResult.class} />
                        <div className="flex justify-center">
                            <button onClick={handleReset} className="btn-primary px-8 py-3 rounded-xl">
                                Analyze Another Crop
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="text-center max-w-lg mx-auto">
                            <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5">
                                <Cpu className="h-3.5 w-3.5" /> Neural Disease Classifier
                            </span>
                            <h2 className="text-3xl font-black text-slate-900 mb-3">Upload Your Leaf Image</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">For best results, ensure the leaf is clearly visible and centred with good lighting.</p>
                        </div>

                        <UploadZone onImageSelect={handleImageSelect} selectedImage={selectedImage} />

                        {/* Crop Selector */}
                        {selectedImage && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto space-y-3">
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    <Sprout className="h-3.5 w-3.5 text-emerald-600" /> Link to a Crop (optional)
                                </label>
                                <div className="relative">
                                    <select id="crop-select" value={selectedCropId}
                                        onChange={e => setSelectedCropId(e.target.value)}
                                        className="input-field appearance-none pr-10 cursor-pointer pl-4">
                                        <option value="">— No crop (unlinked scan) —</option>
                                        {crops.map(c => (
                                            <option key={c.id} value={c.id}>{c.nickname} ({c.crop_type})</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>

                                <button type="button" onClick={() => setShowNewCropForm(!showNewCropForm)}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors">
                                    {showNewCropForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                    {showNewCropForm ? 'Cancel' : 'Register a new crop'}
                                </button>

                                <AnimatePresence>
                                    {showNewCropForm && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nickname *</label>
                                                        <input type="text" placeholder="e.g., Backyard Tomatoes"
                                                            value={newCrop.nickname}
                                                            onChange={e => setNewCrop({ ...newCrop, nickname: e.target.value })}
                                                            className="input-field pl-3" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Crop Type *</label>
                                                        <input type="text" placeholder="e.g., Tomato"
                                                            value={newCrop.cropType}
                                                            onChange={e => setNewCrop({ ...newCrop, cropType: e.target.value })}
                                                            className="input-field pl-3" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Planted Date (optional)</label>
                                                    <input type="date" value={newCrop.plantedDate}
                                                        onChange={e => setNewCrop({ ...newCrop, plantedDate: e.target.value })}
                                                        className="input-field pl-3" />
                                                </div>
                                                <button onClick={handleCreateCrop} disabled={cropsLoading}
                                                    className="btn-primary w-full py-2.5 rounded-lg text-sm">
                                                    {cropsLoading ? 'Creating…' : '+ Add Crop'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {selectedImage && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                                <button onClick={handleAnalyze} className="btn-primary px-12 py-4 rounded-2xl text-base gap-2.5">
                                    <Cpu className="h-5 w-5" /> Run Analysis
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CropAnalyzer;
