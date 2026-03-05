"use client"

import {
  ChevronDown, ChevronUp, ChevronsUpDown, Edit, MoreHorizontal,
  Plus, Search, Settings2, Trash2, ChevronLeft, ChevronRight,
  SlidersHorizontal, Download, Eye, Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteExcersise, fetchUserExcersises } from "../../redux/slice/excersiseSlice"
import { ExerciseModal } from "./SingleExcersise"
import { toast } from "react-toastify"

// ── Difficulty badge ──────────────────────────────────────────────────────────
const DIFFICULTY_STYLES = {
  beginner: { bg: "#10b98118", color: "#10b981" },
  intermediate: { bg: "#f59e0b18", color: "#f59e0b" },
  advanced: { bg: "#ef444418", color: "#ef4444" },
}

const DifficultyBadge = ({ value }) => {
  const style = DIFFICULTY_STYLES[value?.toLowerCase()] ?? { bg: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
      style={{ background: style.bg, color: style.color }}>
      {value}
    </span>
  )
}

// ── Sort icon ─────────────────────────────────────────────────────────────────
const SortIcon = ({ column, sorting }) => {
  if (sorting.column !== column) return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />
  return sorting.direction === "asc"
    ? <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
    : <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdvancedExerciseTable() {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.excersise.userExcersises || [])

  useEffect(() => { dispatch(fetchUserExcersises()) }, [dispatch])

  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" })
  const [columnVisibility, setColumnVisibility] = useState({
    id: true, category: true, difficulty: true, equipment: true,
    set: true, reps: true, tags: true, instructions: true,
  })

  const handleSort = (column) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const processedData = useMemo(() => {
    const filtered = data.filter((row) => {
      const matchesSearch = Object.values(row).some(val =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
      const matchesCategory = categoryFilter === "all" || row.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    return filtered.sort((a, b) => {
      const aVal = a[sorting.column]
      const bVal = b[sorting.column]
      if (aVal < bVal) return sorting.direction === "asc" ? -1 : 1
      if (aVal > bVal) return sorting.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, globalFilter, categoryFilter, sorting])

  const totalPages = Math.ceil(processedData.length / pageSize) || 1
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const categories = [...new Set(data.map(ex => ex.category))]

  const handleDelete = async (exerciseId) => {
    try {
      const result = await dispatch(deleteExcersise(exerciseId))
      deleteExcersise.fulfilled.match(result)
        ? toast.success("Exercise deleted successfully")
        : toast.error("Failed to delete exercise")
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`)
    }
  }

  const SortableTh = ({ column, children }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground whitespace-nowrap"
      onClick={() => handleSort(column)}>
      <div className="flex items-center">
        {children}
        <SortIcon column={column} sorting={sorting} />
      </div>
    </TableHead>
  )

  return (
    <div className="bg-background p-6 space-y-5">

      {/* ── Header ── */}
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
          <Button variant="outline" size="sm" className="gap-1.5 hidden lg:flex">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Exercise
          </Button>
        </div>
      </div>

      <Separator />

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises…"
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); setCurrentPage(1) }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="h-9 w-44">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
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
                    setColumnVisibility(prev => ({ ...prev, [key]: !!value }))
                  }>
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground sm:ml-auto">
          {processedData.length} result{processedData.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columnVisibility.id && (
                <SortableTh column="id">#</SortableTh>
              )}
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
            {paginatedData.length > 0 ? paginatedData.map((exercise, index) => (
              <TableRow key={exercise._id} className="group">

                {columnVisibility.id && (
                  <TableCell className="font-mono text-xs text-muted-foreground w-12">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                )}

                {/* Exercise name + avatar */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg border shrink-0">
                      <AvatarImage src={exercise.imageUrl} className="object-cover" />
                      <AvatarFallback className="bg-muted text-[10px] font-bold rounded-lg">
                        {exercise.name?.substring(0, 2).toUpperCase() || "EX"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm leading-none">{exercise.name}</span>
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
                      {exercise.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wide">
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

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedExerciseId(exercise.excersiseId)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(exercise._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            )) : (
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

      {/* ── Pagination ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map(size => (
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
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-3.5 w-3.5" /><ChevronLeft className="h-3.5 w-3.5 -ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <ExerciseModal
        exerciseId={selectedExerciseId}
        isOpen={!!selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
    </div>
  )
}