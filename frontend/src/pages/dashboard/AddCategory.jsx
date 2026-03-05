import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
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

   const result= await dispatch(addCategory(categoryName))
    if(addCategory.fulfilled.match(result)){
      toast.success("Category Added Successfully");
      setIsLoading(false);
      setCategoryName('');
    } else {
      toast.error(result.payload || "Failed to add category");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create Category</CardTitle>
          <CardDescription>
            Add a new category to organize your products or content.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Category Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Electronics, Home & Garden"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="focus-visible:ring-2"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 mt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !categoryName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
            <Button variant="ghost" type="button" className="w-full text-slate-500">
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddCategory;