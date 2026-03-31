import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const UploadZone = ({ onImageSelect, selectedImage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onImageSelect(null);
        setPreview(null);
    };

    return (
        <div className="w-full">
            {preview ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">Image Sample</h3>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-0.5">Ready for Analysis</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRemove}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors border border-red-100"
                        >
                            <X className="h-5 w-5" />
                        </motion.button>
                    </div>

                    <div className="relative group rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner">
                        <img
                            src={preview}
                            alt="Selected crop"
                            className="w-full h-auto max-h-[500px] object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative glass-card rounded-[3rem] p-16 shadow-2xl
                        border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${isDragging
                            ? 'border-primary bg-primary/10 scale-[1.02]'
                            : 'border-slate-200 hover:border-primary hover:bg-white/50'
                        }
                    `}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    />

                    {/* Scanning Line Animation */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)] z-0 pointer-events-none"
                    ></motion.div>

                    <div className="relative z-10 text-center pointer-events-none">
                        <motion.div
                            animate={isDragging ? { scale: 1.2, y: -10 } : { scale: 1, y: 0 }}
                            className="mx-auto h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20"
                        >
                            {isDragging ? (
                                <ImageIcon className="h-12 w-12 text-primary" />
                            ) : (
                                <Upload className="h-12 w-12 text-primary" />
                            )}
                        </motion.div>

                        <h3 className="text-3xl font-display font-black text-slate-950 mb-3 tracking-tight">
                            {isDragging ? 'Release to Scan' : 'Drop specimen here'}
                        </h3>
                        <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">
                            Analyze plant leaves instantly with our advanced neural diagnostic network.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">RAW</span>
                            <span className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">JPG</span>
                            <span className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">TIFF</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default UploadZone;
