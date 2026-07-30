import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FaUserCircle, FaSignOutAlt, FaGraduationCap } from 'react-icons/fa'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-[#0f172a]/70 backdrop-blur-md border-b border-white/10 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <FaGraduationCap className="text-blue-400 text-2xl" />
                        <span className="text-xl font-extrabold text-white tracking-wide">STEMQuest</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <Link to="/courses" className="text-blue-100 hover:text-white font-medium transition-colors">
                                    Courses
                                </Link>
                                <Link to="/leaderboard" className="text-blue-100 hover:text-white font-medium transition-colors">
                                    Leaderboard
                                </Link>
                                <Link to="/sandbox" className="text-blue-100 hover:text-white font-medium transition-colors flex items-center gap-1">
                                    <span className="text-green-400">{'</>'}</span> Sandbox
                                </Link>
                                <Link to="/dashboard" className="text-blue-100 hover:text-white font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
                                    <Link to="/profile">
                                        <FaUserCircle className="text-2xl text-blue-200 hover:text-white transition-colors shadow-sm" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-pink-300 hover:text-pink-100 transition-colors"
                                    >
                                        <FaSignOutAlt className="text-xl drop-shadow-md" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-5 py-2 text-white font-medium hover:text-blue-200 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar