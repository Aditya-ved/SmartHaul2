
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import BackButton from "./components/BackButton";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FleetManagement = lazy(() => import("./pages/FleetManagement"));
const DriverManagement = lazy(() => import("./pages/DriverManagement"));
const ShipmentManagement = lazy(() => import("./pages/ShipmentManagement"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Tracking = lazy(() => import("./pages/Tracking"));
const VehicleDetails = lazy(() => import("./pages/VehicleDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Analytics = lazy(() => import("./pages/Analytics"));
const ShipmentHistory = lazy(() => import("./pages/ShipmentHistory"));
const FleetOptimization = lazy(() => import("./pages/FleetOptimization"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const Payments = lazy(() => import("./pages/Payments"));
const Messages = lazy(() => import("./pages/Messages"));
const TrustCenter = lazy(() => import("./pages/TrustCenter"));
const Operations = lazy(() => import("./pages/Operations"));
const Support = lazy(() => import("./pages/Support"));

const LoadingScreen = () => (
    <div className="grid min-h-screen place-items-center bg-[#f7f7f7] text-sm text-[#5e5e5e]">
        Loading SmartHaul...
    </div>
);
function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ForgotPassword />} />
                <Route path="/support" element={<Support />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/tracking/:shipmentId" element={<Tracking />} />
                <Route path="/vehicles/:vehicleId" element={<VehicleDetails />} />

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "sender",
                                "individual_owner",
                                "company_admin"
                            ]}
                        />
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/fleet" element={<FleetManagement />} />
                    <Route path="/drivers" element={<DriverManagement />} />
                    <Route path="/shipments" element={<ShipmentManagement />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/shipment-history" element={<ShipmentHistory />} />
                    <Route path="/fleet-optimization" element={<FleetOptimization />} />
                    <Route path="/booking" element={<BookingFlow />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/trust" element={<TrustCenter />} />
                    <Route path="/operations" element={<Operations />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["driver"]} />
                    }
                >
                    <Route
                        path="/driver-dashboard"
                        element={<DriverDashboard />}
                    />
                </Route>

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["admin"]} />
                    }
                >
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>
                <Route path="*" element={<div className="grid min-h-screen place-items-center bg-[#f7f7f7] px-4 text-center"><div><BackButton to="/" label="Home" className="mx-auto mb-5" /><h1 className="text-[36px] font-bold">Page not found</h1><p className="mt-2 text-[#5e5e5e]">The page you requested does not exist.</p></div></div>} />
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
