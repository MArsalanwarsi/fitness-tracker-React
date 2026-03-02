"use client"

import * as React from "react"
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

export default function AdvancedExerciseTable() {
  // --- Data (Added image/gif URLs) ---
  const [data] = React.useState([
    { id: "EX-001", name: "Barbell Squat", category: "Strength", difficulty: "Intermediate", equipment: "Barbell", status: "Active", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&q=80" },
    { id: "EX-002", name: "Treadmill Run", category: "Cardio", difficulty: "Beginner", equipment: "Treadmill", status: "Active", image: "" },
    { id: "EX-003", name: "Deadlift", category: "Strength", difficulty: "Advanced", equipment: "Barbell", status: "Archived", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&q=80" },
    { id: "EX-004", name: "Yoga Flow", category: "Flexibility", difficulty: "Beginner", equipment: "Mat", status: "Active", image: "" },
    { id: "EX-005", name: "Clean & Jerk", category: "Power", difficulty: "Advanced", equipment: "Barbell", status: "Active", image: "" },
  ]);

  // --- States ---
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [pageSize, setPageSize] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sorting, setSorting] = React.useState({ column: "name", direction: "asc" })
  const [columnVisibility, setColumnVisibility] = React.useState({
    id: true,
    category: true,
    difficulty: true,
    equipment: true,
    status: true,
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
  const processedData = React.useMemo(() => {
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
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
            <SelectTrigger className="h-9 w-[150px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Strength">Strength</SelectItem>
              <SelectItem value="Cardio">Cardio</SelectItem>
              <SelectItem value="Flexibility">Flexibility</SelectItem>
              <SelectItem value="Power">Power</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Settings2 className="mr-2 h-4 w-4" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
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
                <TableHead className="w-[100px] cursor-pointer hover:text-foreground" onClick={() => handleSort("id")}>
                  <div className="flex items-center">ID <SortIcon column="id" /></div>
                </TableHead>
              )}
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                <div className="flex items-center">Exercise <SortIcon column="name" /></div>
              </TableHead>
              {columnVisibility.category && <TableHead>Category</TableHead>}
              {columnVisibility.difficulty && <TableHead>Difficulty</TableHead>}
              {columnVisibility.equipment && <TableHead>Equipment</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((exercise) => (
                <TableRow key={exercise.id} className="group transition-colors">
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-xs text-muted-foreground">{exercise.id}</TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-lg border">
                        <AvatarImage src={exercise.image} className="object-cover" />
                        <AvatarFallback className="bg-muted text-[10px] font-bold">
                          {exercise.name.substring(0, 2).toUpperCase()}
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
                  {columnVisibility.status && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${exercise.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`} />
                        <span className="text-xs font-medium">{exercise.status}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No results found.</TableCell>
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
            <SelectTrigger className="h-8 w-[70px]">
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
    </div>
  )
}