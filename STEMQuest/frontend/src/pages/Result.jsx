import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaChartLine } from 'react-icons/fa'
import { quizService } from '../services/quizService'

const Result = () => {
    const { attemptId } = useParams()
    const navigate = useNavigate()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await quizService.getResults(attemptId)
                setResult(response.data)
            } catch (error) {
                console.error('Error fetching results:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [attemptId])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots color="#3B82F6" height={80} width={80} />
            </div>
        )
    }

    if (!result) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white">Results not found</h2>
            </div>
        )
    }

    const isPassed = result.percentage >= 70

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    {isPassed ? (
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <FaTrophy className="text-4xl text-yellow-500" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <FaTimesCircle className="text-4xl text-red-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                    {isPassed ? 'Congratulations!' : 'Keep Learning!'}
                </h2>
                <p className="text-blue-100 mb-6">
                    {isPassed
                        ? "You've successfully passed this quiz!"
                        : "Don't give up! Review the material and try again."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-blue-200">Score</p>
                        <p className="text-2xl font-bold text-white">{result.score}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-blue-200">Total</p>
                        <p className="text-2xl font-bold text-white">{result.total_possible}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-blue-200">Percentage</p>
                        <p className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.percentage.toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-blue-200">Status</p>
                        <p className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {isPassed ? 'Passed' : 'Failed'}
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Answer Summary</h3>
                    <div className="space-y-2">
                        {result.correct_answers.map((correct, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-sm text-blue-100">Question {index + 1}</span>
                                <span className={`flex items-center ${result.answers?.[index] === correct ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.answers?.[index] === correct ? (
                                        <><FaCheckCircle className="mr-1" /> Correct</>
                                    ) : (
                                        <><FaTimesCircle className="mr-1" /> Incorrect</>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-primary"
                    >
                        <FaChartLine className="inline mr-2" /> Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate(-2)}
                        className="btn-secondary"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Result