import { useEffect, useState } from "react";
import { ArrowUp, CheckCheck, Paperclip, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Messages() {
    const [threads, setThreads] = useState([]);
    const [active, setActive] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        api.get("/platform/conversations")
            .then(({ data }) => {
                if (data.conversations?.length) {
                    const conversation = data.conversations[0];
                    setThreads(data.conversations.map((item) => ({
                        id: item._id,
                        name: item.participantIds?.map((participant) => participant.fullName).join(", ") || "Conversation",
                        role: item.subject || "SmartHaul chat",
                        preview: item.lastMessage || "No messages",
                        time: "Recent",
                        unread: 0
                    })));
                    setActive({
                        id: conversation._id,
                        name: conversation.participantIds?.map((p) => p.fullName).join(", ") || "Conversation",
                        role: "SmartHaul chat",
                        preview: conversation.lastMessage || "No messages",
                        time: "Now",
                        unread: 0
                    });
                    api.get(`/platform/conversations/${conversation._id}/messages`)
                        .then(({ data: messageData }) => {
                            const nextMessages = (messageData.messages || []).map((message) => ({
                                id: message._id,
                                from: "other",
                                text: message.body,
                                time: new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                            }));
                            setMessages(nextMessages);
                        })
                        .catch(() => undefined);
                }
            })
            .catch(() => {});
    }, []);
    const selectThread = async (thread) => {
        setActive(thread);
        try {
            const { data } = await api.get(`/platform/conversations/${thread.id}/messages`);
            setMessages((data.messages || []).map((message) => ({
                id: message._id,
                from: "other",
                text: message.body,
                time: new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
            })));
        } catch {
            setMessages([]);
        }
    };
    const send = async (event) => {
        event.preventDefault();
        if (!text.trim()) return;
        if (typeof active?.id === "string") {
            try {
                await api.post(`/platform/conversations/${active.id}/messages`, { body: text.trim() });
                setMessages([...messages, { id: Date.now(), from: "me", text: text.trim(), time: "Now" }]);
                setText("");
                return;
            } catch {
                // Keep the page usable if the API is temporarily unavailable.
            }
        }
        setMessages([...messages, { id: Date.now(), from: "me", text: text.trim(), time: "Now" }]);
        setText("");
    };
    return (
        <div className="min-h-screen bg-[#f7f7f7]"><Navbar />
            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
                <BackButton to="/dashboard" label="Dashboard" className="-ml-3 mb-4" />
                <h1 className="mb-8 text-[36px] font-bold leading-[44px]">Messages</h1>
                <Card className="grid h-[650px] overflow-hidden p-0 md:grid-cols-[280px_1fr]">
                    <aside className="border-b border-[#e5e5e5] md:border-b-0 md:border-r"><div className="divide-y divide-[#e5e5e5]">{threads.length === 0 ? <p className="p-5 text-sm text-[#5e5e5e]">No conversations yet.</p> : threads.map((thread) => <button key={thread.id} onClick={() => selectThread(thread)} className={`w-full p-4 text-left ${active?.id === thread.id ? "bg-[#ecebff]" : "hover:bg-[#f7f7f7]"}`}><div className="flex justify-between gap-2"><p className="font-medium">{thread.name}</p><span className="text-xs text-[#9a9a9a]">{thread.time}</span></div><p className="mt-1 truncate text-xs text-[#5e5e5e]">{thread.preview}</p></button>)}</div></aside>
                    <section className="grid grid-rows-[64px_1fr_72px]">
                        <header className="flex items-center justify-between border-b border-[#e5e5e5] px-5"><div><p className="font-medium">{active?.name || "Select a conversation"}</p><p className="text-xs text-[#15803d]">{active ? "Available" : "No active conversation"}</p></div><button disabled={!active} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef] disabled:opacity-40" aria-label="Call"><Phone size={17} /></button></header>
                        <div className="overflow-y-auto p-5"><div className="space-y-3">{messages.map((message) => <div key={message.id} className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-[16px] px-4 py-3 ${message.from === "me" ? "bg-black text-white" : "bg-[#efefef]"}`}><p className="text-sm">{message.text}</p><p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.from === "me" ? "text-white/60" : "text-[#9a9a9a]"}`}>{message.time}{message.from === "me" && <CheckCheck size={12} />}</p></div></div>)}</div></div>
                        <form onSubmit={send} className="flex items-center gap-2 border-t border-[#e5e5e5] px-4"><button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efefef]" aria-label="Attach file"><Paperclip size={17} /></button><Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message..." /><button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white" aria-label="Send"><ArrowUp size={18} /></button></form>
                    </section>
                </Card>
            </main>
        </div>
    );
}
export default Messages;
