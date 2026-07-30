import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaMicrophone, FaPaperPlane, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const MOCK_ANSWERS = {
    "hello": "Hello there! I am your STEMQuest AI Assistant. How can I help you learn today?",
    "hi": "Hi! Ready to learn some Science or Math?",
    "who are you": "I am the STEMQuest Voice AI. I can answer your questions about STEM topics!",
    "what is python": "Python is a high-level, interpreted programming language known for its readability and versatile applications in AI, web development, and data science.",
    "what is dna": "DNA, or Deoxyribonucleic acid, is the molecule that carries genetic information for the development and functioning of an organism.",
    "what is calculus": "Calculus is the mathematical study of continuous change, covering rates of change (derivatives) and accumulation of quantities (integrals).",
    "what is physics": "Physics is the branch of science concerned with the nature and properties of matter and energy. It includes mechanics, heat, light, and more!",
    "how to learn react": "To learn React, start with the basics of components, state, and props, then move on to hooks like useState and useEffect. Practice by building projects!",
    "default": "That is a great question! While I am currently a mock AI, in the future I will be connected to a powerful brain to give you a detailed answer. Keep exploring STEM!"
};

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your STEM AI. You can type or use your voice to ask me questions!", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                // Optionally auto-send after voice input
                // handleSendMessage(transcript); 
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const speak = (text) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInputText("");
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase().trim();
        for (const key in MOCK_ANSWERS) {
            if (lowerText.includes(key) && key !== "default") {
                return MOCK_ANSWERS[key];
            }
        }
        return MOCK_ANSWERS["default"];
    };

    const handleSendMessage = (overrideText = null) => {
        const textToSend = overrideText || inputText;
        if (!textToSend.trim()) return;

        // Add User Message
        setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
        setInputText("");
        setIsListening(false);
        recognitionRef.current?.stop();

        // Simulate thinking and add Bot Message
        setTimeout(() => {
            const answer = getBotResponse(textToSend);
            setMessages(prev => [...prev, { text: answer, sender: 'bot' }]);
            speak(answer);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 w-80 sm:w-96 bg-[#0f172a]/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden flex flex-col h-[500px] max-h-[70vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <FaRobot className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">STEMQuest AI</h3>
                                    <p className="text-blue-100 text-xs font-medium">Voice Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                                    className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                                    title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                                >
                                    {voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/20">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm ${
                                            msg.sender === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                                : 'bg-white/10 border border-white/10 text-white rounded-bl-sm backdrop-blur-md'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white/5 border-t border-white/10 shrink-0">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleListen}
                                    className={`p-3 rounded-xl transition-all ${
                                        isListening 
                                            ? 'bg-red-500/80 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
                                            : 'bg-white/10 text-blue-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                    title="Voice Input"
                                >
                                    <FaMicrophone />
                                </button>
                                
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                />
                                
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputText.trim()}
                                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] border-2 border-white/20 relative group"
                >
                    <FaRobot className="text-3xl text-white group-hover:animate-bounce" />
                    {/* Notification Dot */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full"></span>
                </motion.button>
            )}
        </div>
    );
};

export default ChatbotWidget;
