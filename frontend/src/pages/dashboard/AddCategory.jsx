import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusCircle, Tag } from "lucide-react";
import { useDispatch } from 'react-redux';
import { addCategory } from '../../redux/slice/categorySlice';
import { toast } from 'react-toastify';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsLoading(true);
    const result = await dispatch(addCategory(categoryName));
    if (addCategory.fulfilled.match(result)) {
      toast.success("Category Added Successfully");
      setCategoryName('');
    } else {
      toast.error(result.payload || "Failed to add category");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background py-6 px-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Tag size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">Categories</span>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">Add Category</CardTitle>
          <CardDescription>
            Add a new category to organize your exercises and content.
          </CardDescription>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Strength, Cardio, Mobility…"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                className="gap-2"
                disabled={isLoading || !categoryName.trim()}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <><PlusCircle className="h-4 w-4" /> Add Category</>
                )}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setCategoryName('')}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default AddCategory;