import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRocket, FaBrain, FaTrophy } from 'react-icons/fa'

const Home = () => {
    return (
        <div className="space-y-12">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <h1 className="text-5xl font-bold text-white mb-4">
                    Welcome to STEMQuest
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Master STEM subjects through interactive quizzes, personalized learning paths,
                    and compete with peers on the leaderboard.
                </p>
                <div className="mt-8 space-x-4">
                    <Link to="/courses" className="btn-primary text-lg px-8 py-3">
                        Start Learning
                    </Link>
                    <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                        Join Now
                    </Link>
                </div>
            </motion.section>

            <section className="grid md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card text-center"
                >
                    <FaRocket className="text-4xl text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
                    <p className="text-blue-100">
                        Access curated courses designed for interactive STEM learning
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card text-center"
                >
                    <FaBrain className="text-4xl text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Test Your Knowledge</h3>
                    <p className="text-blue-100">
                        Challenge yourself with adaptive quizzes and track your progress
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card text-center"
                >
                    <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Compete & Earn</h3>
                    <p className="text-blue-100">
                        Rise on the leaderboard and earn achievements for your progress
                    </p>
                </motion.div>
            </section>
        </div>
    )
}

export default Home