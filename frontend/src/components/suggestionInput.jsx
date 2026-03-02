import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input" // Adjust path to your shadcn Input
import { useDispatch, useSelector } from "react-redux"
import { fetchExcersises } from "../redux/slice/excersiseSlice"

export function AsyncAutocomplete({ value, onChange, placeholder }) {
    const [suggestions, setSuggestions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const wrapperRef = useRef(null)
    const dispatch = useDispatch();
    const excersiseSlice = useSelector((state) => state.excersise)

    // 1. Fetch data from API with a debounce
    useEffect(() => {
        if (!value || value.length < 1) {
            setSuggestions([])
            return
        }

        const fetchSuggestions = async () => {
            setIsLoading(true)
            try {
               await dispatch(fetchExcersises(value))
                // MOCK API BEHAVIOR FOR TESTING:
                const mockDatabase = excersiseSlice.excersises.map(ex => ex.name)
                const data = mockDatabase.filter(item =>
                    item.toLowerCase().includes(value.toLowerCase())
                )

                setSuggestions(data)
                setIsOpen(true)
            } catch (error) {
                console.error("Failed to fetch suggestions", error)
            } finally {
                setIsLoading(false)
            }
        }

        // Debounce: Wait 300ms after the user stops typing before calling the API
        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [value])

    // 2. Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={wrapperRef} className="relative w-full">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => {
                    if (suggestions.length > 0) setIsOpen(true)
                }}
                placeholder={placeholder}
            />

            {/* Loading Indicator (Optional) */}
            {isLoading && (
                <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1">
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                                onChange(item) // Update react-hook-form value
                                setIsOpen(false) // Close dropdown
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}