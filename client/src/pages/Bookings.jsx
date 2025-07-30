// ✅ UPDATED booking.jsx (frontend) with proper review submission to match backend API

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/api";

const Bookings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState("");
  const [linkUpdated, setLinkUpdated] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [durationComplete, setDurationComplete] = useState(false);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    let interval;
    if (isMeetingStarted) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= 1800) {
            clearInterval(interval);
            setDurationComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingStarted]);

  const handleJoin = () => {
    setIsMeetingStarted(true);
    setElapsedTime(0);
    setDurationComplete(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = activeTab === "all" ? "" : `?type=${activeTab}`;
      const response = await api.get(`/bookings/my-bookings${params}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, meetingLink = "") => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status, meetingLink });
      addToast(`Booking ${status} successfully!`, "success");
      fetchBookings();
    } catch (error) {
      addToast("Failed to update booking", "error");
    }
  };

  const updateLink = async (bookingId, link) => {
    try {
      await api.put(`/bookings/${bookingId}/link`, { link });
      addToast(`Link Updated successfully!`, "success");
      setLinkUpdated(true);
    } catch (error) {
      addToast("Failed to update Link", "error");
    }
  };

  const completeSession = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/complete`);
      addToast("Session completed successfully!", "success");
      fetchBookings();
    } catch (error) {
      addToast("Failed to complete session", "error");
    }
  };

  const submitReview = async (bookingId) => {
    const { rating, feedback } = reviewData[bookingId] || {};
    if (!rating || !feedback) {
      addToast("Please provide both rating and feedback", "warning");
      return;
    }

    const booking = bookings.find((b) => b._id === bookingId);
    try {
      await api.post("/bookings/reviews", {
        booking: bookingId,
        reviewer: user._id,
        reviewee: booking.teacher._id,
        rating,
        comment: feedback,
        type: "learner",
      });
      setSubmittedReviews((prev) => ({ ...prev, [bookingId]: true }));
      addToast("Review submitted successfully!", "success");
    } catch (error) {
      console.error(error);
      addToast("Failed to submit review", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "teaching") return booking.teacher._id === user._id;
    if (activeTab === "learning") return booking.learner._id === user._id;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent mb-2">
            My Bookings
          </h1>
          <p className="text-zinc-700">
            Manage your teaching and learning sessions
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200 p-2 mb-8 shadow-xl">
          <div className="flex space-x-2">
            {["all", "teaching", "learning"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base shadow-sm ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-fuchsia-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200 p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.teacher._id === user._id
                          ? booking.learner.name[0]
                          : booking.teacher.name[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-800">
                          {booking.skill}
                        </h3>
                        <p className="text-zinc-600">
                          {booking.teacher._id === user._id
                            ? "Teaching"
                            : "Learning from"}{" "}
                          {booking.teacher._id === user._id
                            ? booking.learner.name
                            : booking.teacher.name}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-500">Date:</span>
                        <p className="font-medium">
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Time:</span>
                        <p className="font-medium">
                          {new Date(booking.scheduledDate).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Duration:</span>
                        <p className="font-medium">
                          {booking.duration} minutes
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Status:</span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                        <p className="text-sm text-zinc-700">
                          {booking.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {booking.teacher._id === user._id &&
                      booking?.status == "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateBookingStatus(
                                booking._id,
                                "accepted",
                                "https://meet.google.com/new"
                              )
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "rejected")
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                    {booking.status === "accepted" && (
                      <>
                        {booking.meetingLink && !linkUpdated && (
                          <a
                            onClick={() => handleJoin()}
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4 transition-colors text-sm text-center"
                          >
                            Join Meeting
                          </a>
                        )}
                        {booking.teacher._id === user._id &&
                          (durationComplete ? (
                            <button
                              onClick={() => completeSession(booking._id)}
                              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm"
                            >
                              Mark Complete
                            </button>
                          ) : (
                            <div className="px-4 py-2 bg-violet-600 text-white rounded-lg text-center text-sm">
                              Wait 30 mins to mark complete
                            </div>
                          ))}
                        {booking.teacher._id === user._id &&
                          (linkUpdated ? (
                            <div>Link Updated! Admit learner via Meet</div>
                          ) : (
                            <>
                              <label className="text-sm font-medium mb-1">
                                Enter Updated Link
                              </label>
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-300 mb-2"
                              />
                              <button
                                onClick={() => updateLink(booking._id, link)}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
                              >
                                Update Link
                              </button>
                            </>
                          ))}
                      </>
                    )}

                    {booking.status === "completed" &&
                      booking.teacher._id === user._id && (
                        <div className="text-green-600 text-sm">
                          {booking.pointsEarned} points earned
                        </div>
                      )}

                    {/* ✅ Review for Learner after session is completed */}
                    {booking.status === "completed" &&
                      booking.learner._id === user._id &&
                      !submittedReviews[booking._id] && (
                        <div className="mt-4 bg-zinc-50 border p-4 rounded-xl">
                          <h4 className="font-semibold text-sm mb-2">
                            Leave a review for {booking.teacher.name}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  setReviewData((prev) => ({
                                    ...prev,
                                    [booking._id]: {
                                      ...prev[booking._id],
                                      rating: star,
                                    },
                                  }))
                                }
                                className={`text-xl ${
                                  reviewData[booking._id]?.rating >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Write your feedback..."
                            value={reviewData[booking._id]?.feedback || ""}
                            onChange={(e) =>
                              setReviewData((prev) => ({
                                ...prev,
                                [booking._id]: {
                                  ...prev[booking._id],
                                  feedback: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-2 border rounded-lg text-sm mb-2"
                          />
                          <button
                            onClick={() => submitReview(booking._id)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:bg-fuchsia-700 text-sm"
                          >
                            Submit Review
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-zinc-600">No bookings found</p>
                <p className="text-sm text-zinc-500 mt-1">
                  {activeTab === "teaching"
                    ? "No one has booked your skills yet"
                    : activeTab === "learning"
                    ? "You haven't booked any sessions yet"
                    : "No bookings available"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
