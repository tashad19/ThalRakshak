import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserDashboard from "../pages/UserDashboard";
import HospitalDashboard from "../pages/HospitalDashboard";
import About from "../pages/About";
import Events from "../pages/Events";
import Contact from "../pages/Contact";
import HospitalDetails from "../pages/HospitalDetails";
import EmergencyRequest from "../pages/EmergencyRequest";
import { Toaster } from "react-hot-toast";
import EmergencySuccess from "../pages/EmergencySuccess";
import Donate from "../pages/Donate";
import FindDonor from "../pages/FindDonor";
import Requests from "../pages/Requests";
import BloodPredictor from "../pages/BloodPredictor";
import { Analytics } from "@vercel/analytics/react";

// Simple 404 page
const NotFound = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                404
            </h1>
            <p className="text-xl mb-6 text-white/80">Page Not Found</p>
            <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300">
                Go Home
            </a>
        </div>
    </div>
);

// Wrapper to conditionally render Navbar/Footer
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavFooter = ["/login", "/signup"].includes(location.pathname);
    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavFooter && <Navbar />}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        color: "white",
                    },
                }}
            />
            <main className="flex-grow">{children}</main>
            {!hideNavFooter && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HeroSection />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/user-dashboard"
                            element={<UserDashboard />}
                        />
                        <Route
                            path="/hospital-dashboard"
                            element={<HospitalDashboard />}
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/donate" element={<Donate />} />
                        <Route path="/find-donor" element={<FindDonor />} />
                        <Route
                            path="/hospital/:id"
                            element={<HospitalDetails />}
                        />
                        <Route path="/requests" element={<Requests />} />
                        <Route
                            path="/emergency"
                            element={<EmergencyRequest />}
                        />
                        <Route
                            path="/emergency/success"
                            element={<EmergencySuccess />}
                        />
                        <Route path="*" element={<NotFound />} />
                        <Route
                            path="/blood-predictor"
                            element={<BloodPredictor />}
                        />
                    </Routes>
                </Layout>
            </Router>
            <Analytics />
        </>
    );
};

export default App;
