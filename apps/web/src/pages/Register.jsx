import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import api from "../services/api";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import warehouseImage from "../assets/register-delivery.jpg";
import BackButton from "../components/BackButton";
import PasswordField from "../components/PasswordField";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "sender" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/register", form);
            navigate("/login", { replace: true, state: { message: "Registration successful. Please log in." } });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-[#f7f7f7] lg:grid-cols-2">
            <div className="relative hidden overflow-hidden lg:block">
                <img src={warehouseImage} alt="Delivery package being handed over" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-10 left-10 max-w-[420px] text-[32px] font-bold leading-[38px] text-white">Goods move better together.</p>
            </div>
            <div className="flex items-center justify-center px-4 py-8 sm:px-8">
                <div className="w-full max-w-[470px]">
                    <div className="mb-4 flex items-center justify-between">
                        <BackButton to="/" label="Home" />
                        <ThemeToggle />
                    </div>
                    <Card className="w-full">
                    <CardHeader>
                        <Link to="/" className="inline-flex items-center gap-2 text-[22px] font-bold"><BrandMark compact />SmartHaul</Link>
                        <CardTitle className="pt-5 text-[36px] leading-[44px]">Create account.</CardTitle>
                        <CardDescription>Join SmartHaul based on how you use the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" name="fullName" value={form.fullName} onChange={change} required /></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={form.email} onChange={change} required /></div>
                                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={form.phone} onChange={change} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="role">Account type</Label><select id="role" name="role" value={form.role} onChange={change}><option value="sender">Sender</option><option value="individual_owner">Individual truck owner</option><option value="company_admin">Logistics company</option></select></div>
                            <div className="space-y-2"><Label htmlFor="password">Password</Label><PasswordField id="password" name="password" value={form.password} onChange={change} minLength={8} required /></div>
                            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
                        </form>
                        <p className="mt-5 text-center text-sm">Already have an account? <Link to="/login" className="font-medium text-[#533afd]">Log in</Link></p>
                    </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default Register;
