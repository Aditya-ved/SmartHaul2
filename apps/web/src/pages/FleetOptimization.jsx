import { Gauge, MapPin, Warehouse, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function FleetOptimization() {
    const [routes, setRoutes] = useState([]);
    const [fleetSize, setFleetSize] = useState(0);
    const [utilization, setUtilization] = useState(0);
    useEffect(() => {
        api.get("/vehicles")
            .then(({ data }) => {
                const vehicles = data.vehicles || [];
                setFleetSize(vehicles.length);
                const total = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.capacityKg || 0), 0);
                const available = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0), 0);
                setUtilization(total ? Math.round(((total - available) / total) * 100) : 0);
                setRoutes(vehicles.map((vehicle) => {
                    const totalVehicle = Number(vehicle.capacityKg || 0);
                    const availableVehicle = Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0);
                    const percent = totalVehicle ? Math.round(((totalVehicle - availableVehicle) / totalVehicle) * 100) : 0;
                    return {
                        route: `${vehicle.currentCity || "Pickup"} → ${vehicle.destinationCity || "Destination"}`,
                        vehicle: vehicle.vehicleNumber,
                        utilization: percent,
                        status: percent >= 90 ? "Near full" : percent >= 60 ? "Optimal" : "Review"
                    };
                }));
            })
            .catch(() => {
                setRoutes([]);
                setFleetSize(0);
                setUtilization(0);
            });
    }, []);
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar /><main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
            <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
            <div className="mb-8"><p className="text-xs text-[#533afd]">Fleet planning</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Fleet optimization</h1></div>
            <section className="grid gap-4 sm:grid-cols-3">
                {[ [Warehouse, "Fleet size", String(fleetSize)], [Gauge, "Utilization", `${utilization}%`], [Users, "Assigned drivers", "Manage in Drivers"] ].map(([Icon,label,value]) => <Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">{label}</span><Icon size={18} /></div><p className="mt-4 text-[32px] font-semibold tabular-nums">{value}</p></Card>)}
            </section>
            <Card className="mt-6 p-6"><div className="flex items-center justify-between"><div><h2 className="text-[18px] font-semibold">Upcoming routes</h2><p className="mt-1 text-sm text-[#5e5e5e]">Capacity and assignment recommendations</p></div><Button variant="secondary">Rebalance</Button></div><div className="mt-5 divide-y divide-[#e5e5e5]">{routes.map((item) => <div key={item.route} className="grid gap-4 py-5 sm:grid-cols-[1fr_180px_120px_100px] sm:items-center"><div><p className="flex items-center gap-2 font-medium"><MapPin size={16} />{item.route}</p><p className="mt-1 font-mono text-sm text-[#5e5e5e]">{item.vehicle}</p></div><div><div className="flex justify-between text-xs"><span>Utilization</span><strong>{item.utilization}%</strong></div><div className="mt-2 h-2 rounded-full bg-[#efefef]"><div className={`h-full rounded-full ${item.utilization > 90 ? "bg-[#b91c1c]" : "bg-black"}`} style={{ width: `${item.utilization}%` }} /></div></div><Badge variant={item.status === "Optimal" ? "delivered" : item.status === "Near full" ? "rejected" : "pending"}>{item.status}</Badge><Button variant="secondary" size="sm">Optimize</Button></div>)}</div></Card>
        </main></div>
    );
}
export default FleetOptimization;
