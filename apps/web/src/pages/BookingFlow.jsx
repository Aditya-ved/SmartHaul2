import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Check, MapPin, Package, ShieldCheck, Weight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import api from "../services/api";

function BookingFlow() {
    const [searchParams] = useSearchParams();
    const shipmentId = searchParams.get("shipmentId");
    const vehicleId = searchParams.get("vehicleId");
    const [step, setStep] = useState(1);
    const [terms, setTerms] = useState(false);
    const [estimate, setEstimate] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    const [routeWeight, setRouteWeight] = useState(4000);
    const [route, setRoute] = useState({
        pickupCity: "",
        deliveryCity: "",
        pickupDate: ""
    });
    const [goodsType, setGoodsType] = useState("packaged");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const requests = [];
                if (vehicleId) requests.push(api.get(`/vehicles/public/${vehicleId}`));
                if (shipmentId) requests.push(api.get(`/shipments/${shipmentId}`));
                requests.push(api.post("/bookings/estimate", { weightKg: routeWeight }));

                const responses = await Promise.allSettled(requests);
                if (!active) return;

                let responseIndex = 0;
                if (vehicleId) {
                    const vehicleResult = responses[responseIndex++];
                    if (vehicleResult.status === "fulfilled") setVehicle(vehicleResult.value.data.vehicle);
                }
                if (shipmentId) {
                    const shipmentResult = responses[responseIndex++];
                    if (shipmentResult.status === "fulfilled") {
                        const shipment = shipmentResult.value.data.shipment;
                        setRoute({
                            pickupCity: shipment.pickupLocation?.city || "",
                            deliveryCity: shipment.deliveryLocation?.city || "",
                            pickupDate: shipment.pickupDate
                                ? new Date(shipment.pickupDate).toISOString().slice(0, 10)
                                : ""
                        });
                        setRouteWeight(shipment.weightKg || 4000);
                        setGoodsType(shipment.goodsType || "packaged");
                    }
                }
                const estimateResult = responses[responseIndex];
                if (estimateResult?.status === "fulfilled") {
                    setEstimate(estimateResult.value.data.estimate);
                }
            } catch {
                if (active) toast.error("Unable to load booking details");
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => { active = false; };
    }, [shipmentId, vehicleId, routeWeight]);

    const submitBooking = async () => {
        if (!shipmentId || !vehicleId) {
            toast.error("A shipment and vehicle are required");
            return;
        }
        if (!terms) {
            toast.error("Accept the booking conditions to continue");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/bookings/lifecycle", { shipmentId, vehicleId });
            toast.success("Booking request created");
        } catch (err) {
            toast.error(err.response?.data?.message || "Unable to create booking");
        } finally {
            setSubmitting(false);
        }
    };

    const steps = ["Route", "Capacity", "Review"];

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <Navbar />
            <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
                <BackButton to="/marketplace" label="Marketplace" className="-ml-3 mb-4" />

                <div className="mb-8 grid grid-cols-3">
                    {steps.map((label, index) => (
                        <div key={label} className="relative flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step > index + 1 ? "bg-black text-white" : step === index + 1 ? "border-2 border-[#533afd] bg-white text-[#533afd]" : "border border-[#e5e5e5] bg-white text-[#9a9a9a]"}`}>
                                {step > index + 1 ? <Check size={14} /> : index + 1}
                            </div>
                            <span className="mt-2 text-xs font-medium">{label}</span>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <Card className="p-8 text-sm text-[#5e5e5e]">Loading booking details...</Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <Card className="p-6">
                            {step === 1 && (
                                <div>
                                    <h1 className="text-[28px] font-bold">Review your route</h1>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <label className="space-y-2"><span className="text-sm font-medium">Pickup city</span><input value={route.pickupCity} readOnly /></label>
                                        <label className="space-y-2"><span className="text-sm font-medium">Delivery city</span><input value={route.deliveryCity} readOnly /></label>
                                        <label className="space-y-2 sm:col-span-2"><span className="text-sm font-medium">Pickup date</span><input type="date" value={route.pickupDate} readOnly /></label>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h1 className="text-[28px] font-bold">Confirm shipment capacity</h1>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <label className="space-y-2"><span className="text-sm font-medium">Goods weight</span><input type="number" min="1" value={routeWeight} onChange={(event) => setRouteWeight(Number(event.target.value))} /></label>
                                        <label className="space-y-2"><span className="text-sm font-medium">Goods type</span><input value={goodsType} readOnly /></label>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <h1 className="text-[28px] font-bold">Confirm details</h1>
                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f7] p-4">
                                            <MapPin size={20} />
                                            <div><p className="text-xs text-[#9a9a9a]">Route</p><p className="font-medium">{route.pickupCity} → {route.deliveryCity}</p></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-[12px] bg-[#f7f7f7] p-4"><Weight size={18} /><p className="mt-2 text-xs text-[#9a9a9a]">Capacity</p><p className="font-semibold tabular-nums">{routeWeight.toLocaleString("en-IN")} kg</p></div>
                                            <div className="rounded-[12px] bg-[#f7f7f7] p-4"><CalendarDays size={18} /><p className="mt-2 text-xs text-[#9a9a9a]">Pickup</p><p className="font-semibold">{route.pickupDate ? new Date(`${route.pickupDate}T00:00:00`).toLocaleDateString("en-IN") : "Not set"}</p></div>
                                        </div>
                                        <label className="flex items-start gap-3 text-sm">
                                            <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-1 h-4 w-4 min-h-0" />
                                            <span>I agree to cancellation terms and SmartHaul booking conditions.</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                <Button variant="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
                                {step < 3
                                    ? <Button onClick={() => setStep(step + 1)}>Continue <ArrowRight size={17} /></Button>
                                    : <Button disabled={!terms || submitting} onClick={submitBooking}>{submitting ? "Submitting..." : "Request booking"}</Button>}
                            </div>
                        </Card>

                        <aside>
                            <Card className="h-fit p-6 lg:sticky lg:top-24">
                                <Badge variant="delivered"><ShieldCheck size={14} /> {vehicle?.verificationStatus === "verified" ? "Verified vehicle" : "Vehicle"}</Badge>
                                <h2 className="mt-4 flex items-center gap-2 text-[22px] font-semibold"><Package size={20} /> {vehicle?.vehicleNumber || "Select a vehicle"}</h2>
                                <div className="my-5 border-t border-[#e5e5e5]" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span>Distance</span><strong>₹{Number(estimate?.distanceCharge || 0).toLocaleString("en-IN")}</strong></div>
                                    <div className="flex justify-between"><span>Weight</span><strong>₹{Number(estimate?.weightCharge || 0).toLocaleString("en-IN")}</strong></div>
                                    <div className="flex justify-between"><span>Service fee</span><strong>₹{Number(estimate?.serviceFee || 0).toLocaleString("en-IN")}</strong></div>
                                    <div className="border-t border-[#e5e5e5] pt-3 flex justify-between text-lg"><strong>Total</strong><strong>₹{Number(estimate?.total || 0).toLocaleString("en-IN")}</strong></div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

export default BookingFlow;
