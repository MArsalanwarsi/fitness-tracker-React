"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { fetchEquipment } from "../../redux/slice/excersiseSlice"

// 1. Define the schema
const exerciseSchema = z.object({
    name: z.string().min(2, "Exercise name must be at least 2 characters."),
    description: z.string().optional(),
    category: z.string({ required_error: "Please select a category." }),
    difficulty: z.string({ required_error: "Please select a difficulty level." }),
    equipment: z.string().optional(),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tags: z.array(z.string()).min(1, "Add at least one tag."),
})



export default function AddExercisePage() {
    const [tagInput, setTagInput] = useState("")
    const dispatch = useDispatch();
    const equipmentState = useSelector((state) => state.excersise.equipments);

    useEffect(() => {
        dispatch(fetchEquipment());
    }, [dispatch]);



    // 2. Initialize the form
    const form = useForm({
        resolver: zodResolver(exerciseSchema),
        defaultValues: {
            name: "",
            description: "",
            equipment: "",
            videoUrl: "",
            tags: [],
        },
    })

    // 3. Handle Form Submission
    function onSubmit(data) {
        console.log("Submitted Data:", data)
        // Add your API call here
    }

    // Helper to add tags
    const handleAddTag = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = tagInput.trim().toLowerCase()
            const currentTags = form.getValues("tags")

            if (newTag && !currentTags.includes(newTag)) {
                form.setValue("tags", [...currentTags, newTag], { shouldValidate: true })
            }
            setTagInput("")
        }
    }

    // Helper to remove tags
    const handleRemoveTag = (tagToRemove) => {
        const currentTags = form.getValues("tags")
        form.setValue(
            "tags",
            currentTags.filter((tag) => tag !== tagToRemove),
            { shouldValidate: true }
        )
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Exercise</CardTitle>
                    <CardDescription>
                        Create a new exercise by filling out the details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exercise Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Barbell Squat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Category & Difficulty Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="strength">Strength</SelectItem>
                                                    <SelectItem value="cardio">Cardio</SelectItem>
                                                    <SelectItem value="flexibility">Flexibility</SelectItem>
                                                    <SelectItem value="plyometrics">Plyometrics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Difficulty *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Equipment Field */}
                            <FormField
                                control={form.control}
                                name="equipment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Equipment Needed</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select equipment or leave blank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {equipmentState && equipmentState.map((eq) => (
                                                    <SelectItem key={eq.name} value={eq.name}>
                                                        {eq.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Interactive Tags Field */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags *</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="Type a tag and press Enter (e.g. legs, push)..."
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                />
                                                {field.value.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {field.value.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveTag(tag)}
                                                                    className="ml-2 hover:text-destructive focus:outline-none"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Press Enter or comma to add a tag.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructions / Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Explain how to perform the exercise properly..."
                                                className="resize-none h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Video URL Field */}
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video Tutorial URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://youtube.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="w-full sm:w-auto">
                                    Save Exercise
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}