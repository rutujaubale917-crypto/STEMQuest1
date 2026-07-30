import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    FaHome, FaBook, FaTrophy, FaUser,
    FaChartLine, FaCog, FaSignOutAlt
} from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const { logout } = useAuth()

    const menuItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/courses', icon: FaBook, label: 'Courses' },
        { path: '/leaderboard', icon: FaTrophy, label: 'Leaderboard' },
        { path: '/profile', icon: FaUser, label: 'Profile' },
        { path: '/progress', icon: FaChartLine, label: 'Progress' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ]

    const handleLogout = () => {
        logout()
        onClose()
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:static md:z-auto`}
            >
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-blue-600">STEMQuest</h2>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-blue-50 hover:bg-white/10'
                                    }`}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </>
    )
}

export default Sidebar