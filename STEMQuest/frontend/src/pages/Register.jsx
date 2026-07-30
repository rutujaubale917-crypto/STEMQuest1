import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import loginIllustration from "../assets/login_illustration.png";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData);
            toast.success("Registration successful! Welcome to STEMQuest!");
            navigate("/dashboard");
        } catch (error) {
            console.log("REGISTER ERROR:", error);
            let message = "Registration failed";

            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    message = error.response.data.detail[0].msg;
                } else {
                    message = error.response.data.detail;
                }
            }

            if (message.toLowerCase().includes("already registered")) {
                toast.error("This email is already registered! Redirecting to Login...", { duration: 3000 });
                setTimeout(() => {
                    navigate("/login", { state: { email: formData.email } });
                }, 1200);
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full relative overflow-hidden bg-[#0f172a]">
            {/* Colorful Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse"></div>
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[60%] bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] opacity-50"></div>
            <div className="absolute bottom-[-20%] right-[20%] w-[60%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40"></div>
            
            {/* Left Side: Full height image section */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center z-10">
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        src={loginIllustration} 
                        alt="STEM Education" 
                        className="w-full max-w-lg object-contain mb-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700" 
                    />
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg"
                    >
                        Start Your Journey
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-xl text-pink-100 max-w-md font-medium leading-relaxed drop-shadow-md"
                    >
                        Join STEMQuest today and unlock a world of knowledge in Science, Technology, Engineering, and Mathematics.
                    </motion.p>
                </div>
            </div>

            {/* Right Side: Register Form (Glassmorphism) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative z-20">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
                >
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 rounded-full bg-white/10 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/10 backdrop-blur-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                            Create Account
                        </h2>
                        <p className="text-pink-100 text-lg">
                            Join STEMQuest to start learning
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-white/90 mb-1">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/40 focus:border-pink-400 transition-all text-white placeholder-white/50 font-medium backdrop-blur-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/90 mb-1">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/40 focus:border-pink-400 transition-all text-white placeholder-white/50 font-medium backdrop-blur-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/90 mb-1">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Create a password (min 6 chars)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/40 focus:border-pink-400 transition-all text-white placeholder-white/50 font-medium backdrop-blur-sm"
                            />
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-2xl hover:opacity-90 transition-all font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] disabled:opacity-50 transform hover:-translate-y-1 border border-white/20"
                            >
                                {loading ? "Creating Account..." : "Register Now"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-blue-100 font-medium">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-white font-extrabold hover:text-pink-300 transition-colors ml-1 underline decoration-pink-500/50 decoration-2 underline-offset-4"
                        >
                            Login here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;