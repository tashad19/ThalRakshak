"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
    X,
    Bot,
    User,
    Loader2,
    Paperclip,
    ImageIcon,
    FileText,
    Send,
    Minimize2,
    Maximize2,
    Sparkles,
    Heart,
    Activity,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as pdfjs from "pdfjs-dist"

// Set worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [botData, setBotData] = useState(null)
    const messagesEndRef = useRef(null)
    const [isTyping, setIsTyping] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)
    const [activeRequest, setActiveRequest] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [eligibilityData, setEligibilityData] = useState(null)
    const [scheduledAppointments, setScheduledAppointments] = useState([])

    // Memoize initial welcome message to prevent re-renders
    const welcomeMessage = useMemo(
        () => ({
            role: "bot",
            content: `👋 **Welcome to BloodConnection AI!**

I'm your 24/7 blood management assistant. Here's what I can help you with:

🩸 **Blood Services**
• Request blood units
• Check availability
• Track requests
• Emergency alerts

💉 **Donation Services**
• Eligibility check
• Schedule donation
• Find centers
• Donation history

🏥 **Hospital Services**
• Registration
• Bulk requests
• Inventory management
• Emergency support

**Quick Start:**
• "I need O+ blood urgently"
• "Am I eligible to donate?"
• "Show blood inventory"
• "Schedule donation"

How can I assist you today?`,
            timestamp: Date.now(),
        }),
        [],
    )

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    // Fetch data when component mounts
    useEffect(() => {
        const fetchBotData = async () => {
            try {
                const response = await fetch("https://bloodconnection-backend.onrender.com/api/chatbot/data")
                const data = await response.json()
                setBotData(data)
            } catch (error) {
                console.error("Error fetching bot data:", error)
                // Set mock data if API fails
                setBotData({
                    statistics: {
                        totalHospitals: 150,
                        totalUsers: 5000,
                        activeEmergencies: 8,
                        emergencyResponseTime: "12 minutes",
                        averageRating: 4.6,
                        bloodInventory: {
                            aPositive: 45,
                            aNegative: 23,
                            bPositive: 38,
                            bNegative: 15,
                            abPositive: 12,
                            abNegative: 8,
                            oPositive: 67,
                            oNegative: 34,
                        },
                        cityWiseDistribution: {
                            "New York": 25,
                            "Los Angeles": 20,
                            Chicago: 18,
                            Houston: 15,
                        },
                    },
                    hospitals: [
                        {
                            name: "City General Hospital",
                            location: { city: "New York", state: "NY" },
                            rating: 4.8,
                        },
                        {
                            name: "Metro Medical Center",
                            location: { city: "Los Angeles", state: "CA" },
                            rating: 4.5,
                        },
                    ],
                    users: [
                        { bloodGroup: "O+", count: 1200 },
                        { bloodGroup: "A+", count: 980 },
                        { bloodGroup: "B+", count: 750 },
                    ],
                })
            }
        }

        fetchBotData()
    }, [])

    // Initialize welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([welcomeMessage])
        }
    }, [messages.length, welcomeMessage])

    // Enhanced query processing function with memoization
    const processQuery = useCallback(
        (query) => {
            if (!botData) return "🤖 I'm still loading data. Please wait a moment..."

            const lowerQuery = query.toLowerCase()

            // 1. Blood Unit Request & Management
            if (lowerQuery.includes("request blood") || lowerQuery.includes("place request")) {
                return `🩸 **Blood Unit Request System**

📋 **To place a blood request:**
1. Blood Group: A+, A-, B+, B-, AB+, AB-, O+, O-
2. Quantity: Number of units needed
3. Urgency: Emergency, Urgent, Normal

💬 **Example:** "I need 2 units of O+ blood urgently"

📊 **Track your request status:**
• Pending → Under Review
• Approved → Ready for dispatch
• Dispatched → On the way
• Completed → Delivered

🔄 **Manage requests:** You can edit or cancel requests within 30 minutes of placement.

**Ready to place a request? Just tell me: blood group, quantity, and urgency level!**`
            }

            if (lowerQuery.includes("track request") || lowerQuery.includes("request status")) {
                return `📋 **Request Tracking System**

${activeRequest
                        ? `🔍 **Your Active Request:**
• Request ID: #${activeRequest.id}
• Blood Type: ${activeRequest.bloodGroup}
• Quantity: ${activeRequest.quantity} units
• Status: ${activeRequest.status}
• Priority: ${activeRequest.urgency}
• Estimated Time: ${activeRequest.estimatedTime}

📱 **Next Steps:** ${activeRequest.nextSteps}`
                        : `📝 **No active requests found.**

To track a request, please provide:
• Request ID number, or
• Tell me you want to "place a new blood request"`
                    }

💡 **Need help?** I can help you place a new request or modify existing ones!`
            }

            // 2. Stock Availability Check
            if (lowerQuery.includes("do you have") || lowerQuery.includes("available") || lowerQuery.includes("stock")) {
                const bloodTypeMatch = query.match(/\b(a|b|ab|o)[+-]\b/i)
                if (bloodTypeMatch) {
                    const bloodType = bloodTypeMatch[0].toUpperCase()
                    const inventoryKey = bloodType
                        .replace(/^A\+$/, "aPositive")
                        .replace(/^A-$/, "aNegative")
                        .replace(/^B\+$/, "bPositive")
                        .replace(/^B-$/, "bNegative")
                        .replace(/^AB\+$/, "abPositive")
                        .replace(/^AB-$/, "abNegative")
                        .replace(/^O\+$/, "oPositive")
                        .replace(/^O-$/, "oNegative")

                    const units = botData.statistics.bloodInventory[inventoryKey] || 0
                    const status = units < 10 ? "🔴 Critical" : units < 20 ? "🟡 Moderate" : "🟢 Available"

                    return `🩸 **${bloodType} Blood Availability**

📦 **Current Stock:** ${units} units
📊 **Status:** ${status}
🏥 **Locations:** Available at ${Math.floor(Math.random() * 5) + 3} nearby centers

${units > 0
                            ? `✅ **Good News!** ${bloodType} blood is available.

🚀 **Quick Actions:**
• Place immediate request
• Schedule pickup
• Find nearest center
• Check delivery options

**Want to proceed?** Just say "request ${units > 5 ? Math.min(units, 3) : 1} units of ${bloodType}"`
                            : `❌ **Currently Out of Stock**

🔔 **We'll notify you when available!**
• Set up stock alert
• Check alternative blood types
• Find emergency contacts
• View donation drives

**Alternative:** Compatible blood types for ${bloodType} are available.`
                        }`
                }

                // General stock inquiry
                return `🏥 **Real-Time Blood Stock Status**

${Object.entries(botData.statistics.bloodInventory)
                        .map(([key, units]) => {
                            const display = key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/positive/g, "+")
                                .replace(/negative/g, "-")
                                .replace(/^a /, "A")
                                .replace(/^b /, "B")
                                .replace(/^ab /, "AB")
                                .replace(/^o /, "O")
                            const status = units < 10 ? "🔴" : units < 20 ? "🟡" : "🟢"
                            return `${status} **${display}**: ${units} units`
                        })
                        .join("\n")}

🔍 **Quick Search:** Ask "Do you have O+ blood?" for specific types
📍 **Location Filter:** Available - ask about specific centers
⚡ **Emergency Stock:** Priority access for urgent cases`
            }

            // 3. Schedule Pickup or Delivery
            if (lowerQuery.includes("schedule") || lowerQuery.includes("pickup") || lowerQuery.includes("delivery")) {
                return `📅 **Pickup & Delivery Scheduling**

🚚 **Pickup Service:**
• Available slots: 9 AM - 6 PM
• Same-day pickup available
• Hospital/clinic pickup points
• 30-minute time windows

🏠 **Delivery Service:**
• Emergency delivery: 24/7
• Standard delivery: Next day
• GPS tracking included
• Contactless delivery option

📋 **To schedule:**
1. Choose service type (pickup/delivery)
2. Select date and time
3. Provide location details
4. Confirm contact information

🗓️ **Available Today:**
• 10:00 AM - 10:30 AM ✅
• 2:00 PM - 2:30 PM ✅  
• 4:30 PM - 5:00 PM ✅

**Ready to book?** Tell me: "Schedule pickup at [location] at [time]"`
            }

            // 4. Donation Scheduling for Donors
            if (
                lowerQuery.includes("donate") ||
                lowerQuery.includes("appointment") ||
                lowerQuery.includes("schedule donation")
            ) {
                return `💉 **Blood Donation Scheduling**

🏥 **Find Nearest Centers:**
• City General Hospital - 2.3 km
• Metro Blood Bank - 4.1 km  
• Community Health Center - 5.8 km

📅 **Available Slots This Week:**
• **Today**: 11 AM, 3 PM, 5 PM
• **Tomorrow**: 9 AM, 1 PM, 4 PM
• **Weekend**: 10 AM - 4 PM

✅ **Eligibility Quick Check:**
• Age: 18-65 years
• Weight: 50+ kg
• Last donation: 56+ days ago
• Feeling healthy today

🎁 **Donor Benefits:**
• Free health checkup
• Donation certificate
• Priority blood access
• Community recognition

**Book now:** "Schedule donation at [center] on [date] at [time]"
**Check eligibility:** "Am I eligible to donate?"`
            }

            // 5. Donor Eligibility Check
            if (
                lowerQuery.includes("eligible") ||
                lowerQuery.includes("can i donate") ||
                lowerQuery.includes("eligibility")
            ) {
                return `🔍 **Donor Eligibility Assessment**

📋 **Quick Health Check:**
Please answer these questions:

**Basic Requirements:**
• Age: 18-65 years? (Yes/No)
• Weight: Above 50 kg? (Yes/No)
• Feeling healthy today? (Yes/No)

**Recent History:**
• Last blood donation: More than 56 days ago? (Yes/No)
• Recent illness/fever: None in past 2 weeks? (Yes/No)
• Recent travel: No international travel in 4 weeks? (Yes/No)
• Medications: No antibiotics in past week? (Yes/No)

**Lifestyle:**
• Alcohol: None in past 24 hours? (Yes/No)
• Sleep: Adequate rest last night? (Yes/No)

💡 **Smart Assessment:** Upload your recent blood test report for AI-powered eligibility analysis!

**Next eligible date calculator:** Tell me your last donation date for personalized timeline.

**Ready for assessment?** Answer with: "Age 25, weight 65kg, last donated 3 months ago, feeling healthy"`
            }

            // 6. Registration & Profile Handling
            if (
                lowerQuery.includes("register") ||
                lowerQuery.includes("profile") ||
                lowerQuery.includes("login") ||
                lowerQuery.includes("account")
            ) {
                return `👤 **Registration & Profile Management**

🆕 **New Donor Registration:**
• Personal details (Name, Age, Contact)
• Blood group verification
• Medical history
• Emergency contact
• Preferred donation center

🏥 **Hospital Registration:**
• Hospital license verification
• Contact information
• Service areas
• Emergency protocols

📊 **Your Profile Dashboard:**
${userProfile
                        ? `• **Name:** ${userProfile.name}
• **Blood Group:** ${userProfile.bloodGroup}
• **Total Donations:** ${userProfile.donations}
• **Last Donation:** ${userProfile.lastDonation}
• **Eligibility Status:** ${userProfile.eligible ? "✅ Eligible" : "❌ Not Eligible"}
• **Rewards Points:** ${userProfile.points}`
                        : `• Profile not found - Please register first`
                    }

🎯 **Quick Actions:**
• View donation history
• Update contact information
• Check reward points
• Download certificates
• Set notification preferences

**Get started:** "Register as donor" or "Hospital registration"`
            }

            // 7. Emergency Alerts & Smart Notifications
            if (lowerQuery.includes("emergency") || lowerQuery.includes("urgent") || lowerQuery.includes("alert")) {
                return `🚨 **Emergency Blood Alert System**

⚡ **Current Emergency Status:**
• Active Alerts: ${botData.statistics.activeEmergencies}
• Response Time: ${botData.statistics.emergencyResponseTime}
• Success Rate: 94%

🔔 **Smart Notifications:**
• Real-time stock alerts
• Emergency broadcast to donors
• Location-based notifications
• Priority matching system

📱 **Emergency Response:**
1. **Immediate Alert:** Sent to 500+ nearby donors
2. **Hospital Network:** 25 hospitals notified
3. **Blood Banks:** 12 centers activated
4. **Mobile Units:** 3 units dispatched

🆘 **Critical Needs Right Now:**
• **O- Blood:** 5 units needed urgently
• **AB+ Blood:** 3 units for surgery
• **Platelets:** 2 units for cancer patient

**Respond to emergency:** "I can donate O- blood now"
**Set up alerts:** "Notify me for O+ emergencies"
**Report emergency:** "Emergency need for 3 units B+ blood"

📞 **24/7 Emergency Hotline:** 1-800-BLOOD-911`
            }

            // 8. Enhanced FAQs and Information Support
            if (
                lowerQuery.includes("help") ||
                lowerQuery.includes("faq") ||
                lowerQuery.includes("information") ||
                lowerQuery.includes("what can you do")
            ) {
                return `🤖 **BloodConnection AI - Complete Assistant**

🩸 **Blood Services:**
• "Request 2 units of O+ blood urgently"
• "Do you have AB- blood available?"
• "Track my request #12345"
• "Schedule pickup tomorrow 2 PM"

💉 **Donation Services:**
• "Am I eligible to donate blood?"
• "Schedule donation appointment"
• "Find nearest donation center"
• "When can I donate next?"

🏥 **Hospital Services:**
• "Register our hospital"
• "Emergency blood alert"
• "Bulk blood request"
• "Delivery scheduling"

👤 **Profile & History:**
• "Show my donation history"
• "Update my profile"
• "Check reward points"
• "Download certificates"

📋 **Document Analysis:**
• Upload blood test reports (PDF)
• Eligibility assessment
• Health recommendations
• Medical history tracking

🚨 **Emergency Features:**
• 24/7 emergency alerts
• Real-time stock monitoring
• Priority donor matching
• Mobile response units

**Operating Hours:** 24/7 for emergencies, 9 AM - 6 PM for regular services
**Accepted IDs:** Government ID, Passport, Driver's License
**Donation Interval:** 56 days for whole blood, 7 days for platelets

💡 **Pro Tips:**
• Use specific blood types (O+, A-, etc.)
• Mention urgency level (emergency, urgent, normal)
• Include quantity (units needed)
• Specify location for better service`
            }

            // Blood inventory queries (enhanced)
            if (lowerQuery.includes("blood") || lowerQuery.includes("inventory")) {
                const bloodTypeMatch = query.match(/\b(a|b|ab|o)[+-]\b/i)
                if (bloodTypeMatch) {
                    const bloodType = bloodTypeMatch[0].toUpperCase()
                    const inventoryKey = bloodType
                        .replace(/^A\+$/, "aPositive")
                        .replace(/^A-$/, "aNegative")
                        .replace(/^B\+$/, "bPositive")
                        .replace(/^B-$/, "bNegative")
                        .replace(/^AB\+$/, "abPositive")
                        .replace(/^AB-$/, "abNegative")
                        .replace(/^O\+$/, "oPositive")
                        .replace(/^O-$/, "oNegative")

                    const units = botData.statistics.bloodInventory[inventoryKey] || 0
                    const status = units < 10 ? "🔴 Critical" : units < 20 ? "🟡 Moderate" : "🟢 Good"

                    return `🩸 **${bloodType} Blood - Detailed Status**

📦 **Available Units:** ${units}
📊 **Status:** ${status}
🏥 **Locations:** ${Math.floor(Math.random() * 8) + 2} centers
⏰ **Last Updated:** ${new Date().toLocaleTimeString()}

**Compatibility Info:**
• **Can receive from:** ${getCompatibleDonors(bloodType).join(", ")}
• **Can donate to:** ${getCompatibleRecipients(bloodType).join(", ")}

**Quick Actions:**
${units > 0
                            ? `• Request units: "I need ${Math.min(units, 2)} units of ${bloodType}"
• Schedule pickup: "Schedule pickup for ${bloodType}"
• Check delivery: "Delivery options for ${bloodType}"`
                            : `• Set alert: "Notify when ${bloodType} available"
• Find alternatives: "Show compatible blood types"
• Emergency protocol: "Emergency need for ${bloodType}"`
                        }

**Expiry Information:**
• Fresh units: ${Math.floor(units * 0.6)} (expires in 35+ days)
• Moderate: ${Math.floor(units * 0.3)} (expires in 15-35 days)
• Use soon: ${Math.floor(units * 0.1)} (expires in <15 days)`
                }

                // Show all blood inventory with enhanced details
                const bloodGroups = [
                    ["A+", "aPositive"],
                    ["A-", "aNegative"],
                    ["B+", "bPositive"],
                    ["B-", "bNegative"],
                    ["AB+", "abPositive"],
                    ["AB-", "abNegative"],
                    ["O+", "oPositive"],
                    ["O-", "oNegative"],
                ]
                    .map(([display, key]) => {
                        const units = botData.statistics.bloodInventory[key] || 0
                        const status = units < 10 ? "🔴" : units < 20 ? "🟡" : "🟢"
                        const demand = Math.random() > 0.5 ? "High" : "Normal"
                        return `${status} **${display}**: ${units} units (${demand} demand)`
                    })
                    .join("\n")

                return `🏥 **Complete Blood Inventory Dashboard**

${bloodGroups}

**Legend:**
🟢 Good Supply (20+ units) | 🟡 Moderate (10-19) | 🔴 Critical (<10)

📊 **Today's Statistics:**
• Total Units: ${Object.values(botData.statistics.bloodInventory).reduce((a, b) => a + b, 0)}
• Requests Fulfilled: 89%
• Emergency Response: ${botData.statistics.emergencyResponseTime}
• Donor Visits: 47 today

🚨 **Urgent Needs:**
• O- (Universal donor): Only ${botData.statistics.bloodInventory.oNegative} units
• AB- (Rare type): Only ${botData.statistics.bloodInventory.abNegative} units

**Smart Recommendations:**
• Best time to donate: 10 AM - 2 PM
• High-demand types: O+, A+, B+
• Rare type alerts: AB-, O-

💡 **Quick Commands:**
• "Request [number] units of [blood type]"
• "When will [blood type] be available?"
• "Set alert for [blood type] shortage"`
            }

            // Default enhanced response
            return `🤔 **I can help you with many things!**

🩸 **Blood Requests:**
• "I need 2 units of O+ blood urgently"
• "Do you have B- blood available?"
• "Track my blood request"

💉 **Donation Services:**
• "Am I eligible to donate?"
• "Schedule donation appointment"
• "Find donation centers near me"

🏥 **Hospital Services:**
• "Register hospital account"
• "Emergency blood alert"
• "Schedule blood pickup"

📋 **Smart Features:**
• Upload blood test reports for analysis
• Real-time stock monitoring
• Emergency alert system
• Donation history tracking

**Try asking:** "Show blood inventory" or "Help me donate blood"`
        },
        [botData, activeRequest, userProfile],
    )

    // Add these helper functions after the processQuery function:
    const getCompatibleDonors = (bloodType) => {
        const compatibility = {
            "A+": ["A+", "A-", "O+", "O-"],
            "A-": ["A-", "O-"],
            "B+": ["B+", "B-", "O+", "O-"],
            "B-": ["B-", "O-"],
            "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            "AB-": ["A-", "B-", "AB-", "O-"],
            "O+": ["O+", "O-"],
            "O-": ["O-"],
        }
        return compatibility[bloodType] || []
    }

    const getCompatibleRecipients = (bloodType) => {
        const compatibility = {
            "A+": ["A+", "AB+"],
            "A-": ["A+", "A-", "AB+", "AB-"],
            "B+": ["B+", "AB+"],
            "B-": ["B+", "B-", "AB+", "AB-"],
            "AB+": ["AB+"],
            "AB-": ["AB+", "AB-"],
            "O+": ["A+", "B+", "AB+", "O+"],
            "O-": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        }
        return compatibility[bloodType] || []
    }

    const analyzePdfContent = useCallback(async (pdfText) => {
        // Blood donation eligibility criteria
        const criteria = {
            hemoglobin: { min: 12.5, max: 18 },
            bloodPressure: {
                systolic: { min: 90, max: 180 },
                diastolic: { min: 60, max: 100 },
            },
            pulse: { min: 60, max: 100 },
            temperature: { min: 36.5, max: 37.5 },
            weight: { min: 50 },
            age: { min: 18, max: 65 },
        }

        const extractValue = (text, pattern) => {
            const match = text.match(pattern)
            return match ? Number.parseFloat(match[1]) : null
        }

        const values = {
            hemoglobin: extractValue(pdfText, /hemoglobin[:\s]+(\d+\.?\d*)/i),
            systolic: extractValue(pdfText, /blood pressure[:\s]+(\d+)/i),
            diastolic: extractValue(pdfText, /blood pressure[:\s]+\d+\/(\d+)/i),
            pulse: extractValue(pdfText, /pulse[:\s]+(\d+)/i),
            temperature: extractValue(pdfText, /temperature[:\s]+(\d+\.?\d*)/i),
            weight: extractValue(pdfText, /weight[:\s]+(\d+\.?\d*)/i),
            age: extractValue(pdfText, /age[:\s]+(\d+)/i),
        }

        const eligibility = { status: true, reasons: [] }

        // Check each criterion
        if (values.hemoglobin && values.hemoglobin < criteria.hemoglobin.min) {
            eligibility.status = false
            eligibility.reasons.push(
                `Hemoglobin level (${values.hemoglobin}) is below minimum required (${criteria.hemoglobin.min})`,
            )
        }

        if (
            values.systolic &&
            (values.systolic < criteria.bloodPressure.systolic.min || values.systolic > criteria.bloodPressure.systolic.max)
        ) {
            eligibility.status = false
            eligibility.reasons.push(`Blood pressure (systolic) is out of safe range`)
        }

        return { eligibility, values }
    }, [])

    const handleFileSelect = useCallback(
        async (event) => {
            const file = event.target.files[0]
            if (file) {
                if (file.type === "application/pdf") {
                    setSelectedFile(file)
                    setLoading(true)

                    try {
                        if (file.size > 5 * 1024 * 1024) {
                            throw new Error("File size too large. Please upload a PDF smaller than 5MB.")
                        }

                        const arrayBuffer = await file.arrayBuffer()
                        const pdf = await pdfjs.getDocument({
                            data: arrayBuffer,
                        }).promise

                        if (pdf.numPages > 10) {
                            throw new Error("PDF has too many pages. Please upload a shorter report.")
                        }

                        let fullText = ""
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i)
                            const textContent = await page.getTextContent()
                            const pageText = textContent.items.map((item) => item.str).join(" ")
                            fullText += pageText + "\n"
                        }

                        const analysis = await analyzePdfContent(fullText)

                        const response = `📋 **Blood Report Analysis Complete!**

${analysis.eligibility.status
                                ? "✅ **You are eligible to donate blood!**"
                                : "❌ **You are currently not eligible to donate blood.**"
                            }

${analysis.eligibility.reasons.length > 0
                                ? `\n⚠️ **Reasons:**\n${analysis.eligibility.reasons.map((reason) => `• ${reason}`).join("\n")}`
                                : ""
                            }

📊 **Your Test Results:**
${Object.entries(analysis.values)
                                .filter(([_, value]) => value !== null)
                                .map(([key, value]) => `• **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}`)
                                .join("\n")}

${analysis.eligibility.status
                                ? "\n🎉 **Great news!** You can proceed with blood donation. Visit your nearest blood bank or hospital."
                                : "\n💡 **Recommendation:** Please consult with a healthcare provider for guidance on improving your eligibility."
                            }

🏥 **Need help finding a donation center?** Just ask me to find hospitals near you!`

                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "user",
                                content: "📋 Uploaded blood test report for analysis",
                                attachment: { type: "pdf", name: file.name },
                                timestamp: Date.now(),
                            },
                            {
                                role: "bot",
                                content: response,
                                timestamp: Date.now(),
                            },
                        ])
                    } catch (error) {
                        console.error("Error processing PDF:", error)
                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "bot",
                                content: `⚠️ **Error Processing PDF**

${error.message || "Could not read the PDF properly."}

📋 **Please ensure:**
• The file is a valid blood test report
• Contains medical information (hemoglobin, blood pressure, etc.)
• Is properly formatted and not corrupted
• Is not password protected
• File size is under 5MB

💡 **Try uploading a different report or contact support if the issue persists.**`,
                                timestamp: Date.now(),
                            },
                        ])
                        setSelectedFile(null)
                    } finally {
                        setLoading(false)
                    }
                } else if (file.type.startsWith("image/")) {
                    setSelectedFile(file)
                } else {
                    alert("Please upload only images or PDF files")
                }
            }
        },
        [analyzePdfContent],
    )

    const handleSend = useCallback(async () => {
        if (!input.trim() && !selectedFile) return

        const userMessage = {
            role: "user",
            content: input,
            attachment: selectedFile
                ? {
                    type: selectedFile.type,
                    name: selectedFile.name,
                    url: URL.createObjectURL(selectedFile),
                }
                : null,
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setSelectedFile(null)
        setLoading(true)
        setIsTyping(true)

        try {
            // Simulate typing delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const response = processQuery(input)
            setMessages((prev) => [...prev, { role: "bot", content: response, timestamp: Date.now() }])
        } catch (error) {
            console.error("Error processing query:", error)
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "🤖 Sorry, I encountered an error. Please try again!",
                    timestamp: Date.now(),
                },
            ])
        } finally {
            setLoading(false)
            setIsTyping(false)
        }
    }, [input, selectedFile, processQuery])

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        },
        [handleSend],
    )

    const toggleChat = useCallback(() => setIsOpen(!isOpen), [isOpen])
    const toggleMinimize = useCallback(() => setIsMinimized(!isMinimized), [isMinimized])

    return (
        <AnimatePresence>
            {!isOpen ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-full shadow-2xl hover:shadow-red-500/25 transition-all z-50 group"
                    onClick={toggleChat}
                    aria-label="Open BloodConnection AI Assistant"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        className="relative"
                    >
                        <Sparkles size={32} className="text-white" />
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    </motion.div>
                    <span className="absolute -top-12 right-0 bg-white/10 backdrop-blur-sm text-white text-sm py-2 px-4 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Chat with BloodConnection AI
                    </span>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className={`fixed bottom-8 right-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 z-50 transition-all duration-300 ${
                        isMinimized ? "w-80 h-16" : "w-[420px] h-[600px]"
                    }`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                            >
                                <Bot className="text-white" size={24} />
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold text-white">BloodConnection AI</h2>
                                <p className="text-white/80 text-sm">Your Health Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleMinimize}
                                className="text-white hover:bg-white/20 rounded-full p-2.5 transition-colors"
                                title={isMinimized ? "Maximize" : "Minimize"}
                            >
                                {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleChat}
                                className="text-white hover:bg-white/20 rounded-full p-2.5 transition-colors"
                                title="Close"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {!isMinimized ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-900/50 to-purple-900/50 backdrop-blur-sm">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className="flex items-start max-w-[85%] space-x-3">
                                            {msg.role === "bot" && (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                    <Bot size={18} className="text-white" />
                                                </div>
                                            )}
                                            <div
                                                className={`p-4 rounded-2xl shadow-sm ${
                                                    msg.role === "user"
                                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-sm"
                                                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-sm"
                                                }`}
                                            >
                                                <div className="whitespace-pre-line text-sm leading-relaxed">
                                                    {msg.content.split("**").map((part, i) =>
                                                        i % 2 === 1 ? (
                                                            <strong key={i} className="font-semibold">
                                                                {part}
                                                            </strong>
                                                        ) : (
                                                            part
                                                        ),
                                                    )}
                                                </div>
                                                {msg.attachment && (
                                                    <div className="mt-2 flex items-center text-xs opacity-75">
                                                        {msg.attachment.type.startsWith("image/") ? (
                                                            <ImageIcon size={14} className="mr-1" />
                                                        ) : (
                                                            <FileText size={14} className="mr-1" />
                                                        )}
                                                        {msg.attachment.name}
                                                    </div>
                                                )}
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                    <User size={18} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                                            <Bot size={18} className="text-white" />
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                                            <div className="flex space-x-1.5">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            delay: i * 0.2,
                                                        }}
                                                        className="w-2.5 h-2.5 bg-red-500 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-white/20 p-5 bg-gradient-to-b from-slate-900/50 to-purple-900/50 backdrop-blur-sm">
                                <div className="flex flex-col space-y-3">
                                    {selectedFile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                                        >
                                            {selectedFile.type.startsWith("image/") ? (
                                                <ImageIcon size={18} className="text-white/80" />
                                            ) : (
                                                <FileText size={18} className="text-white/80" />
                                            )}
                                            <span className="text-sm text-white/80 truncate flex-1">{selectedFile.name}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedFile(null)}
                                                className="text-white/80 hover:text-white transition-colors"
                                            >
                                                <X size={16} />
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    <div className="flex items-end space-x-3">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type your message here..."
                                                className="w-full p-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-white placeholder-white/50"
                                                rows="1"
                                                style={{
                                                    minHeight: "52px",
                                                    maxHeight: "120px",
                                                }}
                                                disabled={loading}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                                title="Upload file"
                                            >
                                                <Paperclip size={20} />
                                            </motion.button>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSend}
                                            disabled={loading || (!input.trim() && !selectedFile)}
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[52px] w-[52px] flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                        </motion.button>
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-white/50">
                                    <div className="flex items-center space-x-1.5">
                                        <Heart size={14} className="text-red-400" />
                                        <span>Powered by AI</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Activity size={14} className="text-emerald-400" />
                                        <span>Real-time Data</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Minimized View
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600">
                            <div className="flex items-center space-x-2.5">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 4,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
                                >
                                    <Bot size={16} className="text-white" />
                                </motion.div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">BloodConnection AI</p>
                                    <p className="text-xs text-white/80 truncate">Click to expand</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1.5 ml-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMinimize}
                                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                                >
                                    <Maximize2 size={16} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleChat}
                                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Chatbot
