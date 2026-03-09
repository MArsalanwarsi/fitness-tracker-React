"use client"

import { useEffect, useState } from "react"
import { X, Plus, Image as ImageIcon, Dumbbell, Tag, AlignLeft, Settings2, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addExcersise, fetchEquipment } from "../../redux/slice/excersiseSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import {
    Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput,
    ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue,
} from "@/components/ui/combobox"
import { AsyncAutocomplete } from "../../components/suggestionInput"
import { toast } from "react-toastify"
import { fetchCategories } from "../../redux/slice/categorySlice"

const ScopedStyles = () => (
    <style>{`
        @keyframes ae-fade-in {
            from { opacity: 0; transform: translateY(6px); }
        }
        .ae-fade-in { animation: ae-fade-in .22s ease forwards; }

        .ae-field-card {
            background: hsl(var(--muted) / 0.4);
            border: 1px solid hsl(var(--border));
            border-radius: .875rem;
            padding: 1.25rem 1.25rem;
            transition: border-color .15s;
        }
        .ae-field-card:focus-within {
            border-color: hsl(var(--primary) / 0.5);
            background: hsl(var(--card));
        }

        .ae-preview-empty {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; gap: .75rem;
            height: 100%;
            color: hsl(var(--muted-foreground));
        }

        .ae-tag {
            display: inline-flex; align-items: center; gap: .4rem;
            padding: .3rem .75rem;
            border-radius: 999px;
            font-size: .72rem; font-weight: 700;
            letter-spacing: .04em; text-transform: uppercase;
            background: hsl(var(--primary) / 0.12);
            color: hsl(var(--primary));
            border: 1px solid hsl(var(--primary) / 0.2);
            transition: background .15s;
        }
        .ae-tag-remove {
            display: flex; align-items: center;
            cursor: pointer; opacity: .6; transition: opacity .15s;
        }
        .ae-tag-remove:hover { opacity: 1; color: hsl(var(--destructive)); }

        .ae-difficulty-btn {
            flex: 1; padding: .5rem .25rem;
            border: 1px solid hsl(var(--border));
            border-radius: .6rem;
            background: transparent;
            font-size: .75rem; font-weight: 600; cursor: pointer;
            transition: all .15s;
            color: hsl(var(--muted-foreground));
            font-family: inherit;
        }
        .ae-difficulty-btn:hover { border-color: hsl(var(--primary)); color: hsl(var(--foreground)); }
        .ae-difficulty-btn.active {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border-color: hsl(var(--primary));
        }
        .ae-difficulty-btn.beginner.active   { background: #10b981; border-color: #10b981; color: #fff; }
        .ae-difficulty-btn.intermediate.active { background: #f59e0b; border-color: #f59e0b; color: #fff; }
        .ae-difficulty-btn.advanced.active  { background: #ef4444; border-color: #ef4444; color: #fff; }
    `}</style>
)

const SectionHeading = ({ icon, title, description }) => (
    <div className="flex items-start gap-2 mb-4">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
            <h3 className="text-sm font-bold leading-none">{title}</h3>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </div>
    </div>
)

const Field = ({ label, required, children, hint }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}{required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {children}
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
)

export default function AddExercisePage() {
    const dispatch = useDispatch()
    const equipmentState = useSelector((state) => state.excersise.equipments || [])
    const excersiseState = useSelector((state) => state.excersise.excersises || [])
    const categoryState = useSelector((state) => state.category.categories || [])

    const [form, setForm] = useState({
        name: "", description: "", category: "", difficulty: "",
        equipment: "", excersiseImage: "", sets: "", reps: "", tags: [], exerciseId: "",
    })
    const [tagInput, setTagInput] = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [newEquipment, setNewEquipment] = useState({ name: "", instructions: "" })

    useEffect(() => {
        dispatch(fetchEquipment())
        dispatch(fetchCategories())
    }, [dispatch])

    const handleChange = (field, value) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleExerciseChange = async (field, value) => {
        const found = excersiseState.find(ex => ex.name === value)
        const image = found?.gifUrl || ""
        const exerciseId = found?.exerciseId || ""
        const descriptionText = found?.instructions || ""
        const descriptionString = Array.isArray(descriptionText)
            ? descriptionText.join(", ")
            : descriptionText
        setForm(prev => ({ ...prev, [field]: value, excersiseImage: image, description: descriptionString, exerciseId }))
    }

    const handleAddTag = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = tagInput.trim().toUpperCase()
            if (newTag && !form.tags.includes(newTag))
                setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove) =>
        setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.category || !form.difficulty || form.tags.length === 0
            || !form.description || !form.excersiseImage || !form.equipment
            || !form.sets || !form.reps || form.sets <= 0 || form.reps <= 0) {
            toast.error("Please fill out all required fields with valid values.")
            return
        }
        const result = await dispatch(addExcersise(form))
        if (addExcersise.fulfilled.match(result)) {
            toast.success("Exercise added successfully!")
            setForm({ name: "", description: "", category: "", difficulty: "", equipment: "", excersiseImage: "", sets: "", reps: "", tags: [], exerciseId: "" })
        } else {
            toast.error(result.payload?.error)
        }
    }

    const difficultyConfig = [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
    ]

    const formFilled = !!(form.name && form.category && form.difficulty && form.equipment)
    const progressFields = [form.name, form.category, form.difficulty, form.equipment, form.sets, form.reps, form.description, form.tags.length > 0]
    const progressPct = Math.round((progressFields.filter(Boolean).length / progressFields.length) * 100)

    return (
        <>
            <ScopedStyles />
            <div className="bg-background py-6 px-4">
                <div className="space-y-6 ae-fade-in">

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <span>Exercises</span>
                            <ChevronRight size={12} />
                            <span className="text-foreground font-semibold">Add New</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">Add Exercise</h1>
                        <p className="text-sm text-muted-foreground">
                            Configure a new exercise with full details, equipment, and media.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Form completion</span>
                            <span>{progressPct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-muted">
                            <div className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Card className="overflow-hidden">
                            <div className="overflow-hidden rounded-t-xl border-b bg-muted/40">
                                <AspectRatio ratio={16 / 6} className="flex items-center justify-center">
                                    {form.excersiseImage ? (
                                        <img
                                            src={form.excersiseImage}
                                            alt="Exercise preview"
                                            className="h-full w-full object-cover ae-fade-in"
                                        />
                                    ) : (
                                        <div className="ae-preview-empty">
                                            <div className="w-14 h-14 rounded-2xl bg-muted border flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                                            </div>
                                            <p className="text-sm font-medium">Exercise preview will appear here</p>
                                            <p className="text-xs text-muted-foreground/70">Select an exercise name to load its GIF</p>
                                        </div>
                                    )}
                                </AspectRatio>
                            </div>

                            <CardContent className="p-5 space-y-5">

                                <div>
                                    <SectionHeading
                                        icon={<Dumbbell size={14} />}
                                        title="Exercise Identity"
                                        description="Name and classify the exercise"
                                    />
                                    <div className="space-y-4">
                                        <Field label="Exercise Name" required>
                                            <AsyncAutocomplete
                                                value={form.name}
                                                onChange={(val) => handleExerciseChange("name", val)}
                                                placeholder="Search e.g. Barbell Squat…"
                                            />
                                        </Field>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Category" required>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={form.category}
                                                        onValueChange={(val) => handleChange("category", val)}>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select…" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="strength">Strength</SelectItem>
                                                            <SelectItem value="cardio">Cardio</SelectItem>
                                                            <SelectItem value="flexibility">Flexibility</SelectItem>
                                                            <SelectItem value="plyometrics">Plyometrics</SelectItem>
                                                            {categoryState.map((cat) => (
                                                                <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                                                                <Plus size={14} />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-72" align="end">
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-sm font-semibold">New Category</p>
                                                                    <p className="text-xs text-muted-foreground mt-0.5">Add a custom category</p>
                                                                </div>
                                                                <Separator />
                                                                <Input
                                                                    placeholder="e.g. Olympic Lifting"
                                                                    value={newCategory}
                                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                                />
                                                                <Button size="sm" className="w-full">Add Category</Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </Field>

                                            <Field label="Difficulty" required>
                                                <div className="flex gap-1.5">
                                                    {difficultyConfig.map(({ value, label }) => (
                                                        <button
                                                            key={value} type="button"
                                                            className={`ae-difficulty-btn ${value} ${form.difficulty === value ? "active" : ""}`}
                                                            onClick={() => handleChange("difficulty", value)}>
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </Field>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <SectionHeading
                                        icon={<Settings2 size={14} />}
                                        title="Equipment & Volume"
                                        description="Set the equipment required and training volume"
                                    />
                                    <div className="space-y-4">
                                        <Field label="Equipment" required>
                                            <div className="flex gap-2">
                                                <Combobox
                                                    items={equipmentState}
                                                    onValueChange={(val) => handleChange("equipment", val)}
                                                    defaultValue="Select Equipment">
                                                    <ComboboxTrigger
                                                        render={
                                                            <Button variant="outline" className="flex-1 justify-between font-normal text-left">
                                                                <ComboboxValue />
                                                            </Button>
                                                        }
                                                    />
                                                    <ComboboxContent>
                                                        <ComboboxInput showTrigger={false} placeholder="Search equipment…" />
                                                        <ComboboxEmpty>No equipment found.</ComboboxEmpty>
                                                        <ComboboxList>
                                                            {(item) => (
                                                                <ComboboxItem key={item.name} value={item.name}>
                                                                    {item.name}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxContent>
                                                </Combobox>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                                                            <Plus size={14} />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-72" align="end">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-semibold">New Equipment</p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Add custom equipment</p>
                                                            </div>
                                                            <Separator />
                                                            <Input
                                                                placeholder="Equipment name"
                                                                value={newEquipment.name}
                                                                onChange={(e) => setNewEquipment(p => ({ ...p, name: e.target.value }))}
                                                            />
                                                            <Textarea
                                                                placeholder="Usage instructions…"
                                                                className="h-20 resize-none"
                                                                value={newEquipment.instructions}
                                                                onChange={(e) => setNewEquipment(p => ({ ...p, instructions: e.target.value }))}
                                                            />
                                                            <Button size="sm" className="w-full">Add Equipment</Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </Field>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Sets">
                                                <div className="relative">
                                                    <Input
                                                        type="number" min="1"
                                                        placeholder="e.g. 4"
                                                        value={form.sets}
                                                        onChange={(e) => handleChange("sets", e.target.value)}
                                                        className="pr-12"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                                                        sets
                                                    </span>
                                                </div>
                                            </Field>
                                            <Field label="Reps">
                                                <div className="relative">
                                                    <Input
                                                        type="number" min="1"
                                                        placeholder="e.g. 10"
                                                        value={form.reps}
                                                        onChange={(e) => handleChange("reps", e.target.value)}
                                                        className="pr-12"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                                                        reps
                                                    </span>
                                                </div>
                                            </Field>
                                        </div>
                                    </div>
                                </div>

                                <Separator />
                                <div>
                                    <SectionHeading
                                        icon={<AlignLeft size={14} />}
                                        title="Tags & Instructions"
                                        description="Help users find this exercise and understand how to do it"
                                    />
                                    <div className="space-y-4">
                                        <Field label="Tags" required hint="Press Enter or comma to add a tag">
                                            <Input
                                                placeholder="e.g. LEGS, COMPOUND, PUSH…"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                            />
                                            {form.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {form.tags.map((tag) => (
                                                        <span key={tag} className="ae-tag">
                                                            <Tag size={10} />
                                                            {tag}
                                                            <span className="ae-tag-remove" onClick={() => handleRemoveTag(tag)}>
                                                                <X size={10} />
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </Field>

                                        <Field label="Instructions / Description">
                                            <Textarea
                                                placeholder="Describe how to perform the exercise correctly, cues, common mistakes…"
                                                className="h-32 resize-none"
                                                value={form.description}
                                                onChange={(e) => handleChange("description", e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <Separator />

                                {/* ── Submit ── */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-destructive font-bold">*</span> Required fields
                                    </div>
                                    <Button type="submit" size="default" className="gap-2 px-6">
                                        <Plus size={15} /> Save Exercise
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    )
}