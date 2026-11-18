import { useEffect, useState } from "react";
import { CheckCircle2, FileText, ShieldCheck, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import api from "../services/api";
import BackButton from "../components/BackButton";

function TrustCenter() {
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(5);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/trust/documents")
            .then(({ data }) => setDocuments(data.documents || []))
            .catch(() => setDocuments([]))
            .finally(() => setLoading(false));
    }, []);
    const submitReview = async () => {
        const bookingId = localStorage.getItem("smarthaul_last_booking");
        if (!bookingId || !review.trim()) {
            toast.error("A completed booking and review comment are required");
            return;
        }
        try {
            await api.post("/trust/reviews", { bookingId, revieweeId: localStorage.getItem("smarthaul_reviewee"), rating, comment: review });
            toast.success("Review submitted");
            setReview("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Unable to submit review");
        }
    };
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <div className="mb-8"><p className="text-xs text-[#533afd]">Trust & safety</p><h1 className="mt-2 text-[36px] font-bold leading-[44px]">Verification center</h1></div>
                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-6"><Card className="p-6"><div className="flex items-center justify-between"><div><Badge variant={documents.length ? "pending" : "neutral"}><ShieldCheck size={14} /> {documents.length ? "Verification in progress" : "No documents"}</Badge><h2 className="mt-4 text-[22px] font-semibold">KYC documents</h2></div><CheckCircle2 size={24} className={documents.length ? "text-[#533afd]" : "text-[#9a9a9a]"} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{loading ? <p className="text-sm text-[#5e5e5e]">Loading documents...</p> : documents.length ? documents.map((document) => <div key={document._id} className="flex items-center justify-between rounded-[12px] border border-[#e5e5e5] p-4"><div className="flex items-center gap-3"><FileText size={18} /><span className="text-sm font-medium">{document.type?.replaceAll("_", " ")}</span></div><Badge variant={document.status === "verified" ? "delivered" : document.status === "rejected" ? "rejected" : "pending"}>{document.status}</Badge></div>) : <p className="text-sm text-[#5e5e5e]">No verification documents uploaded.</p>}</div></Card>
                        <Card className="p-6"><h2 className="text-[18px] font-semibold">Submit a review</h2><div className="mt-4 flex gap-1">{[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} stars`}><Star size={24} fill={star <= rating ? "#0a0a0a" : "none"} /></button>)}</div><Textarea value={review} onChange={(event) => setReview(event.target.value)} className="mt-4" placeholder="Share your delivery experience..." /><Button className="mt-4" onClick={submitReview}>Submit review</Button></Card>
                    </div>
                    <Card className="h-fit p-6"><h2 className="text-[18px] font-semibold">Safety score</h2><div className="mt-6 text-center"><div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-[#ecebff] text-[32px] font-semibold text-[#533afd]">92</div><p className="mt-4 text-sm text-[#5e5e5e]">Excellent account standing</p></div><div className="mt-6 space-y-3">{[["Identity","Verified"],["Vehicle","Verified"],["Payments","Protected"],["Reviews","4.8 / 5"]].map(([label,value]) => <div key={label} className="flex justify-between text-sm"><span className="text-[#5e5e5e]">{label}</span><strong>{value}</strong></div>)}</div></Card>
                </div>
            </main>
        </div>
    );
}
export default TrustCenter;
