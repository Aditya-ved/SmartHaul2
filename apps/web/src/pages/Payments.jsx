import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Download, IndianRupee, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Payments() {
    const [paid, setPaid] = useState(false);
    const [payments, setPayments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([api.get("/bookings"), api.get("/platform/payments")])
            .then(([bookingResult, paymentResult]) => {
                const bookingItems = bookingResult.data.bookings || [];
                setSelected(bookingItems[0] || null);
                setPayments(paymentResult.data.payments || []);
            })
            .catch((err) => setError(err.response?.data?.message || "Unable to load billing"))
            .finally(() => setLoading(false));
    }, []);

    const pay = async () => {
        if (!selected) return;
        try {
            await api.post("/bookings/payment/mock", { bookingId: selected._id });
            setPaid(true);
            toast.success("Payment recorded");
            const { data } = await api.get("/platform/payments");
            setPayments(data.payments || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment failed");
        }
    };
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8"><p className="text-xs text-[#533afd]">Billing</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Payments & invoices</h1></div>
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    {loading ? <Card className="p-6"><p className="text-sm text-[#5e5e5e]">Loading billing...</p></Card> : error ? <Card className="p-6"><p className="text-sm text-[#b91c1c]">{error}</p></Card> : selected ? <Card className="p-6"><div className="flex items-start justify-between"><div><Badge variant="pending">Payment pending</Badge><h2 className="mt-4 text-[22px] font-semibold">Booking {selected._id.slice(-8).toUpperCase()}</h2><p className="mt-1 text-sm text-[#5e5e5e]">{selected.route?.pickupCity} → {selected.route?.deliveryCity} · {selected.vehicleId?.vehicleNumber || "Vehicle"}</p></div><IndianRupee size={24} /></div><div className="mt-6 border-t border-[#e5e5e5] pt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-[#5e5e5e]">Freight charge</span><strong>₹{Number(selected.estimate?.distanceCharge || 0).toLocaleString("en-IN")}</strong></div><div className="flex justify-between"><span className="text-[#5e5e5e]">Weight charge</span><strong>₹{Number(selected.estimate?.weightCharge || 0).toLocaleString("en-IN")}</strong></div><div className="flex justify-between"><span className="text-[#5e5e5e]">Service fee</span><strong>₹{Number(selected.estimate?.serviceFee || 0).toLocaleString("en-IN")}</strong></div></div>{paid ? <div className="mt-6 flex items-center gap-3 rounded-[12px] bg-[#dcf5e4] p-4 text-[#15803d]"><CheckCircle2 size={20} /><div><p className="font-medium">Payment recorded</p><p className="text-xs">Booking reference {selected._id.slice(-8).toUpperCase()}</p></div></div> : <Button className="mt-6 w-full" onClick={pay}><CreditCard size={18} /> Pay ₹{Number(selected.estimate?.total || 0).toLocaleString("en-IN")}</Button>}</Card> : <Card className="p-6"><p className="text-sm text-[#5e5e5e]">No outstanding bookings.</p></Card>}
                    <Card className="p-6"><h2 className="text-[18px] font-semibold">Invoices</h2><div className="mt-5 space-y-3">{payments.length ? payments.map((payment) => <div key={payment._id} className="flex items-center justify-between rounded-[12px] bg-[#f7f7f7] p-4"><div><p className="text-sm font-medium">{payment.invoiceNumber}</p><p className="mt-1 text-xs text-[#9a9a9a]">{payment.status} · ₹{Number(payment.amount || 0).toLocaleString("en-IN")}</p></div><button aria-label="Download invoice" className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><Download size={17} /></button></div>) : <p className="text-sm text-[#5e5e5e]">No invoices yet.</p>}</div><div className="mt-5 flex items-center gap-2 text-xs text-[#5e5e5e]"><ShieldCheck size={15} /> Payment records are linked to bookings.</div></Card>
                </div>
            </main>
        </div>
    );
}
export default Payments;
