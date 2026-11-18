import { useEffect, useState } from "react";
import { RefreshCw, Trash2, UserPlus, Users } from "lucide-react";
import api from "../services/api";
import DashboardShell from "../components/DashboardShell";
import { Alert } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import ConfirmDialog from "../components/ConfirmDialog";
import PasswordField from "../components/PasswordField";

function DriverManagement() {
    const [user, setUser] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [profile, driverResult, vehicleResult] = await Promise.all([api.get("/auth/me"), api.get("/drivers"), api.get("/vehicles")]);
            setUser(profile.data.user);
            setDrivers(driverResult.data.drivers || []);
            setVehicles(vehicleResult.data.vehicles || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load driver data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const register = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/drivers", form);
            setForm({ fullName: "", email: "", phone: "", password: "" });
            setSuccess("Driver registered.");
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to register driver.");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (driverId) => {
        setDeleteTarget(driverId);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/drivers/${deleteTarget}`);
            setSuccess("Driver deleted.");
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete driver.");
        } finally {
            setDeleteTarget(null);
        }
    };

    const assign = async (vehicleId, driverId) => {
        try {
            if (driverId) await api.patch(`/vehicles/${vehicleId}/assign-driver`, { driverId });
            await load();
            setSuccess("Vehicle assignment updated.");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update assignment.");
        }
    };

    const removeAssignment = async (vehicleId) => {
        try {
            await api.patch(`/vehicles/${vehicleId}/remove-driver`);
            await load();
            setSuccess("Driver removed from vehicle.");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to remove assignment.");
        }
    };

    return (
        <DashboardShell user={user} title="Driver management" subtitle="Register and assign drivers">
            <div className="mb-6 flex items-end justify-between"><div><p className="text-xs text-[#533afd]">Team</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Drivers</h1></div><Button variant="secondary" size="icon" onClick={load} aria-label="Refresh"><RefreshCw size={17} /></Button></div>
            {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
            {success && <Alert variant="success" className="mb-5">{success}</Alert>}
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <Card className="h-fit p-5"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]"><UserPlus size={18} /></span><div><h2 className="font-semibold">Register driver</h2><p className="text-sm text-[#5e5e5e]">Create driver login credentials.</p></div></div><form onSubmit={register} className="space-y-4"><div className="space-y-2"><Label>Full name</Label><Input name="fullName" value={form.fullName} onChange={change} required /></div><div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={form.email} onChange={change} required /></div><div className="space-y-2"><Label>Phone</Label><Input name="phone" value={form.phone} onChange={change} /></div><div className="space-y-2"><Label>Temporary password</Label><PasswordField name="password" value={form.password} onChange={change} minLength={8} required /></div><Button type="submit" className="w-full" disabled={saving}>{saving ? "Registering..." : "Register driver"}</Button></form></Card>
                <Card className="p-5"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]"><Users size={18} /></span><div><h2 className="font-semibold">Registered drivers</h2><p className="text-sm text-[#5e5e5e]">{drivers.length} drivers</p></div></div>{loading ? <p className="py-10 text-center text-sm text-[#5e5e5e]">Loading drivers...</p> : drivers.length === 0 ? <p className="py-10 text-center text-sm text-[#5e5e5e]">No drivers registered.</p> : <div className="space-y-3">{drivers.map((driver) => {
                    const assigned = vehicles.find((vehicle) => String(vehicle.assignedDriver?._id || vehicle.assignedDriver) === String(driver._id));
                    return <div key={driver._id} className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#e5e5e5] p-4"><div><p className="font-medium">{driver.fullName}</p><p className="mt-1 text-sm text-[#5e5e5e]">{driver.email}</p><Badge variant={assigned ? "delivered" : "neutral"} className="mt-2">{assigned ? `Assigned · ${assigned.vehicleNumber}` : "Not assigned"}</Badge></div><Button variant="destructive" size="icon" onClick={() => remove(driver._id)} aria-label={`Delete ${driver.fullName}`}><Trash2 size={17} /></Button></div>;
                })}</div>}</Card>
            </div>
            <Card className="mt-6 p-5"><h2 className="mb-5 font-semibold">Vehicle assignments</h2>{vehicles.length === 0 ? <p className="py-8 text-center text-sm text-[#5e5e5e]">Register a vehicle before assigning a driver.</p> : <div className="space-y-3">{vehicles.map((vehicle) => <div key={vehicle._id} className="grid gap-3 rounded-[12px] border border-[#e5e5e5] p-4 sm:grid-cols-[1fr_220px_auto] sm:items-center"><div><p className="font-mono text-sm font-medium">{vehicle.vehicleNumber}</p><p className="mt-1 text-sm text-[#5e5e5e]">{vehicle.vehicleType?.replaceAll("_", " ")}</p></div><select value={String(vehicle.assignedDriver?._id || vehicle.assignedDriver || "")} onChange={(event) => assign(vehicle._id, event.target.value)}><option value="">Unassigned</option>{drivers.map((driver) => <option key={driver._id} value={driver._id}>{driver.fullName}</option>)}</select>{vehicle.assignedDriver && <Button variant="secondary" size="sm" onClick={() => removeAssignment(vehicle._id)}>Remove</Button>}</div>)}</div>}</Card>
            <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete this driver?" description="Their vehicle assignments will be cleared." confirmLabel="Delete driver" destructive onConfirm={confirmDelete} />
        </DashboardShell>
    );
}

export default DriverManagement;
