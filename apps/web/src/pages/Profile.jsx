import { useEffect, useState } from "react";
import api from "../services/api";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import DashboardShell from "../components/DashboardShell";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [profile, setProfile] = useState({ fullName: "", email: "", phone: "", role: "" });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/me")
            .then(({ data }) => setProfile(data.user))
            .catch((err) => setError(err.response?.data?.message || "Unable to load profile"))
            .finally(() => setLoading(false));
    }, []);

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus("");
        setError("");
        try {
            await api.patch("/auth/me", { fullName: profile.fullName, phone: profile.phone });
            setStatus("Profile details saved.");
        } catch (error) {
            setError(error.response?.data?.message || "Unable to save profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardShell user={profile} title="Profile" subtitle="Account and security">
            <div className="mx-auto max-w-[800px]">
                <h1 className="mb-8 text-[36px] font-bold leading-[44px]">Account settings</h1>
                <Card className="p-6">
                    {status && <Alert variant="success" className="mb-5">{status}</Alert>}
                    {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
                    {loading ? <p className="text-sm text-[#5e5e5e]">Loading profile...</p> : 
                    <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2"><Label>Full name</Label><Input value={profile.fullName || ""} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Email</Label><Input type="email" value={profile.email || ""} readOnly /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                        <div className="sm:col-span-2"><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button></div>
                    </form>}
                </Card>
                <Card className="mt-6 p-6"><h2 className="text-[18px] font-semibold">Security</h2><p className="mt-2 text-sm text-[#5e5e5e]">Change password and review account access.</p><Button variant="secondary" className="mt-5" onClick={() => navigate("/forgot-password")}>Change password</Button></Card>
            </div>
        </DashboardShell>
    );
}

export default Profile;
