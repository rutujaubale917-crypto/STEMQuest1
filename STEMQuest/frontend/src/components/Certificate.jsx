import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaAward } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Certificate = ({ courseName, dateCompleted }) => {
    const { user } = useAuth();
    const certificateRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-8">
            {/* The Certificate UI */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={certificateRef}
                className="relative w-full max-w-4xl p-2 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-xl shadow-2xl overflow-hidden print-certificate"
            >
                <div className="relative bg-[#0f172a] text-center p-12 sm:p-20 border-4 border-yellow-500 rounded-lg h-full flex flex-col items-center justify-center">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-64 h-64 border-[40px] border-yellow-500 rounded-full"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 border-[40px] border-yellow-500 rounded-full"></div>
                    </div>

                    <FaAward className="text-7xl text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    
                    <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-2 uppercase tracking-widest">
                        Certificate
                    </h1>
                    <h3 className="text-xl sm:text-2xl text-yellow-400 font-medium tracking-widest mb-10 uppercase">
                        Of Completion
                    </h3>

                    <p className="text-blue-100 text-lg mb-4 italic font-serif">
                        This is proudly presented to
                    </p>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 border-b-2 border-yellow-500/50 pb-2 inline-block px-8">
                        {user?.name || "Student Name"}
                    </h2>

                    <p className="text-blue-100 text-lg mb-6 italic font-serif max-w-xl">
                        for successfully completing the course and demonstrating a deep understanding of the concepts in
                    </p>

                    <h3 className="text-3xl font-bold text-yellow-400 mb-12 drop-shadow-md">
                        {courseName || "Advanced STEM Concepts"}
                    </h3>

                    <div className="flex justify-between w-full max-w-2xl px-8 items-end mt-4">
                        <div className="text-center">
                            <p className="text-white font-bold text-xl border-b border-white/30 pb-2 w-40">
                                {dateCompleted || new Date().toLocaleDateString()}
                            </p>
                            <p className="text-blue-200 text-sm mt-2 uppercase tracking-wider">Date</p>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-yellow-500 font-bold text-3xl font-serif border-b border-white/30 pb-2 w-40">
                                STEMQuest
                            </p>
                            <p className="text-blue-200 text-sm mt-2 uppercase tracking-wider">Organization</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Print/Download Button (Hidden when printing) */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-certificate, .print-certificate * {
                            visibility: visible;
                        }
                        .print-certificate {
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%) scale(0.9) !important;
                            width: 100vw !important;
                            margin: 0 !important;
                        }
                    }
                `}
            </style>

            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all text-lg"
            >
                <FaDownload /> Download / Print Certificate
            </button>
        </div>
    );
};

export default Certificate;
