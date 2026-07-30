import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaMedal, FaUser, FaCrown } from 'react-icons/fa'
import { userService } from '../services/userService'
import { ThreeDots } from 'react-loader-spinner'

const Leaderboard = ({ limit = 5 }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await userService.getLeaderboard()
                setUsers(response.data.slice(0, limit))
            } catch (error) {
                console.error('Error fetching leaderboard:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [limit])

    const getMedal = (rank) => {
        switch (rank) {
            case 1: return <FaCrown className="text-yellow-500 text-xl" />
            case 2: return <FaMedal className="text-blue-300 text-xl" />
            case 3: return <FaMedal className="text-amber-600 text-xl" />
            default: return <span className="text-blue-200 font-semibold">#{rank}</span>
        }
    }

    if (loading) {
        return <ThreeDots color="#3B82F6" height={40} width={40} />
    }

    return (
        <div className="space-y-2">
            {users.map((user, index) => (
                <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <div className="w-8 flex justify-center">
                        {getMedal(user.rank)}
                    </div>
                    <div className="flex-1 ml-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <FaUser />
                            )}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-blue-600">{user.points}</span>
                        <span className="text-xs text-blue-200 ml-1">pts</span>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default Leaderboard