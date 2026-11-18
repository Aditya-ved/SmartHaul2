import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useEffect } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        api.get("/platform/notifications")
            .then(({ data }) => {
                if (data.notifications?.length) setNotifications(data.notifications.map((item) => ({
                    id: item._id,
                    icon: Bell,
                    title: item.title,
                    detail: item.message,
                    time: new Date(item.createdAt).toLocaleString("en-IN"),
                    unread: item.unread
                })));
            })
            .catch(() => undefined);
    }, []);
    const markAllRead = async () => {
        try { await api.patch("/platform/notifications/read"); } catch { /* keep local read state */ }
        setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
    };
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[800px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs text-[#533afd]">Updates</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Notifications</h1></div><Button variant="secondary" onClick={markAllRead}><CheckCircle2 size={17} /> Mark all read</Button></div>
                <Card className="divide-y divide-[#e5e5e5] p-0">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                            <Bell className="mx-auto text-[#9a9a9a]" size={28} />
                            <h2 className="mt-3 font-semibold">No notifications</h2>
                            <p className="mt-2 text-sm text-[#5e5e5e]">Booking and shipment updates will appear here.</p>
                        </div>
                    ) : notifications.map(({ id, icon: Icon, title, detail, time, unread }) => (
                        <button key={id} onClick={async () => {
                            if (typeof id === "string") {
                                try { await api.patch(`/platform/notifications/${id}/read`); } catch { /* Keep UI responsive. */ }
                            }
                            setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
                        }} className="flex w-full gap-4 p-5 text-left first:rounded-t-[16px] last:rounded-b-[16px] hover:bg-[#f7f7f7]">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efefef]"><Icon size={18} /></span>
                            <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-medium">{title}{unread && <span className="h-2 w-2 rounded-full bg-[#533afd]" />}</span><span className="mt-1 block text-sm text-[#5e5e5e]">{detail}</span></span>
                            <span className="shrink-0 text-xs text-[#9a9a9a]">{time}</span>
                        </button>
                    ))}
                </Card>
            </main>
        </div>
    );
}

export default Notifications;
