import { useParams } from "react-router-dom";
import { Check, Route } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Tracking() {
    const { shipmentId } = useParams();
    const [tracking, setTracking] = useState(null);
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(Boolean(shipmentId));
    const [error, setError] = useState("");
    useEffect(() => {
        if (!shipmentId) return;
        Promise.allSettled([
            api.get(`/trust/tracking/${shipmentId}`),
            api.get(`/shipments/${shipmentId}`)
        ]).then(([trackingResult, shipmentResult]) => {
            if (trackingResult.status === "fulfilled") setTracking(trackingResult.value.data);
            if (shipmentResult.status === "fulfilled") setShipment(shipmentResult.value.data.shipment);
            if (trackingResult.status === "rejected" && shipmentResult.status === "rejected") {
                setError("Unable to load shipment tracking.");
            }
        }).finally(() => setLoading(false));
    }, [shipmentId]);
    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div><p className="text-xs text-[#533afd]">Shipment #{shipmentId?.slice(-8) || "Select shipment"}</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Shipment tracking</h1></div>
                    <Badge variant={tracking?.status === "delivered" ? "delivered" : "transit"}>{tracking?.status?.replaceAll("_", " ") || "Status unavailable"}</Badge>
                </div>
                {loading && <Card className="mb-6 p-6 text-sm text-[#5e5e5e]">Loading shipment tracking...</Card>}
                {error && <Card className="mb-6 p-6 text-sm text-[#b91c1c]">{error}</Card>}
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <Card className="overflow-hidden p-0">
                        <div className="relative h-[360px] bg-[#efefef]">
                            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#d9d9d9 1px, transparent 1px), linear-gradient(90deg,#d9d9d9 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                            <div className="absolute left-[14%] top-[62%] h-3 w-3 rounded-full bg-black" />
                            <div className="absolute left-[14%] top-[62%] h-[2px] w-[68%] rotate-[18deg] origin-left bg-[#533afd]" />
                            <div className="absolute right-[14%] top-[34%] h-4 w-4 rounded-full border-4 border-white bg-[#533afd] shadow-[0_2px_8px_rgba(0,0,0,0.16)]" />
                            <div className="absolute left-[48%] top-[48%] flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)]"><Route size={22} /></div>
                        </div>
                        <div className="p-6"><p className="text-sm text-[#5e5e5e]">Estimated arrival</p><h2 className="mt-1 text-[28px] font-semibold tabular-nums">{tracking?.tracking?.estimatedArrival ? new Date(tracking.tracking.estimatedArrival).toLocaleString("en-IN") : "Awaiting ETA"}</h2></div>
                    </Card>
                    <Card className="h-fit p-6">
                        <h2 className="text-[22px] font-semibold">Journey</h2>
                        <div className="mt-6 space-y-0">
                            {[
                                { label: "Booked", detail: shipment?.bookedAt ? new Date(shipment.bookedAt).toLocaleDateString("en-IN") : "Booking confirmed", state: ["booked", "picked_up", "in_transit", "delivered"].includes(tracking?.status) ? "done" : "future" },
                                { label: "Picked up", detail: tracking?.tracking?.currentLocation?.address || "Pickup location", state: ["picked_up", "in_transit", "delivered"].includes(tracking?.status) ? "done" : "future" },
                                { label: "In transit", detail: tracking?.tracking?.currentLocation?.address || "Location unavailable", state: tracking?.status === "in_transit" ? "current" : ["delivered"].includes(tracking?.status) ? "done" : "future" },
                                { label: "Delivered", detail: shipment?.deliveryLocation?.city || "Destination", state: tracking?.status === "delivered" ? "done" : "future" }
                            ].map((step, index) => (
                                <div key={step.label} className="grid grid-cols-[24px_1fr] gap-3">
                                    <div className="flex flex-col items-center">{step.state === "future" ? <div className="h-6 w-6 rounded-full border border-[#e5e5e5] bg-white" /> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">{step.state === "done" ? <Check size={14} /> : <Route size={13} />}</div>}{index < 3 && <div className="h-16 w-px bg-[#e5e5e5]" />}</div>
                                    <div className="pb-6"><p className="font-medium">{step.label}</p><p className="mt-1 text-sm text-[#5e5e5e]">{step.detail}</p></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default Tracking;
