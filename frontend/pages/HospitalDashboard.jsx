"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion, useInView } from "framer-motion"
import {
  Hospital,
  MapPin,
  Droplets,
  Save,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react"
import ChatBot from "../components/ChatBot"

const HospitalDashboard = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState({
    aPositive: 0,
    aNegative: 0,
    bPositive: 0,
    bNegative: 0,
    abPositive: 0,
    abNegative: 0,
    oPositive: 0,
    oNegative: 0,
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [hospital, setHospital] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token) {
      toast.error("Please log in to access the dashboard", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      })
      navigate("/login", { replace: true })
      return
    }

    if (userType !== "hospital") {
      toast.error("Access denied. Hospital login required.", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      })
      navigate("/login", { replace: true })
      return
    }

    setIsAuthenticated(true)
    fetchProfile()
  }, [navigate])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await axios.get("http://localhost:5000/api/hospitals/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.data) {
        throw new Error("No profile data received")
      }

      // Set hospital data
      setHospital(response.data)
      
      // Set inventory with default values if not present
      setInventory({
        aPositive: response.data.inventory?.aPositive || 0,
        aNegative: response.data.inventory?.aNegative || 0,
        bPositive: response.data.inventory?.bPositive || 0,
        bNegative: response.data.inventory?.bNegative || 0,
        abPositive: response.data.inventory?.abPositive || 0,
        abNegative: response.data.inventory?.abNegative || 0,
        oPositive: response.data.inventory?.oPositive || 0,
        oNegative: response.data.inventory?.oNegative || 0,
      })
    } catch (err) {
      console.error("Profile fetch error:", err)
      if (err.response?.status === 401) {
        // Clear all auth data
        localStorage.removeItem("token")
        localStorage.removeItem("userType")
        localStorage.removeItem("userId")
        
        toast.error("Session expired. Please log in again.", {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
        navigate("/login", { replace: true })
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch profile data", {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInventory = async () => {
    try {
      setUpdating(true)
      const response = await axios.put(
        "http://localhost:5000/api/hospitals/inventory",
        inventory,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.inventory) {
        setInventory(response.data.inventory)
        toast.success("Inventory updated successfully!", {
          style: {
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
      }
    } catch (err) {
      console.error("Update error:", err)
      toast.error(err.response?.data?.message || "Failed to update inventory", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    navigate("/login", { replace: true })
  }, [navigate])

  const handleInventoryChange = useCallback((type, value) => {
    setInventory(prev => ({
      ...prev,
      [type]: Math.max(0, parseInt(value) || 0)
    }))
  }, [])

  // Memoized components and values
  const AnimatedSection = useMemo(() => {
    return ({ children, delay = 0 }) => {
      const ref = useRef(null)
      const isInView = useInView(ref, { once: true, margin: "-100px" })

      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )
    }
  }, [])

  const getStockStatus = useCallback((quantity) => {
    if (quantity === 0) return { status: "Out of Stock", color: "text-red-400", bgColor: "bg-red-500/20" }
    if (quantity < 10) return { status: "Critical", color: "text-orange-400", bgColor: "bg-orange-500/20" }
    if (quantity < 20) return { status: "Low", color: "text-yellow-400", bgColor: "bg-yellow-500/20" }
    return { status: "Good", color: "text-emerald-400", bgColor: "bg-emerald-500/20" }
  }, [])

  const bloodTypeDisplayNames = useMemo(() => ({
    aPositive: "A+",
    aNegative: "A-",
    bPositive: "B+",
    bNegative: "B-",
    abPositive: "AB+",
    abNegative: "AB-",
    oPositive: "O+",
    oNegative: "O-",
  }), [])

  const stats = useMemo(() => ({
    totalUnits: Object.values(inventory).reduce((sum, units) => sum + (Number.parseInt(units) || 0), 0),
    criticalTypes: Object.entries(inventory).filter(([_, quantity]) => quantity < 10).length,
    outOfStock: Object.entries(inventory).filter(([_, quantity]) => quantity === 0).length,
  }), [inventory])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 pt-32 pb-20">
        {/* Hospital Header */}
        <AnimatedSection>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg"
                  >
                    <Hospital className="w-10 h-10 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {hospital?.hospitalName || "Hospital Dashboard"}
                    </h1>
                    <div className="flex items-center text-white/80 mb-4">
                      <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-lg">
                        {hospital?.location?.city || "City"}, {hospital?.location?.state || "State"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/blood-predictor")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Blood Predictor
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Overview */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Blood Units</h3>
                  <Droplets className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalUnits}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Critical Types</h3>
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.criticalTypes}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Out of Stock</h3>
                  <TrendingUp className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.outOfStock}</p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Inventory Management */}
        <AnimatedSection delay={0.4}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Blood Inventory Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateInventory}
                  disabled={updating}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center ${
                    updating
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  } text-white transition-all duration-300`}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {updating ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(inventory).map(([type, quantity]) => {
                  const { status, color, bgColor } = getStockStatus(quantity)
                  return (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {bloodTypeDisplayNames[type]}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${color} ${bgColor}`}>
                          {status}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleInventoryChange(type, e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 transition-all duration-300"
                          min="0"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                          units
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Add ChatBot at the end, before closing div */}
      <ChatBot />
    </div>
  )
}

export default HospitalDashboard
