"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/api";

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [bookingData, setBookingData] = useState({
    scheduledDate: "",
    message: "",
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      addToast("User not found", "error");
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (skill) => {
    if (currentUser.points < 1) {
      addToast("You need at least 1 point to book a session", "error");
      return;
    }
    setSelectedSkill(skill);
    setShowBookingModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    try {
      await api.post("/bookings", {
        teacherId: user._id,
        skill: selectedSkill.skill,
        category: selectedSkill.category,
        scheduledDate: bookingData.scheduledDate,
        message: bookingData.message,
      });

      addToast("Booking request sent successfully!", "success");
      setShowBookingModal(false);
      setBookingData({ scheduledDate: "", message: "" });
    } catch (error) {
      addToast("Failed to send booking request", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 mb-8 shadow-xl">
          <div className="flex flex-col justify-center md:flex-row items-center md:items-start space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white">
              <span className="text-4xl font-bold">{user.name[0]}</span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                {user.name}
              </h1>
              <p className="text-zinc-600 mb-4">{user.location}</p>

              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-zinc-700 ml-1">
                    {user.rating.average.toFixed(1)} ({user.rating.count}{" "}
                    reviews)
                  </span>
                </div>
                <div className="text-zinc-600">Age: {user.age}</div>
              </div>

              {user.bio && (
                <p className="text-zinc-700 leading-relaxed">{user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Skills Offered
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.skillsOffered.map((skill, index) => (
              <div
                key={index}
                className="bg-indigo-50 rounded-xl p-6 hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900">
                      {skill.skill}
                    </h3>
                    <p className="text-sm text-indigo-600">{skill.category}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      skill.level === "expert"
                        ? "bg-green-200 text-green-800"
                        : skill.level === "intermediate"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600">
                    {skill.experience} years experience
                  </span>
                  <button
                    onClick={() => handleBookSession(skill)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 text-sm font-medium"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        {user.skillsWanted.length > 0 && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              Skills They Want to Learn
            </h2>

            <div className="flex flex-wrap gap-3">
              {user.skillsWanted.map((skill, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full"
                >
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm ml-2">({skill.category})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">
              Book Session: {selectedSkill?.skill}
            </h3>

            <form onSubmit={submitBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingData.scheduledDate}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      scheduledDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows="4"
                  value={bookingData.message}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell them what you'd like to learn..."
                />
              </div>

              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-indigo-700">
                  <strong>Cost:</strong> 1 point (You have {currentUser.points}{" "}
                  points)
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-4 bg-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
