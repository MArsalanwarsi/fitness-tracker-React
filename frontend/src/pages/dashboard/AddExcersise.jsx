"use client"

import { useEffect, useState } from "react"
import { X, Plus, Image as ImageIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addExcersise, fetchEquipment } from "../../redux/slice/excersiseSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/components/ui/combobox"
import { AsyncAutocomplete } from "../../components/suggestionInput"
import { toast } from "react-toastify";

export default function AddExercisePage() {
    const dispatch = useDispatch();
    const equipmentState = useSelector((state) => state.excersise.equipments);
    const excersiseState = useSelector((state) => state.excersise.excersises);


    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        difficulty: "",
        equipment: "",
        excersiseImage: "",
        sets: "",
        reps: "",
        tags: []
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        dispatch(fetchEquipment());
    }, [dispatch]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };
    const handleExcesiseChange = (field, value) => {
        const image = excersiseState.find(ex => ex.name === value)?.gifUrl || "";
        const descriptionText = excersiseState.find(ex => ex.name === value)?.instructions || "";
        const descriptionString = Array.isArray(descriptionText)
            ? descriptionText.join(", ")
            : descriptionText;

        setForm(prev => ({
            ...prev,
            [field]: value,
            excersiseImage: image,
            description: descriptionString
        }));
        t
    }
    const handleEquipmentChange = (equipmentName) => {
        setForm(prev => ({
            ...prev,
            equipment: equipmentName,
        }));
    };

    const handleAddTag = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !form.tags.includes(newTag)) {
                setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm(prev => ({
            ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.difficulty || form.tags.length === 0 || !form.description || !form.excersiseImage || !form.equipment || !form.sets || !form.reps || form.sets <= 0 || form.reps <= 0) {
            toast.error("Please fill out all required fields with valid values.");
            return;
        }
        const result = await dispatch(addExcersise(form));
        if (addExcersise.fulfilled.match(result)) {
            toast.success("Exercise added successfully!");
            setForm({
                name: "",
                description: "",
                category: "",
                difficulty: "",
                equipment: "",
                excersiseImage: "",
                sets: "",
                reps: "",
                tags: []
            });
        } else {
            const message = result.payload?.error || "Failed to add exercise.";
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Exercise</CardTitle>
                    <CardDescription>Fill out the details below using standard React state.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* --- TOP IMAGE PREVIEW --- */}
                        <div className="overflow-hidden rounded-md border bg-muted">
                            <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
                                {form.excersiseImage || form.gifUrl ? (
                                    <img
                                        src={form.gifUrl || form.excersiseImage}
                                        alt="Exercise preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ImageIcon className="h-10 w-10" />
                                        <p className="text-sm font-medium">No equipment or GIF selected</p>
                                    </div>
                                )}
                            </AspectRatio>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Exercise Name *</label>
                            <AsyncAutocomplete
                                value={form.name}
                                onChange={(val) => handleExcesiseChange("name", val)}
                                placeholder="e.g. Barbell Squat"

                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category *</label>
                                <div className="flex gap-3 items-center">
                                    <Select onValueChange={(val) => handleChange("category", val)}>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="strength">Strength</SelectItem>
                                            <SelectItem value="cardio">Cardio</SelectItem>
                                            <SelectItem value="flexibility">Flexibility</SelectItem>
                                            <SelectItem value="plyometrics">Plyometrics</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Plus className="h-4 w-4" /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="space-y-4">
                                                <h4 className="font-medium text-sm">Add New Category</h4>
                                                <Input placeholder="Enter category name" />
                                                <Button size="sm" className="w-full">Add Category</Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Difficulty *</label>
                                <Select onValueChange={(val) => handleChange("difficulty", val)}>
                                    <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Equipment Needed</label>
                            <div className="flex gap-3">
                                <Combobox items={equipmentState} onValueChange={handleEquipmentChange} defaultValue="Select Equipment">
                                    <ComboboxTrigger render={<Button variant="outline" className="w-64 justify-between font-normal"><ComboboxValue /></Button>} />
                                    <ComboboxContent>
                                        <ComboboxInput showTrigger={false} placeholder="Search" />
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.name} value={item.name}>{item.name}</ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Plus className="h-4 w-4" /></Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-sm">Add New Equipment</h4>
                                            <Input placeholder="Equipment name" />
                                            <Textarea placeholder="Usage instructions..." className="h-24" />
                                            <Button size="sm" className="w-full">Add Equipment</Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sets</label>
                                <Input type="number" placeholder="e.g. 4" value={form.sets} onChange={(e) => handleChange("sets", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reps</label>
                                <Input type="number" placeholder="e.g. 10" value={form.reps} onChange={(e) => handleChange("reps", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags *</label>
                            <Input
                                placeholder="Press Enter or comma to add"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                                        {tag}
                                        <X className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Instructions / Description</label>
                            <Textarea
                                placeholder="How to perform the exercise..."
                                className="h-32"
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="w-full sm:w-auto">Save Exercise</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}