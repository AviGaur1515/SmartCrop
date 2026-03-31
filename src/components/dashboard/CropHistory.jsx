import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, Download, ChevronRight, Leaf, X, FileText, Trash2 } from 'lucide-react';
import { analysisService } from '../../services/api';
import toast from 'react-hot-toast';
import { getRemedyData, getCropName, getDiseaseName } from '../../utils/remedyUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';   // jspdf-autotable v5

const CropHistory = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnalysis, setSelected] = useState(null);
    const [showDeleteConfirm, setDelConfirm] = useState(false);

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        const r = await analysisService.getHistory(20);
        if (r.success) setAnalyses(r.data);
        else toast.error('Failed to load history');
        setLoading(false);
    };

    const fmtDate = (ds) => new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const fmtDT = (ds) => {
        try { return new Date(ds.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }); }
        catch { return ds; }
    };

    const getStatus = (diseaseClass, confidence) => {
        if (!diseaseClass) return 'Unknown';
        if (diseaseClass.toLowerCase().includes('healthy')) return 'Healthy';
        if (confidence >= 90) return 'High Risk - Immediate Action';
        if (confidence >= 70) return 'Moderate - Monitor Closely';
        return 'Low Risk - Keep Watch';
    };

    const confColor = (c) =>
        c >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
            c >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                'text-red-700 bg-red-50 border-red-200';

    const handleDeleteSingle = async (id, e) => {
        e.stopPropagation();
        const r = await analysisService.deleteHistory(id);
        if (r.success) {
            setAnalyses(prev => prev.filter(a => a.id !== id));
            toast.success('Record deleted');
            if (selectedAnalysis?.id === id) setSelected(null);
        } else toast.error(r.error || 'Delete failed');
    };

    const handleDeleteAll = async () => {
        const r = await analysisService.deleteAllHistory();
        if (r.success) { setAnalyses([]); setDelConfirm(false); toast.success('History cleared'); }
        else toast.error(r.error || 'Failed to clear history');
    };

    /*  ── PDF export ──
        jspdf-autotable v5 uses:  autoTable(doc, config)
        Status column avoids emoji (they render as garbage in jsPDF default font) */
    const handleExportPDF = () => {
        if (!analyses.length) { toast.error('No data to export'); return; }
        try {
            const doc = new jsPDF();

            // Header bar
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 36, 'F');
            doc.setFillColor(5, 150, 105);
            doc.rect(0, 34, 210, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20); doc.setFont('helvetica', 'bold');
            doc.text('SmartCrop Farm Analysis Report', 105, 18, { align: 'center' });
            doc.setFontSize(9); doc.setFont('helvetica', 'normal');
            doc.text('Generated: ' + new Date().toLocaleDateString('en-IN'), 105, 28, { align: 'center' });

            // Overview stats
            const healthy = analyses.filter(a => a.disease_class?.toLowerCase().includes('healthy')).length;
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(11); doc.setFont('helvetica', 'bold');
            doc.text('Farm Overview', 14, 50);
            doc.setFontSize(9); doc.setFont('helvetica', 'normal');
            doc.text(`Total Scans: ${analyses.length}   |   Healthy: ${healthy}   |   Disease Detected: ${analyses.length - healthy}`, 14, 58);

            // Main analysis table
            autoTable(doc, {
                startY: 66,
                head: [['Date', 'Crop', 'Diagnosis', 'Confidence', 'Status']],
                body: analyses.map(a => [
                    fmtDate(a.created_at),
                    getCropName(a.disease_class),
                    getDiseaseName(a.disease_class),
                    Math.round(a.confidence) + '%',
                    getStatus(a.disease_class, a.confidence),
                ]),
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
                bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [30, 30, 30] },
                alternateRowStyles: { fillColor: [247, 250, 252] },
                columnStyles: { 3: { halign: 'center' }, 4: { halign: 'center' } },
                didParseCell: (data) => {
                    if (data.column.index === 4 && data.section === 'body') {
                        const val = data.cell.raw;
                        if (val === 'Healthy') data.cell.styles.textColor = [5, 150, 105];
                        else if (val === 'High Risk - Immediate Action') data.cell.styles.textColor = [185, 28, 28];
                        else if (val === 'Moderate - Monitor Closely') data.cell.styles.textColor = [180, 83, 9];
                        else data.cell.styles.textColor = [100, 116, 139];
                    }
                }
            });

            // Remedy details section
            const mainY = doc.lastAutoTable?.finalY ?? 140;
            doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
            doc.text('Remedy & Action Details', 14, mainY + 14);

            autoTable(doc, {
                startY: mainY + 20,
                head: [['Crop', 'Diagnosis', 'Immediate Action', 'Prevention']],
                body: analyses.filter(a => !a.disease_class?.toLowerCase().includes('healthy')).map(a => {
                    const rem = getRemedyData(a.disease_class);
                    return [
                        getCropName(a.disease_class),
                        rem.diagnosis?.substring(0, 80) + (rem.diagnosis?.length > 80 ? '…' : ''),
                        (rem.immediateActions?.[0] || rem.immediateAction || '—'),
                        (rem.preventionSteps?.[0] || rem.prevention || '—'),
                    ];
                }),
                theme: 'striped',
                headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { fontSize: 7.5, cellPadding: 3, textColor: [50, 50, 50] },
                columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 58 }, 2: { cellWidth: 52 }, 3: { cellWidth: 52 } },
            });

            const finalY = doc.lastAutoTable?.finalY ?? 200;
            doc.setFontSize(7.5); doc.setTextColor(160, 160, 160);
            doc.text('SmartCrop AI - For accurate agricultural diagnostics and professional field use.', 105, finalY + 12, { align: 'center' });

            doc.save(`smartcrop_report_${Date.now()}.pdf`);
            toast.success('PDF exported successfully');
        } catch (err) {
            console.error(err);
            toast.error('PDF export failed: ' + err.message);
        }
    };

    const handleExportCSV = () => {
        if (!analyses.length) { toast.error('No data to export'); return; }
        try {
            const headers = ['Date', 'Crop', 'Disease', 'Confidence(%)', 'Status', 'Diagnosis', 'Immediate Action', 'Prevention'];
            const rows = analyses.map(a => {
                const rem = getRemedyData(a.disease_class);
                return [
                    fmtDT(a.created_at),
                    getCropName(a.disease_class),
                    getDiseaseName(a.disease_class),
                    Math.round(a.confidence),
                    getStatus(a.disease_class, a.confidence),
                    rem.diagnosis || '—',
                    rem.immediateActions?.[0] || rem.immediateAction || '—',
                    rem.preventionSteps?.[0] || rem.prevention || '—',
                ];
            });
            const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `smartcrop_data_${Date.now()}.csv`;
            link.click();
            toast.success('CSV exported');
        } catch { toast.error('CSV export failed'); }
    };

    if (loading) return (
        <div className="card p-12 rounded-2xl text-center">
            <div className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">Loading history…</p>
        </div>
    );

    return (
        <>
            <div className="card rounded-2xl p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <History className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Analysis History</h2>
                            <p className="text-xs text-slate-400 font-medium">{analyses.length} total records</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleExportCSV} className="btn-secondary text-xs px-3.5 py-2 rounded-lg gap-1.5">
                            <Download className="h-3.5 w-3.5" /> CSV
                        </button>
                        <button onClick={handleExportPDF} className="btn-primary text-xs px-3.5 py-2 rounded-lg gap-1.5">
                            <FileText className="h-3.5 w-3.5" /> PDF Report
                        </button>
                        {analyses.length > 0 && (
                            <button onClick={() => setDelConfirm(true)}
                                className="btn-secondary text-xs px-3.5 py-2 rounded-lg gap-1.5 !text-red-600 !border-red-200 hover:!bg-red-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Clear All
                            </button>
                        )}
                    </div>
                </div>

                {analyses.length === 0 ? (
                    <div className="py-16 text-center">
                        <Leaf className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium text-sm">No history yet. Start scanning your crops.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-0.5 custom-scrollbar">
                        {analyses.map((a, i) => (
                            <motion.div key={a.id}
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => setSelected({ ...a, remedy: getRemedyData(a.disease_class) })}
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer group transition-all"
                            >
                                <div className="h-9 w-9 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Leaf className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900 text-sm">{getCropName(a.disease_class)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${confColor(a.confidence)}`}>{Math.round(a.confidence)}%</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">{getDiseaseName(a.disease_class)}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-slate-300 hidden sm:block">{fmtDate(a.created_at)}</span>
                                    <button onClick={e => handleDeleteSingle(a.id, e)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 text-slate-300 transition-all"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-emerald-600 transition-colors">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Delete confirm ── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setDelConfirm(false)}
                    >
                        <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Clear All History?</h3>
                            <p className="text-sm text-slate-500 mb-6">This permanently deletes all {analyses.length} records. This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDelConfirm(false)} className="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                                <button onClick={handleDeleteAll} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">Delete All</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Detail modal ── */}
            <AnimatePresence>
                {selectedAnalysis && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl custom-scrollbar"
                        >
                            {/* Modal header */}
                            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">Analysis Details</h3>
                                <button onClick={() => setSelected(null)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Summary */}
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <Leaf className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h2 className="text-xl font-black text-slate-900">{getCropName(selectedAnalysis.disease_class)}</h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${confColor(selectedAnalysis.confidence)}`}>
                                                {Math.round(selectedAnalysis.confidence)}% confidence
                                            </span>
                                        </div>
                                        <p className="text-slate-600 font-medium">{getDiseaseName(selectedAnalysis.disease_class)}</p>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {fmtDT(selectedAnalysis.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100" />

                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Diagnosis</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{selectedAnalysis.remedy.diagnosis}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-3">Immediate Actions</p>
                                        <ul className="space-y-2">
                                            {(selectedAnalysis.remedy.immediateActions || []).map((a, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <span className="mt-2 h-1 w-1 rounded-full bg-amber-500 shrink-0" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">Prevention</p>
                                        <ul className="space-y-2">
                                            {(selectedAnalysis.remedy.preventionSteps || []).map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <span className="mt-2 h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CropHistory;
