import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck, Weight } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import api from "../services/api";
import BackButton from "../components/BackButton";

function VehicleDetails() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingWeight, setBookingWeight] = useState(4000);
    const [estimate, setEstimate] = useState(null);
    useEffect(() => {
        api.get(`/vehicles/public/${vehicleId}`)
            .then(({ data }) => setVehicle(data.vehicle))
            .catch(() => setVehicle(null))
            .finally(() => setLoading(false));
    }, [vehicleId]);

    useEffect(() => {
        if (!vehicle) return;
        api.post("/bookings/estimate", { weightKg: bookingWeight })
            .then(({ data }) => setEstimate(data.estimate))
            .catch(() => setEstimate(null));
    }, [bookingWeight, vehicle]);

    if (loading) return <div className="grid min-h-screen place-items-center bg-[#f7f7f7]"><p className="text-sm text-[#5e5e5e]">Loading vehicle...</p></div>;
    if (!vehicle) return <div className="grid min-h-screen place-items-center bg-[#f7f7f7] px-4 text-center"><div><h1 className="text-[28px] font-bold">Vehicle not found</h1><Link to="/marketplace" className="mt-5 inline-flex h-11 items-center rounded-full border border-[#e5e5e5] px-5">Back to marketplace</Link></div></div>;
    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/marketplace" label="Marketplace" className="-ml-3 mb-4" />
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div>
                        <Card className="aspect-[16/9] overflow-hidden p-0">
                            <div className="flex h-full items-center justify-center bg-[#efefef]">
                                <div className="text-center">
                                    <p className="font-mono text-[22px] font-semibold text-[#0a0a0a]">{vehicle.vehicleNumber}</p>
                                    <p className="mt-2 text-sm text-[#5e5e5e]">Verified vehicle details</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="mt-6 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4"><div><Badge variant="delivered"><ShieldCheck size={14} /> Verified vehicle</Badge><h1 className="mt-4 text-[28px] font-bold">{vehicle.vehicleNumber}</h1><p className="text-[#5e5e5e]">{vehicle.vehicleType?.replaceAll("_", " ")} · {[vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle details"}</p></div><Badge variant="neutral">{vehicle.availability === "available" ? "Available" : "Unavailable"}</Badge></div>
                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <div><p className="text-xs text-[#9a9a9a]">Total capacity</p><p className="mt-2 text-[22px] font-semibold tabular-nums">{Number(vehicle.capacityKg || 0).toLocaleString("en-IN")} kg</p></div>
                                <div><p className="text-xs text-[#9a9a9a]">Available</p><p className="mt-2 text-[22px] font-semibold tabular-nums">{Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0).toLocaleString("en-IN")} kg</p></div>
                                <div><p className="text-xs text-[#9a9a9a]">Vehicle ID</p><p className="mt-2 font-mono text-sm">#{vehicleId?.slice(-8) || "V-1234"}</p></div>
                            </div>
                            <div className="mt-8 border-t border-[#e5e5e5] pt-6"><h2 className="text-[18px] font-semibold">Current route</h2><p className="mt-3 flex items-center gap-2 text-[#5e5e5e]"><MapPin size={18} /> {vehicle.currentCity || "Pickup"} → {vehicle.destinationCity || "Destination"}</p></div>
                        </Card>
                    </div>
                    <aside className="h-fit lg:sticky lg:top-24">
                        <Card className="p-6">
                            <p className="text-sm text-[#5e5e5e]">Estimated booking</p><p className="mt-2 text-[32px] font-semibold tabular-nums">₹{Number(estimate?.total || 0).toLocaleString("en-IN")}</p>
                            <div className="my-5 border-t border-[#e5e5e5]" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-[#5e5e5e]">Capacity needed</span><strong className="tabular-nums">{bookingWeight.toLocaleString("en-IN")} kg</strong></div>
                                <input
                                    type="range"
                                    min="500"
                                    max={Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 500)}
                                    step="250"
                                    value={bookingWeight}
                                    onChange={(event) => setBookingWeight(Number(event.target.value))}
                                    className="h-2 min-h-0"
                                />
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="mt-6 w-full"><Weight size={17} /> Request booking</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm booking</DialogTitle>
                                        <DialogDescription>Review the route, capacity and estimated price before booking.</DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-6 grid gap-4 text-sm">
                                        <div className="flex justify-between"><span className="text-[#5e5e5e]">Route</span><strong>{vehicle.currentCity || "Pickup"} → {vehicle.destinationCity || "Destination"}</strong></div>
                                        <div className="flex justify-between"><span className="text-[#5e5e5e]">Vehicle</span><strong className="font-mono">{vehicle.vehicleNumber}</strong></div>
                                        <div className="flex justify-between"><span className="text-[#5e5e5e]">Capacity</span><strong className="tabular-nums">{bookingWeight.toLocaleString("en-IN")} kg</strong></div>
                                        <div className="border-t border-[#e5e5e5] pt-4">
                                            <div className="flex justify-between"><span className="text-[#5e5e5e]">Distance / route</span><strong>₹{Number(estimate?.distanceCharge || 0).toLocaleString("en-IN")}</strong></div>
                                            <div className="mt-2 flex justify-between"><span className="text-[#5e5e5e]">Weight charge</span><strong>₹{Number(estimate?.weightCharge || 0).toLocaleString("en-IN")}</strong></div>
                                            <div className="mt-2 flex justify-between"><span className="text-[#5e5e5e]">Service fee</span><strong>₹{Number(estimate?.serviceFee || 0).toLocaleString("en-IN")}</strong></div>
                                            <div className="mt-4 flex justify-between text-lg"><strong>Estimated total</strong><strong className="tabular-nums">₹{Number(estimate?.total || 0).toLocaleString("en-IN")}</strong></div>
                                        </div>
                                        <p className="rounded-[12px] bg-[#f7f7f7] p-3 text-xs text-[#5e5e5e]">Free cancellation until 12 hours before pickup. Final availability and price are confirmed after owner approval.</p>
                                    </div>
                                    <Button className="mt-6 w-full" onClick={() => navigate("/shipments")}>Create a shipment to book</Button>
                                </DialogContent>
                            </Dialog>
                        </Card>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default VehicleDetails;
