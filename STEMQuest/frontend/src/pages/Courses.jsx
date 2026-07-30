import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import { FaSearch, FaFilter, FaBookOpen, FaTimes, FaLightbulb, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CourseCard from '../components/CourseCard'
import { courseService } from '../services/courseService'

const popularTopicChips = [
    { label: '🐍 Python Variables', term: 'Python' },
    { label: '📐 Calculus & Derivatives', term: 'Calculus' },
    { label: '⚡ Newton\'s Laws', term: 'Newtonian' },
    { label: '🧬 DNA & Genetics', term: 'DNA' },
    { label: '📊 Machine Learning', term: 'Machine Learning' },
    { label: '🤖 Arduino & Sensors', term: 'Arduino' },
    { label: '⚛️ Quantum Superposition', term: 'Superposition' },
    { label: '🔒 Encryption & RSA', term: 'Encryption' },
    { label: '💻 React Hooks', term: 'React' },
    { label: '☁️ Docker & Microservices', term: 'Docker' },
]

const Courses = () => {
    const [courses, setCourses] = useState([])
    const [filteredCourses, setFilteredCourses] = useState([])
    const [matchedChapters, setMatchedChapters] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        level: '',
        category: '',
    })
    const [showFilters, setShowFilters] = useState(false)

    // State for Topic Reader Modal directly in Courses view
    const [selectedTopicModal, setSelectedTopicModal] = useState(null)
    const [activeTab, setActiveTab] = useState('content')

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAll()
                const data = Array.isArray(response?.data) 
                    ? response.data 
                    : (Array.isArray(response) ? response : [])
                setCourses(data)
                setFilteredCourses(data)
            } catch (error) {
                console.error('Error fetching courses:', error)
                setCourses([])
                setFilteredCourses([])
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    useEffect(() => {
        const safeCourses = Array.isArray(courses) ? courses : []
        let resultCourses = [...safeCourses]
        let chapterMatches = []

        const term = searchTerm.toLowerCase().trim()

        if (term) {
            // Filter courses matching title, description, category, tags, or chapter contents
            resultCourses = safeCourses.filter(course => {
                const matchesCourse = 
                    (course?.title || '').toLowerCase().includes(term) ||
                    (course?.description || '').toLowerCase().includes(term) ||
                    (course?.category || '').toLowerCase().includes(term) ||
                    (course?.tags || []).some(t => t.toLowerCase().includes(term))

                const matchesChapter = (course?.chapters || []).some(chap =>
                    (chap?.title || '').toLowerCase().includes(term) ||
                    (chap?.description || '').toLowerCase().includes(term) ||
                    (chap?.content || '').toLowerCase().includes(term)
                )

                return matchesCourse || matchesChapter
            })

            // Extract specific matching topics/chapters for direct detailed display
            safeCourses.forEach(course => {
                (course?.chapters || []).forEach(chapter => {
                    const matchInTitle = (chapter?.title || '').toLowerCase().includes(term)
                    const matchInDesc = (chapter?.description || '').toLowerCase().includes(term)
                    const matchInContent = (chapter?.content || '').toLowerCase().includes(term)

                    if (matchInTitle || matchInDesc || matchInContent) {
                        chapterMatches.push({
                            courseTitle: course.title,
                            courseCategory: course.category,
                            courseId: course.id || course._id,
                            chapter: chapter
                        })
                    }
                })
            })
        }

        // Apply level and category filters
        if (filters.level) {
            resultCourses = resultCourses.filter(course => course?.level === filters.level)
        }
        if (filters.category) {
            resultCourses = resultCourses.filter(course => course?.category === filters.category)
        }

        setFilteredCourses(resultCourses)
        setMatchedChapters(chapterMatches)
    }, [searchTerm, filters, courses])

    const openTopicModal = (courseTitle, chapter) => {
        setSelectedTopicModal({ courseTitle, chapter })
        setActiveTab('content')
    }

    const levels = ['beginner', 'intermediate', 'advanced']
    const categories = ['Programming', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering']

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots color="#3B82F6" height={80} width={80} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header & Search Bar */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">STEM Knowledge & Topic Search 🔍</h1>
                    <p className="text-blue-100 mt-2 text-base">
                        Search any topic (e.g. Python, Calculus, DNA, Encryption, Quantum, Newton) to instantly read full detailed lesson explanations.
                    </p>

                    <div className="mt-6 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 text-lg" />
                            <input
                                type="text"
                                placeholder="Type any topic (e.g. Python, DNA, Calculus, React)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-base"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 shrink-0 border border-white/20"
                        >
                            <FaFilter />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Popular Topic Chips */}
                    <div className="mt-5 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider mr-1">Popular Topics:</span>
                        {popularTopicChips.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSearchTerm(chip.term)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                                    searchTerm.toLowerCase() === chip.term.toLowerCase()
                                        ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white text-blue-700 shadow-md scale-105'
                                        : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                                }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters Drawer */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-6 rounded-2xl shadow-lg border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm font-bold text-blue-50 mb-2">Level</label>
                        <select
                            value={filters.level}
                            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                            className="w-full px-4 py-2.5 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                            <option value="">All Levels</option>
                            {levels.map(level => (
                                <option key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-blue-50 mb-2">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full px-4 py-2.5 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>
            )}

            {/* TOPIC MATCHES SECTION (Shows when user searches a topic) */}
            {searchTerm && matchedChapters.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-sm space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                            <span>🎯 Exact Topic Lessons Found for "{searchTerm}"</span>
                            <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
                                {matchedChapters.length} Lessons
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchedChapters.slice(0, 6).map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-5 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                                            {item.courseCategory}
                                        </span>
                                        <span className="text-xs text-blue-300 font-medium truncate max-w-[180px]">
                                            Course: {item.courseTitle}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-base leading-snug">{item.chapter.title}</h3>
                                    {item.chapter.description && (
                                        <p className="text-xs text-blue-200 mt-1 line-clamp-2">{item.chapter.description}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => openTopicModal(item.courseTitle, item.chapter)}
                                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                                >
                                    <FaBookOpen />
                                    <span>Read Full Detailed Topic Explanation</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ALL COURSES GRID */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {searchTerm ? `Courses matching "${searchTerm}"` : 'All Available STEM Courses'}
                    </h2>
                    <span className="text-sm font-semibold text-blue-200">
                        Showing {filteredCourses.length} Courses
                    </span>
                </div>

                {!filteredCourses || filteredCourses.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-12 text-center shadow-sm border border-white/10">
                        <p className="text-blue-200 text-lg">No courses or topics found matching "{searchTerm}".</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilters({ level: '', category: '' }); }}
                            className="mt-4 btn-primary px-6 py-2 text-sm"
                        >
                            Reset Search & Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course?.id || course?._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* TOPIC READER MODAL FOR DIRECT SEARCH TOPIC RESULTS */}
            <AnimatePresence>
                {selectedTopicModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between shrink-0">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
                                        Course: {selectedTopicModal.courseTitle}
                                    </span>
                                    <h2 className="text-2xl font-extrabold text-white mt-1.5">
                                        {selectedTopicModal.chapter.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedTopicModal(null)}
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Modal Tabs */}
                            <div className="flex border-b border-white/20 bg-white/5 shrink-0">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 py-3.5 px-4 text-center font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition ${
                                        activeTab === 'content'
                                            ? 'border-blue-600 text-blue-600 bg-white/10 backdrop-blur-md border border-white/20 text-white'
                                            : 'border-transparent text-blue-200 hover:text-blue-50'
                                    }`}
                                >
                                    <FaBookOpen /> 📖 Detailed Topic Explanation
                                </button>
                                <button
                                    onClick={() => setActiveTab('takeaways')}
                                    className={`flex-1 py-3.5 px-4 text-center font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition ${
                                        activeTab === 'takeaways'
                                            ? 'border-blue-600 text-blue-600 bg-white/10 backdrop-blur-md border border-white/20 text-white'
                                            : 'border-transparent text-blue-200 hover:text-blue-50'
                                    }`}
                                >
                                    <FaLightbulb /> 💡 Key Takeaways & Cheat Sheet
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                {activeTab === 'content' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl text-blue-900 text-sm font-medium">
                                            💡 <strong>Topic Summary:</strong> {selectedTopicModal.chapter.description || 'Comprehensive learning material for this topic.'}
                                        </div>

                                        <div className="prose max-w-none text-white text-base leading-relaxed whitespace-pre-line font-normal bg-gray-50/80 p-6 rounded-2xl border border-white/20 shadow-inner">
                                            {selectedTopicModal.chapter.content}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'takeaways' && (
                                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                                        <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-3">
                                            <FaLightbulb className="text-amber-600" /> Key Concepts & Quick Notes
                                        </h3>
                                        <ul className="space-y-2 text-sm text-amber-950">
                                            <li>✔️ Review foundational concepts and definitions carefully.</li>
                                            <li>✔️ Practice applying key formulas or code blocks to real problems.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-white/5 border-t border-white/20 flex items-center justify-end">
                                <button
                                    onClick={() => setSelectedTopicModal(null)}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow transition"
                                >
                                    Close Reader
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Courses