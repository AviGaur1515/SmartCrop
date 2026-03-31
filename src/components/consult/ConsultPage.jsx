import React from 'react';
import { Users, Video, Calendar, MessageSquare, Sparkles } from 'lucide-react';

const ConsultPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white border text-center border-slate-200 shadow-sm rounded-3xl p-10 max-w-2xl w-full flex flex-col items-center">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex gap-2 items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-blue-600" />
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-4">
                    Expert Consultant Network
                </h1>
                
                <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    Sometimes AI needs a human touch. Connect directly with certified agronomists and plant pathologists for severe or complex cases.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 w-full mb-8">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center">
                        <Video className="h-6 w-6 text-blue-500 mb-3" />
                        <span className="text-sm font-semibold text-slate-700">1-on-1<br/>Video Calls</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center">
                        <MessageSquare className="h-6 w-6 text-blue-500 mb-3" />
                        <span className="text-sm font-semibold text-slate-700">Secure<br/>Messaging</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center">
                        <Calendar className="h-6 w-6 text-blue-500 mb-3" />
                        <span className="text-sm font-semibold text-slate-700">Priority<br/>Booking</span>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-full font-bold shadow-sm">
                    <Sparkles className="h-5 w-5" />
                    Expert Onboarding in Progress...
                </div>
            </div>
        </div>
    );
};

export default ConsultPage;
