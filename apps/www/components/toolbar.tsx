'use client'
import { ArrowUpRight, MoveVertical, RotateCw, Ruler } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@tailark/core/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const ORIGINAL_WIDTH = 2880
const REDUCED_WIDTH = 686

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b)
}

function simplifyRatio(width: number, height: number): string {
    const divisor = gcd(width, height)
    const w = Math.round(width / divisor)
    const h = Math.round(height / divisor)

    if (w > 100 || h > 100) {
        const ratio = width / height

        const approximations = [
            { w: 90, h: Math.round(90 / ratio) },
            { w: Math.round(90 * ratio), h: 90 },
        ]
        const best = approximations.reduce((acc, curr) => (curr.w <= 90 && curr.h <= 90 ? curr : acc), approximations[0])
        return `${best.w} / ${best.h}`
    }
    return `${w} / ${h}`
}

export const DevToolbar = () => {
    const pathname = usePathname()
    const handleReload = () => {
        window.location.reload()
    }

    const pathParts = pathname.split('/').filter(Boolean)

    let categoryLink: string | null = null
    let kit: string | null = null
    let category: string | null = null
    let variant: string | null = null

    if (pathParts[0] === 'preview' && pathParts.length === 4) {
        kit = pathParts[1]
        category = pathParts[2]
        variant = pathParts[3]
        categoryLink = `/${category}/#${variant}`
    }

    const copyBlockMetadata = () => {
        if (!category || !variant) {
            console.error('Category or variant not found')
            return
        }

        const contentHeight = document.documentElement.scrollHeight

        if (!contentHeight) {
            console.error('Could not get content height')
            return
        }

        const reducedHeight = Math.round((contentHeight * REDUCED_WIDTH) / ORIGINAL_WIDTH)
        const aspectRatio = simplifyRatio(REDUCED_WIDTH, reducedHeight)

        const output = `{
    category: '${category}',
    variant: '${variant}',
    aspectRatio: ${aspectRatio},
    image: '/blocks/${category}-${variant}.png',
    width: ${REDUCED_WIDTH},
    height: ${reducedHeight},
},`

        navigator.clipboard.writeText(output)
        console.log('Block metadata copied:', output)
    }

    const copyInitialHeight = () => {
        if (!kit || !category || !variant) {
            console.error('Kit, category or variant not found')
            return
        }
        // Get the actual block content (first section or footer element rendered by the block)
        const blockContent = document.querySelector('section, footer')
        if (!blockContent) {
            console.error('Could not find block content element')
            return
        }
        const contentHeight = blockContent.getBoundingClientRect().height
        const output = `'${kit}/${category}/${variant}': ${Math.round(contentHeight)},`
        navigator.clipboard.writeText(output)
        console.log('Initial height copied:', output)
    }

    if (!pathname.includes('/preview')) {
        return null
    }

    return (
        <div
            data-theme="dark"
            className="z-100 **:hover:text-white border-white/6.5 fixed inset-x-0 bottom-4 mx-auto w-fit overflow-hidden rounded-full border bg-zinc-900/75 p-0.5 text-white shadow-xl shadow-black/30 ring-1 ring-black/75 backdrop-blur-3xl">
            <div className="flex items-center [--color-accent:color-mix(in_oklab,var(--color-foreground)5%,transparent)]">
                <ThemeToggle className="size-7 rounded-l-2xl rounded-r-md border border-transparent px-0 hover:border-white/5" />
                {categoryLink && (
                    <>
                        <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="group size-7 border border-transparent hover:border-white/5"
                            aria-label="Go to category">
                            <Link href={categoryLink}>
                                <ArrowUpRight className="size-4 duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                        <span className="mx-0.5 h-4 w-px bg-white/10" />

                        <Button
                            onClick={copyBlockMetadata}
                            size="icon"
                            variant="ghost"
                            className="group size-7 border border-transparent hover:border-white/5"
                            aria-label="Copy block metadata">
                            <Ruler className="size-4" />
                        </Button>
                        <Button
                            onClick={copyInitialHeight}
                            size="icon"
                            variant="ghost"
                            className="group size-7 border border-transparent hover:border-white/5"
                            aria-label="Copy initial height">
                            <MoveVertical className="size-4" />
                        </Button>
                        <span className="mx-0.5 h-4 w-px bg-white/10" />
                    </>
                )}
                <Button
                    onClick={handleReload}
                    size="icon"
                    variant="ghost"
                    className="rounded-r-2xl! group size-7 rounded-none rounded-l-md border border-transparent hover:border-white/5"
                    aria-label="Reload page">
                    <RotateCw className="size-4 duration-300 group-hover:rotate-45" />
                </Button>
            </div>
        </div>
    )
}
