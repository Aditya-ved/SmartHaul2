import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Warehouse, Users, LogOut, Moon, Sun, Bell } from "lucide-react";
import BrandMark from "./BrandMark";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

function DashboardShell({ user, children, title, subtitle, dark, onToggleTheme, onLogout }) {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const canManage = ["individual_owner", "company_admin"].includes(user?.role);
    const items = [
        { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
        { label: "Shipments", to: "/shipments", icon: Package },
        ...(canManage ? [
            { label: "Fleet", to: "/fleet", icon: Warehouse },
            { label: "Drivers", to: "/drivers", icon: Users }
        ] : [])
    ];
    const logout = onLogout || (() => {
        localStorage.removeItem("smarthaul_token");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login", { replace: true });
    });

    return (
        <div className="min-h-screen bg-[#f7f7f7] text-[#0a0a0a]">
            <aside className="fixed left-0 top-0 hidden h-screen w-[248px] border-r border-[#e5e5e5] bg-white p-4 lg:flex lg:flex-col">
                <Link to="/" className="mb-8 flex items-center gap-2 px-2 text-[20px] font-bold"><BrandMark />SmartHaul</Link>
                <p className="mb-2 px-3 text-xs font-medium text-[#9a9a9a]">Workspace</p>
                <nav className="space-y-1">
                    {items.map(({ label, to, icon: Icon }) => (
                        <Link key={to} to={to} className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-sm font-medium ${location.pathname === to ? "bg-[#ecebff] text-[#533afd]" : "text-[#5e5e5e] hover:bg-[#f7f7f7]"}`}><Icon size={18} />{label}</Link>
                    ))}
                </nav>
                <div className="mt-auto border-t border-[#e5e5e5] pt-4">
                    <Link to="/notifications" className="mb-1 flex h-10 items-center gap-3 rounded-[8px] px-3 text-sm font-medium text-[#5e5e5e]"><Bell size={18} />Notifications</Link>
                    <button onClick={() => setLogoutOpen(true)} className="flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-sm font-medium text-[#5e5e5e] hover:bg-[#fde4e4] hover:text-[#b91c1c]"><LogOut size={18} />Log out</button>
                </div>
            </aside>
            <main className="lg:ml-[248px]">
                <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#e5e5e5] bg-white px-4 sm:px-8">
                    <div><h1 className="text-[18px] font-semibold">{title}</h1>{subtitle && <p className="text-xs text-[#5e5e5e]">{subtitle}</p>}</div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {onToggleTheme && <button onClick={onToggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]" aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>}
                        <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</Link>
                    </div>
                </header>
                <div className="mx-auto max-w-[1440px] p-4 pb-24 sm:p-8 lg:pb-8">
                    {location.pathname !== "/dashboard" && (
                        <div className="mb-6 flex h-10 items-center">
                            <BackButton to="/dashboard" label="Dashboard" />
                        </div>
                    )}
                    {children}
                </div>
            </main>
            <nav className="fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-4 border-t border-[#e5e5e5] bg-white px-2 lg:hidden">
                {items.slice(0, 4).map(({ label, to, icon: Icon }) => (
                    <Link key={to} to={to} className={`flex flex-col items-center justify-center gap-1 text-[10px] ${location.pathname === to ? "text-[#533afd]" : "text-[#5e5e5e]"}`}><Icon size={19} />{label}</Link>
                ))}
            </nav>
            <ConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of SmartHaul?" description="You will need to sign in again to access your workspace." confirmLabel="Log out" destructive onConfirm={logout} />
        </div>
    );
}

export default DashboardShell;
