import { useState } from "react";
import { AlertCircle, MessageCircle, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Support() {
    const [sent, setSent] = useState(false);
    const submit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        try {
            await api.post("/trust/support", {
                category: String(form.get("category") || "booking").toLowerCase(),
                subject: "Support request",
                description: form.get("description")
            });
            setSent(true);
            toast.success("Support ticket submitted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to submit ticket");
        }
    };
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar /><main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-8">
            <BackButton to="/" label="Home" className="-ml-3 mb-4" />
            <div className="mb-8 text-center"><p className="text-xs text-[#533afd]">Help center</p><h1 className="mt-2 text-[36px] font-bold">How can we help?</h1><div className="relative mx-auto mt-5 max-w-[620px]"><Search className="absolute left-4 top-3.5" size={18} /><Input className="pl-11" placeholder="Search bookings, payments or deliveries" /></div></div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6"><h2 className="text-[18px] font-semibold">Popular topics</h2><div className="mt-4 space-y-2">{["Cancel a booking","Payment and refunds","Tracking a shipment","Verify a vehicle","Driver assignment"].map((topic) => <button key={topic} className="flex w-full items-center justify-between rounded-[12px] bg-[#f7f7f7] px-4 py-3 text-left text-sm font-medium">{topic}<span>→</span></button>)}</div></Card>
                <Card className="p-6"><h2 className="text-[18px] font-semibold">Create a support ticket</h2>{sent ? <div className="mt-5 rounded-[12px] bg-[#dcf5e4] p-5 text-[#15803d]"><MessageCircle className="mb-3" /><p className="font-medium">Ticket submitted</p><p className="mt-1 text-sm">Our team will respond as soon as possible.</p></div> : <form onSubmit={submit} className="mt-5 space-y-4"><div className="space-y-2"><Label>Topic</Label><select name="category"><option value="booking">Booking</option><option value="payment">Payment</option><option value="delivery">Delivery</option><option value="safety">Safety</option></select></div><div className="space-y-2"><Label>Description</Label><Textarea name="description" required placeholder="Describe the issue..." /></div><Button type="submit" className="w-full"><AlertCircle size={17} /> Submit ticket</Button></form>}</Card>
            </div>
        </main></div>
    );
}
export default Support;
