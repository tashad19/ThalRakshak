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
  Navigation,
  Map,
  Crosshair,
} from "lucide-react"

const HospitalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [navigationUrl, setNavigationUrl] = useState("")

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

  const getUserLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setIsGettingLocation(false)
          
          // Generate navigation URL for OpenStreetMap
          if (hospital?.location?.coordinates?.latitude && hospital?.location?.coordinates?.longitude) {
            const url = `https://www.openstreetmap.org/directions?from=${latitude},${longitude}&to=${hospital.location.coordinates.latitude},${hospital.location.coordinates.longitude}&route=1`
            setNavigationUrl(url)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
          alert("Unable to get your location. Please check your browser permissions.")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      setIsGettingLocation(false)
      alert("Geolocation is not supported by this browser.")
    }
  }

  const openNavigation = () => {
    if (navigationUrl) {
      window.open(navigationUrl, '_blank')
    } else {
      alert("Please get your location first to enable navigation.")
    }
  }

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
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 disabled:opacity-50"
                  title="Get My Location"
                >
                  {isGettingLocation ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Crosshair size={20} />
                  )}
                </button>
                <button
                  onClick={openNavigation}
                  disabled={!navigationUrl}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 disabled:opacity-50"
                  title="Open Navigation"
                >
                  <Navigation size={20} />
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                  title="Show Map"
                >
                  <Map size={20} />
                </button>
              </div>
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

        {/* Navigation Map Section */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Map size={20} className="mr-2 text-blue-400" />
                Location & Navigation
              </h3>
              
              {hospital.location.coordinates?.latitude && hospital.location.coordinates?.longitude ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-2">Hospital Coordinates</h4>
                      <p className="text-white/70 text-sm">
                        Latitude: {hospital.location.coordinates.latitude.toFixed(6)}
                      </p>
                      <p className="text-white/70 text-sm">
                        Longitude: {hospital.location.coordinates.longitude.toFixed(6)}
                      </p>
                    </div>
                    {userLocation && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-2">Your Location</h4>
                        <p className="text-white/70 text-sm">
                          Latitude: {userLocation.latitude.toFixed(6)}
                        </p>
                        <p className="text-white/70 text-sm">
                          Longitude: {userLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {!userLocation ? (
                      <button
                        onClick={getUserLocation}
                        disabled={isGettingLocation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isGettingLocation ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <Crosshair size={16} className="mr-2" />
                            Get My Location
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={openNavigation}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Navigation size={16} className="mr-2" />
                        Open Navigation
                      </button>
                    )}
                  </div>
                  
                  {/* Embedded OpenStreetMap */}
                  <div className="w-full h-64 rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.location.coordinates.longitude-0.01},${hospital.location.coordinates.latitude-0.01},${hospital.location.coordinates.longitude+0.01},${hospital.location.coordinates.latitude+0.01}&layer=mapnik&marker=${hospital.location.coordinates.latitude},${hospital.location.coordinates.longitude}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
                  <p className="text-white/70 mb-4">
                    Hospital location coordinates are not available. Please contact the hospital to update their location information.
                  </p>
                  <button
                    onClick={() => window.open(`mailto:${hospital.email}?subject=Location Update Request&body=Please update the hospital location coordinates for navigation purposes.`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Location Update
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

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