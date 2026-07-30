import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'
import ProgressChart from '../components/ProgressChart'

const Profile = () => {
    const { user, login } = useAuth()
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
    })
    const [progress, setProgress] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, progressRes] = await Promise.all([
                    userService.getProfile(),
                    userService.getProgress(),
                ])
                setProfile(profileRes.data)
                setFormData({
                    name: profileRes.data.name,
                    bio: profileRes.data.bio || '',
                })
                setProgress(progressRes.data || {})
            } catch (error) {
                console.error('Error fetching profile:', error)
                toast.error('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await userService.updateProfile(formData)
            setProfile(response.data)
            setIsEditing(false)
            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots color="#3B82F6" height={80} width={80} />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <FaUser />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{profile?.name}</h1>
                                <p className="text-blue-100">{profile?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            {isEditing ? <FaTimes /> : <FaEdit />}
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-50 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-50 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="btn-primary">
                                    <FaSave className="inline mr-2" /> Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false)
                                        setFormData({
                                            name: profile?.name,
                                            bio: profile?.bio || '',
                                        })
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200">Email</h3>
                                    <p className="mt-1 flex items-center gap-2">
                                        <FaEnvelope className="text-blue-300" />
                                        {profile?.email}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200">Bio</h3>
                                    <p className="mt-1">{profile?.bio || 'No bio yet'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200">Points</h3>
                                    <p className="mt-1 text-2xl font-bold text-blue-600">{profile?.points || 0}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200">Courses</h3>
                                    <p className="mt-1">
                                        {profile?.enrolled_courses?.length || 0} enrolled
                                    </p>
                                </div>
                            </div>

                            {profile?.achievements && profile.achievements.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200 mb-2">Achievements</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.achievements.map((achievement, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                                            >
                                                🏆 {achievement}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {progress && (
                                <div>
                                    <h3 className="text-sm font-medium text-blue-200 mb-4">Overall Progress</h3>
                                    <ProgressChart progress={progress} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default Profile