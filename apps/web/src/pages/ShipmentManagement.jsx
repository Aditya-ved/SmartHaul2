import { useEffect, useState } from "react";
import { Package, Plus, RefreshCw, Search, X } from "lucide-react";
import api from "../services/api";
import DashboardShell from "../components/DashboardShell";
import { Alert } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import ConfirmDialog from "../components/ConfirmDialog";

const empty = {
    pickupAddress: "", pickupCity: "", pickupState: "", pickupPincode: "",
    deliveryAddress: "", deliveryCity: "", deliveryState: "", deliveryPincode: "",
    goodsType: "", weightKg: "", lengthCm: "", widthCm: "", heightCm: "", description: "", pickupDate: ""
};

function ShipmentManagement() {
    const [user, setUser] = useState(null);
    const [shipments, setShipments] = useState([]);
    const [form, setForm] = useState(empty);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [matches, setMatches] = useState({});
    const [matching, setMatching] = useState("");
    const [booking, setBooking] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [profile, result] = await Promise.all([api.get("/auth/me"), api.get("/shipments")]);
            setUser(profile.data.user);
            setShipments(result.data.shipments || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load shipments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const payload = {
                pickupLocation: { address: form.pickupAddress.trim(), city: form.pickupCity.trim(), state: form.pickupState.trim(), pincode: form.pickupPincode.trim() },
                deliveryLocation: { address: form.deliveryAddress.trim(), city: form.deliveryCity.trim(), state: form.deliveryState.trim(), pincode: form.deliveryPincode.trim() },
                goodsType: form.goodsType.trim(),
                weightKg: Number(form.weightKg),
                dimensions: { lengthCm: Number(form.lengthCm) || 0, widthCm: Number(form.widthCm) || 0, heightCm: Number(form.heightCm) || 0 },
                description: form.description.trim(),
                pickupDate: new Date(`${form.pickupDate}T10:00:00`).toISOString()
            };
            if (editing) await api.put(`/shipments/${editing._id}`, payload);
            else await api.post("/shipments", payload);
            setSuccess(editing ? "Shipment updated." : "Shipment created.");
            setOpen(false);
            setEditing(null);
            setForm(empty);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to save shipment.");
        } finally {
            setSaving(false);
        }
    };

    const edit = (shipment) => {
        setEditing(shipment);
        setForm({
            pickupAddress: shipment.pickupLocation?.address || "", pickupCity: shipment.pickupLocation?.city || "", pickupState: shipment.pickupLocation?.state || "", pickupPincode: shipment.pickupLocation?.pincode || "",
            deliveryAddress: shipment.deliveryLocation?.address || "", deliveryCity: shipment.deliveryLocation?.city || "", deliveryState: shipment.deliveryLocation?.state || "", deliveryPincode: shipment.deliveryLocation?.pincode || "",
            goodsType: shipment.goodsType || "", weightKg: shipment.weightKg || "", lengthCm: shipment.dimensions?.lengthCm || "", widthCm: shipment.dimensions?.widthCm || "", heightCm: shipment.dimensions?.heightCm || "",
            description: shipment.description || "", pickupDate: shipment.pickupDate ? new Date(shipment.pickupDate).toISOString().slice(0, 10) : ""
        });
        setOpen(true);
    };

    const findMatches = async (shipmentId) => {
        setMatching(shipmentId);
        setError("");
        try {
            const { data } = await api.get(`/matching/${shipmentId}`);
            setMatches((current) => ({ ...current, [shipmentId]: data.matches || [] }));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to find matching trucks.");
        } finally {
            setMatching("");
        }
    };

    const book = async (shipmentId, vehicleId) => {
        setConfirmation({ type: "book", shipmentId, vehicleId });
    };

    const confirmAction = async () => {
        if (!confirmation) return;
        if (confirmation.type === "cancel") {
            await cancelConfirmed(confirmation.shipmentId);
            return;
        }
        await bookConfirmed(confirmation.shipmentId, confirmation.vehicleId);
    };

    const bookConfirmed = async (shipmentId, vehicleId) => {
        setBooking(`${shipmentId}:${vehicleId}`);
        setError("");
        setSuccess("");
        try {
            await api.post(`/bookings/${shipmentId}/${vehicleId}`);
            setMatches((current) => ({ ...current, [shipmentId]: [] }));
            setSuccess("Truck booked successfully.");
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to book truck.");
        } finally {
            setBooking("");
            setConfirmation(null);
        }
    };

    const cancel = async (shipmentId) => {
        setConfirmation({ type: "cancel", shipmentId });
    };

    const cancelConfirmed = async (shipmentId) => {
        try {
            await api.delete(`/shipments/${shipmentId}`);
            setSuccess("Shipment cancelled.");
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to cancel shipment.");
        } finally {
            setConfirmation(null);
        }
    };

    const statusVariant = (status) => status === "delivered" ? "delivered" : status === "in_transit" ? "transit" : status === "booked" || status === "matched" ? "booked" : "pending";

    return (
        <DashboardShell user={user} title="Shipments" subtitle="Create and track goods transportation">
            <div className="mb-6 flex items-end justify-between gap-4"><div><h1 className="text-[36px] font-bold leading-[44px]">My shipments</h1></div><div className="flex gap-2"><Button variant="secondary" size="icon" onClick={load} aria-label="Refresh"><RefreshCw size={17} /></Button><Button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus size={17} />Create shipment</Button></div></div>
            {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
            {success && <Alert variant="success" className="mb-5">{success}</Alert>}
            {open && <Card className="mb-6 p-5"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-[22px] font-semibold">{editing ? "Edit shipment" : "New shipment"}</h2><p className="mt-1 text-sm text-[#5e5e5e]">Enter route and goods details.</p></div><button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]" aria-label="Close"><X size={18} /></button></div><form onSubmit={submit} className="space-y-6">
                <section><h3 className="mb-4 font-semibold">Pickup</h3><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input name="pickupAddress" value={form.pickupAddress} onChange={change} required /></div><div className="space-y-2"><Label>City</Label><Input name="pickupCity" value={form.pickupCity} onChange={change} required /></div><div className="space-y-2"><Label>State</Label><Input name="pickupState" value={form.pickupState} onChange={change} required /></div><div className="space-y-2 sm:col-span-2"><Label>PIN code</Label><Input name="pickupPincode" value={form.pickupPincode} onChange={change} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></div></div></section>
                <section><h3 className="mb-4 font-semibold">Delivery</h3><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input name="deliveryAddress" value={form.deliveryAddress} onChange={change} required /></div><div className="space-y-2"><Label>City</Label><Input name="deliveryCity" value={form.deliveryCity} onChange={change} required /></div><div className="space-y-2"><Label>State</Label><Input name="deliveryState" value={form.deliveryState} onChange={change} required /></div><div className="space-y-2 sm:col-span-2"><Label>PIN code</Label><Input name="deliveryPincode" value={form.deliveryPincode} onChange={change} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></div></div></section>
                <section><h3 className="mb-4 font-semibold">Goods</h3><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Goods type</Label><Input name="goodsType" value={form.goodsType} onChange={change} required /></div><div className="space-y-2"><Label>Weight (kg)</Label><Input name="weightKg" type="number" min="1" value={form.weightKg} onChange={change} required /></div><div className="space-y-2"><Label>Pickup date</Label><Input name="pickupDate" type="date" value={form.pickupDate} onChange={change} required /></div><div className="space-y-2"><Label>Dimensions (optional)</Label><div className="grid grid-cols-3 gap-2"><Input name="lengthCm" type="number" placeholder="L cm" value={form.lengthCm} onChange={change} /><Input name="widthCm" type="number" placeholder="W cm" value={form.widthCm} onChange={change} /><Input name="heightCm" type="number" placeholder="H cm" value={form.heightCm} onChange={change} /></div></div><div className="space-y-2 sm:col-span-2"><Label>Description</Label><textarea name="description" value={form.description} onChange={change} /></div></div></section>
                <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create shipment"}</Button><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button></div>
            </form></Card>}
            {loading ? <Card className="p-10 text-center text-sm text-[#5e5e5e]">Loading shipments...</Card> : shipments.length === 0 ? <Card className="p-10 text-center"><Package className="mx-auto text-[#9a9a9a]" /><h2 className="mt-3 font-semibold">No shipments yet</h2><p className="mt-2 text-sm text-[#5e5e5e]">Create your first shipment to find a truck.</p></Card> : <div className="space-y-4">{shipments.map((shipment) => <Card key={shipment._id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-[#9a9a9a]">#{shipment._id.slice(-8).toUpperCase()}</p><h2 className="mt-1 text-[18px] font-semibold">{shipment.goodsType}</h2></div><Badge variant={statusVariant(shipment.status)}>{shipment.status.replaceAll("_", " ")}</Badge></div><div className="mt-5 grid gap-4 border-y border-[#e5e5e5] py-5 sm:grid-cols-3"><div><p className="text-xs text-[#9a9a9a]">Route</p><p className="mt-1 text-sm font-medium">{shipment.pickupLocation?.city} → {shipment.deliveryLocation?.city}</p></div><div><p className="text-xs text-[#9a9a9a]">Weight</p><p className="mt-1 text-sm font-medium tabular-nums">{Number(shipment.weightKg || 0).toLocaleString("en-IN")} kg</p></div><div><p className="text-xs text-[#9a9a9a]">Pickup</p><p className="mt-1 text-sm font-medium">{shipment.pickupDate ? new Date(shipment.pickupDate).toLocaleDateString("en-IN") : "Not set"}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{shipment.status === "pending" && <><Button variant="secondary" onClick={() => edit(shipment)}>Edit</Button><Button variant="secondary" onClick={() => findMatches(shipment._id)} disabled={matching === shipment._id}><Search size={16} />{matching === shipment._id ? "Finding..." : "Find trucks"}</Button><Button variant="destructive" onClick={() => cancel(shipment._id)}>Cancel</Button></>}</div>{matches[shipment._id]?.length > 0 && <div className="mt-5 grid gap-3 md:grid-cols-2">{matches[shipment._id].map((vehicle) => <Card key={vehicle._id} className="p-4"><div className="flex items-start justify-between">            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]"><Package size={18} /></span><Badge variant="delivered">Verified</Badge></div><p className="mt-3 font-mono text-sm font-semibold">{vehicle.vehicleNumber}</p><p className="mt-1 text-sm text-[#5e5e5e]">{vehicle.availableCapacityKg ?? vehicle.capacityKg} kg available</p><Button className="mt-4 w-full" disabled={booking === `${shipment._id}:${vehicle._id}`} onClick={() => book(shipment._id, vehicle._id)}>Book truck</Button></Card>)}</div>}</Card>)}</div>}
            <ConfirmDialog
                open={Boolean(confirmation)}
                onOpenChange={(open) => !open && setConfirmation(null)}
                title={confirmation?.type === "cancel" ? "Cancel this shipment?" : "Book this vehicle?"}
                description={confirmation?.type === "cancel" ? "The shipment and any reserved capacity will be released." : "Confirm that you want to reserve this vehicle for the shipment."}
                confirmLabel={confirmation?.type === "cancel" ? "Cancel shipment" : "Confirm booking"}
                destructive={confirmation?.type === "cancel"}
                onConfirm={confirmAction}
                loading={Boolean(booking)}
            />
        </DashboardShell>
    );
}

export default ShipmentManagement;
