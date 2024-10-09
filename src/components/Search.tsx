import { Input } from "./ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function Search() {
    const [_, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");

    const updateSearch = useCallback(() => {
        if (searchTerm) {
            setSearchParams(params => { params.set('s', searchTerm.trim()); return params })
        } else {
            setSearchParams(params => { params.delete('s'); return params })
        }
    }, [searchTerm, setSearchParams]);

    // Debounce input to avoid updating search params on each keystroke
    useEffect(() => {
        const timeout = setTimeout(updateSearch, 600);
        return () => clearTimeout(timeout);
    }, [updateSearch]);

    return <div className="relative">
        <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search posts" className="pl-8" value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
        }} />
    </div>
}