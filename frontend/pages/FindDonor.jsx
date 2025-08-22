"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
    Search,
    User,
    MapPin,
    Heart,
    Phone,
    Mail,
    Filter,
    Users,
    Target,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Memoized AnimatedSection component to prevent re-renders
const AnimatedSection = React.memo(({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}>
            {children}
        </motion.div>
    );
});

// Memoized Particle component
const Particle = React.memo(({ index }) => {
    const particleStyle = useMemo(
        () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
        }),
        []
    );

    const animationProps = useMemo(
        () => ({
            y: [-20, -120, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.2, 0.8],
        }),
        []
    );

    const transitionProps = useMemo(
        () => ({
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
            ease: "easeInOut",
        }),
        []
    );

    return (
        <motion.div
            className="absolute w-2 h-2 bg-white/30 rounded-full blur-[0.5px]"
            style={particleStyle}
            animate={animationProps}
            transition={transitionProps}
        />
    );
});

// Memoized DonorCard component
const DonorCard = React.memo(({ donor, index }) => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({
        subject: "",
        message: "",
        urgency: "normal",
    });

    const handleCall = useCallback(() => {
        if (donor.phone) {
            window.location.href = `tel:${donor.phone}`;
        } else {
            toast.error("Phone number not available");
        }
    }, [donor.phone]);

    const handleEmail = useCallback(() => {
        setShowEmailModal(true);
    }, []);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/donors/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: donor.email,
                    toName: donor.name,
                    from: localStorage.getItem("userEmail") || "anonymous@bloodbond.com",
                    fromName: localStorage.getItem("userName") || "Anonymous User",
                    subject: emailForm.subject,
                    message: emailForm.message,
                    senderPhone: localStorage.getItem("userPhone") || "",
                    urgency: emailForm.urgency,
                    donorBloodGroup: donor.bloodGroup,
                    donorLocation: `${donor.city}, ${donor.state}`,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Email sent successfully!");
                setShowEmailModal(false);
                setEmailForm({ subject: "", message: "", urgency: "normal" });
            } else {
                throw new Error(data.message || "Failed to send email");
            }
        } catch (error) {
            toast.error(error.message || "Failed to send email");
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 shadow-xl hover:shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <User className="w-10 h-10 text-white" />
                        </motion.div>

                        <div className="min-w-0 flex-1">
                            <h4 className="text-2xl font-bold text-white mb-3">
                                {donor.name}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-white/80">
                                <div className="flex items-center">
                                    <Heart className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                                    <span className="font-semibold text-lg">
                                        {donor.bloodGroup}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                                    <span className="text-base">
                                        {donor.city}, {donor.state}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                        <motion.button
                            onClick={handleCall}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="min-h-[56px] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center border border-emerald-400/20 hover:border-emerald-300/40"
                            title="Contact donor via phone">
                            <Phone className="w-5 h-5 mr-2" />
                            Call
                        </motion.button>
                        <motion.button
                            onClick={handleEmail}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="min-h-[56px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center border border-blue-400/20 hover:border-blue-300/40"
                            title="Contact donor via email">
                            <Mail className="w-5 h-5 mr-2" />
                            Email
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Send Email to {donor.name}</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-white/60 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/90 font-medium mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                                    required
                                    className="w-full min-h-[48px] p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                                    placeholder="Enter email subject"
                                />
                            </div>

                            <div>
                                <label className="block text-white/90 font-medium mb-2">Message</label>
                                <textarea
                                    value={emailForm.message}
                                    onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                                    required
                                    rows={6}
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 resize-none"
                                    placeholder="Enter your message"
                                />
                            </div>

                            <div>
                                <label className="block text-white/90 font-medium mb-2">Urgency Level</label>
                                <select
                                    value={emailForm.urgency}
                                    onChange={(e) => setEmailForm(prev => ({ ...prev, urgency: e.target.value }))}
                                    className="w-full min-h-[48px] p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300">
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-colors">
                                    Send Email
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
});

const FindDonor = () => {
    const [form, setForm] = useState({ bloodGroup: "", city: "", state: "" });
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    // Memoized blood groups array
    const bloodGroups = useMemo(
        () => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        []
    );

    // Memoized particles array
    const particles = useMemo(
        () => Array.from({ length: 18 }, (_, i) => i),
        []
    );

    // Memoized form change handler
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Memoized search handler
    const handleSearch = useCallback(
        async (e) => {
            e.preventDefault();
            setSearched(true);
            setLoading(true);

            try {
                const query = new URLSearchParams(form).toString();
                const response = await fetch(
                    `http://localhost:5000/api/donors/search?${query}`
                );
                const data = await response.json();

                if (response.ok) {
                    setResults(data);
                    if (data.length === 0) {
                        toast.error("No donors found matching your criteria");
                    }
                } else {
                    throw new Error(data.message || "Failed to search donors");
                }
            } catch (error) {
                console.error("Search error:", error);
                toast.error(error.message || "Failed to search donors");
                setResults([]);
            } finally {
                setLoading(false);
            }
        },
        [form]
    );

    // Memoized background gradients
    const backgroundGradients = useMemo(
        () => (
            <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
            </>
        ),
        []
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Static Background */}
            <div className="absolute inset-0">{backgroundGradients}</div>

            {/* Optimized Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((index) => (
                    <Particle key={index} index={index} />
                ))}
            </div>

            <div className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <AnimatedSection>
                    <div className="text-center px-6 max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                            <Target className="w-5 h-5 text-red-400 mr-2" />
                            <span className="text-white/90 font-medium">
                                Find Life Savers
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Find
                            </span>
                            <br />
                            <motion.span
                                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: [
                                        "0% 50%",
                                        "100% 50%",
                                        "0% 50%",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}>
                                Donors
                            </motion.span>
                        </h1>

                        <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            Connect with generous blood donors in your area.
                            Search by blood type and location to find the help
                            you need quickly and efficiently.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Search Form */}
                <AnimatedSection delay={0.2}>
                    <div className="max-w-4xl mx-auto px-6 mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center mb-8">
                                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                    <Filter className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    Search Donors
                                </h2>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Blood Group */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-3">
                                            <Heart className="w-5 h-5 mr-2 text-red-400" />
                                            Blood Group
                                        </label>
                                        <select
                                            name="bloodGroup"
                                            value={form.bloodGroup}
                                            onChange={handleChange}
                                            className="w-full min-h-[56px] p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15">
                                            <option
                                                value=""
                                                className="bg-slate-800 text-white">
                                                Any Blood Group
                                            </option>
                                            {bloodGroups.map((group) => (
                                                <option
                                                    key={group}
                                                    value={group}
                                                    className="bg-slate-800 text-white">
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-3">
                                            <MapPin className="w-5 h-5 mr-2 text-red-400" />
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="w-full min-h-[56px] p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                                            placeholder="Enter city"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-3">
                                            <MapPin className="w-5 h-5 mr-2 text-red-400" />
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="w-full min-h-[56px] p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                                            placeholder="Enter state"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    className="w-full min-h-[64px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center border border-red-400/20 hover:border-red-300/40 text-lg">
                                    {loading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "linear",
                                                }}
                                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                            />
                                            Searching Donors...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-6 h-6 mr-3" />
                                            Search Donors
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Results Section */}
                <AnimatedSection delay={0.4}>
                    <div className="max-w-6xl mx-auto px-6">
                        {searched && (
                            <div className="mb-8">
                                <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                                    <Users className="w-8 h-8 text-red-400 mr-3" />
                                    Search Results ({results.length} donors
                                    found)
                                </h3>

                                {results.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center shadow-xl">
                                        <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                            <Search className="w-12 h-12 text-white" />
                                        </div>
                                        <h4 className="text-3xl font-bold text-white mb-6">
                                            No Donors Found
                                        </h4>
                                        <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                                            No donors match your search
                                            criteria. Try adjusting your filters
                                            or expanding your search area to
                                            find more donors.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="grid gap-8">
                                        {results.map((donor, idx) => (
                                            <DonorCard
                                                key={`${donor.name}-${idx}`}
                                                donor={donor}
                                                index={idx}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default FindDonor;
