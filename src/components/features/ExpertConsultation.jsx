import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Clock, FileText, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ExpertConsultation = () => {
    const [formData, setFormData] = useState({
        expertType: '',
        preferredDate: '',
        preferredTime: '',
        issue: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const expertTypes = [
        'Plant Pathologist',
        'Soil Scientist',
        'Crop Specialist',
        'Irrigation Expert',
        'Pest Control Advisor',
        'Agricultural Engineer'
    ];

    const timeSlots = [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.expertType || !formData.preferredDate || !formData.preferredTime || !formData.issue) {
            toast.error('Please fill in all fields');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            toast.success('Consultation request submitted successfully!');
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="glass-card rounded-[3rem] p-16 shadow-2xl text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="h-14 w-14 text-green-600" />
                </motion.div>

                <h3 className="text-3xl font-display font-black text-slate-950 mb-4">
                    Request Submitted!
                </h3>

                <p className="text-slate-600 font-medium mb-6 max-w-md mx-auto">
                    Your consultation request has been received. An expert will contact you within 24 hours to confirm your appointment.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 mb-8 max-w-md mx-auto text-left">
                    <h4 className="font-bold text-slate-950 mb-4">Appointment Details:</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Expert:</span>
                            <span className="font-bold text-slate-950">{formData.expertType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Date:</span>
                            <span className="font-bold text-slate-950">{new Date(formData.preferredDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Time:</span>
                            <span className="font-bold text-slate-950">{formData.preferredTime}</span>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({
                            expertType: '',
                            preferredDate: '',
                            preferredTime: '',
                            issue: ''
                        });
                    }}
                    className="px-8 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                    Book Another Consultation
                </motion.button>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center space-x-5 mb-10">
                <div className="h-16 w-16 bg-primary gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <UserCheck className="h-9 w-9 text-slate-950" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-950 tracking-tight">
                        Expert <span className="text-primary italic">Consultation</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500">Get personalized advice from agricultural specialists</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expert Type */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Expert Type *
                        </label>
                        <div className="relative">
                            <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="expertType"
                                value={formData.expertType}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Select expert type</option>
                                {expertTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preferred Date */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Preferred Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Preferred Time */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Preferred Time Slot *
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Select time slot</option>
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Describe Your Issue *
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-6 h-5 w-5 text-slate-400" />
                            <textarea
                                name="issue"
                                value={formData.issue}
                                onChange={handleChange}
                                required
                                rows={6}
                                placeholder="Describe the crop issue you're facing in detail..."
                                className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-400 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-black text-blue-900 mb-1">💡 Pro Tip</h4>
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            For faster diagnosis, consider uploading photos of the affected crops when meeting with the expert. Include images showing leaves, stems, and overall plant condition.
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full gradient-primary text-slate-950 py-5 rounded-[2rem] font-black text-lg tracking-tight shadow-2xl transition-all flex items-center justify-center space-x-3"
                >
                    <span>Request Consultation</span>
                    <Send className="h-5 w-5" />
                </motion.button>

                <p className="text-center text-xs text-slate-500 font-medium">
                    Consultations are typically confirmed within 24 hours. You'll receive an email with meeting details.
                </p>
            </form>
        </div>
    );
};

export default ExpertConsultation;
