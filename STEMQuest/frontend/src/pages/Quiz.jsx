import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { FaClock, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa'
import { quizService } from '../services/quizService'

const Quiz = () => {
    const { quizId } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedOption, setSelectedOption] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [timeLeft, setTimeLeft] = useState(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizService.getQuiz(quizId)
                setQuiz(response.data)
                setAnswers(new Array(response.data.questions.length).fill(null))
                if (response.data.time_limit) {
                    setTimeLeft(response.data.time_limit * 60) // Convert to seconds
                }
            } catch (error) {
                console.error('Error fetching quiz:', error)
                toast.error('Failed to load quiz')
                navigate('/courses')
            } finally {
                setLoading(false)
            }
        }

        fetchQuiz()
    }, [quizId, navigate])

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const handleSelectOption = (optionIndex) => {
        setSelectedOption(optionIndex)
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = optionIndex
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(answers[currentQuestion + 1])
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
            setSelectedOption(answers[currentQuestion - 1])
        }
    }

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unanswered = answers.some(a => a === null)
        if (unanswered) {
            const confirmSubmit = window.confirm(
                'You have unanswered questions. Are you sure you want to submit?'
            )
            if (!confirmSubmit) return
        }

        setSubmitting(true)
        try {
            const response = await quizService.submitQuiz(quizId, { answers })
            toast.success('Quiz submitted successfully!')
            navigate(`/result/${response.data.attempt_id}`)
        } catch (error) {
            console.error('Error submitting quiz:', error)
            toast.error('Failed to submit quiz')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots color="#3B82F6" height={80} width={80} />
            </div>
        )
    }

    if (!quiz) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white">Quiz not found</h2>
            </div>
        )
    }

    const question = quiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
    const isAnswered = answers[currentQuestion] !== null

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-100 hover:text-blue-600 transition-colors mb-4"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-lg p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
                        <p className="text-blue-100 text-sm">{quiz.description}</p>
                    </div>
                    {timeLeft !== null && (
                        <div className="flex items-center gap-2 text-red-600 font-semibold">
                            <FaClock />
                            <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                        <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                        {question.question_text}
                    </h3>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => handleSelectOption(index)}
                                className={`w-full text-left p-4 border rounded-lg transition-all ${selectedOption === index
                                        ? 'border-blue-600 bg-blue-50 shadow-md'
                                        : 'border-white/20 hover:border-blue-300 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-blue-100 text-sm font-semibold">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{option}</span>
                                    {selectedOption === index && (
                                        <FaCheck className="ml-auto text-blue-600" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="btn-primary px-8 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="btn-primary px-8"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    {answers.map((answer, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${answer !== null ? 'bg-blue-600' : 'bg-gray-300'
                                } ${index === currentQuestion ? 'ring-2 ring-blue-400' : ''}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default Quiz