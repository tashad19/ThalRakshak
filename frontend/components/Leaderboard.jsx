"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  Trophy,
  Medal,
  Award,
  Star,
  Crown,
  TrendingUp,
  Users,
  Target,
  Zap,
  Heart,
  MapPin,
  Droplets,
} from "lucide-react"

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("leaderboard")

  useEffect(() => {
    fetchLeaderboard()
    fetchUserStats()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leaderboard")
      setLeaderboard(response.data.leaderboard)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast.error("Failed to load leaderboard")
    }
  }

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get("http://localhost:5000/api/leaderboard/user-stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserStats(response.data.userStats)
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <Star className="w-4 h-4 text-blue-400" />
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700"
      default:
        return "bg-white/10"
    }
  }

  const getLevelColor = (level) => {
    if (level >= 50) return "text-purple-400"
    if (level >= 25) return "text-red-400"
    if (level >= 10) return "text-blue-400"
    if (level >= 5) return "text-green-400"
    return "text-gray-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white/70">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-yellow-400 mr-3" />
            Blood Donation Leaderboard
          </h1>
          <p className="text-white/70 text-lg">
            Compete with other donors and track your progress
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "leaderboard"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              My Stats
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="order-2 md:order-1"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Medal className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">#{leaderboard[1].rank}</h3>
                      <p className="text-white/80 font-semibold">{leaderboard[1].name}</p>
                      <p className="text-white/60 text-sm">{leaderboard[1].bloodGroup}</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-white">{leaderboard[1].donationCount}</span>
                        <p className="text-white/60 text-sm">donations</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="order-1 md:order-2"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-yellow-400/30 transform scale-110">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">#{leaderboard[0].rank}</h3>
                      <p className="text-white/90 font-semibold text-lg">{leaderboard[0].name}</p>
                      <p className="text-white/60 text-sm">{leaderboard[0].bloodGroup}</p>
                      <div className="mt-3">
                        <span className="text-3xl font-bold text-white">{leaderboard[0].donationCount}</span>
                        <p className="text-white/60 text-sm">donations</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="order-3"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">#{leaderboard[2].rank}</h3>
                      <p className="text-white/80 font-semibold">{leaderboard[2].name}</p>
                      <p className="text-white/60 text-sm">{leaderboard[2].bloodGroup}</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-white">{leaderboard[2].donationCount}</span>
                        <p className="text-white/60 text-sm">donations</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Leaderboard List */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  All Donors
                </h2>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.name + index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        getRankColor(user.rank)
                      } ${user.rank <= 3 ? "border-white/30" : "border-white/10"}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(user.rank)}
                          <span className="text-white font-bold text-lg">#{user.rank}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.name}</p>
                          <div className="flex items-center space-x-2 text-white/60 text-sm">
                            <Droplets className="w-4 h-4" />
                            <span>{user.bloodGroup}</span>
                            <MapPin className="w-4 h-4" />
                            <span>{user.location?.city}, {user.location?.state}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getLevelColor(user.level)}`}>
                            Lv.{user.level}
                          </span>
                          <span className="text-white font-bold text-xl">{user.donationCount}</span>
                        </div>
                        <p className="text-white/60 text-sm">donations</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && userStats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* User Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Rank</h3>
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">#{userStats.rank}</p>
                  <p className="text-white/60 text-sm">out of all donors</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Donations</h3>
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{userStats.donationCount}</p>
                  <p className="text-white/60 text-sm">total donations</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Level</h3>
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{userStats.level}</p>
                  <p className="text-white/60 text-sm">experience level</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Experience</h3>
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{userStats.experience}</p>
                  <p className="text-white/60 text-sm">XP points</p>
                </motion.div>
              </div>

              {/* Progress to Next Level */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4">Progress to Level {userStats.level + 1}</h3>
                <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.progressToNextLevel}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full"
                  />
                </div>
                <p className="text-white/70 text-sm">
                  {userStats.experience} / {userStats.nextLevelExp} XP ({userStats.progressToNextLevel.toFixed(1)}%)
                </p>
              </motion.div>

              {/* Badges */}
              {userStats.badges && userStats.badges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Badges Earned</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userStats.badges.map((badge, index) => (
                      <motion.div
                        key={badge.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="text-white font-semibold mb-1">{badge.name}</h4>
                        <p className="text-white/60 text-sm">{badge.description}</p>
                        <p className="text-white/40 text-xs mt-2">
                          {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Last Donation */}
              {userStats.lastDonationDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Last Donation</h3>
                  <p className="text-white/70">
                    {new Date(userStats.lastDonationDate).toLocaleDateString()} at{" "}
                    {new Date(userStats.lastDonationDate).toLocaleTimeString()}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Leaderboard
