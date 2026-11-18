import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Bell, X } from "lucide-react";
import BrandMark from "./BrandMark";
import api from "../services/api";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import ConfirmDialog from "./ConfirmDialog";

function Navbar() {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);
    const [open, setOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    useEffect(() => {
        let active = true;
        const load = async () => {
            if (!localStorage.getItem("smarthaul_token")) {
                if (active) setChecking(false);
                return;
            }
            try {
                const { data } = await api.get("/auth/me");
                if (active) setUser(data.user);
            } catch {
                localStorage.removeItem("smarthaul_token");
            } finally {
                if (active) setChecking(false);
            }
        };
        load();
        window.addEventListener("auth-change", load);
        return () => {
            active = false;
            window.removeEventListener("auth-change", load);
        };
    }, []);

    const dashboard = user?.role === "admin"
        ? "/admin-dashboard"
        : user?.role === "driver"
            ? "/driver-dashboard"
            : "/dashboard";

    const logout = () => {
        localStorage.removeItem("smarthaul_token");
        window.dispatchEvent(new Event("auth-change"));
        window.location.replace("/");
    };

    return (
        <header className="sticky top-0 z-50 h-16 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-8">
                <Link to="/" className="flex items-center gap-2 text-[20px] font-bold" onClick={() => setOpen(false)}>
                    <BrandMark compact />
                    SmartHaul
                </Link>
                <nav className="hidden items-center gap-7 md:flex">
                    <Link to="/marketplace" className="text-sm font-medium">Marketplace</Link>
                    <Link to="/tracking" className="text-sm font-medium">Tracking</Link>
                    <a href="/#services" className="text-sm font-medium">Services</a>
                    <a href="/#how-it-works" className="text-sm font-medium">How it works</a>
                </nav>
                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    {!checking && (user ? (
                        <>
                            {["sender", "individual_owner", "company_admin"].includes(user.role) && (
                                <Button asChild variant="ghost" size="icon"><Link to="/notifications" aria-label="Notifications"><Bell size={18} /></Link></Button>
                            )}
                            <Button asChild variant="ghost"><Link to={dashboard}><LayoutDashboard size={17} /> Dashboard</Link></Button>
                            <Button variant="secondary" onClick={() => setLogoutOpen(true)}><LogOut size={17} /> Log out</Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost"><Link to="/login">Log in</Link></Button>
                            <Button asChild><Link to="/register">Sign up</Link></Button>
                        </>
                    ))}
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef] md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            {open && (
                <nav className="absolute left-0 top-16 w-full border-b border-[#e5e5e5] bg-white px-4 py-5 md:hidden">
                    <div className="flex flex-col gap-4">
                        <Link to="/marketplace" onClick={() => setOpen(false)}>Marketplace</Link>
                        <Link to="/tracking" onClick={() => setOpen(false)}>Tracking</Link>
                        {user ? (
                            <><Link to={dashboard} onClick={() => setOpen(false)}>Dashboard</Link><ThemeToggle iconOnly={false} /><Button variant="secondary" onClick={() => setLogoutOpen(true)}>Log out</Button></>
                        ) : (
                            <div className="grid grid-cols-2 gap-3"><Button asChild variant="secondary"><Link to="/login">Log in</Link></Button><Button asChild><Link to="/register">Sign up</Link></Button></div>
                        )}
                        <ConfirmDialog
                            open={logoutOpen}
                            onOpenChange={setLogoutOpen}
                            title="Log out of SmartHaul?"
                            description="You will need to sign in again to access your workspace."
                            confirmLabel="Log out"
                            destructive
                            onConfirm={logout}
                        />
                    </div>
                </nav>
            )}
        </header>
    );
}

export default Navbar;
