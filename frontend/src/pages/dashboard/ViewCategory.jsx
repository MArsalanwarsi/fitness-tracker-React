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
  Download,
  FolderTree,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { toast } from "react-toastify"
import { fetchCategories } from "../../redux/slice/categorySlice"

export default function ViewCategory() {
  const dispatch = useDispatch();
  
  const data = useSelector((state) => state.category.categories || []);

  useEffect(() => {
    dispatch(fetchCategories());
    console.log("Fetched Categories:", data);
  }, [dispatch]);

  // --- States ---
  const [globalFilter, setGlobalFilter] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" })
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,

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

  // --- Filtering & Sorting ---
  const processedData = useMemo(() => {
    let filtered = data.filter((row) => {
      return String(row.name).toLowerCase().includes(globalFilter.toLowerCase())
    })

    return filtered.sort((a, b) => {
      const aVal = a[sorting.column]
      const bVal = b[sorting.column]
      // Handle undefined/null and non-string comparisons
      const aStr = aVal == null ? "" : String(aVal).toLowerCase()
      const bStr = bVal == null ? "" : String(bVal).toLowerCase()
      if (aStr < bStr) return sorting.direction === "asc" ? -1 : 1
      if (aStr > bStr) return sorting.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, globalFilter, sorting])

  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
        // dispatch logic here
        toast.info("Delete function triggered for: " + categoryId);
    }
  }

  const visibleColsCount = Object.values(columnVisibility).filter(Boolean).length + 1 // +1 for Actions

  return (
    <div className="w-full p-6 space-y-4 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">Manage and organize your exercise classifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden lg:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 ml-auto">
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
                  {key.replace(/([A-Z])/g, ' $1')}
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
                  <div className="flex items-center">Category Name <SortIcon column="name" /></div>
                </TableHead>
              
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((category, index) => (
                <TableRow key={category._id} className="group transition-colors">
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-xs text-muted-foreground">
                        {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                  )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FolderTree className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">{category.name}</span>
                      </div>
                    </TableCell>
                  

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive" 
                            onClick={() => handleDelete(category._id)}
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
                <TableCell colSpan={visibleColsCount} className="h-32 text-center text-muted-foreground">
                  No categories found. Click "Add Category" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Keeping your existing logic) */}
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
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}