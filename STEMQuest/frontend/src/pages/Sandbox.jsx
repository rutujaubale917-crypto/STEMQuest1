import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCode, FaEraser, FaTerminal } from 'react-icons/fa';

const Sandbox = () => {
    const [code, setCode] = useState('print("Hello, STEMQuest!")\n\n# Try writing some Python code here!\nfor i in range(5):\n    print(f"STEM is awesome {i}")');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRunCode = () => {
        setIsRunning(true);
        setOutput('Running code...\n');

        // Mock execution for demo purposes
        setTimeout(() => {
            if (code.includes('print')) {
                // Extremely simple and naive mock parser just to show something
                const printMatches = code.match(/print\((.*?)\)/g);
                let mockOutput = '';
                if (printMatches) {
                    printMatches.forEach(match => {
                        let inner = match.replace('print(', '').replace(')', '');
                        inner = inner.replace(/['"f]/g, ''); // strip quotes and f string prefix
                        mockOutput += inner + '\n';
                    });
                }
                
                if (code.includes('for i in range(5)')) {
                    for(let i=0; i<5; i++){
                        mockOutput += `STEM is awesome ${i}\n`;
                    }
                }
                
                setOutput(mockOutput || 'Code executed successfully with no output.');
            } else {
                setOutput('Code executed successfully.');
            }
            setIsRunning(false);
        }, 1000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl mx-auto space-y-6"
        >
            <div className="bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-2xl">
                        <FaCode className="text-4xl text-white drop-shadow-md" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                            Live Coding Sandbox 💻
                        </h1>
                        <p className="text-blue-100 font-medium mt-1">
                            Write, run, and experiment with Python code directly in your browser.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Editor Column */}
                <div className="flex flex-col bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-900/50 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </span>
                            <span className="ml-2 text-sm font-bold text-slate-300 font-mono">main.py</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCode('')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
                            >
                                <FaEraser /> Clear
                            </button>
                            <button 
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="flex items-center gap-2 px-5 py-1.5 bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-extrabold rounded-lg transition shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50"
                            >
                                <FaPlay /> {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full bg-transparent text-blue-300 font-mono text-sm p-6 focus:outline-none resize-none leading-relaxed"
                        spellCheck="false"
                    />
                </div>

                {/* Output Column */}
                <div className="flex flex-col bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center gap-2 shrink-0">
                        <FaTerminal className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-300 font-mono">Terminal Output</span>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed">
                            {output || <span className="text-slate-600">No output yet. Click 'Run Code' to execute.</span>}
                        </pre>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Sandbox;
