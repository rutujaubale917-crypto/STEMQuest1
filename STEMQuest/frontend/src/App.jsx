import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Sandbox from "./pages/Sandbox";
import ChatbotWidget from "./components/ChatbotWidget";

const RootHandler = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    const location = useLocation();
    // No padding for login/register/home for full-screen designs
    const isFullScreenPage = ['/login', '/register', '/', '/home'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white relative overflow-x-hidden">
            {/* Global Colorful Animated Background Elements for the whole project */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {!isFullScreenPage && <Navbar />}
                <main className={`flex-grow ${isFullScreenPage ? "w-full" : "container mx-auto px-4 py-8"}`}>
                    <Routes>
                        <Route path="/" element={<RootHandler />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <StudentDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/courses" element={
                            <ProtectedRoute>
                                <Courses />
                            </ProtectedRoute>
                        } />
                        <Route path="/courses/:courseId" element={
                            <ProtectedRoute>
                                <CourseDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/quiz/:quizId" element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        } />
                        <Route path="/result/:attemptId" element={
                            <ProtectedRoute>
                                <Result />
                            </ProtectedRoute>
                        } />
                        <Route path="/leaderboard" element={
                            <ProtectedRoute>
                                <Leaderboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/sandbox" element={
                            <ProtectedRoute>
                                <Sandbox />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <ChatbotWidget />
            </div>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: 'rgba(30, 41, 59, 0.9)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                }}
            />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;