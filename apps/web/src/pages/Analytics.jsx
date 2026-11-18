import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Gauge, IndianRupee, Package, Route } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

const monthly = [
    { month: "Mar", revenue: 82000, bookings: 18 },
    { month: "Apr", revenue: 96000, bookings: 24 },
    { month: "May", revenue: 114000, bookings: 29 },
    { month: "Jun", revenue: 108000, bookings: 27 },
    { month: "Jul", revenue: 138000, bookings: 34 },
    { month: "Aug", revenue: 156000, bookings: 41 },
];

function Analytics() {
    const [stats, setStats] = useState([
        [IndianRupee, "Revenue", "₹0", "No payments yet"],
        [Gauge, "Active bookings", "0", "No active bookings"],
        [Package, "Capacity used", "0%", "No fleet data"],
        [Route, "Active routes", "0", "No route data"],
    ]);
    useEffect(() => {
        Promise.allSettled([api.get("/vehicles"), api.get("/shipments"), api.get("/bookings"), api.get("/platform/payments")])
            .then(([vehicleResult, shipmentResult, bookingResult, paymentResult]) => {
                const vehicles = vehicleResult.status === "fulfilled" ? vehicleResult.value.data.vehicles || [] : [];
                const shipments = shipmentResult.status === "fulfilled" ? shipmentResult.value.data.shipments || [] : [];
                const bookings = bookingResult.status === "fulfilled" ? bookingResult.value.data.bookings || [] : [];
                const payments = paymentResult.status === "fulfilled" ? paymentResult.value.data.payments || [] : [];
                const revenue = payments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
                const totalCapacity = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.capacityKg || 0), 0);
                const availableCapacity = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0), 0);
                const used = totalCapacity ? Math.round(((totalCapacity - availableCapacity) / totalCapacity) * 100) : 0;
                const routes = new Set(shipments.map((shipment) => `${shipment.pickupLocation?.city}-${shipment.deliveryLocation?.city}`)).size;
                setStats([
                    [IndianRupee, "Revenue", `₹${revenue.toLocaleString("en-IN")}`, "Captured payments"],
                    [Gauge, "Active bookings", String(bookings.filter((booking) => !["cancelled", "delivered"].includes(booking.status)).length), "Current lifecycle"],
                    [Package, "Capacity used", `${used}%`, "Across registered fleet"],
                    [Route, "Active routes", String(routes), "Shipment routes"],
                ]);
            });
    }, []);
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8"><p className="text-xs text-[#533afd]">Business overview</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Analytics</h1></div>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map(([Icon, label, value, change]) => (
                        <Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">{label}</span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]"><Icon size={18} /></span></div><p className="mt-5 text-[32px] font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-[#15803d]">{change}</p></Card>
                    ))}
                </section>
                <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <Card className="p-6"><h2 className="text-[18px] font-semibold">Revenue</h2><div className="mt-5 h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly}><CartesianGrid stroke="#e5e5e5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} /><Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]} /><Area type="monotone" dataKey="revenue" stroke="#533afd" fill="#ecebff" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Card>
                    <Card className="p-6"><h2 className="text-[18px] font-semibold">Bookings</h2><div className="mt-5 h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid stroke="#e5e5e5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="bookings" fill="#0a0a0a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
                </section>
            </main>
        </div>
    );
}
export default Analytics;
