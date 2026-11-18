import { useEffect, useState } from "react";
import { Package, Plus, RefreshCw, X } from "lucide-react";
import api from "../services/api";
import DashboardShell from "../components/DashboardShell";
import { Alert } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import ConfirmDialog from "../components/ConfirmDialog";

const empty = { vehicleNumber: "", vehicleType: "mini_truck", make: "", model: "", manufacturingYear: "", capacityKg: "", availableCapacityKg: "", currentCity: "", destinationCity: "", description: "" };

function FleetManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [profile, fleet] = await Promise.all([api.get("/auth/me"), api.get("/vehicles")]);
            setUser(profile.data.user);
            setVehicles(fleet.data.vehicles || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load fleet.");
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
                ...form,
                vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
                manufacturingYear: form.manufacturingYear ? Number(form.manufacturingYear) : undefined,
                capacityKg: Number(form.capacityKg),
                availableCapacityKg: form.availableCapacityKg === "" ? Number(form.capacityKg) : Number(form.availableCapacityKg)
            };
            if (editing) await api.put(`/vehicles/${editing._id}`, payload);
            else await api.post("/vehicles", payload);
            setSuccess(editing ? "Vehicle updated." : "Vehicle registered.");
            setOpen(false);
            setEditing(null);
            setForm(empty);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to save vehicle.");
        } finally {
            setSaving(false);
        }
    };

    const edit = (vehicle) => {
        setEditing(vehicle);
        setForm({
            vehicleNumber: vehicle.vehicleNumber || "",
            vehicleType: vehicle.vehicleType || "mini_truck",
            make: vehicle.make || "",
            model: vehicle.model || "",
            manufacturingYear: vehicle.manufacturingYear || "",
            capacityKg: vehicle.capacityKg || "",
            availableCapacityKg: vehicle.availableCapacityKg ?? vehicle.capacityKg ?? "",
            currentCity: vehicle.currentCity || "",
            destinationCity: vehicle.destinationCity || "",
            description: vehicle.description || ""
        });
        setOpen(true);
    };

    const remove = async (vehicleId) => {
        setDeleteTarget(vehicleId);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/vehicles/${deleteTarget}`);
            await load();
            setSuccess("Vehicle deleted.");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete vehicle.");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <DashboardShell user={user} title="Fleet management" subtitle="Manage vehicles and capacity">
            <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs text-[#533afd]">Fleet</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">My vehicles</h1></div><div className="flex gap-2"><Button variant="secondary" size="icon" onClick={load} aria-label="Refresh"><RefreshCw size={17} /></Button><Button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus size={17} />Add vehicle</Button></div></div>
            {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
            {success && <Alert variant="success" className="mb-5">{success}</Alert>}
            {open && <Card className="mb-6 p-5"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-[22px] font-semibold">{editing ? "Edit vehicle" : "Register vehicle"}</h2><p className="mt-1 text-sm text-[#5e5e5e]">Enter capacity and route information.</p></div><button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]" aria-label="Close"><X size={18} /></button></div><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Vehicle number</Label><Input name="vehicleNumber" value={form.vehicleNumber} onChange={change} placeholder="GJ 01 AB 1234" required /></div><div className="space-y-2"><Label>Vehicle type</Label><select name="vehicleType" value={form.vehicleType} onChange={change}><option value="mini_truck">Mini truck</option><option value="pickup">Pickup</option><option value="light_truck">Light truck</option><option value="heavy_truck">Heavy truck</option><option value="container_truck">Container truck</option><option value="trailer">Trailer</option><option value="other">Other</option></select></div><div className="space-y-2"><Label>Make</Label><Input name="make" value={form.make} onChange={change} /></div><div className="space-y-2"><Label>Model</Label><Input name="model" value={form.model} onChange={change} /></div><div className="space-y-2"><Label>Total capacity (kg)</Label><Input name="capacityKg" type="number" min="1" value={form.capacityKg} onChange={change} required /></div><div className="space-y-2"><Label>Available capacity (kg)</Label><Input name="availableCapacityKg" type="number" min="0" value={form.availableCapacityKg} onChange={change} /></div><div className="space-y-2"><Label>Current city</Label><Input name="currentCity" value={form.currentCity} onChange={change} /></div><div className="space-y-2"><Label>Destination city</Label><Input name="destinationCity" value={form.destinationCity} onChange={change} /></div><div className="sm:col-span-2"><Label>Description</Label><textarea name="description" value={form.description} onChange={change} /></div><div className="sm:col-span-2 flex gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Register vehicle"}</Button><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button></div></form></Card>}
            {loading ? <Card className="p-10 text-center text-sm text-[#5e5e5e]">Loading fleet...</Card> : vehicles.length === 0 ? <Card className="p-10 text-center"><Package className="mx-auto text-[#9a9a9a]" /><h2 className="mt-3 font-semibold">No vehicles registered</h2><p className="mt-2 text-sm text-[#5e5e5e]">Register your first vehicle to start receiving bookings.</p></Card> : <div className="grid gap-4 md:grid-cols-2">{vehicles.map((vehicle) => <Card key={vehicle._id} className="p-5"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#efefef]"><Package size={21} /></span><Badge variant={vehicle.verificationStatus === "verified" ? "delivered" : vehicle.verificationStatus === "rejected" ? "rejected" : "pending"}>{vehicle.verificationStatus}</Badge></div><h2 className="mt-5 font-mono text-lg">{vehicle.vehicleNumber}</h2><p className="mt-1 text-sm text-[#5e5e5e]">{vehicle.vehicleType?.replaceAll("_", " ")} · {[vehicle.make, vehicle.model].filter(Boolean).join(" ")}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e5e5e5] pt-4 text-sm"><div><p className="text-xs text-[#9a9a9a]">Total capacity</p><p className="mt-1 font-medium tabular-nums">{Number(vehicle.capacityKg || 0).toLocaleString("en-IN")} kg</p></div><div><p className="text-xs text-[#9a9a9a]">Available</p><p className="mt-1 font-medium tabular-nums">{Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0).toLocaleString("en-IN")} kg</p></div></div><p className="mt-4 text-sm text-[#5e5e5e]">{vehicle.currentCity || "Not set"} → {vehicle.destinationCity || "Not set"}</p><div className="mt-5 flex gap-2"><Button variant="secondary" onClick={() => edit(vehicle)}>Edit</Button><Button variant="destructive" onClick={() => remove(vehicle._id)}>Delete</Button></div></Card>)}</div>}
            <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete this vehicle?" description="This removes the vehicle and may affect existing assignments." confirmLabel="Delete vehicle" destructive onConfirm={confirmDelete} />
        </DashboardShell>
    );
}

export default FleetManagement;
