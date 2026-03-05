"use client"

import { useState, useMemo } from "react"
import {
    Search, Plus, Trash2, Utensils, Flame, Zap,
    Loader2, Apple, Coffee, Sun, Moon, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ── API config ────────────────────────────────────────────────────────────────
const API_KEY = "rW3jvQGIzLWXHlS1PTNLkrZvHvGrXm0mMPiaMhfc"

// CalorieNinjas free tier returns a string for calories on restricted items:
// e.g. "Only available for premium subscribers."
// These helpers make every numeric field safe to use regardless.
const parseNum = (val) => { const n = parseFloat(val); return isNaN(n) ? 0 : n }
const fmtNum = (val, dec = 1) => parseNum(val).toFixed(dec)

// ── Constants ─────────────────────────────────────────────────────────────────
const MEAL_TYPES = [
    { key: "breakfast", label: "Breakfast", icon: <Coffee size={14} /> },
    { key: "lunch", label: "Lunch", icon: <Sun size={14} /> },
    { key: "dinner", label: "Dinner", icon: <Moon size={14} /> },
    { key: "snacks", label: "Snacks", icon: <Apple size={14} /> },
]

const DAILY_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 65 }

const C = {
    calories: "#f97316",
    protein: "#3b82f6",
    carbs: "#10b981",
    fat: "#8b5cf6",
}

// ── Scoped styles ─────────────────────────────────────────────────────────────
const ScopedStyles = () => (
    <style>{`
    @keyframes n-pop { from { opacity:0; transform:translateY(4px); } }
    .n-pop { animation: n-pop .18s ease forwards; }
    .n-row { transition: background .12s; }
    .n-row:hover { background: hsl(var(--muted)/0.5); }
    .n-del { opacity:0; transition:opacity .12s; color:hsl(var(--muted-foreground)); border:none; background:none; cursor:pointer; display:flex; align-items:center; padding:.2rem; border-radius:.35rem; }
    .n-del:hover { color:#ef4444; }
    .n-row:hover .n-del { opacity:1; }
    .n-result-row { display:flex; align-items:center; gap:.75rem; padding:.6rem .75rem; border-radius:.6rem; cursor:pointer; transition:background .12s; }
    .n-result-row:hover { background:hsl(var(--muted)/0.6); }
  `}</style>
)

// ── Macro pill ────────────────────────────────────────────────────────────────
const MacroPill = ({ label, rawValue, unit = "g", color }) => {
    const display = parseNum(rawValue).toFixed(1)
    return (
        <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl" style={{ background: `${color}12` }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="text-sm font-black" style={{ color }}>
                {display}
                <span className="text-[10px] font-semibold ml-0.5">{unit}</span>
            </span>
        </div>
    )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
const MacroBar = ({ label, consumed, goal, color }) => {
    const p = Math.min(Math.round((consumed / goal) * 100), 100)
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-muted-foreground">{label}</span>
                <span className="font-bold" style={{ color }}>
                    {consumed.toFixed(1)}<span className="text-muted-foreground font-normal"> / {goal}g</span>
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p}%`, background: color }} />
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NutritionPage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [activeMeal, setActiveMeal] = useState("breakfast")
    const [selectedFood, setSelectedFood] = useState(null)
    const [quantity, setQuantity] = useState("100")
    const [logs, setLogs] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] })

    // ── Search ────────────────────────────────────────────────────────────────
    const searchFood = async () => {
        if (!query.trim()) return
        setLoading(true); setError(""); setResults([])
        try {
            const res = await fetch(
                `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
                { headers: { "X-Api-Key": API_KEY } }
            )
            if (!res.ok) throw new Error("API error")
            const data = await res.json()
            setResults(Array.isArray(data) ? data : [])
            if (!Array.isArray(data) || !data.length) setError("No results found. Try a different food name.")
        } catch (err) {
            setError("Failed to fetch. Please check your connection.")
        } finally {
            setLoading(false)
        }
    }

    // ── Add to log ────────────────────────────────────────────────────────────
    const confirmAdd = () => {
        if (!selectedFood) return
        const scale = parseFloat(quantity) / (parseNum(selectedFood.serving_size_g) || 100)
        const entry = {
            id: Date.now(),
            name: selectedFood.name,
            quantity: parseFloat(quantity),
            serving_size: parseNum(selectedFood.serving_size_g),
            // calories may be a premium string — store raw + parsed separately
            caloriesRaw: selectedFood.calories,
            calories: parseNum(selectedFood.calories) * scale,
            protein: parseNum(selectedFood.protein_g) * scale,
            carbs: parseNum(selectedFood.carbohydrates_total_g) * scale,
            fat: parseNum(selectedFood.fat_total_g) * scale,
            fiber: parseNum(selectedFood.fiber_g) * scale,
            sugar: parseNum(selectedFood.sugar_g) * scale,
            sodium: parseNum(selectedFood.sodium_mg) * scale,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setLogs(prev => ({ ...prev, [activeMeal]: [...prev[activeMeal], entry] }))
        setSelectedFood(null); setQuantity("100")
    }

    const removeEntry = (meal, id) =>
        setLogs(prev => ({ ...prev, [meal]: prev[meal].filter(e => e.id !== id) }))

    // ── Aggregates ────────────────────────────────────────────────────────────
    const allEntries = Object.values(logs).flat()
    const totals = useMemo(() => ({
        calories: allEntries.reduce((s, e) => s + e.calories, 0),
        protein: allEntries.reduce((s, e) => s + e.protein, 0),
        carbs: allEntries.reduce((s, e) => s + e.carbs, 0),
        fat: allEntries.reduce((s, e) => s + e.fat, 0),
    }), [allEntries])

    const calLeft = Math.max(0, DAILY_GOALS.calories - totals.calories)

    const mealTotals = (meal) => {
        const e = logs[meal]
        return {
            calories: e.reduce((s, x) => s + x.calories, 0),
            protein: e.reduce((s, x) => s + x.protein, 0),
            carbs: e.reduce((s, x) => s + x.carbs, 0),
            fat: e.reduce((s, x) => s + x.fat, 0),
        }
    }

    return (
        <>
            <ScopedStyles />

            {/* ── Confirm-add dialog ── */}
            <Dialog open={!!selectedFood} onOpenChange={(o) => !o && setSelectedFood(null)}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle className="capitalize">{selectedFood?.name}</DialogTitle>
                    </DialogHeader>

                    {selectedFood && (
                        <div className="space-y-4 pt-1">
                            {/* Macro grid */}
                            <div className="grid grid-cols-4 gap-2">
                                <MacroPill label="Cal" rawValue={selectedFood.calories} unit="kcal" color={C.calories} />
                                <MacroPill label="Protein" rawValue={selectedFood.protein_g} color={C.protein} />
                                <MacroPill label="Carbs" rawValue={selectedFood.carbohydrates_total_g} color={C.carbs} />
                                <MacroPill label="Fat" rawValue={selectedFood.fat_total_g} color={C.fat} />
                            </div>

                            {/* Extra detail row */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                {[
                                    { label: "Fiber", val: selectedFood.fiber_g, unit: "g" },
                                    { label: "Sugar", val: selectedFood.sugar_g, unit: "g" },
                                    { label: "Sodium", val: selectedFood.sodium_mg, unit: "mg" },
                                ].map(({ label, val, unit }) => (
                                    <div key={label} className="bg-muted/50 border rounded-lg p-2 text-center">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">{label}</p>
                                        <p className="font-bold">{fmtNum(val)}<span className="text-muted-foreground text-[10px] ml-0.5">{unit}</span></p>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                                Per {parseNum(selectedFood.serving_size_g) || 100}g serving. Adjust quantity below.
                            </p>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quantity (g)</label>
                                <Input type="number" min="1" value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Add to</label>
                                <Select value={activeMeal} onValueChange={setActiveMeal}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {MEAL_TYPES.map(m => (
                                            <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedFood(null)}>Cancel</Button>
                        <Button onClick={confirmAdd} className="gap-1.5"><Plus size={14} /> Add Food</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Page ── */}
            <div className="bg-background p-6 space-y-6">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Utensils size={14} />
                        <span className="text-xs font-semibold uppercase tracking-widest">Nutrition</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Daily Nutrition Log</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Search foods and track your daily macros. Powered by CalorieNinjas.
                    </p>
                </div>

                <Separator />


                <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

                    {/* ── Left ── */}
                    <div className="space-y-5">

                        {/* Search card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Search size={15} /> Search Food
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 h-9"
                                            placeholder="e.g. grilled chicken, 2 eggs, banana…"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && searchFood()}
                                        />
                                    </div>
                                    <Button onClick={searchFood} disabled={loading} className="h-9 gap-1.5 shrink-0">
                                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                        Search
                                    </Button>
                                </div>

                                {error && <p className="text-xs text-destructive">{error}</p>}

                                {results.length > 0 && (
                                    <div className="rounded-xl border overflow-hidden n-pop">
                                        <div className="px-3 py-2 bg-muted/40 border-b">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                {results.length} result{results.length !== 1 ? "s" : ""} — click to add
                                            </p>
                                        </div>
                                        <div className="divide-y max-h-72 overflow-y-auto">
                                            {results.map((item, i) => (
                                                <div key={i} className="n-result-row" onClick={() => setSelectedFood(item)}>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold capitalize truncate">{item.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            per {parseNum(item.serving_size_g) || 100}g
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">

                                                        <MacroPill label="Cal" rawValue={item.calories} unit="kcal" color={C.calories} />

                                                        <MacroPill label="P" rawValue={item.protein_g} color={C.protein} />
                                                        <MacroPill label="C" rawValue={item.carbohydrates_total_g} color={C.carbs} />
                                                        <MacroPill label="F" rawValue={item.fat_total_g} color={C.fat} />
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0">
                                                        <Plus size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Meal tabs */}
                        <Card>
                            <CardHeader className="pb-0">
                                <Tabs value={activeMeal} onValueChange={setActiveMeal}>
                                    <TabsList className="w-full">
                                        {MEAL_TYPES.map(m => (
                                            <TabsTrigger key={m.key} value={m.key} className="flex-1 gap-1.5 text-xs">
                                                {m.icon} {m.label}
                                                {logs[m.key].length > 0 && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                                                        {logs[m.key].length}
                                                    </Badge>
                                                )}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </CardHeader>

                            <CardContent className="pt-4">
                                {(() => {
                                    const entries = logs[activeMeal]
                                    const mt = mealTotals(activeMeal)
                                    if (entries.length === 0) return (
                                        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                                            <Utensils size={26} className="opacity-25" />
                                            <p className="text-sm font-medium">
                                                No food logged for {MEAL_TYPES.find(m => m.key === activeMeal)?.label}
                                            </p>
                                            <p className="text-xs">Search and add foods above</p>
                                        </div>
                                    )
                                    return (
                                        <div className="space-y-3">
                                            {/* Meal macro summary */}
                                            <div className="flex items-center gap-2 flex-wrap pb-3 border-b">
                                                {[
                                                    { l: "Calories", v: mt.calories.toFixed(0), u: "kcal", c: C.calories },
                                                    { l: "Protein", v: mt.protein.toFixed(1), u: "g", c: C.protein },
                                                    { l: "Carbs", v: mt.carbs.toFixed(1), u: "g", c: C.carbs },
                                                    { l: "Fat", v: mt.fat.toFixed(1), u: "g", c: C.fat },
                                                ].map(({ l, v, u, c }) => (
                                                    <div key={l} className="flex flex-col items-center px-3 py-1.5 rounded-xl border"
                                                        style={{ background: `${c}08` }}>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{l}</span>
                                                        <span className="text-sm font-black" style={{ color: c }}>
                                                            {v}<span className="text-[10px] ml-0.5">{u}</span>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Food rows */}
                                            <div className="divide-y rounded-xl border overflow-hidden">
                                                {entries.map((entry) => (
                                                    <div key={entry.id} className="n-row flex items-center gap-3 px-3 py-2.5">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold capitalize truncate">{entry.name}</p>
                                                            <p className="text-[11px] text-muted-foreground">{entry.quantity}g · {entry.time}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">

                                                            <span className="text-xs font-bold" style={{ color: C.calories }}>
                                                                {entry.calories.toFixed(0)} kcal
                                                            </span>

                                                            <span className="text-[10px] text-muted-foreground">P:{entry.protein.toFixed(1)}g</span>
                                                            <span className="text-[10px] text-muted-foreground">C:{entry.carbs.toFixed(1)}g</span>
                                                            <span className="text-[10px] text-muted-foreground">F:{entry.fat.toFixed(1)}g</span>
                                                        </div>
                                                        <button className="n-del" onClick={() => removeEntry(activeMeal, entry.id)}>
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })()}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Right: summary sidebar ── */}
                    <div className="space-y-4">

                        {/* Calorie ring */}
                        <Card>
                            <CardContent className="pt-5 flex flex-col items-center gap-4">
                                {(() => {
                                    const p = Math.min((totals.calories / DAILY_GOALS.calories) * 100, 100)
                                    const r = 52
                                    const circ = 2 * Math.PI * r
                                    const offset = circ - (circ * p) / 100
                                    return (
                                        <div className="relative w-32 h-32">
                                            <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
                                                <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
                                                <circle cx="64" cy="64" r={r} fill="none" stroke={C.calories}
                                                    strokeWidth="9" strokeDasharray={circ} strokeDashoffset={offset}
                                                    strokeLinecap="round" style={{ transition: "stroke-dashoffset .8s ease" }} />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <p className="text-2xl font-black leading-none">{totals.calories.toFixed(0)}</p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">kcal</p>

                                            </div>
                                        </div>
                                    )
                                })()}

                                <div className="grid grid-cols-3 gap-2 w-full text-center">
                                    {[
                                        { l: "Goal", v: DAILY_GOALS.calories, c: C.calories },
                                        { l: "Eaten", v: totals.calories.toFixed(0), c: C.calories },
                                        { l: "Left", v: calLeft.toFixed(0), c: undefined },
                                    ].map(({ l, v, c }) => (
                                        <div key={l} className="bg-muted/50 border rounded-xl p-2">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">{l}</p>
                                            <p className="text-sm font-black" style={{ color: c }}>{v}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Macro bars */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2"><Zap size={14} /> Macros</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <MacroBar label="Protein" consumed={totals.protein} goal={DAILY_GOALS.protein} color={C.protein} />
                                <MacroBar label="Carbs" consumed={totals.carbs} goal={DAILY_GOALS.carbs} color={C.carbs} />
                                <MacroBar label="Fat" consumed={totals.fat} goal={DAILY_GOALS.fat} color={C.fat} />
                            </CardContent>
                        </Card>

                        {/* Meal breakdown */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2"><Flame size={14} /> Meal Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {MEAL_TYPES.map(m => {
                                    const mt = mealTotals(m.key)
                                    const barW = totals.calories > 0
                                        ? Math.min((mt.calories / totals.calories) * 100, 100)
                                        : 0
                                    return (
                                        <div key={m.key}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                                                    {m.icon} {m.label}
                                                </span>
                                                <span className="font-bold" style={{ color: C.calories }}>
                                                    {mt.calories.toFixed(0)} kcal
                                                </span>
                                            </div>
                                            <div className="h-1 rounded-full overflow-hidden bg-muted">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${barW}%`, background: C.calories }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <p className="text-[11px] text-muted-foreground text-center">
                            Powered by{" "}
                            <a href="https://calorieninjas.com" target="_blank" rel="noreferrer"
                                className="underline underline-offset-2">CalorieNinjas</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}