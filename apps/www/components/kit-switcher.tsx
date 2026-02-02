'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Atom, BookOpen, Gem, MoonStar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getClientKits } from '@/lib/get-kits'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tailark/core/ui/select'

const kits = getClientKits()
const STORAGE_KEY = 'selected-kit-id'
const DEFAULT_CATEGORY_PATH = 'hero-section'

const getKitRouteSegment = (kitId: string): string => {
    if (kitId === 'mist-kit') return 'mist'
    if (kitId === 'veil-kit') return 'veil'
    return ''
}

const getKitIdFromPathnameInternal = (path: string, defaultKitId: string = 'dusk-kit'): string => {
    const pathParts = path.split('/')
    const firstSegment = pathParts[1]

    if (firstSegment === 'mist') {
        return 'mist-kit'
    }
    if (firstSegment === 'veil') {
        return 'veil-kit'
    }
    return defaultKitId
}

export function KitSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const [selectedKitId, setSelectedKitId] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedKit = localStorage.getItem(STORAGE_KEY)
            if (storedKit && kits.some((kit) => kit.id === storedKit)) {
                return storedKit
            }
        }
        return kits[0]?.id || 'dusk-kit'
    })

    const isDisabled = pathname.startsWith('/snippets') || pathname.startsWith('/docs')

    useEffect(() => {
        if (isDisabled) {
            const storedKit = localStorage.getItem(STORAGE_KEY)
            if (storedKit && kits.some((k) => k.id === storedKit) && selectedKitId !== storedKit) {
                setSelectedKitId(storedKit)
            }
            return
        }

        const currentKitIdFromPath = getKitIdFromPathnameInternal(pathname, 'dusk-kit')
        const storedKitId = localStorage.getItem(STORAGE_KEY)

        let targetKitId: string

        if (pathname === '/') {
            // On the root path, do not auto-redirect based on stored kit.
            // Just sync the selected kit state; navigation occurs only on explicit user selection.
            if (storedKitId && kits.some((kit) => kit.id === storedKitId)) {
                targetKitId = storedKitId
            } else {
                targetKitId = 'dusk-kit'
            }
        } else {
            targetKitId = currentKitIdFromPath
        }

        if (!kits.some((kit) => kit.id === targetKitId)) {
            targetKitId = 'dusk-kit'
        }

        if (selectedKitId !== targetKitId) {
            setSelectedKitId(targetKitId)
        }

        if (localStorage.getItem(STORAGE_KEY) !== targetKitId) {
            localStorage.setItem(STORAGE_KEY, targetKitId)
        }
    }, [pathname, router, isDisabled])

    const handleKitChange = (newlySelectedKitId: string) => {
        if (newlySelectedKitId === 'quartz-kit') {
            window.open('https://pro.tailark.com', '_parent')
            return
        }

        if (isDisabled) return

        setSelectedKitId(newlySelectedKitId)
        localStorage.setItem(STORAGE_KEY, newlySelectedKitId)

        const currentKitIdFromPath = getKitIdFromPathnameInternal(pathname, 'dusk-kit')
        const pathSegments = pathname.split('/').filter(Boolean)
        let newPath: string

        const newKitRouteSegment = getKitRouteSegment(newlySelectedKitId)

        let remainingPath = ''
        if (currentKitIdFromPath !== 'dusk-kit') {
            if (pathSegments.length > 1) {
                remainingPath = pathSegments.slice(1).join('/')
            }
        } else {
            if (pathSegments.length > 0) {
                remainingPath = pathSegments.join('/')
            }
        }

        if (!remainingPath) {
            remainingPath = DEFAULT_CATEGORY_PATH
        }

        if (newlySelectedKitId === 'dusk-kit') {
            newPath = `/${remainingPath}`
        } else {
            newPath = `/${newKitRouteSegment}/${remainingPath}`
        }

        if (newPath !== pathname) {
            router.push(newPath)
        }
    }

    return (
        <Select
            value={selectedKitId}
            defaultValue={selectedKitId}
            onValueChange={handleKitChange}
            disabled={isDisabled}>
            <SelectTrigger className="hover:bg-foreground/5 -ml-2 h-8 gap-3 rounded-lg border-none pl-1 pr-3 font-medium shadow-none lg:w-fit">
                <div className="flex items-center gap-2">
                    <SelectValue placeholder="Select kit" />
                </div>
            </SelectTrigger>
            <SelectContent
                sideOffset={6}
                className="bg-background/85 dark:ring-border w-36 min-w-56 origin-top -translate-x-[7px] rounded-lg border-transparent px-0 shadow-xl ring-1 ring-black/10 backdrop-blur">
                {kits.map((kit) => (
                    <SelectItem
                        key={kit.id}
                        value={kit.id}
                        className={cn('rounded p-2.5', selectedKitId === kit.id && 'font-medium')}>
                        <div className="flex items-center gap-2">
                            {kit.id === 'dusk-kit' && <DuskKitLogo />}
                            {kit.id === 'mist-kit' && <MistKitLogo />}
                            {kit.id === 'veil-kit' && <VeilKitLogo />}
                            <div className="flex items-center gap-1.5">{kit.name}</div>
                        </div>
                    </SelectItem>
                ))}

                <SelectItem
                    value="quartz-kit"
                    className="rounded p-2.5">
                    <div className="flex items-center gap-2">
                        <QuartzKitLogo />
                        <div className="flex items-center gap-1.5">
                            Quartz
                            <span className="inset-ring inset-ring-foreground/10 rounded-md bg-gradient-to-b from-emerald-50 to-indigo-50 px-1.5 py-1 text-xs font-medium leading-none dark:from-emerald-300/15 dark:to-indigo-500/10">
                                <span className="bg-gradient-to-r from-emerald-700 to-indigo-800 bg-clip-text text-transparent dark:from-emerald-200 dark:to-indigo-300">Pro</span>
                            </span>
                        </div>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}

const QuartzKitLogo = () => (
    <div className="bg-linear-to-br shadow-black/6.5 inset-ring inset-ring-foreground/15 relative flex size-6 items-center justify-center rounded-md from-emerald-400 to-indigo-500 shadow">
        <Gem className="mask-b-from-25% size-4 fill-white/95 stroke-white drop-shadow" />
    </div>
)

const DuskKitLogo = () => (
    <div className="bg-linear-to-b inset-ring inset-ring-foreground/15 shadow-black/6.5 relative flex size-6 items-center justify-center rounded-md from-purple-300 to-blue-600 shadow">
        <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
        <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
        <MoonStar className="size-4 fill-white/75 stroke-white drop-shadow" />
    </div>
)

const MistKitLogo = () => (
    <div className="bg-linear-to-b shadow-black/6.5 inset-ring inset-ring-foreground/15 relative flex size-6 items-center justify-center rounded-md from-lime-300 to-teal-600 shadow">
        <BookOpen className="mask-b-from-25% z-1 relative size-4 fill-white/75 stroke-white drop-shadow-sm" />
    </div>
)

const VeilKitLogo = () => (
    <div className="bg-linear-to-b shadow-black/6.5 inset-ring inset-ring-foreground/15 relative flex size-6 items-center justify-center rounded-md from-[#98785d] to-[#9b978c] shadow">
        <Atom className="mask-b-from-25% z-1 relative size-4 fill-white stroke-white drop-shadow-sm" />
        <Atom className="z-2 absolute inset-0 m-auto size-4 fill-white stroke-white opacity-65 drop-shadow-sm" />
    </div>
)
