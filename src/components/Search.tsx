import { Input } from "./ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/lib/utils";

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState("")

    useDebounce(() => {
        if (searchTerm) {
            setSearchParams(params => { params.set('s', searchTerm.trim()); return params })
        } else {
            setSearchParams(params => { params.delete('s'); return params })
        }
    }, [searchTerm, searchParams, setSearchParams], 600)

    return <div className="relative">
        <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search posts" className="pl-8" value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
        }} />
    </div>
}