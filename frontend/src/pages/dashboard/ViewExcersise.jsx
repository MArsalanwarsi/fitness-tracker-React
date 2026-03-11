"use client"

import {
  ChevronDown, ChevronUp, ChevronsUpDown, Edit, MoreHorizontal,
  Plus, Search, Settings2, Trash2, ChevronLeft, ChevronRight,
  SlidersHorizontal, Download, Eye, Dumbbell, AlertTriangle,
  X, Save, Image as ImageIcon, Tag, AlignLeft, Loader2,
  FileText, FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteExcersise, fetchUserExcersises, updateExcersise, fetchEquipment } from "../../redux/slice/excersiseSlice"
import { fetchCategories } from "../../redux/slice/categorySlice"
import { ExerciseModal } from "./SingleExcersise"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useTableExport } from "../../hooks/useTableExport"
import BrandLogo from "../../assets/logo/Fitness_Tracker.png"

const difficultyConfig = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

const EditExerciseModal = ({ exercise, onClose }) => {
  const dispatch = useDispatch()
  const equipmentState = useSelector((state) => state.excersise.equipments ?? [])
  const categoryState = useSelector((state) => state.category?.categories ?? [])
  const saving = useSelector((state) => state.excersise.loading)

  const [form, setForm] = useState({
    name: exercise.name ?? "",
    description: exercise.instructions ?? "",
    category: exercise.category ?? "",
    difficulty: exercise.difficulty ?? "",
    equipment: exercise.equipment ?? "",
    excersiseImage: exercise.imageUrl ?? "",
    sets: String(exercise.sets ?? ""),
    reps: String(exercise.reps ?? ""),
    tags: exercise.tags ?? [],
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    dispatch(fetchEquipment())
    dispatch(fetchCategories())
  }, [dispatch])

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const addTag = (e) => {
    if (e.key !== "Enter" && e.key !== ",") return
    e.preventDefault()
    const t = tagInput.trim().toUpperCase()
    if (t && !form.tags.includes(t)) setForm((p) => ({ ...p, tags: [...p.tags, t] }))
    setTagInput("")
  }

  const handleSave = async () => {
    if (!form.name || !form.category || !form.difficulty || !form.equipment || !form.sets || !form.reps) {
      toast.error("Please fill out all required fields.")
      return
    }

    const result = await dispatch(updateExcersise({
      id: exercise._id,
      data: {
        name: form.name,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        equipment: form.equipment,
        excersiseImage: form.excersiseImage,
        sets: form.sets,
        reps: form.reps,
        tags: form.tags,
      },
    }))

    if (updateExcersise.fulfilled.match(result)) {
      toast.success("Exercise updated!")
      onClose()
    } else {
      toast.error(result.payload?.message ?? "Failed to update")
    }
  }

  const diffBtnStyle = (val) => {
    const map = { beginner: "#10b981", intermediate: "#f59e0b", advanced: "#ef4444" }
    const active = form.difficulty === val
    return {
      flex: 1,
      padding: "6px 4px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all .15s",
      border: `1px solid ${active ? map[val] : "hsl(var(--border))"}`,
      background: active ? map[val] : "transparent",
      color: active ? "#fff" : "hsl(var(--muted-foreground))",
    }
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="overflow-hidden rounded-t-xl border-b bg-muted/40">
          <AspectRatio ratio={16 / 5} className="flex items-center justify-center">
            {form.excersiseImage ? (
              <img src={form.excersiseImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-7 w-7 opacity-40" />
                <p className="text-xs">No preview image</p>
              </div>
            )}
          </AspectRatio>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Exercise
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Exercise Name <span className="text-destructive">*</span>
              </label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Exercise name…" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="plyometrics">Plyometrics</SelectItem>
                    {categoryState.map((c) => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Difficulty <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-1.5">
                  {difficultyConfig.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      style={diffBtnStyle(value)}
                      onClick={() => set("difficulty", value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Equipment <span className="text-destructive">*</span>
              </label>
              <Select value={form.equipment} onValueChange={(v) => set("equipment", v)}>
                <SelectTrigger><SelectValue placeholder="Select equipment…" /></SelectTrigger>
                <SelectContent>
                  {equipmentState.map((eq) => <SelectItem key={eq.name} value={eq.name}>{eq.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Sets <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    placeholder="4"
                    value={form.sets}
                    onChange={(e) => set("sets", e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    sets
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Reps <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={form.reps}
                    onChange={(e) => set("reps", e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    reps
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tags</label>
              <Input
                placeholder="Press Enter to add tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                      style={{
                        background: "hsl(var(--primary)/0.12)",
                        color: "hsl(var(--primary))",
                        border: "1px solid hsl(var(--primary)/0.2)",
                      }}
                    >
                      <Tag size={9} />
                      {t}
                      <button
                        onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }))}
                        className="opacity-60 hover:opacity-100 hover:text-red-500 transition-opacity"
                      >
                        <X size={9} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Instructions
              </label>
              <Textarea
                placeholder="Describe how to perform the exercise…"
                className="h-28 resize-none"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-1.5">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const DIFFICULTY_STYLES = {
  beginner: { bg: "#10b98118", color: "#10b981" },
  intermediate: { bg: "#f59e0b18", color: "#f59e0b" },
  advanced: { bg: "#ef444418", color: "#ef4444" },
}

const DifficultyBadge = ({ value }) => {
  const style = DIFFICULTY_STYLES[value?.toLowerCase()] ?? {
    bg: "hsl(var(--muted))",
    color: "hsl(var(--muted-foreground))",
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
      style={{ background: style.bg, color: style.color }}
    >
      {value}
    </span>
  )
}

const SortIcon = ({ column, sorting }) => {
  if (sorting.column !== column) return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />
  return sorting.direction === "asc"
    ? <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
    : <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
}

export default function AdvancedExerciseTable() {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.excersise.userExcersises || [])

  useEffect(() => {
    dispatch(fetchUserExcersises())
  }, [dispatch])

  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    category: true,
    difficulty: true,
    equipment: true,
    set: true,
    reps: true,
    tags: true,
    instructions: true,
  })

  const handleSort = (column) =>
    setSorting((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }))

  const processedData = useMemo(() => {
    const filtered = data.filter((row) => {
      const matchesSearch =
        String(row.name || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.category || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.difficulty || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.equipment || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.instructions || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.sets || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        String(row.reps || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        (Array.isArray(row.tags) && row.tags.join(" ").toLowerCase().includes(globalFilter.toLowerCase()))

      const matchesCategory = categoryFilter === "all" || row.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      const aVal = a[sorting.column] ?? ""
      const bVal = b[sorting.column] ?? ""

      const aStr = Array.isArray(aVal) ? aVal.join(", ").toLowerCase() : String(aVal).toLowerCase()
      const bStr = Array.isArray(bVal) ? bVal.join(", ").toLowerCase() : String(bVal).toLowerCase()

      if (aStr < bStr) return sorting.direction === "asc" ? -1 : 1
      if (aStr > bStr) return sorting.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, globalFilter, categoryFilter, sorting])

  const totalPages = Math.ceil(processedData.length / pageSize) || 1
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const categories = [...new Set(data.map((ex) => ex.category).filter(Boolean))]

  const exportColumns = useMemo(() => {
    const cols = []

    if (columnVisibility.id) {
      cols.push({
        key: "serial",
        header: "#",
        value: (_row, index) => index + 1,
      })
    }

    cols.push({
      key: "name",
      header: "Exercise Name",
      value: (row) => row.name || "",
    })

    if (columnVisibility.category) {
      cols.push({
        key: "category",
        header: "Category",
        value: (row) => row.category || "",
      })
    }

    if (columnVisibility.difficulty) {
      cols.push({
        key: "difficulty",
        header: "Difficulty",
        value: (row) => row.difficulty || "",
      })
    }

    if (columnVisibility.equipment) {
      cols.push({
        key: "equipment",
        header: "Equipment",
        value: (row) => row.equipment || "",
      })
    }

    if (columnVisibility.set) {
      cols.push({
        key: "sets",
        header: "Sets",
        value: (row) => row.sets ?? "",
      })
    }

    if (columnVisibility.reps) {
      cols.push({
        key: "reps",
        header: "Reps",
        value: (row) => row.reps ?? "",
      })
    }

    if (columnVisibility.tags) {
      cols.push({
        key: "tags",
        header: "Tags",
        value: (row) => Array.isArray(row.tags) ? row.tags.join(", ") : "",
      })
    }

    if (columnVisibility.instructions) {
      cols.push({
        key: "instructions",
        header: "Instructions",
        value: (row) => row.instructions || "",
      })
    }

    return cols
  }, [columnVisibility])

  const { handleExportCsv, handleExportPdf } = useTableExport({
    data: processedData,
    columns: exportColumns,
    fileBaseName: "exercises",
    pdfTitle: "Exercise Database Report",
    pdfSubtitle: "Manage your workout library with advanced filters",
    companyName: "FitTrack",
    logoUrl: BrandLogo,
  })

  const onExportCsv = () => {
    const result = handleExportCsv()
    if (result.ok) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const onExportPdf = async () => {
    const result = await handleExportPdf()
    if (result.ok) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    const result = await dispatch(deleteExcersise(deleteTarget._id))

    if (deleteExcersise.fulfilled.match(result)) {
      toast.success(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
    } else {
      toast.error("Failed to delete exercise")
    }

    setDeleting(false)
  }

  const SortableTh = ({ column, children }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground whitespace-nowrap"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon column={column} sorting={sorting} />
      </div>
    </TableHead>
  )

  return (
    <div className="bg-background p-6 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Dumbbell size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">Exercises</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Exercise Database</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your workout library with advanced filters.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExportCsv}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPdf}>
                <FileText className="mr-2 h-4 w-4" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/dashboard/Excersise/addExcersise">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Exercise
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises…"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-44">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Settings2 className="h-3.5 w-3.5" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(columnVisibility).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize text-sm"
                  checked={columnVisibility[key]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({ ...prev, [key]: !!value }))
                  }
                >
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground sm:ml-auto">
          {processedData.length} result{processedData.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columnVisibility.id && <TableHead>#</TableHead>}
              <SortableTh column="name">Exercise</SortableTh>
              {columnVisibility.category && <SortableTh column="category">Category</SortableTh>}
              {columnVisibility.difficulty && <TableHead>Difficulty</TableHead>}
              {columnVisibility.equipment && <TableHead>Equipment</TableHead>}
              {columnVisibility.set && <TableHead>Sets</TableHead>}
              {columnVisibility.reps && <TableHead>Reps</TableHead>}
              {columnVisibility.tags && <TableHead>Tags</TableHead>}
              {columnVisibility.instructions && <TableHead>Instructions</TableHead>}
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((exercise, index) => (
                <TableRow key={exercise._id} className="group">
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-xs text-muted-foreground w-12">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                  )}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg border shrink-0">
                        <AvatarImage src={exercise.imageUrl} className="object-cover" />
                        <AvatarFallback className="bg-muted text-[10px] font-bold rounded-lg">
                          {exercise.name?.substring(0, 2).toUpperCase() || "EX"}
                        </AvatarFallback>
                      </Avatar>

                      <span
                        className="font-medium text-sm leading-none cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedExerciseId(exercise.excersiseId)}
                      >
                        {exercise.name}
                      </span>
                    </div>
                  </TableCell>

                  {columnVisibility.category && (
                    <TableCell className="text-sm text-muted-foreground">{exercise.category}</TableCell>
                  )}

                  {columnVisibility.difficulty && (
                    <TableCell><DifficultyBadge value={exercise.difficulty} /></TableCell>
                  )}

                  {columnVisibility.equipment && (
                    <TableCell className="text-sm text-muted-foreground">{exercise.equipment}</TableCell>
                  )}

                  {columnVisibility.set && (
                    <TableCell className="text-sm tabular-nums">{exercise.sets}</TableCell>
                  )}

                  {columnVisibility.reps && (
                    <TableCell className="text-sm tabular-nums">{exercise.reps}</TableCell>
                  )}

                  {columnVisibility.tags && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {exercise.tags?.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wide"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {exercise.tags?.length > 2 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{exercise.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {columnVisibility.instructions && (
                    <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                      {exercise.instructions?.substring(0, 40) || "—"}
                      {exercise.instructions?.length > 40 ? "…" : ""}
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedExerciseId(exercise.excersiseId)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditTarget(exercise)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(exercise)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Dumbbell size={28} className="opacity-30" />
                    <p className="text-sm font-medium">No exercises found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <ChevronLeft className="h-3.5 w-3.5 -ml-2" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editTarget && (
        <EditExerciseModal exercise={editTarget} onClose={() => setEditTarget(null)} />
      )}

      <ExerciseModal
        exerciseId={selectedExerciseId}
        isOpen={!!selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
    </div>
  )
}