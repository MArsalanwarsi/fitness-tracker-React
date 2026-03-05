"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Search, ChefHat, ExternalLink, Loader2, BookOpen,
    Clock, Users, Tag, X, Filter, Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// ── TheMealDB base URL ────────────────────────────────────────────────────────
const BASE = "https://www.themealdb.com/api/json/v1/1"

// ── Scoped styles ─────────────────────────────────────────────────────────────
const ScopedStyles = () => (
    <style>{`
    @keyframes r-pop { from { opacity:0; transform:translateY(6px); } }
    .r-pop { animation: r-pop .2s ease forwards; }
    .r-card { transition: transform .2s, box-shadow .2s; cursor: pointer; }
    .r-card:hover { transform: translateY(-3px); }
    .r-card img { transition: transform .3s ease; }
    .r-card:hover img { transform: scale(1.04); }
    .r-img-wrap { overflow: hidden; border-radius: .75rem .75rem 0 0; }
  `}</style>
)

// ── Recipe card skeleton ──────────────────────────────────────────────────────
const RecipeSkeleton = () => (
    <div className="rounded-xl border bg-card overflow-hidden">
        <Skeleton className="h-44 w-full rounded-none" />
        <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    </div>
)

// ── Ingredient list from meal object ──────────────────────────────────────────
const getIngredients = (meal) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]
        const measure = meal[`strMeasure${i}`]
        if (ingredient && ingredient.trim()) {
            ingredients.push({ ingredient: ingredient.trim(), measure: measure?.trim() || "" })
        }
    }
    return ingredients
}

// ── Recipe detail modal ───────────────────────────────────────────────────────
const RecipeModal = ({ meal, onClose }) => {
    if (!meal) return null
    const ingredients = getIngredients(meal)
    const ytId = meal.strYoutube?.split("v=")[1]

    return (
        <Dialog open={!!meal} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                <ScrollArea className="max-h-[85vh]">
                    {/* Hero image */}
                    <div className="relative h-56 w-full overflow-hidden">
                        <img src={meal.strMealThumb} alt={meal.strMeal}
                            className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-xl font-black text-white leading-tight">{meal.strMeal}</h2>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className="text-[10px] bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    {meal.strCategory}
                                </Badge>
                                <Badge className="text-[10px] bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    {meal.strArea}
                                </Badge>
                                {meal.strTags?.split(",").slice(0, 3).map(tag => (
                                    <Badge key={tag} className="text-[10px] bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                        {tag.trim()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">

                        {/* Action links */}
                        <div className="flex gap-2 flex-wrap">
                            {meal.strSource && (
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs" asChild>
                                    <a href={meal.strSource} target="_blank" rel="noreferrer">
                                        <ExternalLink size={12} /> View Source
                                    </a>
                                </Button>
                            )}
                            {meal.strYoutube && (
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-500 border-red-200 hover:bg-red-50" asChild>
                                    <a href={meal.strYoutube} target="_blank" rel="noreferrer">
                                        <Youtube size={12} /> Watch on YouTube
                                    </a>
                                </Button>
                            )}
                        </div>

                        <Separator />

                        {/* Ingredients */}
                        <div>
                            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                                <Tag size={14} className="text-muted-foreground" /> Ingredients
                                <Badge variant="secondary" className="text-[10px]">{ingredients.length}</Badge>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {ingredients.map(({ ingredient, measure }, i) => (
                                    <div key={i}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border text-xs">
                                        <img
                                            src={`https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`}
                                            alt={ingredient}
                                            className="w-8 h-8 object-contain rounded"
                                            onError={(e) => { e.target.style.display = "none" }}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate capitalize">{ingredient}</p>
                                            {measure && <p className="text-muted-foreground truncate">{measure}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Instructions */}
                        <div>
                            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                                <BookOpen size={14} className="text-muted-foreground" /> Instructions
                            </h3>
                            <div className="space-y-3">
                                {meal.strInstructions
                                    ?.split(/\r\n|\n/)
                                    .filter(s => s.trim())
                                    .map((step, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-[10px] font-black text-primary">{i + 1}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.trim()}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RecipesPage() {
    const [query, setQuery] = useState("")
    const [recipes, setRecipes] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState("all")
    const [selectedMeal, setSelectedMeal] = useState(null)
    const [detailMeal, setDetailMeal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(false)

    // ── Load categories on mount ──────────────────────────────────────────────
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BASE}/categories.php`)
                const data = await res.json()
                setCategories(data.categories || [])
            } catch { /* silent */ }
        }
        fetchCategories()
        // Load popular recipes by default (search 'a')
        fetchBySearch("chicken")
    }, [])

    // ── Search by name ────────────────────────────────────────────────────────
    const fetchBySearch = async (q = query) => {
        if (!q.trim()) return
        setLoading(true)
        setError("")
        setActiveCategory("all")
        setSearched(true)
        try {
            const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(q)}`)
            const data = await res.json()
            setRecipes(data.meals || [])
            if (!data.meals) setError(`No recipes found for "${q}".`)
        } catch {
            setError("Failed to load recipes. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // ── Filter by category ────────────────────────────────────────────────────
    const fetchByCategory = async (category) => {
        if (category === "all") { fetchBySearch("chicken"); return }
        setLoading(true)
        setError("")
        setActiveCategory(category)
        setSearched(false)
        try {
            const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`)
            const data = await res.json()
            setRecipes(data.meals || [])
            if (!data.meals) setError(`No recipes in "${category}".`)
        } catch {
            setError("Failed to load category recipes.")
        } finally {
            setLoading(false)
        }
    }

    // ── Open recipe detail ────────────────────────────────────────────────────
    const openDetail = async (meal) => {
        setSelectedMeal(meal)
        if (meal.strInstructions) { setDetailMeal(meal); return }
        // category filter returns partial data — fetch full
        setDetailLoading(true)
        try {
            const res = await fetch(`${BASE}/lookup.php?i=${meal.idMeal}`)
            const data = await res.json()
            setDetailMeal(data.meals?.[0] || null)
        } catch { setDetailMeal(meal) }
        finally { setDetailLoading(false) }
    }

    return (
        <>
            <ScopedStyles />

            <RecipeModal
                meal={detailLoading ? null : detailMeal}
                onClose={() => { setDetailMeal(null); setSelectedMeal(null) }}
            />

            <div className="bg-background p-6 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <ChefHat size={14} />
                            <span className="text-xs font-semibold uppercase tracking-widest">Nutrition</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Recipe Browser</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Explore thousands of recipes. Powered by TheMealDB.
                        </p>
                    </div>
                </div>

                <Separator />

                {/* ── Search bar ── */}
                <div className="flex gap-2 max-w-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-9"
                            placeholder="Search recipes… e.g. pasta, chicken, sushi"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchBySearch()}
                        />
                    </div>
                    <Button onClick={() => fetchBySearch()} disabled={loading} className="h-9 gap-1.5 shrink-0">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                        Search
                    </Button>
                </div>

                {/* ── Category pills ── */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
                            <Filter size={12} className="inline mr-1" />Category:
                        </span>
                        <button
                            onClick={() => fetchByCategory("all")}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${activeCategory === "all"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-transparent border-border text-muted-foreground hover:border-primary hover:text-foreground"
                                }`}>
                            All
                        </button>
                        {categories.slice(0, 14).map(cat => (
                            <button
                                key={cat.idCategory}
                                onClick={() => fetchByCategory(cat.strCategory)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${activeCategory === cat.strCategory
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-transparent border-border text-muted-foreground hover:border-primary hover:text-foreground"
                                    }`}>
                                {cat.strCategory}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Result count ── */}
                {!loading && recipes.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found
                        {activeCategory !== "all" ? ` in ${activeCategory}` : searched ? ` for "${query}"` : ""}
                    </p>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* ── Recipe grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <RecipeSkeleton key={i} />)
                        : recipes.map(meal => (
                            <div key={meal.idMeal} className="r-card r-pop rounded-xl border bg-card overflow-hidden"
                                onClick={() => openDetail(meal)}>
                                <div className="r-img-wrap h-44">
                                    <img
                                        src={`${meal.strMealThumb}/preview`}
                                        alt={meal.strMeal}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3 space-y-1.5">
                                    <p className="text-sm font-bold leading-tight line-clamp-2">{meal.strMeal}</p>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {meal.strCategory && (
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{meal.strCategory}</Badge>
                                        )}
                                        {meal.strArea && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{meal.strArea}</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Loading spinner for detail */}
                {detailLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="animate-spin text-primary" />
                            <p className="text-sm font-semibold text-muted-foreground">Loading recipe…</p>
                        </div>
                    </div>
                )}

                <p className="text-[11px] text-muted-foreground text-center pt-2">
                    Recipes powered by{" "}
                    <a href="https://www.themealdb.com" target="_blank" rel="noreferrer"
                        className="underline underline-offset-2">TheMealDB</a>
                </p>
            </div>
        </>
    )
}