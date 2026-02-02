import React from 'react'

export const BlockPreviewWrapper = ({ children, id, height }: { children: React.ReactNode; id: string; height: number }) => {
    return (
        <section
            id={id}
            className="scroll-my-6 pb-16">
            <div
                className="h-(--block-height) group [--block-height:36rem] lg:[--block-height:var(--block-static-height)]"
                style={{ '--block-static-height': `${height + 48}px` } as React.CSSProperties}>
                {children}
            </div>
        </section>
    )
}
