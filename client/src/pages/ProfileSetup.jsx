"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

const ProfileSetup = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: "",
    bio: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
  })
  const [currentSkill, setCurrentSkill] = useState({ skill: "", category: "", experience: 1 })
  const [currentWantedSkill, setCurrentWantedSkill] = useState({ skill: "", category: "" })
  const [loading, setLoading] = useState(false)

  const { updateProfile } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const addSkillOffered = () => {
    if (currentSkill.skill && currentSkill.category) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, currentSkill],
      })
      setCurrentSkill({ skill: "", category: "", experience: 1 })
    }
  }

  const addSkillWanted = () => {
    if (currentWantedSkill.skill && currentWantedSkill.category) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, currentWantedSkill],
      })
      setCurrentWantedSkill({ skill: "", category: "" })
    }
  }

  const removeSkillOffered = (index) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((_, i) => i !== index),
    })
  }

  const removeSkillWanted = (index) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile(formData)

    if (result.success) {
      addToast("Profile completed successfully!", "success")
      navigate("/dashboard")
    } else {
      addToast(result.message, "error")
    }

    setLoading(false)
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-900">Complete Your Profile</h2>
            <p className="text-zinc-600 mt-2">Step {step} of 3</p>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-zinc-900 to-zinc-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Location (City)</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Skills You Can Teach</h3>

                <div className="bg-zinc-50 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Skill</label>
                      <input
                        type="text"
                        value={currentSkill.skill}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, skill: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg"
                        placeholder="e.g., React.js"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
                      <select
                        value={currentSkill.category}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg"
                      >
                        <option value="">Select category</option>
                        {skillCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Experience (Years): {currentSkill.experience}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={currentSkill.experience}
                      onChange={(e) =>
                        setCurrentSkill({ ...currentSkill, experience: Number.parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addSkillOffered}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.skillsOffered.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div>
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-sm text-zinc-600 ml-2">({skill.category})</span>
                        <span className="text-sm text-zinc-500 ml-2">{skill.experience} years</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillOffered(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Skills You Want to Learn</h3>

                <div className="bg-zinc-50 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Skill</label>
                      <input
                        type="text"
                        value={currentWantedSkill.skill}
                        onChange={(e) => setCurrentWantedSkill({ ...currentWantedSkill, skill: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg"
                        placeholder="e.g., Guitar"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
                      <select
                        value={currentWantedSkill.category}
                        onChange={(e) => setCurrentWantedSkill({ ...currentWantedSkill, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg"
                      >
                        <option value="">Select category</option>
                        {skillCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addSkillWanted}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.skillsWanted.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div>
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-sm text-zinc-600 ml-2">({skill.category})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillWanted(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-300 transition-colors"
                >
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-xl hover:from-zinc-800 hover:to-zinc-600 transition-all duration-200 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-xl hover:from-zinc-800 hover:to-zinc-600 transition-all duration-200 ml-auto disabled:opacity-50"
                >
                  {loading ? "Completing..." : "Complete Profile"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
