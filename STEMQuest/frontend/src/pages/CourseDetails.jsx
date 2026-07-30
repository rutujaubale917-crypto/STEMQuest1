import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import {
    FaBook, FaClock, FaStar, FaUsers, FaPlay,
    FaCheckCircle, FaArrowLeft, FaBookOpen, FaTimes,
    FaChevronRight, FaChevronLeft, FaLightbulb, FaFlask, FaAward
} from 'react-icons/fa'
import { courseService } from '../services/courseService'
import { userService } from '../services/userService'
import { useAuth } from '../hooks/useAuth'
import Certificate from '../components/Certificate'

const CourseDetails = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [course, setCourse] = useState(null)
    const [progress, setProgress] = useState(null)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)
    const [showCertificate, setShowCertificate] = useState(false)
    
    // Modal state for viewing full topic details
    const [activeChapterIndex, setActiveChapterIndex] = useState(null)
    const [activeTab, setActiveTab] = useState('content') // 'content', 'takeaways', 'practice'

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId) {
                setLoading(false)
                return
            }
            try {
                const courseRes = await courseService.getById(courseId)
                setCourse(courseRes?.data || courseRes)

                // Check if user is enrolled
                if (user) {
                    try {
                        const enrolledRes = await userService.getEnrolledCourses()
                        const enrolledList = Array.isArray(enrolledRes?.data) ? enrolledRes.data : (Array.isArray(enrolledRes) ? enrolledRes : [])
                        const enrolled = enrolledList.some(c => (c?.id || c?._id) === courseId)
                        setIsEnrolled(enrolled)

                        if (enrolled) {
                            const progressRes = await courseService.getProgress(courseId)
                            setProgress(progressRes?.data || progressRes)
                        }
                    } catch (e) {
                        console.error('Error fetching enrollment status:', e)
                    }
                }
            } catch (error) {
                console.error('Error fetching course details:', error)
                toast.error('Failed to load course details')
            } finally {
                setLoading(false)
            }
        }

        fetchCourseDetails()
    }, [courseId, user])

    const handleEnroll = async () => {
        setEnrolling(true)
        try {
            await courseService.enroll(courseId)
            setIsEnrolled(true)
            toast.success('Successfully enrolled in the course!')
            try {
                const progressRes = await courseService.getProgress(courseId)
                setProgress(progressRes?.data || progressRes)
            } catch (e) {
                console.error('Error refreshing progress:', e)
            }
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Failed to enroll')
        } finally {
            setEnrolling(false)
        }
    }

    const handleStartQuiz = (quizId) => {
        if (quizId) {
            navigate(`/quiz/${quizId}`)
        }
    }

    const openChapterReader = (index) => {
        setActiveChapterIndex(index)
        setActiveTab('content')
    }

    const closeChapterReader = () => {
        setActiveChapterIndex(null)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots color="#3B82F6" height={80} width={80} />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-white">Course not found</h2>
                <button onClick={() => navigate('/courses')} className="btn-primary mt-4">
                    Back to Courses
                </button>
            </div>
        )
    }

    const selectedChapter = activeChapterIndex !== null && course?.chapters ? course.chapters[activeChapterIndex] : null

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/courses')}
                className="flex items-center text-blue-100 hover:text-blue-600 transition-colors font-medium"
            >
                <FaArrowLeft className="mr-2" /> Back to All Courses
            </button>

            {/* Course Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-700">
                    {course.thumbnail && (
                        <img
                            src={course.thumbnail}
                            alt={course.title || 'Course'}
                            className="w-full h-full object-cover opacity-80"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                        <div className="p-6 md:p-8 text-white">
                            <span className="inline-block px-3 py-1 bg-blue-500/80 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                                {course.level || 'Beginner'} • {course.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{course.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div className="flex flex-wrap items-center gap-6 text-blue-100 text-sm font-medium">
                            <span className="flex items-center">
                                <FaBook className="mr-2 text-blue-600" /> {course.chapters?.length || 0} Topics & Chapters
                            </span>
                            <span className="flex items-center">
                                <FaClock className="mr-2 text-purple-600" /> {course.duration || 'N/A'}
                            </span>
                            <span className="flex items-center">
                                <FaStar className="mr-2 text-yellow-500" /> {course.rating || 4.9} Rating
                            </span>
                            <span className="flex items-center">
                                <FaUsers className="mr-2 text-green-600" /> {course.enrolled_count || 0} Enrolled Students
                            </span>
                        </div>

                        {!isEnrolled ? (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="btn-primary px-8 py-3.5 rounded-2xl text-base font-semibold shadow-lg shadow-blue-500/20 hover:scale-105 transition disabled:opacity-50"
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-xl font-semibold">
                                <FaCheckCircle />
                                <span>You are Enrolled!</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-white mb-2">Course Overview</h2>
                        <p className="text-blue-100 leading-relaxed text-base">{course.description}</p>
                    </div>

                    {progress && (
                        <div className="mt-6 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white mb-2 flex items-center justify-between">
                                <span>Your Course Progress</span>
                                <span className="text-blue-600 font-extrabold">{progress.overall_progress || 0}%</span>
                            </h3>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.overall_progress || 0}%` }}
                                />
                            </div>
                            {(progress.overall_progress === 100) && (
                                <div className="text-center mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="font-bold text-white mb-2">100% Completed! 🎉</h4>
                                    <button 
                                        onClick={() => setShowCertificate(!showCertificate)}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <FaAward className="text-xl" /> {showCertificate ? "Hide Certificate" : "View Certificate"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Certificate Section */}
                    {showCertificate && (
                        <div className="mt-10" id="certificate-section">
                            <Certificate 
                                courseName={course.title} 
                                dateCompleted={new Date().toLocaleDateString()} 
                            />
                        </div>
                    )}

                    {/* Chapters List */}
                    {course.chapters && course.chapters.length > 0 && (
                        <div className="mt-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Course Topics & Chapters</h2>
                                    <p className="text-sm text-blue-200 mt-1">Click on any topic to read full detailed lesson explanations & notes</p>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                                    {course.chapters.length} Total Topics
                                </span>
                            </div>

                            <div className="space-y-4">
                                {course.chapters.map((chapter, index) => (
                                    <motion.div
                                        key={chapter?.id || chapter?._id || index}
                                        whileHover={{ scale: 1.01 }}
                                        className="border border-white/20 rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:border-blue-400 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-snug">{chapter.title}</h3>
                                                    {chapter.description && (
                                                        <p className="text-sm text-blue-200 mt-1">{chapter.description}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                                                <button
                                                    onClick={() => openChapterReader(index)}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
                                                >
                                                    <FaBookOpen />
                                                    <span>Read Full Topic Details</span>
                                                </button>

                                                {isEnrolled && chapter.quiz_ids && chapter.quiz_ids.length > 0 && (
                                                    <button
                                                        onClick={() => handleStartQuiz(chapter.quiz_ids[0])}
                                                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
                                                    >
                                                        <FaPlay className="text-xs" />
                                                        <span>Quiz</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Snippet preview */}
                                        {chapter.content && (
                                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-blue-100 line-clamp-2 italic">
                                                {chapter.content.slice(0, 180)}...
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* FULL TOPIC DETAIL READER MODAL */}
            <AnimatePresence>
                {selectedChapter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
                        >
                            {/* Modal Top Bar */}
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between shrink-0">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white/90">
                                        Topic #{activeChapterIndex + 1} of {course.chapters.length}
                                    </span>
                                    <h2 className="text-2xl font-extrabold text-white mt-1">{selectedChapter.title}</h2>
                                    <p className="text-xs text-blue-100 mt-1">{course.title}</p>
                                </div>
                                <button
                                    onClick={closeChapterReader}
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Modal Tabs Bar */}
                            <div className="flex border-b border-white/20 bg-white/5 shrink-0">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 py-3.5 px-4 text-center font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition ${
                                        activeTab === 'content'
                                            ? 'border-blue-600 text-blue-600 bg-white/10 backdrop-blur-md border border-white/20 text-white'
                                            : 'border-transparent text-blue-200 hover:text-blue-50'
                                    }`}
                                >
                                    <FaBookOpen /> 📖 Detailed Lesson Notes
                                </button>
                                <button
                                    onClick={() => setActiveTab('takeaways')}
                                    className={`flex-1 py-3.5 px-4 text-center font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition ${
                                        activeTab === 'takeaways'
                                            ? 'border-blue-600 text-blue-600 bg-white/10 backdrop-blur-md border border-white/20 text-white'
                                            : 'border-transparent text-blue-200 hover:text-blue-50'
                                    }`}
                                >
                                    <FaLightbulb /> 💡 Formulas & Key Concepts
                                </button>
                            </div>

                            {/* Modal Body / Reader View */}
                            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                {activeTab === 'content' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl text-blue-900 text-sm font-medium">
                                            💡 <strong>Topic Summary:</strong> {selectedChapter.description || 'Comprehensive learning content for this topic.'}
                                        </div>

                                        <div className="prose max-w-none text-white text-base leading-relaxed whitespace-pre-line font-normal bg-gray-50/70 p-6 rounded-2xl border border-white/20 shadow-inner">
                                            {selectedChapter.content}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'takeaways' && (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                                            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-3">
                                                <FaLightbulb className="text-amber-600" /> Key Takeaways & Cheat Sheet
                                            </h3>
                                            <ul className="space-y-2 text-sm text-amber-950">
                                                <li>✔️ Pay close attention to definitions and foundational syntax rules.</li>
                                                <li>✔️ Practice writing out formulas and code blocks step-by-step.</li>
                                                <li>✔️ Test your understanding by taking the interactive chapter quiz.</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Controls */}
                            <div className="p-4 md:p-6 bg-white/5 border-t border-white/20 flex items-center justify-between shrink-0">
                                <button
                                    onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
                                    disabled={activeChapterIndex === 0}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-50 bg-white/10 backdrop-blur-md border border-white/20 text-white border border-white/30 disabled:opacity-40 hover:bg-white/10 transition"
                                >
                                    <FaChevronLeft /> Previous Topic
                                </button>

                                <span className="text-xs text-blue-200 font-semibold hidden sm:inline">
                                    Topic {activeChapterIndex + 1} of {course.chapters.length}
                                </span>

                                <button
                                    onClick={() => setActiveChapterIndex(Math.min(course.chapters.length - 1, activeChapterIndex + 1))}
                                    disabled={activeChapterIndex === course.chapters.length - 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 disabled:opacity-40 hover:bg-blue-700 transition"
                                >
                                    Next Topic <FaChevronRight />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CourseDetails