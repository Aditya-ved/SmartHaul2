import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import api from "../services/api";
import BackButton from "../components/BackButton";

function ShipmentHistory() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/shipments")
            .then(({ data }) => setShipments((data.shipments || []).map((item) => ({
                id: item._id,
                route: `${item.pickupLocation?.city || "Pickup"} → ${item.deliveryLocation?.city || "Delivery"}`,
                goods: item.goodsType,
                driver: "Assigned on booking",
                vehicle: item.bookedVehicleId?.vehicleNumber || "Not assigned",
                date: item.pickupDate ? new Date(item.pickupDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Not set",
                status: item.status
            }))))
            .catch(() => setShipments([]))
            .finally(() => setLoading(false));
    }, []);
    const filtered = useMemo(() => shipments.filter((item) => (`${item.id} ${item.route} ${item.driver} ${item.vehicle}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || item.status === status))), [query, status, shipments]);
    const badgeVariant = (value) => value === "delivered" ? "delivered" : value === "in_transit" ? "transit" : "pending";
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8"><p className="text-xs text-[#533afd]">Shipment records</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Shipment history</h1></div>
                <Card className="mb-5 p-4"><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-3.5" size={17} /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" placeholder="Search route, shipment, driver or vehicle" /></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44"><option value="all">All status</option><option value="pending">Pending</option><option value="in_transit">In transit</option><option value="delivered">Delivered</option></select><Button variant="secondary"><Filter size={17} /> Filters</Button></div></Card>
                {loading ? (
                    <Card className="p-10 text-center text-sm text-[#5e5e5e]">Loading shipments...</Card>
                ) : filtered.length ? (
                    <Card className="overflow-hidden p-0"><div className="hidden grid-cols-[1fr_1fr_1fr_120px] gap-4 border-b border-[#e5e5e5] bg-[#f7f7f7] px-5 py-3 text-xs font-medium text-[#5e5e5e] md:grid"><span>Shipment / route</span><span>Driver</span><span>Vehicle</span><span>Status</span></div>{filtered.map((item) => <div key={item.id} className="grid gap-3 border-b border-[#e5e5e5] px-5 py-4 last:border-0 md:grid-cols-[1fr_1fr_1fr_120px] md:items-center"><div><p className="font-medium">{item.id}</p><p className="mt-1 text-sm text-[#5e5e5e]">{item.route}</p><p className="mt-1 flex items-center gap-1 text-xs text-[#9a9a9a]"><CalendarDays size={13} />{item.date}</p></div><p className="text-sm">{item.driver}</p><p className="font-mono text-sm">{item.vehicle}</p><Badge variant={badgeVariant(item.status)}>{item.status.replace("_", " ")}</Badge></div>)}</Card>
                ) : (
                    <Card className="p-10 text-center"><h2 className="text-[18px] font-semibold">No shipments found</h2><p className="mt-2 text-sm text-[#5e5e5e]">Try changing the route or status filter.</p><Button variant="secondary" className="mt-5" onClick={() => { setQuery(""); setStatus("all"); }}>Clear filters</Button></Card>
                )}
            </main>
        </div>
    );
}
export default ShipmentHistory;
