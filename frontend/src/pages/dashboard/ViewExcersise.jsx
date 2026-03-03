"use client"

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteExcersise, fetchUserExcersises } from "../../redux/slice/excersiseSlice"
import { ExerciseModal } from "./SingleExcersise"
import { toast } from "react-toastify"

export default function AdvancedExerciseTable() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.excersise.userExcersises || []);

  useEffect(() => {
    dispatch(fetchUserExcersises());
  }, [dispatch]);

  // --- States ---
  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" })
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

  // --- Sorting Handler ---
  const handleSort = (column) => {
    const isAsc = sorting.column === column && sorting.direction === "asc"
    setSorting({ column, direction: isAsc ? "desc" : "asc" })
  }

  const SortIcon = ({ column }) => {
    if (sorting.column !== column) return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
    return sorting.direction === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  // --- Combined Filtering & Sorting Logic ---
  const processedData = useMemo(() => {
    let filtered = data.filter((row) => {
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

  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (exerciseId) => {
    try {
      const result = await dispatch(deleteExcersise(exerciseId));
      if (deleteExcersise.fulfilled.match(result)) {
        toast.success("Exercise deleted successfully");
      }
      else {
        toast.error("Failed to delete exercise");
      }
    } catch (error) {
      toast.error(`An error occurred while deleting the exercise ${error.message}`);
    }
  }


  return (
    <div className="w-full p-6 space-y-4 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exercise Database</h2>
          <p className="text-sm text-muted-foreground">Manage your workout library with advanced filters.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden lg:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-40">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {[...new Set(data.map(ex => ex.category))].map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Settings2 className="mr-2 h-4 w-4" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(columnVisibility).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={columnVisibility[key]}
                  onCheckedChange={(value) => setColumnVisibility(prev => ({ ...prev, [key]: !!value }))}
                >
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columnVisibility.id && (
                <TableHead className="w-24 cursor-pointer hover:text-foreground" onClick={() => handleSort("id")}>
                  <div className="flex items-center">S.NO <SortIcon column="id" /></div>
                </TableHead>
              )}
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                <div className="flex items-center">Exercise <SortIcon column="name" /></div>
              </TableHead>
              {columnVisibility.category && <TableHead>Category</TableHead>}
              {columnVisibility.difficulty && <TableHead>Difficulty</TableHead>}
              {columnVisibility.equipment && <TableHead>Equipment</TableHead>}
              {columnVisibility.set && <TableHead>Set</TableHead>}
              {columnVisibility.reps && <TableHead>Reps</TableHead>}
              {columnVisibility.tags && <TableHead>Tags</TableHead>}
              {columnVisibility.instructions && <TableHead>Instructions</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((exercise, index) => (
                <TableRow key={exercise._id} className="group transition-colors">
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-lg border">
                        <AvatarImage src={exercise.imageUrl} className="object-cover" />
                        <AvatarFallback className="bg-muted text-[10px] font-bold">
                          {exercise.name?.substring(0, 2).toUpperCase() || "EX"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{exercise.name}</span>
                    </div>
                  </TableCell>
                  {columnVisibility.category && <TableCell className="text-sm">{exercise.category}</TableCell>}
                  {columnVisibility.difficulty && (
                    <TableCell>
                      <Badge variant="secondary" className="font-medium text-[11px]">
                        {exercise.difficulty}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.equipment && <TableCell className="text-sm text-muted-foreground">{exercise.equipment}</TableCell>}
                  {columnVisibility.set && <TableCell className="text-sm">{exercise.sets}</TableCell>}
                  {columnVisibility.reps && <TableCell className="text-sm">{exercise.reps}</TableCell>}
                  {columnVisibility.tags && (
                    <TableCell>
                      {exercise.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="mr-1 mb-1 text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                  )}
                  {columnVisibility.instructions && <TableCell className="text-sm text-muted-foreground">{exercise.instructions?.substring(0, 20) || "N/A"}...</TableCell>}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* CRITICAL CHANGE: Using exercise._id here */}
                        <DropdownMenuItem onClick={() => setSelectedExerciseId(exercise.excersiseId)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(exercise._id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">No results found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" /><ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>
              <ChevronRight className="h-4 w-4" />
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