"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Target, Activity, Repeat } from "lucide-react";
import { useDispatch } from "react-redux";
// CRITICAL: Ensure this import path matches your project structure
import { getExcersiseById } from "../../redux/slice/excersiseSlice";

export function ExerciseModal({ exerciseId, isOpen, onClose }) {
    const [exercise, setExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen && exerciseId) {
            const fetchExercise = async () => {
                setIsLoading(true);
                try {
                    const result = await dispatch(getExcersiseById(exerciseId));
                    // Check if the dispatch was successful
                    if (getExcersiseById.fulfilled.match(result)) {
                        setExercise(result.payload.data);
                    } else {
                        console.error("Fetch failed:", result.error);
                    }
                } catch (error) {
                    console.error("Failed to fetch exercise details", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchExercise();
        } else if (!isOpen) {
            setExercise(null);
        }
    }, [exerciseId, isOpen, dispatch]);


    const renderInstructions = (instructions) => {
        if (!instructions) return <p className="text-sm text-muted-foreground italic">No instructions provided.</p>;

        if (Array.isArray(instructions)) {
            return (
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    {instructions.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                            {step.replace(/Step:\d\s/, "").replace(/Step:\d:\s/, "")}
                        </li>
                    ))}
                </ol>
            );
        }
        return <p className="text-sm text-muted-foreground leading-relaxed">{instructions}</p>;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden max-h-[90vh]">
                {isLoading || !exercise ? (
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-[250px] w-full rounded-md" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="p-6 pb-2 border-b">
                            <DialogTitle className="text-2xl font-bold capitalize">
                                {exercise.name}
                            </DialogTitle>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(exercise.bodyParts || []).map((part) => (
                                    <Badge key={part} variant="secondary" className="capitalize">
                                        {part}
                                    </Badge>
                                ))}
                                {(exercise.targetMuscles || []).map((muscle) => (
                                    <Badge key={muscle} variant="default" className="capitalize">
                                        Target: {muscle}
                                    </Badge>
                                ))}
                            </div>
                        </DialogHeader>

                        <ScrollArea className="max-h-[60vh] p-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-muted rounded-xl overflow-hidden flex items-center justify-center p-2 border aspect-square">
                                        <img
                                            src={exercise.gifUrl || exercise.imageUrl}
                                            alt={exercise.name}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {exercise.sets && (
                                            <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                                                <Repeat className="w-4 h-4 text-primary" />
                                                <span className="font-semibold">{exercise.sets} Sets × {exercise.reps || 0} Reps</span>
                                            </div>
                                        )}
                                        {exercise.equipment && (
                                            <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                                                <Dumbbell className="w-4 h-4 text-primary" />
                                                <span className="font-medium capitalize">{exercise.equipment}</span>
                                            </div>
                                        )}
                                        {exercise.difficulty && (
                                            <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                                                <Activity className="w-4 h-4 text-primary" />
                                                <span className="font-medium capitalize">{exercise.difficulty}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 border-b pb-1">
                                        How to Perform
                                    </h3>
                                    {renderInstructions(exercise.instructions)}

                                    {exercise.secondaryMuscles?.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold mb-2">Secondary Muscles:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {exercise.secondaryMuscles.map(m => (
                                                    <Badge key={m} variant="outline" className="text-[10px] capitalize">{m}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}