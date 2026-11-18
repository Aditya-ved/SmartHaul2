import {
    ArrowRight,
    ArrowUpRight,
    Package,
    ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import sendGoodsImage from "../assets/send-goods.jpg";
import freightTerminalImage from "../assets/freight-terminal.jpg";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import truckRouteImage from "../assets/truck-route.jpg";

function Home() {
    const searchFields = [
        ["From", "Ahmedabad"],
        ["To", "Delhi"],
        ["Pickup date", "23 Aug"],
        ["Weight", "6,000 kg"]
    ];

    return (
        <div className="min-h-screen bg-white text-[#0a0a0a]">
            <Navbar />
            <main>
                <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-12 sm:px-8 sm:pt-16">
                    <div className="overflow-hidden rounded-[16px] bg-[linear-gradient(115deg,#f7f7f7_0%,#f2f0ff_52%,#ffffff_100%)] px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
                        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
                            <div>
                                <p className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#5e5e5e]">
                                    <span className="h-2 w-2 rounded-full bg-[#15803d]" /> Shared freight across India
                                </p>
                                <h1 className="max-w-[680px] text-[44px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[52px]">
                                    Ship only what you need. Pay for only what you use.
                                </h1>
                                <p className="mt-6 max-w-[600px] text-[18px] leading-7 text-[#5e5e5e]">
                                    Match your goods with verified trucks travelling the same route.
                                    Less empty capacity. Better freight prices.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Button asChild size="lg"><Link to="/register">Find a truck <ArrowRight size={20} /></Link></Button>
                                    <a href="#how-it-works" className="inline-flex h-14 items-center rounded-full border border-[#e5e5e5] px-6 text-[16px] font-medium transition hover:bg-[#f7f7f7]">
                                        How it works
                                    </a>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-sm text-[#5e5e5e]">
                                    <ShieldCheck size={18} /> Verified vehicles and transparent bookings
                                </div>
                            </div>

                            <Card className="p-5 shadow-[0_8px_24px_rgba(10,20,60,0.08)] sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-[#5e5e5e]">Route preview</span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-[#dcf5e4] px-3 py-1 text-xs font-medium text-[#15803d]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" /> Live matching
                                        </span>
                                    </div>
                                <div className="mt-8">
                                    {[["Ahmedabad", "Pickup"], ["Delhi", "Destination"]].map(([city, type], index) => (
                                        <div key={city} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className={`h-3 w-3 rounded-full border-[3px] border-white ${index === 0 ? "bg-black" : "bg-[#533afd]"}`} />
                                                {index === 0 && <span className="h-20 border-l-2 border-dashed border-[#d4d4d4]" />}
                                            </div>
                                            <div className="-mt-1 pb-5">
                                                <p className="text-xs text-[#9a9a9a]">{type}</p>
                                                <p className="mt-1 text-[22px] font-semibold">{city}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 rounded-[16px] bg-[#f7f7f7] p-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#5e5e5e]">Available capacity</span><Package size={18} />
                                    </div>
                                    <div className="mt-3 flex items-end justify-between">
                                        <strong className="text-[28px] leading-none tabular-nums">4,000 kg</strong>
                                        <span className="text-xs text-[#5e5e5e]">of 10,000 kg</span>
                                    </div>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#efefef]"><div className="h-full w-[40%] rounded-full bg-black" /></div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="relative z-10 mx-auto -mt-7 grid max-w-[1080px] grid-cols-2 overflow-hidden rounded-full border border-[#e5e5e5] bg-white p-2 shadow-[0_8px_24px_rgba(10,20,60,0.08)] sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_48px]">
                        {searchFields.map(([label, value]) => (
                            <button key={label} className="px-3 py-2 text-left sm:px-5">
                                <span className="block text-xs font-medium">{label}</span>
                                <span className="block text-sm text-[#5e5e5e]">{value}</span>
                            </button>
                        ))}
                        <button className="col-span-2 mt-1 flex h-12 items-center justify-center rounded-full bg-black text-white sm:col-span-1 lg:mt-0" aria-label="Search trucks">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </section>

                <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8" id="services">
                    <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                        <div className="max-w-[700px]">
                            <h2 className="text-[40px] font-bold leading-[46px] tracking-[-0.025em] sm:text-[48px] sm:leading-[54px]">
                                One platform. Every kind of shipment.
                            </h2>
                        </div>
                        <p className="max-w-[360px] text-[16px] leading-7 text-[#5e5e5e]">
                            Choose a full truck or share the space you need. SmartHaul keeps the route, capacity and booking in one place.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.25fr_0.875fr_0.875fr]">
                        {[
                            [sendGoodsImage, "Send goods", "Book a full truck or pay for available capacity on a matching route."],
                            [truckRouteImage, "Truck owners", "Publish routes, manage bookings and earn from empty vehicle capacity."],
                            [freightTerminalImage, "Logistics companies", "Manage fleets, drivers, routes and freight operations in one workspace."]
                        ].map(([image, title, text], index) => (
                            <article key={title} className={`group relative min-h-[420px] overflow-hidden rounded-[20px] border border-[#e5e5e5] bg-[#0a0a0a] text-white transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(10,20,60,0.16)] ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                                <div className="absolute inset-0">
                                    <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                                    <div className="mb-5 flex justify-end">
                                        <span className="font-mono text-[12px] font-medium text-white/70">0{index + 1}</span>
                                    </div>
                                    <h3 className="text-[28px] font-bold leading-[34px]">{title}</h3>
                                    <p className="mt-3 max-w-[360px] text-[15px] leading-6 text-white/75">{text}</p>
                                    <Link to="/register" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition group-hover:bg-[#533afd] group-hover:text-white">
                                        Get started <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-4 my-20 overflow-hidden rounded-[24px] bg-[#0b0b0e] px-5 py-14 text-white sm:mx-8 sm:px-10 lg:px-16 lg:py-16" id="how-it-works">
                    <div className="mx-auto max-w-[1136px]">
                        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                            <div>
                                <p className="mb-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/60">How it works</p>
                                <h2 className="max-w-[700px] text-[40px] font-bold leading-[46px] tracking-[-0.025em] sm:text-[48px] sm:leading-[54px]">
                                    One route.<br />Three simple moves.
                                </h2>
                            </div>
                            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black sm:flex">
                                <span className="h-2 w-2 rounded-full bg-[#15803d]" />
                                Average match in minutes
                            </div>
                        </div>
                        <div className="relative mt-12 overflow-hidden rounded-[20px] border border-white/10 bg-[#111116]">
                            <div className="grid min-h-[260px] md:grid-cols-[1fr_1.15fr_1fr]">
                            {[
                                ["01", "Enter your route", "Add pickup, destination, goods weight and your preferred date."],
                                ["02", "Find a smart match", "Compare verified trucks already travelling on a compatible route."],
                                ["03", "Book and track", "Confirm the truck, follow the journey and receive delivery updates."]
                            ].map(([number, title, text], index) => (
                                <div key={number} className={`relative flex min-h-[260px] flex-col justify-between p-7 md:p-8 ${index < 2 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[12px] tabular-nums text-white/45">{number}</span>
                                        {index < 2 && (
                                            <span className="hidden text-[24px] leading-none text-[#533afd] md:block">→</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="mb-5 h-px w-full bg-gradient-to-r from-[#533afd] via-white/20 to-transparent" />
                                        <h3 className="text-[22px] font-semibold leading-[28px]">{title}</h3>
                                        <p className="mt-3 max-w-[270px] text-[15px] leading-6 text-white/60">{text}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8" id="about">
                    <div className="grid overflow-hidden rounded-[24px] border border-[#e5e5e5] bg-[#f7f7f7] lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="p-7 sm:p-10 lg:p-12">
                            <p className="text-xs font-semibold text-[#533afd]">Why SmartHaul</p>
                            <h2 className="mt-4 max-w-[560px] text-[40px] font-bold leading-[46px] tracking-[-0.025em] sm:text-[48px] sm:leading-[54px]">
                                Empty capacity should never be wasted.
                            </h2>
                            <p className="mt-5 max-w-[520px] text-[16px] leading-7 text-[#5e5e5e]">
                                SmartHaul brings senders and truck owners onto one route-based network, making every journey more useful and every booking more efficient.
                            </p>
                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {[
                                    ["Lower cost", "Pay for the space you need"],
                                    ["Less waste", "Use space already on route"],
                                    ["One dashboard", "Bookings and tracking together"]
                                ].map(([title, text]) => (
                                    <div key={title} className="rounded-[16px] border border-[#e5e5e5] bg-white p-4">
                                        <p className="text-sm font-semibold">{title}</p>
                                        <p className="mt-2 text-xs leading-5 text-[#5e5e5e]">{text}</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/register" className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-black px-6 font-medium text-white transition hover:bg-[#282828]">
                                Join SmartHaul <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="relative min-h-[420px] overflow-hidden bg-black p-7 text-white sm:p-10 lg:min-h-full">
                            <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                    backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.14) 1px, transparent 1px)",
                                    backgroundSize: "32px 32px"
                                }}
                            />
                            <div className="relative flex h-full flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-white/55">Capacity network</p>
                                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">Live routes</span>
                                </div>

                                <div className="my-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white/45">Ahmedabad</p>
                                            <p className="mt-2 text-[28px] font-semibold">6,000 kg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-white/45">Delhi</p>
                                            <p className="mt-2 text-[28px] font-semibold">4,000 kg</p>
                                        </div>
                                    </div>
                                    <div className="relative mt-7 h-3 rounded-full bg-white/15">
                                        <div className="h-full w-[60%] rounded-full bg-[#533afd]" />
                                        <span className="absolute left-[60%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-black bg-white shadow-[0_0_0_1px_rgba(255,255,255,.3)]" />
                                    </div>
                                    <div className="mt-3 flex justify-between text-xs text-white/45">
                                        <span>Occupied</span>
                                        <span>Available capacity</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        ["Verified", "Vehicles"],
                                        ["Route", "Matched"],
                                        ["24/7", "Visibility"]
                                    ].map(([value, label]) => (
                                        <div key={label} className="rounded-[14px] border border-white/10 bg-white/[0.06] p-4">
                                            <p className="text-[18px] font-semibold">{value}</p>
                                            <p className="mt-1 text-xs text-white/45">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-black px-4 py-12 text-white sm:px-8 sm:py-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr_0.9fr]">
                        <div>
                            <div className="flex items-center gap-3 text-[22px] font-semibold">
                                <span className="[&>*]:border-white/20"><BrandMark /></span>
                                SmartHaul
                            </div>
                            <p className="mt-4 max-w-[340px] text-sm leading-6 text-white/55">
                                Shared freight for better routes, better capacity and better journeys across India.
                            </p>
                            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65">
                                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                                Smart freight network
                            </span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white/40">Platform</p>
                            <nav className="mt-4 flex flex-col gap-3 text-sm text-white/75">
                                <a href="#services" className="transition hover:text-white">Services</a>
                                <a href="#how-it-works" className="transition hover:text-white">How it works</a>
                                <a href="#about" className="transition hover:text-white">About SmartHaul</a>
                                <Link to="/marketplace" className="transition hover:text-white">Truck marketplace</Link>
                            </nav>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white/40">Get started</p>
                            <nav className="mt-4 flex flex-col gap-3 text-sm text-white/75">
                                <Link to="/register" className="transition hover:text-white">Send goods</Link>
                                <Link to="/register" className="transition hover:text-white">List a vehicle</Link>
                                <Link to="/register" className="transition hover:text-white">Logistics company</Link>
                                <Link to="/login" className="transition hover:text-white">Log in</Link>
                            </nav>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white/40">Support</p>
                            <nav className="mt-4 flex flex-col gap-3 text-sm text-white/75">
                                <Link to="/support" className="transition hover:text-white">Help center</Link>
                                <a href="mailto:support@smarthaul.in" className="transition hover:text-white">support@smarthaul.in</a>
                                <span>Mon–Sat, 9:00–18:00</span>
                                <Link to="/tracking" className="transition hover:text-white">Track a shipment</Link>
                            </nav>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
                        <span>© 2026 SmartHaul. All rights reserved.</span>
                        <div className="flex gap-5">
                            <Link to="/support" className="transition hover:text-white">Privacy</Link>
                            <Link to="/support" className="transition hover:text-white">Terms</Link>
                            <Link to="/support" className="transition hover:text-white">Safety</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
