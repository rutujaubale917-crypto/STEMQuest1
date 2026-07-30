import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBook, FaClock, FaStar } from 'react-icons/fa'

const CourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
        >
            <div className="relative">
                <img
                    src={course.thumbnail || '/api/placeholder/400/200'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                    {course.level}
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <p className="text-blue-100 text-sm mt-1 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                        <span className="flex items-center">
                            <FaBook className="mr-1" /> {course.chapters?.length || 0} chapters
                        </span>
                        <span className="flex items-center">
                            <FaClock className="mr-1" /> {course.duration || 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                        <FaStar />
                        <span className="ml-1 text-blue-50">{course.rating || 4.5}</span>
                    </div>
                </div>

                <Link
                    to={`/courses/${course.id || course._id}`}
                    className="mt-4 w-full btn-primary text-center block"
                >
                    View Course
                </Link>
            </div>
        </motion.div>
    )
}

export default CourseCard