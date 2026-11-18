import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Heart, MapPin, Search,  Weight } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import truckImage from "../assets/warehouse.jpg";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Marketplace() {
    const [query, setQuery] = useState("");
    const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("saved_trucks") || "[]"));
    const [selected, setSelected] = useState(null);
    const [savedRoutes, setSavedRoutes] = useState(() => JSON.parse(localStorage.getItem("saved_routes") || "[]"));
    const [loading, setLoading] = useState(true);
    const [apiTrucks, setApiTrucks] = useState([]);
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [error, setError] = useState("");

    const loadVehicles = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get("/vehicles/public", {
                params: {
                    pickupCity: fromCity || undefined,
                    deliveryCity: toCity || undefined,
                    search: query || undefined,
                    limit: 12
                }
            });
            const vehicles = data.vehicles || [];
            setApiTrucks(vehicles);
            if (vehicles.length) {
                const first = vehicles[0];
                setSelected({
                    id: first._id,
                    number: first.vehicleNumber,
                    type: first.vehicleType?.replaceAll("_", " ") || "Truck",
                    route: `${first.currentCity || "Pickup"} → ${first.destinationCity || "Destination"}`,
                    pickup: "Available",
                    capacity: first.capacityKg || 0,
                    available: first.availableCapacityKg ?? first.capacityKg ?? 0,
                    price: 12500,
                    rating: "Verified"
                });
            } else {
                setSelected(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load verified vehicles.");
        } finally {
            setLoading(false);
        }
    }, [fromCity, query, toCity]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadVehicles();
    }, [loadVehicles]);

    const marketplaceTrucks = apiTrucks.map((vehicle) => ({
            id: vehicle._id,
            number: vehicle.vehicleNumber,
            type: vehicle.vehicleType?.replaceAll("_", " ") || "Truck",
            route: `${vehicle.currentCity || "Pickup"} → ${vehicle.destinationCity || "Destination"}`,
            pickup: "Available",
            capacity: vehicle.capacityKg || 0,
            available: vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0,
            price: 12500,
            rating: "Verified"
        }));

    const filtered = marketplaceTrucks.filter((truck) =>
        `${truck.route} ${truck.number} ${truck.type}`.toLowerCase().includes(query.toLowerCase())
    );

    const toggleSaved = (id) => {
        const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
        setSaved(next);
        localStorage.setItem("saved_trucks", JSON.stringify(next));
        api.post("/platform/favorites", { vehicleId: id }).catch(() => undefined);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-8 sm:px-8">
                <BackButton to="/" label="Home" className="-ml-3 mb-4" />
                <div className="mb-8">
                    <p className="text-sm font-medium text-[#533afd]">Truck marketplace</p>
                    <h1 className="mt-2 text-[36px] font-bold leading-[44px] tracking-[-0.02em]">Find a truck for your route.</h1>
                </div>

                <Card className="mb-8 grid gap-2 p-2 shadow-[0_8px_24px_rgba(10,20,60,0.08)] md:grid-cols-[1fr_1fr_1fr_48px]">
                    <label className="flex h-12 items-center gap-3 rounded-full px-4"><MapPin size={18} /><input value={fromCity} onChange={(event) => setFromCity(event.target.value)} className="h-auto border-0 bg-transparent p-0" placeholder="From" /></label>
                    <label className="flex h-12 items-center gap-3 rounded-full px-4"><MapPin size={18} /><input value={toCity} onChange={(event) => setToCity(event.target.value)} className="h-auto border-0 bg-transparent p-0" placeholder="To" /></label>
                    <label className="flex h-12 items-center gap-3 rounded-full px-4"><CalendarDays size={18} /><input className="h-auto border-0 bg-transparent p-0" placeholder="Pickup date" /></label>
                    <Button
                        size="icon"
                        className="h-12 w-12 justify-self-end"
                        onClick={loadVehicles}
                        aria-label="Search"
                        disabled={loading}
                    >
                        <Search size={19} />
                    </Button>
                </Card>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    {error && <div className="lg:col-span-2 rounded-[12px] bg-[#fde4e4] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-[#5e5e5e]">{apiTrucks.length ? `${apiTrucks.length} live` : filtered.length} verified trucks</p>
                            <label className="sr-only" htmlFor="truck-search">Search trucks</label>
                            <div className="hidden items-center gap-2 rounded-full border border-[#e5e5e5] px-4 sm:flex">
                                <Search size={15} /><input id="truck-search" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 w-44 border-0 bg-transparent p-0" placeholder="Search route" />
                            </div>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            {loading ? (
                                [1, 2].map((item) => (
                                    <Card key={item} className="overflow-hidden p-0">
                                        <div className="aspect-[16/9] animate-pulse bg-[#efefef]" />
                                        <div className="space-y-3 p-4">
                                            <div className="h-5 w-2/3 animate-pulse rounded bg-[#efefef]" />
                                            <div className="h-4 w-1/2 animate-pulse rounded bg-[#efefef]" />
                                        </div>
                                    </Card>
                                ))
                            ) : filtered.length ? filtered.map((truck) => (
                                <Card key={truck.id} className="cursor-pointer overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-[0_1px_3px_rgba(10,20,60,0.08)]" onClick={() => setSelected(truck)}>
                                    <div className="relative aspect-[16/9]"><img src={truckImage} alt="" className="h-full w-full object-cover" /><Badge className="absolute left-3 top-3" variant="delivered">{truck.rating}</Badge></div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div><h2 className="text-[18px] font-semibold">{truck.route}</h2><p className="mt-1 text-sm text-[#5e5e5e]">{truck.type} · <span className="tabular-nums">{truck.number}</span></p></div>
                                            <button onClick={(event) => { event.stopPropagation(); toggleSaved(truck.id); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef]" aria-label="Save truck">
                                                <Heart size={18} fill={saved.includes(truck.id) ? "#0a0a0a" : "none"} />
                                            </button>
                                        </div>
                                        <div className="mt-4"><div className="flex justify-between text-sm"><span>Available capacity</span><strong className="tabular-nums">{truck.available.toLocaleString("en-IN")} kg</strong></div><div className="mt-2 h-2 rounded-full bg-[#efefef]"><div className="h-full rounded-full bg-black" style={{ width: `${(truck.available / truck.capacity) * 100}%` }} /></div></div>
                                    </div>
                                </Card>
                            )) : (
                                <Card className="col-span-full p-10 text-center">
                                    <h2 className="text-[18px] font-semibold">No trucks found</h2>
                                    <p className="mt-2 text-sm text-[#5e5e5e]">Try another route or clear the search.</p>
                                    <Button variant="secondary" className="mt-5" onClick={() => setQuery("")}>Clear search</Button>
                                </Card>
                            )}
                        </div>
                    </div>

                    {selected && <aside className="h-fit rounded-[16px] border border-[#e5e5e5] bg-white p-6 lg:sticky lg:top-24">
                        <p className="text-xs text-[#9a9a9a]">Selected truck</p>
                        <h2 className="mt-2 text-[22px] font-semibold">{selected.route}</h2>
                        <p className="mt-2 text-sm text-[#5e5e5e]">{selected.number}</p>
                        <div className="my-5 border-t border-[#e5e5e5]" />
                        <div className="flex items-center justify-between"><span className="text-sm text-[#5e5e5e]">Available</span><strong className="tabular-nums">{selected.available.toLocaleString("en-IN")} kg</strong></div>
                        <div className="mt-4 flex items-end justify-between"><span className="text-sm text-[#5e5e5e]">Estimated trip</span><strong className="text-[28px] tabular-nums">₹{selected.price.toLocaleString("en-IN")}</strong></div>
                        <Link to={`/vehicles/${selected.id}`}><Button className="mt-6 w-full"><Weight size={17} /> View truck</Button></Link>
                        <Button
                            variant="secondary"
                            className="mt-2 w-full"
                            onClick={() => {
                                const route = `${selected.route} · ${selected.available.toLocaleString("en-IN")} kg`;
                                const next = savedRoutes.includes(route) ? savedRoutes : [...savedRoutes, route];
                                setSavedRoutes(next);
                                localStorage.setItem("saved_routes", JSON.stringify(next));
                                const [pickupCity, rest] = selected.route.split(" → ");
                                api.post("/platform/favorites", { pickupCity, deliveryCity: rest || "" }).catch(() => undefined);
                            }}
                        >
                            Save route
                        </Button>
                        {savedRoutes.length > 0 && (
                            <div className="mt-5 border-t border-[#e5e5e5] pt-4">
                                <p className="text-xs font-medium text-[#5e5e5e]">Saved routes</p>
                                <div className="mt-2 space-y-2">
                                    {savedRoutes.slice(-3).map((route) => (
                                        <button key={route} onClick={() => setQuery(route.split(" · ")[0])} className="block w-full truncate rounded-full bg-[#efefef] px-3 py-2 text-left text-xs">
                                            {route}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>}
                </div>
            </main>
        </div>
    );
}

export default Marketplace;
