import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import ProgressChart from "../components/ProgressChart";
import CourseCard from "../components/CourseCard";
import { motion } from "framer-motion";
import {
    FaBook,
    FaCheckCircle,
    FaClock,
    FaTrophy,
    FaStar,
    FaFire
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";


const StudentDashboard = () => {

    const { user } = useAuth();

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [progress, setProgress] = useState(null);

    const [stats, setStats] = useState({
        totalCourses: 0,
        completed: 0,
        inProgress: 0,
        quizzesTaken: 0,
    });

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const [coursesRes, progressRes] = await Promise.all([
                    userService.getEnrolledCourses(),
                    userService.getProgress(),
                ]);


                const coursesList = coursesRes.data || [];
                const progressList = progressRes.data || [];


                setEnrolledCourses(coursesList);
                setProgress(progressList);



                const completedCount = (Array.isArray(progressList)
                    ? progressList.filter(p => p.overall_progress === 100).length
                    : 0) || (user?.completed_courses?.length || 0);

                const inProgressCount = Array.isArray(progressList)
                    ? progressList.filter(p => p.overall_progress > 0 && p.overall_progress < 100).length
                    : 0;

                const quizzesCount = (Array.isArray(progressList)
                    ? progressList.reduce((acc, p) => acc + Object.keys(p.quiz_scores || {}).length, 0)
                    : 0) || (completedCount > 0 ? completedCount : (coursesList.length > 0 ? 1 : 0));

                setStats({
                    totalCourses: coursesList.length,
                    completed: completedCount,
                    inProgress: inProgressCount || Math.max(0, coursesList.length - completedCount),
                    quizzesTaken: quizzesCount,
                });


            } catch (error) {

                console.log(
                    "Dashboard error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboardData();

    }, []);



    if (loading) {

        return (
            <div className="flex justify-center items-center h-64">
                <ThreeDots
                    color="#3B82F6"
                    height={80}
                    width={80}
                />
            </div>
        );

    }



    return (

        <div className="space-y-8">


            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            >
                <h1 className="text-4xl font-extrabold drop-shadow-md">
                    Welcome back, {user?.name || "Learner"} 🚀
                </h1>
                <p className="mt-2 text-lg text-blue-50 drop-shadow-sm font-medium">
                    Continue your learning journey and earn badges ⭐
                </p>
                <Link
                    to="/courses"
                    className="inline-block mt-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/30 hover:scale-105 transition shadow-lg"
                >
                    Start Learning
                </Link>
            </motion.div>





            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 p-6 rounded-3xl shadow-lg text-white">
                    <FaBook className="text-4xl text-blue-400 drop-shadow-md" />
                    <p className="mt-3 text-blue-100 font-medium">Courses</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {stats.totalCourses}
                    </h2>
                </div>

                <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 p-6 rounded-3xl shadow-lg text-white">
                    <FaCheckCircle className="text-4xl text-green-400 drop-shadow-md" />
                    <p className="mt-3 text-green-100 font-medium">Completed</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {stats.completed}
                    </h2>
                </div>

                <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 p-6 rounded-3xl shadow-lg text-white">
                    <FaClock className="text-4xl text-yellow-400 drop-shadow-md" />
                    <p className="mt-3 text-yellow-100 font-medium">Learning</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {stats.inProgress}
                    </h2>
                </div>

                <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 p-6 rounded-3xl shadow-lg text-white">
                    <FaTrophy className="text-4xl text-purple-400 drop-shadow-md" />
                    <p className="mt-3 text-purple-100 font-medium">Quizzes</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        {stats.quizzesTaken}
                    </h2>
                </div>
            </div>





            {/* Gamification */}
            <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 p-6 rounded-3xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-orange-100">Points</h3>
                        <p className="text-3xl font-extrabold mt-1">{user?.points || 1250}</p>
                    </div>
                    <FaStar className="text-5xl text-orange-400 drop-shadow-md opacity-80" />
                </div>

                <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-6 rounded-3xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-red-100">Streak</h3>
                        <p className="text-3xl font-extrabold mt-1">7 Days</p>
                    </div>
                    <FaFire className="text-5xl text-red-400 drop-shadow-md opacity-80" />
                </div>

                <div className="bg-pink-500/20 backdrop-blur-md border border-pink-500/30 p-6 rounded-3xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-pink-100">Badges</h3>
                        <p className="text-3xl font-extrabold mt-1">5</p>
                    </div>
                    <FaTrophy className="text-5xl text-pink-400 drop-shadow-md opacity-80" />
                </div>
            </div>






            {/* Progress + Courses */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Progress */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
                >
                    <h2 className="text-2xl font-bold text-white mb-5 drop-shadow-sm flex items-center gap-2">
                        <span>📊</span> Your Progress
                    </h2>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <ProgressChart progress={progress} />
                    </div>
                </motion.div>


                {/* Courses */}
                <div className="md:col-span-2 bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-5 drop-shadow-sm flex items-center gap-2">
                        <span>📚</span> Your Courses
                    </h2>

                    {
                        enrolledCourses.length > 0 ? (
                            <div className="space-y-4">
                                {
                                    enrolledCourses
                                        .slice(0, 3)
                                        .map((course, index) => (
                                            <div
                                                key={course.id || course._id || index}
                                                className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-sm hover:bg-white/10 transition-colors"
                                            >
                                                <CourseCard course={course} />
                                            </div>
                                        ))
                                }
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
                                <p className="text-lg text-blue-100 font-medium">
                                    No courses enrolled yet 🚀
                                </p>
                                <Link
                                    to="/courses"
                                    className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1 transition-all"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>



        </div>

    );

};


export default StudentDashboard;