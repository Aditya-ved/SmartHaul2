import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, LogOut, Package, RefreshCw, XCircle } from "lucide-react";
import api from "../services/api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";
import ConfirmDialog from "../components/ConfirmDialog";

const tabs = [
    { id: "pending", label: "Pending", icon: Clock },
    { id: "verified", label: "Verified", icon: CheckCircle },
    { id: "rejected", label: "Rejected", icon: XCircle }
];

function AdminDashboard() {
    const navigate = useNavigate();
    const [active, setActive] = useState("pending");
    const [vehicles, setVehicles] = useState([]);
    const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState("");
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [insights, setInsights] = useState(null);

    const load = async (status = active) => {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get(`/admin/vehicles/${status}`);
            setVehicles(data.vehicles || []);
            setCounts((current) => ({ ...current, [status]: data.count || 0 }));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load vehicles.");
        } finally {
            setLoading(false);
        }
    };

    const loadCounts = async () => {
        try {
            const responses = await Promise.all(["pending", "verified", "rejected"].map((status) => api.get(`/admin/vehicles/${status}`)));
            setCounts({
                pending: responses[0].data.count || 0,
                verified: responses[1].data.count || 0,
                rejected: responses[2].data.count || 0
            });
            const { data } = await api.get("/platform/dashboard");
            setInsights(data.insights || null);
        } catch {
            // Counts remain available from individual tab loads.
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load(active);
        loadCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const review = async (vehicleId, verificationStatus) => {
        setUpdating(vehicleId);
        try {
            await api.patch(`/admin/vehicles/${vehicleId}/verification`, { verificationStatus });
            await load(active);
            await loadCounts();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update vehicle.");
        } finally {
            setUpdating("");
        }
    };

    const logout = () => {
        localStorage.removeItem("smarthaul_token");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <header className="flex h-16 items-center justify-between border-b border-[#e5e5e5] bg-white px-4 sm:px-8">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"><ShieldCheckIcon /></span><div><p className="font-semibold">SmartHaul Admin</p><p className="text-xs text-[#9a9a9a]">Vehicle verification</p></div></div>
                <div className="flex items-center gap-2"><ThemeToggle /><Button variant="secondary" onClick={() => setLogoutOpen(true)}><LogOut size={17} /> Log out</Button></div>
            </header>
            <main className="mx-auto max-w-[1200px] p-4 sm:p-8">
                <BackButton to="/" label="Home" className="-ml-3 mb-4" />
                <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs text-[#533afd]">Administration</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Vehicle management</h1></div><Button variant="secondary" onClick={() => { load(active); loadCounts(); }} disabled={loading}><RefreshCw size={17} />Refresh</Button></div>
                {insights && (
                    <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ["Verification rate", `${insights.verificationRate}%`],
                            ["Active drivers", String(insights.activeDrivers)],
                            ["Active owners", String(insights.activeOwners)],
                            ["Total shipments", String(insights.totalShipments)]
                        ].map(([label, value]) => (
                            <Card key={label} className="p-5">
                                <p className="text-xs text-[#5e5e5e]">{label}</p>
                                <p className="mt-3 text-[28px] font-semibold tabular-nums">{value}</p>
                            </Card>
                        ))}
                    </section>
                )}
                <section className="mb-6 grid gap-4 sm:grid-cols-3">{tabs.map((tab) => <Card key={tab.id} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">{tab.label}</span><tab.icon size={18} /></div><p className="mt-4 text-[32px] font-semibold tabular-nums">{counts[tab.id]}</p></Card>)}</section>
                <Card className="p-4 sm:p-6">
                    <div className="mb-6 flex flex-wrap gap-2">{tabs.map((tab) => <Button key={tab.id} variant={active === tab.id ? "default" : "subtle"} size="sm" onClick={() => setActive(tab.id)}>{tab.label} {counts[tab.id]}</Button>)}</div>
                    {error && <div className="mb-4 rounded-[12px] bg-[#fde4e4] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
                    {loading ? <div className="py-16 text-center text-sm text-[#5e5e5e]">Loading vehicles...</div> : vehicles.length === 0 ? <div className="py-16 text-center"><CheckCircle className="mx-auto text-[#15803d]" /><h2 className="mt-3 font-semibold">No vehicles found</h2></div> : <div className="space-y-4">{vehicles.map((vehicle) => (
                        <Card key={vehicle._id} className="p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3">                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#efefef]"><Package size={21} /></span><div><h2 className="font-mono text-sm font-semibold">{vehicle.vehicleNumber}</h2><p className="mt-1 text-sm text-[#5e5e5e]">{vehicle.make} {vehicle.model} · {vehicle.vehicleType?.replaceAll("_", " ")}</p></div></div><Badge variant={vehicle.verificationStatus === "verified" ? "delivered" : vehicle.verificationStatus === "rejected" ? "rejected" : "pending"}>{vehicle.verificationStatus}</Badge></div>
                            <div className="mt-5 grid gap-4 border-t border-[#e5e5e5] pt-5 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-[#9a9a9a]">Capacity</p><p className="mt-1 font-medium tabular-nums">{Number(vehicle.capacityKg || 0).toLocaleString("en-IN")} kg</p></div><div><p className="text-xs text-[#9a9a9a]">Route</p><p className="mt-1 font-medium">{vehicle.currentCity || "Not set"} → {vehicle.destinationCity || "Not set"}</p></div><div><p className="text-xs text-[#9a9a9a]">Owner</p><p className="mt-1 font-medium">{vehicle.ownerId?.fullName || "Unknown"}</p></div><div><p className="text-xs text-[#9a9a9a]">Driver</p><p className="mt-1 font-medium">{vehicle.assignedDriver?.fullName || "Not assigned"}</p></div></div>
                            {active === "pending" && <div className="mt-5 flex flex-wrap gap-3"><Button disabled={updating === vehicle._id} onClick={() => review(vehicle._id, "verified")}><CheckCircle size={17} />Approve</Button><Button variant="destructive" disabled={updating === vehicle._id} onClick={() => review(vehicle._id, "rejected")}><XCircle size={17} />Reject</Button></div>}
                        </Card>
                    ))}</div>}
                </Card>
            </main>
            <ConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of SmartHaul?" description="You will need to sign in again to access admin tools." confirmLabel="Log out" destructive onConfirm={logout} />
        </div>
    );
}

function ShieldCheckIcon() {
    return <CheckCircle size={20} />;
}

export default AdminDashboard;
