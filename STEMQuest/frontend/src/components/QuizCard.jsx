import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaClock, FaQuestionCircle, FaPlay } from 'react-icons/fa'

const QuizCard = ({ quiz }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                    <p className="text-blue-100 text-sm mt-1">{quiz.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {quiz.questions?.length || 0} questions
                </span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-blue-200">
                    {quiz.time_limit && (
                        <span className="flex items-center">
                            <FaClock className="mr-1" /> {quiz.time_limit} min
                        </span>
                    )}
                    <span className="flex items-center">
                        <FaQuestionCircle className="mr-1" /> {quiz.passing_score}% to pass
                    </span>
                </div>
                <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn-primary text-sm px-4 py-1 flex items-center gap-1"
                >
                    <FaPlay className="text-xs" /> Start
                </Link>
            </div>
        </motion.div>
    )
}

export default QuizCard