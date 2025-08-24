
"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Heart, 
  DollarSign, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Shield, 
  Users, 
  FileText, 
  Calculator,
  Globe,
  Award,
  HandHeart
} from "lucide-react"
import { Link } from "react-router-dom"

const FinancialAid = () => {
  const [selectedScheme, setSelectedScheme] = useState(null)

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

  // Government schemes data
  const governmentSchemes = useMemo(() => [
    {
      id: 1,
      name: "Pradhan Mantri Jan Arogya Yojana (PMJAY)",
      description: "Provides health coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
      coverage: "₹5,00,000 per family/year",
      eligibility: "Families identified under Socio Economic Caste Census (SECC) 2011",
      benefits: ["Free treatment at empaneled hospitals", "Cashless treatment", "Covers blood transfusion costs"],
      website: "https://pmjay.gov.in/",
      helpline: "14555"
    },
    {
      id: 2,
      name: "Rashtriya Arogya Nidhi (RAN)",
      description: "Provides financial assistance to patients belonging to families living below poverty line for treatment of major life threatening diseases.",
      coverage: "Up to ₹2,00,000",
      eligibility: "BPL families with life-threatening diseases",
      benefits: ["Financial assistance for treatment", "Support for blood disorders", "Emergency medical aid"],
      website: "https://ran.gov.in/",
      helpline: "1800-11-0023"
    },
    {
      id: 3,
      name: "Chief Minister's Relief Fund",
      description: "State-specific relief funds providing financial assistance for medical treatment including thalassemia care.",
      coverage: "Varies by state (₹50,000 - ₹5,00,000)",
      eligibility: "Residents of respective states with financial hardship",
      benefits: ["Direct financial assistance", "Quick approval process", "Covers blood transfusion costs"],
      website: "Contact state government",
      helpline: "Varies by state"
    },
    {
      id: 4,
      name: "Employees' State Insurance (ESI) Scheme",
      description: "Medical care and cash benefits during sickness and maternity for employees in organized sector.",
      coverage: "Complete medical care",
      eligibility: "Employees earning up to ₹25,000 per month",
      benefits: ["Free medical treatment", "Specialist care coverage", "Blood transfusion included"],
      website: "https://esic.nic.in/",
      helpline: "1800-123-2200"
    }
  ], [])

  // NGO data
  const supportingNGOs = useMemo(() => [
    {
      id: 1,
      name: "Thalassemics India",
      description: "Dedicated to supporting thalassemia patients and their families with comprehensive care and financial assistance.",
      services: ["Free blood transfusion", "Chelation therapy support", "Financial aid for treatment"],
      contact: {
        phone: "+91-22-2204-7027",
        email: "info@thalassemicsindia.org",
        website: "https://thalassemicsindia.org/",
        address: "Mumbai, Maharashtra"
      },
      impact: "Helped 10,000+ patients"
    },
    {
      id: 2,
      name: "Smile Foundation",
      description: "Works towards healthcare support for underprivileged children including blood disorder treatment.",
      services: ["Medical camps", "Treatment support", "Health education"],
      contact: {
        phone: "+91-11-4302-8200",
        email: "info@smilefoundationindia.org",
        website: "https://smilefoundationindia.org/",
        address: "New Delhi"
      },
      impact: "Reached 15 lakh+ children"
    },
    {
      id: 3,
      name: "Sankalp India Foundation",
      description: "Provides comprehensive support for thalassemia patients including financial assistance and awareness programs.",
      services: ["Financial assistance", "Blood donation drives", "Patient counseling"],
      contact: {
        phone: "+91-79-2642-4818",
        email: "info@sankalpindia.net",
        website: "https://sankalpindia.net/",
        address: "Ahmedabad, Gujarat"
      },
      impact: "Supported 5,000+ families"
    },
    {
      id: 4,
      name: "Apollo Hospitals Educational and Research Foundation",
      description: "Provides medical assistance and educational support for patients with chronic diseases.",
      services: ["Subsidized treatment", "Medical consultations", "Patient education"],
      contact: {
        phone: "+91-40-2355-1066",
        email: "info@apollohospitals.com",
        website: "https://apollohospitals.com/",
        address: "Hyderabad, Telangana"
      },
      impact: "Treated 2 lakh+ patients"
    }
  ], [])

  // Statistics
  const statistics = useMemo(() => [
    { icon: Users, value: "50L+", label: "Beneficiaries Covered" },
    { icon: DollarSign, value: "₹500Cr+", label: "Financial Aid Provided" },
    { icon: Building, value: "25,000+", label: "Empaneled Hospitals" },
    { icon: Heart, value: "95%", label: "Success Rate" }
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
              <HandHeart className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-white/90 font-medium">Financial Support</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Financial
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                Aid & Support
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Access government schemes and NGO support for thalassemia treatment, blood transfusion costs, and comprehensive healthcare assistance.
            </p>

            <Link to="/cost-calculator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center mx-auto"
              >
                <Calculator className="w-5 h-5 mr-2" />
                AI Treatment Cost Calculator
              </motion.button>
            </Link>
          </div>
        </SimpleAnimatedSection>

        {/* Statistics */}
        <SimpleAnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statistics.map((stat, index) => (
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
                  <stat.icon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>

        {/* Government Schemes */}
        <SimpleAnimatedSection delay={0.4}>
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Government Schemes</h2>
              <p className="text-white/70 text-lg">Financial assistance programs for healthcare support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {governmentSchemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Shield className="w-8 h-8 text-blue-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">{scheme.name}</h3>
                    </div>
                  </div>

                  <p className="text-white/80 mb-4">{scheme.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-green-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-semibold">Coverage: {scheme.coverage}</span>
                    </div>
                    <div className="text-white/70">
                      <strong>Eligibility:</strong> {scheme.eligibility}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Benefits:</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      {scheme.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/70 text-sm">
                      <Phone className="w-4 h-4 mr-1" />
                      {scheme.helpline}
                    </div>
                    <a
                      href={scheme.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>

        {/* Supporting NGOs */}
        <SimpleAnimatedSection delay={0.6}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Supporting NGOs</h2>
              <p className="text-white/70 text-lg">Organizations providing comprehensive healthcare support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportingNGOs.map((ngo, index) => (
                <motion.div
                  key={ngo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-red-400 mr-3" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{ngo.name}</h3>
                        <p className="text-green-400 text-sm">{ngo.impact}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 mb-4">{ngo.description}</p>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Services:</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      {ngo.services.map((service, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/70">
                      <Phone className="w-4 h-4 mr-2" />
                      {ngo.contact.phone}
                    </div>
                    <div className="flex items-center text-white/70">
                      <Mail className="w-4 h-4 mr-2" />
                      {ngo.contact.email}
                    </div>
                    <div className="flex items-center text-white/70">
                      <MapPin className="w-4 h-4 mr-2" />
                      {ngo.contact.address}
                    </div>
                    <a
                      href={ngo.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>
      </div>
    </div>
  )
}

export default FinancialAid
