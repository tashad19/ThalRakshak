
"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Calculator, 
  User, 
  Calendar, 
  Activity, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  FileText,
  AlertCircle,
  CheckCircle,
  PieChart,
  BarChart3,
  Clock,
  Heart
} from "lucide-react"
import { toast } from "react-hot-toast"

const CostCalculator = () => {
  const [formData, setFormData] = useState({
    patientAge: "",
    thalasemiaType: "",
    transfusionFrequency: "",
    currentCity: ""
  })
  const [calculating, setCalculating] = useState(false)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState({})

  // Simple animation component
  const SimpleAnimatedSection = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  // Form options
  const thalasemiaTypes = useMemo(() => [
    { value: "", label: "Select Thalassemia Type" },
    { value: "beta-major", label: "Beta Thalassemia Major" },
    { value: "beta-intermediate", label: "Beta Thalassemia Intermediate" },
    { value: "beta-minor", label: "Beta Thalassemia Minor" },
    { value: "alpha-major", label: "Alpha Thalassemia Major" },
    { value: "alpha-intermediate", label: "Alpha Thalassemia Intermediate" },
    { value: "hb-e-beta", label: "HbE Beta Thalassemia" }
  ], [])

  const transfusionFrequencies = useMemo(() => [
    { value: "", label: "Select Frequency" },
    { value: "weekly", label: "Weekly (52 times/year)" },
    { value: "bi-weekly", label: "Bi-weekly (26 times/year)" },
    { value: "monthly", label: "Monthly (12 times/year)" },
    { value: "quarterly", label: "Quarterly (4 times/year)" },
    { value: "as-needed", label: "As needed (Variable)" }
  ], [])

  // Cost calculation logic
  const calculateCosts = useCallback(() => {
    const age = parseInt(formData.patientAge)
    const type = formData.thalasemiaType
    const frequency = formData.transfusionFrequency
    const city = formData.currentCity.toLowerCase()

    // Base costs (in INR)
    let baseCosts = {
      bloodTransfusion: 0,
      chelationTherapy: 0,
      monitoring: 0,
      supplements: 0,
      complications: 0
    }

    // Calculate based on transfusion frequency
    const frequencyMultipliers = {
      "weekly": 52,
      "bi-weekly": 26,
      "monthly": 12,
      "quarterly": 4,
      "as-needed": 8
    }

    const transfusionsPerYear = frequencyMultipliers[frequency] || 12

    // Base costs per transfusion
    baseCosts.bloodTransfusion = transfusionsPerYear * 3500 // ₹3,500 per transfusion

    // Chelation therapy costs
    if (type.includes("major") || type.includes("intermediate")) {
      baseCosts.chelationTherapy = 180000 // Annual chelation cost
    } else {
      baseCosts.chelationTherapy = 60000
    }

    // Monitoring costs (tests, consultations)
    baseCosts.monitoring = transfusionsPerYear * 1500 // ₹1,500 per visit

    // Supplements and medications
    baseCosts.supplements = 36000 // Annual supplement cost

    // Complication management (age-based)
    if (age > 30) {
      baseCosts.complications = 80000
    } else if (age > 18) {
      baseCosts.complications = 40000
    } else {
      baseCosts.complications = 20000
    }

    // City-based cost adjustment
    const cityMultipliers = {
      "mumbai": 1.3,
      "delhi": 1.25,
      "bangalore": 1.2,
      "chennai": 1.15,
      "kolkata": 1.1,
      "hyderabad": 1.1,
      "pune": 1.15,
      "ahmedabad": 1.05
    }

    const cityMultiplier = cityMultipliers[city] || 1.0

    // Apply city multiplier
    Object.keys(baseCosts).forEach(key => {
      baseCosts[key] = Math.round(baseCosts[key] * cityMultiplier)
    })

    const totalAnnualCost = Object.values(baseCosts).reduce((sum, cost) => sum + cost, 0)

    return {
      breakdown: baseCosts,
      totalAnnualCost,
      monthlyAverage: Math.round(totalAnnualCost / 12),
      lifetimeEstimate: Math.round(totalAnnualCost * (75 - age)), // Estimated lifetime cost
      governmentCoverage: Math.round(totalAnnualCost * 0.6), // 60% potential coverage
      outOfPocket: Math.round(totalAnnualCost * 0.4) // 40% out of pocket
    }
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const validate = useCallback(() => {
    const newErrors = {}
    
    if (!formData.patientAge) {
      newErrors.patientAge = "Age is required"
    } else if (parseInt(formData.patientAge) < 1 || parseInt(formData.patientAge) > 100) {
      newErrors.patientAge = "Please enter a valid age (1-100)"
    }
    
    if (!formData.thalasemiaType) {
      newErrors.thalasemiaType = "Please select thalassemia type"
    }
    
    if (!formData.transfusionFrequency) {
      newErrors.transfusionFrequency = "Please select transfusion frequency"
    }
    
    if (!formData.currentCity) {
      newErrors.currentCity = "City is required"
    }

    return newErrors
  }, [formData])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setCalculating(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const calculatedResults = calculateCosts()
      setResults(calculatedResults)
      
      toast.success("Cost calculation completed successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: "12px",
        },
        duration: 3000,
      })
    } catch (error) {
      toast.error("Failed to calculate costs. Please try again.", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "12px",
        },
      })
    } finally {
      setCalculating(false)
    }
  }, [formData, validate, calculateCosts])

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }, [])

  // Features data
  const features = useMemo(() => [
    {
      icon: TrendingUp,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms for accurate cost predictions"
    },
    {
      icon: FileText,
      title: "Detailed Breakdown",
      description: "Comprehensive cost analysis by category"
    },
    {
      icon: PieChart,
      title: "Financial Planning",
      description: "Guidance for managing treatment expenses"
    },
    {
      icon: BarChart3,
      title: "City-Based Pricing",
      description: "Location-specific cost adjustments"
    }
  ], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <SimpleAnimatedSection>
          <div className="text-center px-6 max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            >
              <Calculator className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-white/90 font-medium">AI-Powered Calculator</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                Treatment Cost
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                Calculator
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Get personalized cost estimates and financial planning guidance for thalassemia treatment using our AI-powered calculator.
            </p>
          </div>
        </SimpleAnimatedSection>

        {/* Features */}
        <SimpleAnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>

        {/* Calculator Form and Results */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Patient Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Age */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                    Patient Age
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.patientAge ? "border-red-400" : ""
                    }`}
                    placeholder="Enter age"
                    min="1"
                    max="100"
                    disabled={calculating}
                  />
                  {errors.patientAge && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.patientAge}
                    </motion.p>
                  )}
                </div>

                {/* Thalassemia Type */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Activity className="w-4 h-4 mr-2 text-blue-400" />
                    Thalassemia Type
                  </label>
                  <select
                    name="thalasemiaType"
                    value={formData.thalasemiaType}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.thalasemiaType ? "border-red-400" : ""
                    }`}
                    disabled={calculating}
                  >
                    {thalasemiaTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-slate-800">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.thalasemiaType && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.thalasemiaType}
                    </motion.p>
                  )}
                </div>

                {/* Transfusion Frequency */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    Transfusion Frequency
                  </label>
                  <select
                    name="transfusionFrequency"
                    value={formData.transfusionFrequency}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.transfusionFrequency ? "border-red-400" : ""
                    }`}
                    disabled={calculating}
                  >
                    {transfusionFrequencies.map((frequency) => (
                      <option key={frequency.value} value={frequency.value} className="bg-slate-800">
                        {frequency.label}
                      </option>
                    ))}
                  </select>
                  {errors.transfusionFrequency && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.transfusionFrequency}
                    </motion.p>
                  )}
                </div>

                {/* Current City */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                    Current City
                  </label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.currentCity ? "border-red-400" : ""
                    }`}
                    placeholder="Enter your city"
                    disabled={calculating}
                  />
                  {errors.currentCity && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.currentCity}
                    </motion.p>
                  )}
                </div>

                {/* Calculate Button */}
                <motion.button
                  type="submit"
                  disabled={calculating}
                  whileHover={{ scale: calculating ? 1 : 1.02 }}
                  whileTap={{ scale: calculating ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {calculating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate Costs
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Estimated Annual Costs</h2>
              </div>

              {results ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Total Annual Cost</h3>
                      <p className="text-4xl font-bold text-green-400">{formatCurrency(results.totalAnnualCost)}</p>
                      <p className="text-white/70 mt-2">Monthly Average: {formatCurrency(results.monthlyAverage)}</p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-white">Cost Breakdown</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Blood Transfusions</span>
                        <span className="text-white font-semibold">{formatCurrency(results.breakdown.bloodTransfusion)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Chelation Therapy</span>
                        <span className="text-white font-semibold">{formatCurrency(results.breakdown.chelationTherapy)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Monitoring & Tests</span>
                        <span className="text-white font-semibold">{formatCurrency(results.breakdown.monitoring)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Supplements</span>
                        <span className="text-white font-semibold">{formatCurrency(results.breakdown.supplements)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80">Complications</span>
                        <span className="text-white font-semibold">{formatCurrency(results.breakdown.complications)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Planning */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-white">Financial Planning</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200">Government Coverage (Est.)</span>
                          <span className="text-blue-400 font-semibold">{formatCurrency(results.governmentCoverage)}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-200">Out of Pocket (Est.)</span>
                          <span className="text-orange-400 font-semibold">{formatCurrency(results.outOfPocket)}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-200">Lifetime Estimate</span>
                          <span className="text-purple-400 font-semibold">{formatCurrency(results.lifetimeEstimate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        Apply for government schemes like PMJAY for coverage up to ₹5 lakh
                      </li>
                      <li className="flex items-start">
                        <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        Contact supporting NGOs for additional financial assistance
                      </li>
                      <li className="flex items-start">
                        <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        Consider health insurance plans with thalassemia coverage
                      </li>
                      <li className="flex items-start">
                        <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        Set up monthly savings plan for out-of-pocket expenses
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Fill in the patient information to calculate estimated treatment costs</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostCalculator
