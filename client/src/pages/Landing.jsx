"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Code, Brush, Music, Languages, ChefHat, Mic, Camera, Dumbbell, GraduationCap, RefreshCcw, Star, BarChart3, Wallet, Calendar, Target } from "lucide-react"

const Landing = () => {
  const { user } = useAuth()

  const skillCategories = [
     { name: "Programming", icon: <Code size={28} />, color: "from-blue-500 to-purple-600" },
    { name: "Design", icon: <Brush size={28} />, color: "from-pink-500 to-rose-600" },
    { name: "Art & Music", icon: <Music size={28} />, color: "from-green-500 to-teal-600" },
    { name: "Language Learning", icon: <Languages size={28} />, color: "from-yellow-500 to-orange-600" },
    { name: "Cooking & Baking", icon: <ChefHat size={28} />, color: "from-red-500 to-pink-600" },
    { name: "Public Speaking", icon: <Mic size={28} />, color: "from-indigo-500 to-blue-600" },
    { name: "Photography", icon: <Camera size={28} />, color: "from-purple-500 to-indigo-600" },
    { name: "Health & Fitness", icon: <Dumbbell size={28} />, color: "from-green-500 to-emerald-600" },
  ]

  // Split categories into 2 columns of 4 each
  const leftColumnCategories = skillCategories.slice(0, 4)
  const rightColumnCategories = skillCategories.slice(4, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purpal-100 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purpal-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="absolute top-8 right-8">
              {user ? (
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium border border-white/20">
                  Welcome!👋
                </span>
              ) : (
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium border border-white/20">
                  New here? Join us! ✨
                </span>
              )}
            </div>
            
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium border border-white/20">
                🚀 The Future of Skill Exchange
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight">
              Trade Skills,
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Not Money
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-blue-100 mb-6 max-w-4xl mx-auto font-light">
              1 Hour of Your Skill = 1 Point to Learn Any Other Skill
            </p>
            
            <p className="text-lg text-blue-200/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join a revolutionary community where knowledge flows freely. Teach what you master, learn what you dream.
            </p>

            {user && (
              <div className="mb-8">
                <Link
                  to="/dashboard"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-300 to-purple-500 text-white rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Learning
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                HOW IT WORKS
              </span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Simple, Fair & Community-Driven</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform creates a balanced ecosystem where every skill has value and every learner becomes a teacher.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-emerald-500/25">
                  <GraduationCap size={40} className="text-white" />
                </div>
 
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Teach & Earn Points</h3>
              <p className="text-slate-600 leading-relaxed">
                Share your expertise and earn valuable points for every hour you dedicate to teaching others. Your knowledge becomes your currency.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-blue-500/25">
                  <RefreshCcw size={40} className="text-white" />
                </div>

              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Spend Points Wisely</h3>
              <p className="text-slate-600 leading-relaxed">
                Use your hard-earned points to unlock new skills from talented teachers in our community. Every point opens new possibilities.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/25">
                   <Star size={40} className="text-white" />
                </div>

              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Build Community</h3>
              <p className="text-slate-600 leading-relaxed">
                Rate experiences, provide feedback, and help build a trusted network where quality learning thrives and relationships flourish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                YOUR DASHBOARD
              </span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Track Your Learning Journey</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get insights into your progress, manage your sessions, and discover new opportunities all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 size={32} className="mb-4 text-black-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Progress Analytics</h3>
              <p className="text-slate-600">Track your learning milestones and teaching impact with detailed insights.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Wallet size={32} className="mb-4 text-black-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Points Management</h3>
              <p className="text-slate-600">Monitor your earned points and plan your next skill acquisition strategy.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
               <Calendar size={32} className="mb-4 text-black-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Session Scheduler</h3>
              <p className="text-slate-600">Easily book and manage your teaching and learning sessions.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="mb-4 text-black-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Skill Matching</h3>
              <p className="text-slate-600">Get personalized recommendations for skills to learn and teach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skill Categories - 2 Columns of 4 */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                POPULAR CATEGORIES
              </span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Discover & Share Skills</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore trending skill categories where thousands of learners and teachers connect every day.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              {leftColumnCategories.map((category, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-white to-slate-50 rounded-2xl p-8 hover:from-white hover:to-white transition-all duration-300 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h3>
                      <p className="text-slate-600">Join thousands learning and teaching this skill</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {rightColumnCategories.map((category, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-white to-slate-50 rounded-2xl p-8 hover:from-white hover:to-white transition-all duration-300 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h3>
                      <p className="text-slate-600">Join thousands learning and teaching this skill</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-purpal-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium border border-white/20">
              🎉 Join Active Learners
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Skill Journey?
            </span>
          </h2>
          
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners and teachers in our growing community where every skill has value.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="group px-12 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl font-bold text-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started Free
                  <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                </span>
              </Link>
              <Link
                to="/login"
                className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                Explore Community
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Landing