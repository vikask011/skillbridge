"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

const skillCategories = [
  "Programming",
  "Design",
  "Art & Music",
  "Language Learning",
  "Cooking & Baking",
  "Public Speaking",
  "Photography & Videography",
  "Health & Fitness",
  "Writing & Blogging",
  "Personal Development",
]

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const { addToast } = useToast()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    location: user?.location || "",
    bio: user?.bio || "",
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile(formData)

    if (result.success) {
      addToast("Profile updated successfully!", "success")
      setEditing(false)
    } else {
      addToast(result.message, "error")
    }

    setLoading(false)
  }

  const cancelEdit = () => {
    setFormData({
      name: user?.name || "",
      age: user?.age || "",
      gender: user?.gender || "",
      location: user?.location || "",
      bio: user?.bio || "",
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
    })
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">My Profile</h1>
          <p className="text-purple-800">Manage your account and skills</p>
        </div>

        {/* Personal Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-200/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-indigo-300 rounded-xl"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-indigo-300 rounded-xl"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-indigo-300 rounded-xl"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-indigo-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-indigo-300 rounded-xl"
                />
              </div>

              {/* Skills Offered */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Skills I Teach</label>
                {formData.skillsOffered.map((skill, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 bg-indigo-50 p-4 rounded-xl">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skill.skill}
                      onChange={(e) => {
                        const updated = [...formData.skillsOffered]
                        updated[index].skill = e.target.value
                        setFormData({ ...formData, skillsOffered: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...formData.skillsOffered]
                        updated[index].category = e.target.value
                        setFormData({ ...formData, skillsOffered: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    >
                      <option value="">Select category</option>
                      {skillCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Years"
                      value={skill.experience}
                      onChange={(e) => {
                        const updated = [...formData.skillsOffered]
                        updated[index].experience = parseInt(e.target.value)
                        setFormData({ ...formData, skillsOffered: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...formData.skillsOffered]
                        updated[index].level = e.target.value
                        setFormData({ ...formData, skillsOffered: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    >
                      <option value="basic">Basic</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      skillsOffered: [...formData.skillsOffered, { skill: "", category: "", experience: 0, level: "basic" }],
                    })
                  }
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Skill
                </button>
              </div>

              {/* Skills Wanted */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mt-6 mb-2">Skills I Want to Learn</label>
                {formData.skillsWanted.map((skill, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 bg-indigo-50 p-4 rounded-xl">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skill.skill}
                      onChange={(e) => {
                        const updated = [...formData.skillsWanted]
                        updated[index].skill = e.target.value
                        setFormData({ ...formData, skillsWanted: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...formData.skillsWanted]
                        updated[index].category = e.target.value
                        setFormData({ ...formData, skillsWanted: updated })
                      }}
                      className="px-3 py-2 rounded-lg border border-indigo-300"
                    >
                      <option value="">Select category</option>
                      {skillCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      skillsWanted: [...formData.skillsWanted, { skill: "", category: "" }],
                    })
                  }
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Learning Goal
                </button>
              </div>

              {/* Save + Cancel */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 py-3 px-4 bg-indigo-200 text-indigo-800 rounded-xl hover:bg-indigo-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-xl hover:from-indigo-500 hover:to-purple-400 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-600">Name</label>
                  <p className="text-lg text-indigo-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-600">Age</label>
                  <p className="text-lg text-indigo-900">{user?.age}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-600">Gender</label>
                  <p className="text-lg text-indigo-900 capitalize">{user?.gender}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-600">Location</label>
                  <p className="text-lg text-indigo-900">{user?.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-600">Points Balance</label>
                  <p className="text-lg text-indigo-900">{user?.points || 0} points</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-600">Rating</label>
                  <p className="text-lg text-indigo-900">
                    ★ {user?.rating?.average?.toFixed(1) || "0.0"} ({user?.rating?.count || 0} reviews)
                  </p>
                </div>
              </div>

              {user?.bio && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-purple-600">Bio</label>
                  <p className="text-lg text-indigo-900 mt-1">{user.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills Display */}
        {!editing && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-200/50 p-8 mb-8">
            {user?.skillsOffered?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">Skills I Teach</h2>
                <ul className="space-y-2">
                  {user.skillsOffered.map((skill, index) => (
                    <li key={index} className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100">
                      <p className="font-medium text-indigo-900">{skill.skill}</p>
                      <p className="text-sm text-indigo-600">
                        Category: {skill.category} • Experience: {skill.experience} yrs • Level: {skill.level}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user?.skillsWanted?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">Skills I Want to Learn</h2>
                <ul className="space-y-2">
                  {user.skillsWanted.map((skill, index) => (
                    <li key={index} className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100">
                      <p className="font-medium text-indigo-900">{skill.skill}</p>
                      <p className="text-sm text-indigo-600">Category: {skill.category}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="mt-12 text-center">
          <button
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
