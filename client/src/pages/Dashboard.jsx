"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import {
  FaUserCircle,
  FaCoins,
  FaHourglassHalf,
  FaCheckCircle,
  FaCalendarAlt,
  FaSearch,
  FaBookOpen,
  FaUser,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    completedSessions: 0,
    upcomingSessions: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const bookingsResponse = await api.get("/bookings/my-bookings");
      const bookings = bookingsResponse.data;

      setRecentBookings(bookings.slice(0, 5));

      setStats({
        totalBookings: bookings.length,
        pendingRequests: bookings.filter(
          (b) => b.status === "pending" && b.teacher._id === user._id
        ).length,
        completedSessions: bookings.filter((b) => b.status === "completed")
          .length,
        upcomingSessions: bookings.filter(
          (b) =>
            b.status === "accepted" && new Date(b.scheduledDate) > new Date()
        ).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-pink-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-pink-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const iconComponents = {
    Points: <FaCoins className="text-2xl text-emerald-600" />,
    Pending: <FaHourglassHalf className="text-2xl text-orange-500" />,
    Completed: <FaCheckCircle className="text-2xl text-indigo-500" />,
    Upcoming: <FaCalendarAlt className="text-2xl text-pink-500" />,
    Search: <FaSearch className="text-3xl text-white" />,
    Bookings: <FaBookOpen className="text-3xl text-white" />,
    Profile: <FaUser className="text-3xl text-white" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-black-600 text-lg mt-1">
                Here's what's happening with your skills today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Your Stats
            </h2>
            <p className="text-slate-600 text-lg">
              Track your learning and teaching progress
            </p>
          </div>

          <div className="flex flex-wrap gap-6 justify-between">
            {/* Points Balance */}
            <div className="flex-1 min-w-[200px] bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {iconComponents.Points}
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Points Balance
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                  {user?.points || 0}
                </p>
                <p className="text-sm text-slate-600">Available to spend</p>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="flex-1 min-w-[200px] bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {iconComponents.Pending}
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  {stats.pendingRequests}
                </p>
                <p className="text-sm text-slate-600">Awaiting response</p>
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="flex-1 min-w-[200px] bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {iconComponents.Completed}
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Completed Sessions
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {stats.completedSessions}
                </p>
                <p className="text-sm text-slate-600">Successfully finished</p>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="flex-1 min-w-[200px] bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {iconComponents.Upcoming}
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Upcoming Sessions
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {stats.upcomingSessions}
                </p>
                <p className="text-sm text-slate-600">Scheduled ahead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Quick Actions
            </h2>
            <p className="text-slate-600 text-lg">
              Navigate to key areas of your account
            </p>
          </div>

          <div className="flex flex-wrap gap-6 justify-between">
            {/* Find Skills */}
            <Link
              to="/search"
              className="flex-1 min-w-[250px] bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaSearch className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Find Skills</h3>
                <p className="text-slate-300">
                  Discover new skills to learn from our community
                </p>
              </div>
            </Link>

            {/* My Bookings */}
            <Link
              to="/bookings"
              className="flex-1 min-w-[250px] bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaBookOpen className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">My Bookings</h3>
                <p className="text-slate-300">
                  Manage your learning and teaching sessions
                </p>
              </div>
            </Link>

            {/* My Profile */}
            <Link
              to="/profile"
              className="flex-1 min-w-[250px] bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaUserCircle className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">My Profile</h3>
                <p className="text-slate-300">
                  Update your skills and personal information
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity - Full Width */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Recent Bookings
              </h2>
              <p className="text-slate-600">
                Your latest learning and teaching activities
              </p>
            </div>
            <Link
              to="/bookings"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:bg-white/60 transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {booking.teacher._id === user._id
                          ? booking.learner.name[0]
                          : booking.teacher.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg mb-1">
                        {booking.skill}
                      </p>
                      <p className="text-slate-600 mb-1">
                        {booking.teacher._id === user._id
                          ? "Teaching"
                          : "Learning"}{" "}
                        • with{" "}
                        {booking.teacher._id === user._id
                          ? booking.learner.name
                          : booking.teacher.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(booking.scheduledDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : booking.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : booking.status === "completed"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start your learning journey by exploring available skills!
              </p>
              <Link
                to="/search"
                className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Find Skills to Learn
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
