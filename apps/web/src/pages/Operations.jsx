import { CalendarDays, CheckCircle2, FileWarning, Wrench } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Operations() {
    const [maintenance, setMaintenance] = useState([
        { title: "Engine service", vehicle: "GJ 01 AB 1234", date: "25 Aug", type: "urgent" },
        { title: "Insurance renewal", vehicle: "MH 12 CD 5678", date: "30 Aug", type: "document" },
        { title: "Tyre inspection", vehicle: "RJ 14 EF 9012", date: "02 Sep", type: "routine" },
    ]);
    useEffect(() => {
        api.get("/trust/maintenance")
            .then(({ data }) => {
                if (data.maintenance?.length) setMaintenance(data.maintenance.map((item) => ({
                    title: item.title,
                    vehicle: item.vehicleId?.vehicleNumber || "Vehicle",
                    date: new Date(item.scheduledFor).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
                    type: item.type
                })));
            })
            .catch(() => undefined);
    }, []);
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8"><p className="text-xs text-[#533afd]">Fleet operations</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Operations center</h1></div>
                <Tabs defaultValue="maintenance">
                    <TabsList><TabsTrigger value="maintenance">Maintenance</TabsTrigger><TabsTrigger value="calendar">Trip calendar</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger><TabsTrigger value="disputes">Disputes</TabsTrigger></TabsList>
                    <TabsContent><Card className="p-6"><div className="divide-y divide-[#e5e5e5]">{maintenance.map((item) => <div key={item.title} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]">{item.type === "document" ? <FileWarning size={18} /> : <Wrench size={18} />}</span><div><p className="font-medium">{item.title}</p><p className="mt-1 font-mono text-xs text-[#5e5e5e]">{item.vehicle}</p></div></div><div className="flex items-center gap-3"><Badge variant={item.type === "urgent" ? "rejected" : "pending"}><CalendarDays size={13} /> {item.date}</Badge><Button variant="secondary" size="sm">Schedule</Button></div></div>)}</div></Card></TabsContent>
                    <TabsContent><Card className="p-6"><div className="grid gap-3 sm:grid-cols-7">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => <div key={day} className="text-center"><p className="text-xs font-medium text-[#5e5e5e]">{day}</p><div className="mt-2 min-h-24 rounded-[12px] border border-[#e5e5e5] p-2"><p className="text-sm tabular-nums">{day === "Mon" ? "24" : day === "Tue" ? "25" : day === "Wed" ? "26" : ""}</p>{day === "Tue" && <span className="mt-3 block rounded-full bg-[#ecebff] px-2 py-1 text-[10px] text-[#533afd]">Ahmedabad</span>}</div></div>)}</div></Card></TabsContent>
                    <TabsContent><Card className="p-6"><h2 className="text-[18px] font-semibold">Document expiry</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{[["Insurance · GJ 01 AB 1234","12 days"],["Permit · MH 12 CD 5678","28 days"],["Fitness · RJ 14 EF 9012","45 days"],["PUC · All vehicles","Healthy"]].map(([label,value]) => <div key={label} className="flex items-center justify-between rounded-[12px] bg-[#f7f7f7] p-4"><p className="text-sm font-medium">{label}</p><Badge variant={value === "Healthy" ? "delivered" : "pending"}>{value}</Badge></div>)}</div></Card></TabsContent>
                    <TabsContent><Card className="p-10 text-center"><CheckCircle2 size={30} className="mx-auto text-[#15803d]" /><h2 className="mt-4 text-[18px] font-semibold">No open disputes</h2><p className="mt-2 text-sm text-[#5e5e5e]">All resolved cases and audit history will appear here.</p><Button variant="secondary" className="mt-5">Open support ticket</Button></Card></TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
export default Operations;
