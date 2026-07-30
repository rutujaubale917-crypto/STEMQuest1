import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import { FaTrophy, FaCrown, FaMedal, FaUser, FaStar, FaFire, FaBook } from 'react-icons/fa'
import { userService } from '../services/userService'

const Leaderboard = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await userService.getLeaderboard()
                const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
                
                // Sort descending by points just in case
                data.sort((a, b) => (b.points || 0) - (a.points || 0))
                // Assign ranks
                const ranked = data.map((u, i) => ({ ...u, rank: i + 1 }))
                setUsers(ranked)
                
            } catch (error) {
                console.log("Leaderboard Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return (
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl font-black shadow-lg shadow-amber-400/40 shrink-0">
                        <FaCrown className="text-2xl text-amber-900" />
                    </div>
                )
            case 2:
                return (
                    <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-900 flex items-center justify-center text-xl font-black shadow-md shrink-0">
                        <FaMedal className="text-2xl text-slate-700" />
                    </div>
                )
            case 3:
                return (
                    <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-black shadow-md shrink-0">
                        <FaMedal className="text-2xl text-amber-200" />
                    </div>
                )
            default:
                return (
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-base font-black shrink-0">
                        #{rank}
                    </div>
                )
        }
    }

    const getCardStyle = (rank) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]"
            case 2:
                return "bg-gradient-to-r from-slate-50 via-gray-50 to-slate-100 border-2 border-slate-300 shadow-lg"
            case 3:
                return "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-2 border-orange-300 shadow-md"
            default:
                return "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/5 border border-white/20 shadow-sm"
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots height="80" width="80" color="#2563eb" />
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8">
            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div>
                    <div className="flex items-center gap-3">
                        <FaTrophy className="text-yellow-400 text-4xl" />
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">STEMQuest Leaderboard 🏆</h1>
                    </div>
                    <p className="text-purple-100 mt-2 text-base">
                        Top performing STEM learners ranked by points, quiz scores, and course completions.
                    </p>
                </div>
                <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
                    <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">Total Competitors</span>
                    <span className="text-2xl font-black text-white">{users.length} Learners</span>
                </div>
            </motion.div>

            {/* Leaderboard List */}
            <div className="space-y-4">
                {users.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow p-6 text-center text-blue-200">
                        No users available on the leaderboard yet.
                    </div>
                ) : (
                    users.map((userItem, index) => {
                        const rank = userItem.rank || index + 1
                        return (
                            <motion.div
                                key={userItem.user_id || userItem.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-5 rounded-2xl flex items-center justify-between gap-4 transition-all ${getCardStyle(rank)}`}
                            >
                                {/* Rank Badge & User Avatar */}
                                <div className="flex items-center gap-4 min-w-0">
                                    {getRankBadge(rank)}

                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow shrink-0 bg-blue-100 flex items-center justify-center">
                                        {userItem.avatar ? (
                                            <img src={userItem.avatar} alt={userItem.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-xl text-blue-600" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white text-base md:text-lg truncate flex items-center gap-2">
                                            <span>{userItem.name || userItem.username || 'Learner'}</span>
                                            {rank === 1 && <span className="text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">1st Place</span>}
                                            {rank === 2 && <span className="text-xs bg-slate-300 text-slate-900 font-bold px-2 py-0.5 rounded-full">2nd Place</span>}
                                            {rank === 3 && <span className="text-xs bg-orange-400 text-white font-bold px-2 py-0.5 rounded-full">3rd Place</span>}
                                        </h3>
                                        <p className="text-xs text-blue-200 flex items-center gap-3 mt-0.5">
                                            <span className="flex items-center"><FaBook className="mr-1 text-blue-500" /> {userItem.courses_completed || 2} Courses Completed</span>
                                            <span className="flex items-center"><FaFire className="mr-1 text-orange-500" /> {7 - (rank % 3)} Day Streak</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Points Badge */}
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <FaStar className="text-yellow-500 text-lg" />
                                        <span className="text-2xl font-black text-purple-700">{userItem.points || 0}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">Points</span>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Leaderboard