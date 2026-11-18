import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import api from "../services/api";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import truckImage from "../assets/login-new.jpg";
import BackButton from "../components/BackButton";
import PasswordField from "../components/PasswordField";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", form);
            localStorage.setItem("smarthaul_token", data.token);
            window.dispatchEvent(new Event("auth-change"));
            if (data.user.role === "admin") navigate("/admin-dashboard", { replace: true });
            else if (data.user.role === "driver") navigate("/driver-dashboard", { replace: true });
            else navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to log in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-[#f7f7f7] lg:grid-cols-2">
            <div className="relative hidden overflow-hidden lg:block">
                <img src={truckImage} alt="Freight truck on an open highway" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-10 left-10 max-w-[420px] text-[32px] font-bold leading-[38px] text-white">Every shipment has a smarter route.</p>
            </div>
            <div className="flex items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-[470px]">
                    <div className="mb-4 flex items-center justify-between">
                        <BackButton to="/" label="Home" />
                        <ThemeToggle />
                    </div>
                    <Card className="w-full shadow-[0_8px_24px_rgba(10,20,60,0.08)]">
                    <CardHeader>
                        <Link to="/" className="inline-flex items-center gap-2 text-[22px] font-bold"><BrandMark compact />SmartHaul</Link>
                        <CardTitle className="pt-5 text-[36px] leading-[44px]">Welcome back.</CardTitle>
                        <CardDescription>Log in to your SmartHaul account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
                            <div className="space-y-2"><Label htmlFor="password">Password</Label><PasswordField id="password" name="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></div>
                            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log in"}</Button>
                        </form>
                        <div className="mt-5 flex justify-between text-sm"><Link to="/forgot-password" className="text-[#533afd]">Forgot password?</Link><Link to="/register" className="font-medium">Create account</Link></div>
                    </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default Login;
