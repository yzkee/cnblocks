import type { Metadata } from 'next'
import { DevToolbar } from '@/components/toolbar'
import { notFound } from 'next/navigation'
import { blocks } from '@/data/blocks'

export async function generateStaticParams() {
    return blocks.flatMap((block) => {
        const kitShortName = block.kit?.replace('-kit', '') || 'mist'
        return {
            slug: [kitShortName, block.category, block.id],
        }
    })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params

    if (!slug || slug.length < 3) {
        return { title: 'Preview | Tailark' }
    }

    const [kitShortName, category, variant] = slug

    const categoryDisplay = category
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

    const variantDisplay = variant
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

    return {
        title: `${categoryDisplay} ${variantDisplay} | Tailark ${kitShortName.charAt(0).toUpperCase() + kitShortName.slice(1)}`,
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tailark.com'),
        openGraph: {
            title: `${kitShortName} - ${category} ${variant}`,
            images: [`/og?type=preview&slug=${slug.join(',')}`],
        },
        twitter: {
            card: 'summary_large_image',
            images: [`/og?type=preview&slug=${slug.join(',')}`],
        },
        alternates: {
            canonical: `/preview/${kitShortName}/${category}/${variant}`,
        },
    }
}

async function getParams({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params

    return slug
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const slug = await getParams({ params })

    if (!slug || slug.length < 3) {
        notFound()
    }

    const [kitShortName, category, variant] = slug

    return (
        <>
            {process.env.NODE_ENV === 'development' && <DevToolbar />}

            <div
                data-theme={kitShortName === 'mist' ? 'mist' : kitShortName === 'veil' ? 'veil' : ''}
                className="scheme-light selection:bg-foreground/10 selection:text-primary dark:selection:bg-foreground/10 bg-background dark:scheme-dark">
                <LazyBlock
                    kitShortName={kitShortName}
                    category={category}
                    variant={variant}
                />
            </div>
        </>
    )
}

async function LazyBlock({ kitShortName, category, variant }: { kitShortName: string; category: string; variant: string }) {
    'use cache'
    try {
        const BlockModule = await import(`./../../../../../packages/${kitShortName}-kit/blocks/${category}/${variant}`)
        const Block = BlockModule.default

        if (!Block) {
            notFound()
        }

        return <Block />
    } catch (error) {
        console.error(`Failed to load block: ${category}/${variant}`, error)
        notFound()
    }
}
