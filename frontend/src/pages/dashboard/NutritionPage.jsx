"use client"

import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    fetchNutrition,
    addFoodToMeal,
    deleteFoodFromMeal,
    clearMeal,
    selectNutrition,
    selectNutritionLoading,
    selectNutritionError,
    selectTodayTotals,
    clearError,
} from "../../redux/slice/nutritionSlice"
import {
    Search, Plus, Trash2, Utensils, Flame, Zap,
    Loader2, Apple, Coffee, Sun, Moon, Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import api from "../../api/api"
import Cookies from 'js-cookie';

const parseNum = (val, d = 1) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : +n.toFixed(d)
}
const fmt = (val, d = 1) => parseNum(val, d).toFixed(d)
async function fetchNutritionFromAI(query) {
    const token = Cookies.get('auth_token');
    if (!token) {
        throw new Error("No auth token found");
    }
    const { data } = await api.post("/nutrition/ai-search", { query }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data.items ?? []
}

const MEAL_TYPES = [
    { key: "breakfast", label: "Breakfast", icon: <Coffee size={14} /> },
    { key: "lunch", label: "Lunch", icon: <Sun size={14} /> },
    { key: "dinner", label: "Dinner", icon: <Moon size={14} /> },
    { key: "snacks", label: "Snacks", icon: <Apple size={14} /> },
]

const DAILY_GOALS = { calories: 2000, protein: 150, carbs: 250, fats: 65 }

const C = {
    calories: "#f97316",
    protein: "#3b82f6",
    carbs: "#10b981",
    fats: "#8b5cf6",
}

const ScopedStyles = () => (
    <style>{`
    @keyframes n-pop { from { opacity:0; transform:translateY(4px); } }
    .n-pop  { animation: n-pop .18s ease forwards; }
    .n-row  { transition: background .12s; }
    .n-row:hover { background: hsl(var(--muted)/0.5); }
    .n-del  { opacity:0; transition:opacity .12s; color:hsl(var(--muted-foreground)); border:none; background:none; cursor:pointer; display:flex; align-items:center; padding:.2rem; border-radius:.35rem; }
    .n-del:hover { color:#ef4444; }
    .n-row:hover .n-del { opacity:1; }
    .n-result-row { display:flex; align-items:center; gap:.75rem; padding:.6rem .75rem; border-radius:.6rem; cursor:pointer; transition:background .12s; }
    .n-result-row:hover { background:hsl(var(--muted)/0.6); }
  `}</style>
)

const MacroPill = ({ label, value, unit = "g", color }) => (
    <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl"
        style={{ background: `${color}12` }}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-sm font-black" style={{ color }}>
            {fmt(value)}<span className="text-[10px] font-semibold ml-0.5">{unit}</span>
        </span>
    </div>
)

const MacroBar = ({ label, consumed, goal, color }) => {
    const p = Math.min(Math.round((consumed / goal) * 100), 100)
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-muted-foreground">{label}</span>
                <span className="font-bold" style={{ color }}>
                    {fmt(consumed)}<span className="text-muted-foreground font-normal"> / {goal}g</span>
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p}%`, background: color }} />
            </div>
        </div>
    )
}

export default function NutritionPage() {
    const dispatch = useDispatch()
    const nutrition = useSelector(selectNutrition)
    const totals = useSelector(selectTodayTotals)
    const isLoading = useSelector(selectNutritionLoading)
    const reduxError = useSelector(selectNutritionError)

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [searchError, setSearchError] = useState("")
    const [activeMeal, setActiveMeal] = useState("breakfast")
    const [selectedFood, setSelectedFood] = useState(null)
    const [quantity, setQuantity] = useState("100")

    useEffect(() => { dispatch(fetchNutrition()) }, [dispatch])

    useEffect(() => {
        if (reduxError) { toast.error(reduxError); dispatch(clearError()) }
    }, [reduxError, dispatch])

    const searchFood = async () => {
        if (!query.trim()) return
        setSearching(true); setSearchError(""); setResults([])
        try {
            const items = await fetchNutritionFromAI(query)
            setResults(items)
            if (!items.length) setSearchError("No results. Try rephrasing your query.")
        } catch (err) {
            console.error(err)
            setSearchError("AI lookup failed. Please try again in a moment.")
        } finally {
            setSearching(false)
        }
    }

    const scaledPreview = useMemo(() => {
        if (!selectedFood || !parseFloat(quantity)) return null
        const scale = parseFloat(quantity) / selectedFood.serving_size_g
        return {
            calories: +(selectedFood.calories * scale).toFixed(1),
            protein: +(selectedFood.protein_g * scale).toFixed(1),
            carbs: +(selectedFood.carbohydrates_total_g * scale).toFixed(1),
            fats: +(selectedFood.fat_total_g * scale).toFixed(1),
        }
    }, [selectedFood, quantity])

    const confirmAdd = async () => {
        if (!selectedFood || !scaledPreview) return
        const foodData = {
            name: selectedFood.name,
            calories: scaledPreview.calories,
            protein: scaledPreview.protein,
            carbs: scaledPreview.carbs,
            fats: scaledPreview.fats,
        }
        const result = await dispatch(addFoodToMeal({ meal: activeMeal, foodData }))
        if (addFoodToMeal.fulfilled.match(result)) {
            toast.success(`${selectedFood.name} added to ${activeMeal}`)
        }
        setSelectedFood(null); setQuantity("100")
    }

    const handleDelete = async (meal, foodId) => {
        const r = await dispatch(deleteFoodFromMeal({ meal, foodId }))
        if (deleteFoodFromMeal.fulfilled.match(r)) toast.info("Item removed")
    }

    const handleClearMeal = async (meal) => {
        if (!window.confirm(`Clear all items from ${meal}?`)) return
        const r = await dispatch(clearMeal(meal))
        if (clearMeal.fulfilled.match(r)) toast.info(`${meal} cleared`)
    }

    const mealTotals = (meal) => {
        const items = nutrition[meal] || []
        return {
            calories: items.reduce((s, i) => s + (i.calories || 0), 0),
            protein: items.reduce((s, i) => s + (i.protein || 0), 0),
            carbs: items.reduce((s, i) => s + (i.carbs || 0), 0),
            fats: items.reduce((s, i) => s + (i.fats || 0), 0),
        }
    }

    const calLeft = Math.max(0, DAILY_GOALS.calories - totals.calories)

    return (
        <>
            <ScopedStyles />

            <Dialog open={!!selectedFood} onOpenChange={(o) => !o && setSelectedFood(null)}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedFood?.name}
                            <Badge variant="secondary" className="gap-1 text-[10px] font-semibold">
                                <Bot size={9} /> AI
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedFood && (
                        <div className="space-y-4 pt-1">

                            <div>
                                <p className="text-[11px] text-muted-foreground mb-2">
                                    Per {selectedFood.serving_size_g}g serving:
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    <MacroPill label="Cal" value={selectedFood.calories} unit="kcal" color={C.calories} />
                                    <MacroPill label="Protein" value={selectedFood.protein_g} color={C.protein} />
                                    <MacroPill label="Carbs" value={selectedFood.carbohydrates_total_g} color={C.carbs} />
                                    <MacroPill label="Fat" value={selectedFood.fat_total_g} color={C.fats} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "Fiber", val: selectedFood.fiber_g, unit: "g" },
                                    { label: "Sugar", val: selectedFood.sugar_g, unit: "g" },
                                    { label: "Sodium", val: selectedFood.sodium_mg, unit: "mg" },
                                ].map(({ label, val, unit }) => (
                                    <div key={label} className="bg-muted/50 border rounded-lg p-2 text-center">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">{label}</p>
                                        <p className="text-xs font-bold">
                                            {fmt(val)}<span className="text-muted-foreground text-[10px] ml-0.5">{unit}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Quantity (g)
                                </label>
                                <Input type="number" min="1" value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)} />
                            </div>

                            {scaledPreview && (
                                <div className="rounded-xl bg-muted/40 border px-3 py-2.5">
                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                                        For {quantity}g:
                                    </p>
                                    <div className="flex gap-3 flex-wrap">
                                        <span className="text-xs font-bold" style={{ color: C.calories }}>
                                            {scaledPreview.calories} kcal
                                        </span>
                                        <span className="text-xs text-muted-foreground">P: <b className="text-foreground">{scaledPreview.protein}g</b></span>
                                        <span className="text-xs text-muted-foreground">C: <b className="text-foreground">{scaledPreview.carbs}g</b></span>
                                        <span className="text-xs text-muted-foreground">F: <b className="text-foreground">{scaledPreview.fats}g</b></span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Add to</label>
                                <Select value={activeMeal} onValueChange={setActiveMeal}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {MEAL_TYPES.map(m => <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedFood(null)}>Cancel</Button>
                        <Button onClick={confirmAdd} disabled={isLoading} className="gap-1.5">
                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                            Add Food
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="bg-background p-6 space-y-6">

                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Utensils size={14} />
                        <span className="text-xs font-semibold uppercase tracking-widest">Nutrition</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Daily Nutrition Log</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Search any food in natural language. Nutrition data powered by Claude AI.
                    </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

                    <div className="space-y-5">

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Bot size={15} className="text-primary" /> AI Food Search
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 h-9"
                                            placeholder='e.g. "2 scrambled eggs", "bowl of biryani", "protein shake"'
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && searchFood()}
                                        />
                                    </div>
                                    <Button onClick={searchFood} disabled={searching} className="h-9 gap-1.5 shrink-0">
                                        {searching
                                            ? <><Loader2 size={14} className="animate-spin" /> Asking AI…</>
                                            : <><Search size={14} /> Search</>
                                        }
                                    </Button>
                                </div>

                                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Bot size={11} className="text-primary" />
                                    Supports natural language — try "large chicken breast" or "100g of oats with milk"
                                </p>

                                {searchError && <p className="text-xs text-destructive">{searchError}</p>}

                                {results.length > 0 && (
                                    <div className="rounded-xl border overflow-hidden n-pop">
                                        <div className="px-3 py-2 bg-muted/40 border-b flex items-center justify-between">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                {results.length} result{results.length !== 1 ? "s" : ""} — click to add
                                            </p>
                                            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setResults([])}>
                                                Clear
                                            </button>
                                        </div>
                                        <div className="divide-y max-h-72 overflow-y-auto">
                                            {results.map((item, i) => (
                                                <div key={i} className="n-result-row" onClick={() => setSelectedFood(item)}>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{item.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            per {item.serving_size_g}g
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                                                        <MacroPill label="Cal" value={item.calories} unit="kcal" color={C.calories} />
                                                        <MacroPill label="P" value={item.protein_g} color={C.protein} />
                                                        <MacroPill label="C" value={item.carbohydrates_total_g} color={C.carbs} />
                                                        <MacroPill label="F" value={item.fat_total_g} color={C.fats} />
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

                        <Card>
                            <CardHeader className="pb-0">
                                <Tabs value={activeMeal} onValueChange={setActiveMeal}>
                                    <TabsList className="w-full">
                                        {MEAL_TYPES.map(m => (
                                            <TabsTrigger key={m.key} value={m.key} className="flex-1 gap-1.5 text-xs">
                                                {m.icon} {m.label}
                                                {(nutrition[m.key]?.length > 0) && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                                                        {nutrition[m.key].length}
                                                    </Badge>
                                                )}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </CardHeader>

                            <CardContent className="pt-4">
                                {(() => {
                                    const entries = nutrition[activeMeal] || []
                                    const mt = mealTotals(activeMeal)

                                    if (isLoading && entries.length === 0) return (
                                        <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span className="text-sm">Loading…</span>
                                        </div>
                                    )

                                    if (entries.length === 0) return (
                                        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                                            <Utensils size={26} className="opacity-25" />
                                            <p className="text-sm font-medium">
                                                No food logged for {MEAL_TYPES.find(m => m.key === activeMeal)?.label}
                                            </p>
                                            <p className="text-xs">Use AI search above to find and add foods</p>
                                        </div>
                                    )

                                    return (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 flex-wrap pb-3 border-b">
                                                {[
                                                    { l: "Calories", v: mt.calories.toFixed(0), u: "kcal", c: C.calories },
                                                    { l: "Protein", v: mt.protein.toFixed(1), u: "g", c: C.protein },
                                                    { l: "Carbs", v: mt.carbs.toFixed(1), u: "g", c: C.carbs },
                                                    { l: "Fat", v: mt.fats.toFixed(1), u: "g", c: C.fats },
                                                ].map(({ l, v, u, c }) => (
                                                    <div key={l} className="flex flex-col items-center px-3 py-1.5 rounded-xl border"
                                                        style={{ background: `${c}08` }}>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{l}</span>
                                                        <span className="text-sm font-black" style={{ color: c }}>
                                                            {v}<span className="text-[10px] ml-0.5">{u}</span>
                                                        </span>
                                                    </div>
                                                ))}
                                                <Button variant="ghost" size="sm"
                                                    className="ml-auto text-xs text-muted-foreground hover:text-destructive gap-1.5"
                                                    onClick={() => handleClearMeal(activeMeal)}>
                                                    <Trash2 size={12} /> Clear all
                                                </Button>
                                            </div>

                                            <div className="divide-y rounded-xl border overflow-hidden">
                                                {entries.map((entry) => (
                                                    <div key={entry._id} className="n-row flex items-center gap-3 px-3 py-2.5">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold capitalize truncate">{entry.name}</p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                P:{fmt(entry.protein)}g · C:{fmt(entry.carbs)}g · F:{fmt(entry.fats)}g
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-bold shrink-0" style={{ color: C.calories }}>
                                                            {fmt(entry.calories, 0)} kcal
                                                        </span>
                                                        <button className="n-del" disabled={isLoading}
                                                            onClick={() => handleDelete(activeMeal, entry._id)}>
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

                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-5 flex flex-col items-center gap-4">
                                {(() => {
                                    const p = Math.min((totals.calories / DAILY_GOALS.calories) * 100, 100)
                                    const r = 52, circ = 2 * Math.PI * r
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
                                                <p className="text-2xl font-black leading-none">{fmt(totals.calories, 0)}</p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">kcal</p>
                                            </div>
                                        </div>
                                    )
                                })()}

                                <div className="grid grid-cols-3 gap-2 w-full text-center">
                                    {[
                                        { l: "Goal", v: DAILY_GOALS.calories, c: C.calories },
                                        { l: "Eaten", v: fmt(totals.calories, 0), c: C.calories },
                                        { l: "Left", v: fmt(calLeft, 0), c: undefined },
                                    ].map(({ l, v, c }) => (
                                        <div key={l} className="bg-muted/50 border rounded-xl p-2">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">{l}</p>
                                            <p className="text-sm font-black" style={{ color: c }}>{v}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2"><Zap size={14} /> Macros</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <MacroBar label="Protein" consumed={totals.protein} goal={DAILY_GOALS.protein} color={C.protein} />
                                <MacroBar label="Carbs" consumed={totals.carbs} goal={DAILY_GOALS.carbs} color={C.carbs} />
                                <MacroBar label="Fat" consumed={totals.fats} goal={DAILY_GOALS.fats} color={C.fats} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2"><Flame size={14} /> Meal Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {MEAL_TYPES.map(m => {
                                    const mt = mealTotals(m.key)
                                    const barW = totals.calories > 0
                                        ? Math.min((mt.calories / totals.calories) * 100, 100) : 0
                                    return (
                                        <div key={m.key}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                                                    {m.icon} {m.label}
                                                </span>
                                                <span className="font-bold" style={{ color: C.calories }}>
                                                    {fmt(mt.calories, 0)} kcal
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
                    </div>
                </div>
            </div>
        </>
    )
}