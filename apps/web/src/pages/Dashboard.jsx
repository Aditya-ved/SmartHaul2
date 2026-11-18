import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Gauge, Package, Warehouse, Users } from "lucide-react";
import api from "../services/api";
import DashboardShell from "../components/DashboardShell";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        let active = true;
        Promise.allSettled([api.get("/auth/me"), api.get("/shipments"), api.get("/platform/dashboard")])
            .then(async ([profileResult, shipmentResult, insightsResult]) => {
                if (!active) return;
                if (profileResult.status === "rejected") {
                    localStorage.removeItem("smarthaul_token");
                    navigate("/login", { replace: true });
                    return;
                }
                const profile = profileResult.value.data.user;
                setUser(profile);
                if (shipmentResult.status === "fulfilled") setShipments(shipmentResult.value.data.shipments || []);
                if (insightsResult.status === "fulfilled") setInsights(insightsResult.value.data.insights || null);
                if (["individual_owner", "company_admin"].includes(profile.role)) {
                    try {
                        const { data } = await api.get("/vehicles");
                        if (active) setVehicles(data.vehicles || []);
                    } catch (err) {
                        setError(err.response?.data?.message || "Unable to load fleet.");
                    }
                }
            })
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("smarthaul_token");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login", { replace: true });
    };

    if (loading) return <div className="grid min-h-screen place-items-center bg-[#f7f7f7] text-sm text-[#5e5e5e]">Loading workspace...</div>;

    const canManage = ["individual_owner", "company_admin"].includes(user?.role);
    const available = vehicles.filter((vehicle) => vehicle.availability === "available").length;
    const onTrip = vehicles.filter((vehicle) => vehicle.availability === "on_trip").length;
    const activeShipments = shipments.filter((shipment) => ["matching", "matched", "booked", "in_transit"].includes(shipment.status)).length;

    return (
        <DashboardShell user={user} title="Dashboard" subtitle="Manage your SmartHaul workspace" onLogout={logout}>
            {error && <div className="mb-5 rounded-[12px] bg-[#fde4e4] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
            <section className="rounded-[16px] bg-black p-6 text-white sm:p-8">
                <p className="text-xs text-white/60">Welcome back</p>
                <h2 className="mt-2 text-[28px] font-bold leading-[36px]">Hello, {user?.fullName?.split(" ")[0] || "User"}.</h2>
                <p className="mt-2 max-w-[580px] text-sm text-white/70">Create shipments, find verified trucks and manage your logistics operations.</p>
                <Button asChild variant="secondary" className="mt-6 border-white/20 bg-white text-black"><Link to="/shipments">Create shipment <ArrowRight size={17} /></Link></Button>
            </section>
            {canManage && (
                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[["Total vehicles", vehicles.length, Warehouse], ["Available", available, Gauge], ["On trip", onTrip, Package]].map(([label, value, Icon]) => (
                        <Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">{label}</span><Icon size={18} /></div><p className="mt-4 text-[32px] font-semibold tabular-nums">{value}</p></Card>
                    ))}
                </section>
            )}
            <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <Card className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-[#533afd]">Live insights</p>
                            <h2 className="mt-2 text-[20px] font-semibold">Workspace overview</h2>
                        </div>
                        <span className="rounded-full bg-[#ecebff] px-3 py-1 text-xs font-medium text-[#533afd]">Today</span>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                            ["Active shipments", String(insights?.activeShipments ?? activeShipments)],
                            [canManage ? "Fleet utilization" : "Delivered", canManage ? `${insights?.utilization ?? 0}%` : String(insights?.deliveredShipments ?? 0)],
                            [canManage ? "Active bookings" : "Pending approval", canManage ? String(insights?.activeBookings ?? 0) : String(insights?.pendingBookings ?? 0)]
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-[14px] bg-[#f7f7f7] p-4">
                                <p className="text-xs text-[#5e5e5e]">{label}</p>
                                <p className="mt-2 text-[24px] font-semibold tabular-nums">{value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5 sm:p-6">
                    <p className="text-xs font-medium text-[#533afd]">Recent activity</p>
                    <h2 className="mt-2 text-[20px] font-semibold">Latest shipments</h2>
                    <div className="mt-5 space-y-3">
                        {(insights?.recentShipments || shipments).slice(0, 3).map((shipment) => (
                            <Link key={shipment._id} to="/shipments" className="flex items-center justify-between rounded-[12px] border border-[#e5e5e5] p-3">
                                <div>
                                    <p className="text-sm font-medium">{shipment.pickupLocation?.city || "Pickup"} → {shipment.deliveryLocation?.city || "Delivery"}</p>
                                    <p className="mt-1 text-xs text-[#9a9a9a]">{shipment.goodsType || "Shipment"}</p>
                                </div>
                                <span className="text-xs font-medium capitalize text-[#5e5e5e]">{shipment.status?.replaceAll("_", " ")}</span>
                            </Link>
                        ))}
                        {!((insights?.recentShipments || shipments).length) && (
                            <p className="rounded-[12px] bg-[#f7f7f7] p-4 text-sm text-[#5e5e5e]">Your recent shipments will appear here.</p>
                        )}
                    </div>
                </Card>
            </section>
            <section className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="p-5"><Package size={22} /><h2 className="mt-5 text-[18px] font-semibold">Shipments</h2><p className="mt-2 text-sm text-[#5e5e5e]">{activeShipments} active shipments</p><Link to="/shipments" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#533afd]">Manage <ArrowRight size={16} /></Link></Card>
                {canManage && <Card className="p-5"><Warehouse size={22} /><h2 className="mt-5 text-[18px] font-semibold">Fleet</h2><p className="mt-2 text-sm text-[#5e5e5e]">Manage vehicles and availability</p><Link to="/fleet" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#533afd]">Open fleet <ArrowRight size={16} /></Link></Card>}
                {canManage && <Card className="p-5"><Users size={22} /><h2 className="mt-5 text-[18px] font-semibold">Drivers</h2><p className="mt-2 text-sm text-[#5e5e5e]">Register and assign drivers</p><Link to="/drivers" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#533afd]">Open drivers <ArrowRight size={16} /></Link></Card>}
            </section>
        </DashboardShell>
    );
}

export default Dashboard;
