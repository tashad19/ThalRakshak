"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowLeft,
  AlertCircle,
  Heart,
  Droplet,
  Users,
  Calendar,
} from "lucide-react"

const HospitalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`http://localhost:5000/api/hospitals/${id}`)
        setHospital(response.data)
      } catch (error) {
        console.error("Error fetching hospital details:", error)
        setError("Failed to load hospital details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHospitalDetails()
  }, [id])

  if (isLoading) {
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
          <p className="text-white/70">Loading hospital details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">Error Loading Hospital Details</h3>
          <p className="text-white/50">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">Hospital Not Found</h3>
          <p className="text-white/50">The hospital you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Calculate average rating
  const averageRating = hospital.reviews?.length > 0
    ? (hospital.reviews.reduce((acc, review) => acc + review.rating, 0) / hospital.reviews.length).toFixed(1)
    : 0

  // Format blood inventory
  const bloodInventory = Object.entries(hospital.inventory).map(([type, units]) => ({
    type: type
      .replace(/([A-Z])/g, '$1')
      .replace('Positive', '+')
      .replace('Negative', '-')
      .toUpperCase(),
    units,
    status: units > 0 ? "available" : "unavailable"
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        {/* Hospital Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 via-red-700 to-purple-700 rounded-2xl p-8 text-white shadow-2xl border border-white/10 backdrop-blur-sm mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hospital.hospitalName}</h1>
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {hospital.location.city}, {hospital.location.state}
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-2 text-yellow-400" />
                  {averageRating}/5.0 ({hospital.reviews?.length || 0} reviews)
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={() => window.open(`tel:${hospital.phone}`)}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Phone size={20} />
              </button>
              <button
                onClick={() => window.open(`mailto:${hospital.email}`)}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Mail size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-white/80">
                  <Phone size={16} className="mr-3 text-red-400" />
                  {hospital.phone}
                </div>
                <div className="flex items-center text-white/80">
                  <Mail size={16} className="mr-3 text-red-400" />
                  {hospital.email}
                </div>
                <div className="flex items-center text-white/80">
                  <MapPin size={16} className="mr-3 text-red-400" />
                  {hospital.location.city}, {hospital.location.state}
                </div>
                <div className="flex items-center text-white/80">
                  <Clock size={16} className="mr-3 text-red-400" />
                  24/7 Emergency Services
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Registration Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-white/80">
                  <Users size={16} className="mr-3 text-red-400" />
                  Registration Number: {hospital.registrationNumber}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Blood Inventory & Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Blood Inventory */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Droplet size={20} className="mr-2 text-red-400" />
                Blood Inventory
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodInventory.map((blood) => (
                  <div
                    key={blood.type}
                    className={`p-4 rounded-xl ${
                      blood.status === "available"
                        ? "bg-green-500/20 border-green-400/30"
                        : "bg-red-500/20 border-red-400/30"
                    } border backdrop-blur-sm`}
                  >
                    <div className="text-lg font-semibold text-white mb-1">{blood.type}</div>
                    <div className="text-sm text-white/70">
                      {blood.units} units {blood.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star size={20} className="mr-2 text-yellow-400" />
                Reviews
              </h3>
              {hospital.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {hospital.reviews.map((review, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">{review.userName}</div>
                        <div className="flex items-center text-yellow-400">
                          <Star size={16} className="mr-1" />
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">{review.comment}</p>
                      <div className="text-white/50 text-xs mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-4">No reviews yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HospitalDetails 