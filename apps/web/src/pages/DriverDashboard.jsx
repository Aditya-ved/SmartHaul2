import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Gauge, LogOut, MapPin, Navigation, Package, RefreshCw, Weight, Warehouse } from "lucide-react";
import BrandMark from "../components/BrandMark";
import api from "../services/api";
import { Alert } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";
import ConfirmDialog from "../components/ConfirmDialog";

const formatLocation = (location) => {
    if (!location) return "Not available";
    if (typeof location === "string") return location;
    return [location.address, location.city, location.state, location.pincode].filter(Boolean).join(", ") || "Not available";
};

function DriverDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState({ vehicles: [], shipments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState("");
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [insights, setInsights] = useState(null);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [workResult, insightResult] = await Promise.all([
                api.get("/drivers/my-work"),
                api.get("/platform/dashboard")
            ]);
            setData(workResult.data);
            setInsights(insightResult.data.insights || null);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load your work.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const updateStatus = async (shipmentId, status) => {
        setUpdating(shipmentId);
        try {
            await api.patch(`/shipments/${shipmentId}/status`, { status });
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update shipment.");
        } finally {
            setUpdating("");
        }
    };

    const logout = () => {
        localStorage.removeItem("smarthaul_token");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login", { replace: true });
    };

    const totalCapacity = data.vehicles.reduce((total, vehicle) => total + (vehicle.capacityKg || 0), 0);
    const availableCapacity = data.vehicles.reduce((total, vehicle) => total + (vehicle.availableCapacityKg || 0), 0);
    const active = data.shipments.filter((shipment) => ["booked", "in_transit"].includes(shipment.status)).length;

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e5e5e5] bg-white px-4 sm:px-8">
                <div className="flex items-center gap-3"><BrandMark compact /><div><p className="font-semibold">SmartHaul Driver</p><p className="text-xs text-[#9a9a9a]">Driver workspace</p></div></div>
                <div className="flex gap-2"><ThemeToggle /><Button variant="secondary" size="icon" onClick={load} aria-label="Refresh"><RefreshCw size={17} /></Button><Button variant="secondary" onClick={() => setLogoutOpen(true)}><LogOut size={17} /><span className="hidden sm:inline">Log out</span></Button></div>
            </header>
            <main className="mx-auto max-w-[1200px] p-4 pb-24 sm:p-8">
                <BackButton to="/" label="Home" className="-ml-3 mb-4" />
                <div className="mb-6"><p className="text-xs text-[#533afd]">Driver workspace</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">My deliveries</h1></div>
                {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
                {loading ? <div className="py-20 text-center text-sm text-[#5e5e5e]">Loading assigned work...</div> : <>
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
                        ["Assigned vehicles", data.vehicles.length, Warehouse],
                        ["Total capacity", `${totalCapacity.toLocaleString("en-IN")} kg`, Weight],
                        ["Available", `${availableCapacity.toLocaleString("en-IN")} kg`, CheckCircle],
                        ["Active shipments", active, Package]
                    ].map(([label, value, Icon]) => <Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">{label}</span><Icon size={18} /></div><p className="mt-4 text-[28px] font-semibold tabular-nums">{value}</p></Card>)}</section>
                    <Card className="mt-6 p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-xs font-medium text-[#533afd]">Next priority</p>
                                <h2 className="mt-2 text-[20px] font-semibold">
                                    {insights?.nextShipment
                                        ? `${insights.nextShipment.pickupLocation?.city || "Pickup"} → ${insights.nextShipment.deliveryLocation?.city || "Delivery"}`
                                        : "No active route"}
                                </h2>
                                <p className="mt-2 text-sm text-[#5e5e5e]">
                                    {insights?.nextShipment
                                        ? `${Number(insights.nextShipment.weightKg || 0).toLocaleString("en-IN")} kg · ${insights.nextShipment.status?.replaceAll("_", " ")}`
                                        : "Assigned shipments and routes will appear here."}
                                </p>
                                <ConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of SmartHaul?" description="You will need to sign in again to view assigned shipments." confirmLabel="Log out" destructive onConfirm={logout} />
                            </div>
                            {insights?.nextShipment && <Button variant="secondary" onClick={() => document.getElementById(`shipment-${insights.nextShipment._id}`)?.scrollIntoView({ behavior: "smooth" })}>View shipment</Button>}
                        </div>
                    </Card>
                    <section className="mt-6">
                        <h2 className="mb-4 text-[22px] font-semibold">Assigned trucks</h2>
                        {data.vehicles.length === 0 ? <Card className="p-10 text-center"><Warehouse className="mx-auto text-[#9a9a9a]" /><p className="mt-3 font-medium">No vehicle assigned</p></Card> : <div className="grid gap-4 md:grid-cols-2">{data.vehicles.map((vehicle) => <Card key={vehicle._id} className="p-5"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#efefef]"><Gauge size={21} /></span><Badge variant={vehicle.availability === "available" ? "delivered" : "pending"}>{vehicle.availability?.replaceAll("_", " ")}</Badge></div><h3 className="mt-5 font-mono text-lg">{vehicle.vehicleNumber}</h3><p className="mt-1 text-sm text-[#5e5e5e]">{vehicle.vehicleType?.replaceAll("_", " ")}</p><p className="mt-4 flex items-center gap-2 text-sm"><MapPin size={16} />{vehicle.currentCity || "Not set"} <ArrowRight size={14} /> {vehicle.destinationCity || "Not set"}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e5e5e5] pt-4 text-sm"><div><p className="text-xs text-[#9a9a9a]">Total</p><p className="mt-1 font-medium tabular-nums">{Number(vehicle.capacityKg || 0).toLocaleString("en-IN")} kg</p></div><div><p className="text-xs text-[#9a9a9a]">Available</p><p className="mt-1 font-medium tabular-nums">{Number(vehicle.availableCapacityKg || 0).toLocaleString("en-IN")} kg</p></div></div></Card>)}</div>}
                    </section>
                    <section id={`shipment-${insights?.nextShipment?._id || "list"}`} className="mt-8">
                        <h2 className="mb-4 text-[22px] font-semibold">Assigned shipments</h2>
                        {data.shipments.length === 0 ? <Card className="p-10 text-center"><Package className="mx-auto text-[#9a9a9a]" /><p className="mt-3 font-medium">No shipments assigned</p></Card> : <div className="grid gap-4 lg:grid-cols-2">{data.shipments.map((shipment) => <Card key={shipment._id} className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[18px] font-semibold">{shipment.goodsType}</h3><p className="mt-1 font-mono text-xs text-[#5e5e5e]">#{shipment._id.slice(-8).toUpperCase()}</p></div><Badge variant={shipment.status === "delivered" ? "delivered" : shipment.status === "in_transit" ? "transit" : "booked"}>{shipment.status.replaceAll("_", " ")}</Badge></div><div className="mt-5 space-y-3 text-sm"><p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0" /><span><span className="block text-xs text-[#9a9a9a]">Pickup</span>{formatLocation(shipment.pickupLocation)}</span></p><p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0" /><span><span className="block text-xs text-[#9a9a9a]">Delivery</span>{formatLocation(shipment.deliveryLocation)}</span></p></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e5e5e5] pt-4 text-sm"><div><p className="text-xs text-[#9a9a9a]">Weight</p><p className="mt-1 font-medium tabular-nums">{Number(shipment.weightKg || 0).toLocaleString("en-IN")} kg</p></div><div><p className="text-xs text-[#9a9a9a]">Pickup date</p><p className="mt-1 font-medium">{shipment.pickupDate ? new Date(shipment.pickupDate).toLocaleDateString("en-IN") : "Not set"}</p></div></div><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatLocation(shipment.deliveryLocation))}`} target="_blank" rel="noreferrer" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#e5e5e5] text-sm font-medium"><Navigation size={17} />Open navigation</a>{shipment.status === "booked" && <Button className="mt-2 h-14 w-full" disabled={updating === shipment._id} onClick={() => updateStatus(shipment._id, "in_transit")}><ArrowRight size={18} />{updating === shipment._id ? "Updating..." : "Start journey"}</Button>}{shipment.status === "in_transit" && <Button className="mt-2 h-14 w-full" disabled={updating === shipment._id} onClick={() => updateStatus(shipment._id, "delivered")}><CheckCircle size={18} />{updating === shipment._id ? "Updating..." : "Mark delivered"}</Button>}</Card>)}</div>}
                    </section>
                </>}
            </main>
        </div>
    );
}

export default DriverDashboard;
