import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplet, Sun, TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        soilType: '',
        climateZone: '',
        waterAvailability: '',
        budget: ''
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
    const climateZones = ['Tropical', 'Subtropical', 'Temperate', 'Arid', 'Semi-Arid'];
    const waterLevels = ['Abundant', 'Moderate', 'Limited', 'Scarce'];
    const budgetRanges = ['Low ($)', 'Medium ($$)', 'High ($$$)'];

    // Simple recommendation logic (can be enhanced with actual algorithm/API)
    const cropDatabase = {
        'Loamy_Tropical_Abundant': ['Rice', 'Sugarcane', 'Banana', 'Coconut'],
        'Clay_Subtropical_Moderate': ['Wheat', 'Cotton', 'Chickpea', 'Mustard'],
        'Sandy_Arid_Limited': ['Millet', 'Groundnut', 'Watermelon', 'Cactus'],
        'Silty_Temperate_Moderate': ['Corn', 'Soybeans', 'Potatoes', 'Tomatoes'],
        default: ['Tomato', 'Lettuce', 'Spinach', 'Herbs']
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.soilType || !formData.climateZone || !formData.waterAvailability) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        // Simulate AI processing
        setTimeout(() => {
            const key = `${formData.soilType}_${formData.climateZone}_${formData.waterAvailability}`;
            const crops = cropDatabase[key] || cropDatabase.default;

            setRecommendations({
                crops,
                confidence: 85 + Math.floor(Math.random() * 10),
                season: 'Spring/Summer',
                expectedYield: 'High'
            });
            setLoading(false);
            toast.success('Recommendations generated!');
        }, 1500);
    };

    return (
        <div className="glass-card rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center space-x-5 mb-10">
                <div className="h-16 w-16 bg-primary gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sprout className="h-9 w-9 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-950 tracking-tight">
                        Crop <span className="text-primary italic">Recommendation</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500">AI-powered suggestions for your farm</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Soil Type */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Soil Type *
                        </label>
                        <div className="relative">
                            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="soilType"
                                value={formData.soilType}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                required
                            >
                                <option value="">Select soil type</option>
                                {soilTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Climate Zone */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Climate Zone *
                        </label>
                        <div className="relative">
                            <Sun className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="climateZone"
                                value={formData.climateZone}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                required
                            >
                                <option value="">Select climate</option>
                                {climateZones.map(zone => (
                                    <option key={zone} value={zone}>{zone}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Water Availability */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Water Availability *
                        </label>
                        <div className="relative">
                            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="waterAvailability"
                                value={formData.waterAvailability}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                required
                            >
                                <option value="">Select water level</option>
                                {waterLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Budget Range
                        </label>
                        <div className="relative">
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            >
                                <option value="">Select budget</option>
                                {budgetRanges.map(range => (
                                    <option key={range} value={range}>{range}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-primary text-slate-950 py-5 rounded-[2rem] font-black text-lg tracking-tight shadow-2xl transition-all flex items-center justify-center space-x-3"
                >
                    {loading ? (
                        <>
                            <div className="h-6 w-6 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <span>Get Recommendations</span>
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </motion.button>
            </form>

            {recommendations && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 space-y-6"
                >
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                    <div>
                        <h3 className="text-xl font-display font-black text-slate-950 mb-4">Recommended Crops</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendations.crops.map((crop, index) => (
                                <motion.div
                                    key={crop}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 text-center"
                                >
                                    <Sprout className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="font-bold text-slate-950">{crop}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Confidence</p>
                            <p className="text-2xl font-black text-green-600">{recommendations.confidence}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Best Season</p>
                            <p className="text-sm font-black text-blue-600">{recommendations.season}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Expected Yield</p>
                            <p className="text-sm font-black text-amber-600">{recommendations.expectedYield}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CropRecommendation;
