"use client";

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderTree,
  AlertTriangle,
  Pencil,
  Loader2,
  Check,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../../redux/slice/categorySlice";
import { Link } from "react-router-dom";
import { useTableExport } from "../../hooks/useTableExport";
import BrandLogo from "../../assets/logo/Fitness_Tracker.png";

const SortIcon = ({ column, sorting }) => {
  if (sorting.column !== column) {
    return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
  }

  return sorting.direction === "asc" ? (
    <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
  ) : (
    <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
  );
};

export default function ViewCategory() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.category.categories || []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState({ column: "name", direction: "asc" });
  const [columnVisibility, setColumnVisibility] = useState({ id: true });
  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const openEdit = (category) => {
    setEditTarget(category);
    setEditName(category.name);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);

    const result = await dispatch(
      updateCategory({
        id: editTarget._id,
        name: editName.trim(),
      })
    );

    if (updateCategory.fulfilled.match(result)) {
      toast.success("Category renamed!");
      setEditTarget(null);
    } else {
      toast.error("Failed to rename category");
    }

    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const result = await dispatch(deleteCategory(deleteTarget._id));

    if (deleteCategory.fulfilled.match(result)) {
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } else {
      toast.error("Failed to delete category");
    }

    setDeleting(false);
  };

  const processedData = useMemo(() => {
    const filtered = data.filter((row) =>
      String(row.name).toLowerCase().includes(globalFilter.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const aStr =
        a[sorting.column] == null ? "" : String(a[sorting.column]).toLowerCase();
      const bStr =
        b[sorting.column] == null ? "" : String(b[sorting.column]).toLowerCase();

      if (aStr < bStr) return sorting.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, globalFilter, sorting]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;

  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportColumns = useMemo(() => {
    const cols = [];

    if (columnVisibility.id) {
      cols.push({
        key: "serial",
        header: "#",
        value: (_row, index) => index + 1,
      });
    }

    cols.push({
      key: "name",
      header: "Category Name",
      value: (row) => row.name,
    });

    return cols;
  }, [columnVisibility]);

  const { handleExportCsv, handleExportPdf } = useTableExport({
    data: processedData,
    columns: exportColumns,
    fileBaseName: "categories",
    pdfTitle: "Categories Report",
    pdfSubtitle: "Manage and organize your exercise classifications",
    companyName: "FitTrack",
    logoUrl: BrandLogo,
  });

  const onExportCsv = () => {
    const result = handleExportCsv();

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const onExportPdf = async () => {
    const result = await handleExportPdf();

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const SortableTh = ({ column, children, className = "" }) => (
    <TableHead
      className={`cursor-pointer select-none hover:text-foreground whitespace-nowrap ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon column={column} sorting={sorting} />
      </div>
    </TableHead>
  );

  return (
    <div className="bg-background p-6 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FolderTree size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Library
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and organize your exercise classifications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                Export
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

          <Link to="/dashboard/Excersise/addCategory">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories…"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
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
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [key]: !!value,
                    }))
                  }
                >
                  {key.replace(/([A-Z])/g, " $1")}
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
              {columnVisibility.id && (
                <TableHead className="w-12 whitespace-nowrap">#</TableHead>
              )}
              <SortableTh column="name">Category Name</SortableTh>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((category, index) => (
                <TableRow key={category._id} className="group">
                  {columnVisibility.id && (
                    <TableCell className="font-mono text-xs text-muted-foreground w-12">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                  )}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FolderTree className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                  </TableCell>

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
                        <DropdownMenuItem onClick={() => openEdit(category)}>
                          <Pencil className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(category)}
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
                <TableCell colSpan={3} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FolderTree size={28} className="opacity-30" />
                    <p className="text-sm font-medium">No categories found</p>
                    <p className="text-xs">
                      Try adjusting your search or add a new category
                    </p>
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
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span>{" "}
            of <span className="font-semibold text-foreground">{totalPages}</span>
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

      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => {
          if (!o) setEditTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Rename Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-1.5 py-2">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Category Name
            </Label>
            <Input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Category name…"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving || !editName.trim()}
              className="gap-1.5"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>

            <AlertDialogTitle>Delete Category</AlertDialogTitle>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This cannot be undone.
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              )}
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}