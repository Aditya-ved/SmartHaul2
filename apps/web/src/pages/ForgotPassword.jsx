import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandMark from "../components/BrandMark";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import api from "../services/api";
import BackButton from "../components/BackButton";
import PasswordField from "../components/PasswordField";
import ThemeToggle from "../components/ThemeToggle";

function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { token } = useParams();
    const submittingReset = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await api.patch(`/auth/reset-password/${token}`, { password });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to reset password");
        }
    };
    const submit = async (event) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get("email");
        try {
            await api.post("/auth/forgot-password", { email });
        } finally {
            setSubmitted(true);
        }
    };
    return (
        <main className="min-h-screen bg-[#f7f7f7] px-4 py-10 sm:px-8">
            <div className="mx-auto mb-4 flex max-w-[470px] items-center justify-between">
                <BackButton to="/login" label="Login" />
                <ThemeToggle />
            </div>
            <Card className="mx-auto w-full max-w-[470px]">
                <CardHeader>
                    <Link to="/" className="inline-flex items-center gap-2 text-[22px] font-bold"><BrandMark compact />SmartHaul</Link>
                    <CardTitle className="pt-5 text-[36px] leading-[44px]">Reset your password.</CardTitle>
                    <CardDescription>Enter your account email to receive a reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted && <Alert variant="success" className="mb-5">{token ? "Password reset successfully." : "If this email is registered, a reset link has been sent."}</Alert>}
                    {error && <Alert variant="destructive" className="mb-5">{error}</Alert>}
                    {token ? (
                        <form onSubmit={submittingReset} className="space-y-4"><div className="space-y-2"><Label htmlFor="new-password">New password</Label><PasswordField id="new-password" name="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></div><Button type="submit" className="w-full">Reset password</Button></form>
                    ) : (
                        <form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="reset-email">Email address</Label><Input id="reset-email" name="email" type="email" required placeholder="you@example.com" /></div><Button type="submit" className="w-full">Send reset link</Button></form>
                    )}
                    <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#533afd]"><ArrowLeft size={16} /> Back to login</Link>
                </CardContent>
            </Card>
        </main>
    );
}

export default ForgotPassword;
