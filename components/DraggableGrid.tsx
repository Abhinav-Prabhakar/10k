// Draggable Grid — Originkit
// Using component defaults.

"use client"

import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"

export type GridItem = {
    image?: { src?: string; srcSet?: string; alt?: string }
    alt?: string
    title?: string
    category?: string
    milestonePreview?: string
}

export interface DraggableGridProps {
    items?: GridItem[]
    columns?: number
    imageWidth?: number
    imageHeight?: number
    rounded?: number
    gap?: number
    enableWheel?: boolean
    placeholderColor?: string
    onItemClick?: (item: GridItem, index: number) => void
    style?: React.CSSProperties
}

const defaultItems: GridItem[] = [
    {
        image: {
            src: "https://images.unsplash.com/photo-1520523839898-50712140b43a?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Grand Piano",
        title: "Classical Piano",
        category: "Music & Repertoire",
        milestonePreview: "Play Chopin Ballade No. 1 from memory",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Chess Grandmaster",
        title: "Chess",
        category: "Strategy & Calculation",
        milestonePreview: "FIDE 2200 Candidate Master evaluation",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Fine Art Oil Painting",
        title: "Oil Painting",
        category: "Visual Arts",
        milestonePreview: "Chiaroscuro portrait from life in single sitting",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Software Architecture & Code",
        title: "Systems Architecture",
        category: "Computing & Logic",
        milestonePreview: "Design high-throughput distributed consensus engine",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Classical Guitar",
        title: "Classical Guitar",
        category: "Music & Strings",
        milestonePreview: "Flawless tremolo on Recuerdos de la Alhambra",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Big Wave Surfing",
        title: "Big Wave Surfing",
        category: "Physical Mastery",
        milestonePreview: "Effortless barrel riding on double-overhead reef breaks",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Japanese Calligraphy Shodo",
        title: "Japanese & Kanji",
        category: "Language & Linguistics",
        milestonePreview: "Full JLPT N1 fluency & 2,136 Jouyou Kanji reading",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Film Photography",
        title: "Film Photography",
        category: "Visual Storytelling",
        milestonePreview: "Zone System darkroom silver gelatin mastery",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        },
        alt: "3D Procedural Sculpting",
        title: "3D Sculpting",
        category: "Digital Arts",
        milestonePreview: "Anatomically flawless organic character modelling",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Pure Mathematics",
        title: "Pure Mathematics",
        category: "Theory & Proof",
        milestonePreview: "Deep intuition in differential geometry and topology",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Creative Writing",
        title: "Creative Writing",
        category: "Literature",
        milestonePreview: "Publish a compelling 90,000-word historical fiction novel",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Woodworking Joinery",
        title: "Fine Woodworking",
        category: "Craftsmanship",
        milestonePreview: "Hand-cut Japanese sashimono joinery with zero fasteners",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Violin Repertoire",
        title: "Violin",
        category: "Music & Performance",
        milestonePreview: "Master Bach Partita No. 2 Chaconne with rich tone",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Gymnastics & Calisthenics",
        title: "Calisthenics",
        category: "Body Mastery",
        milestonePreview: "Strict one-arm handstand & full maltese on still rings",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Culinary Arts & Gastronomy",
        title: "Culinary Arts",
        category: "Craft & Flavor",
        milestonePreview: "French mother sauce perfection and spontaneous tasting menus",
    },
    {
        image: {
            src: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?auto=format&fit=crop&w=800&q=80",
        },
        alt: "Bonsai Tree Cultivation",
        title: "Bonsai Cultivation",
        category: "Botanical Arts",
        milestonePreview: "Decade-long structural wiring & deadwood jin carving",
    },
]

// Distinct visible color per tile (golden-angle hue rotation) so the grid is
// always visible even when images don't load.
function getItemColor(index: number) {
    const hue = (index * 137.508) % 360
    return `hsl(${hue}, 35%, 20%)`
}

// Deterministic PRNG (mulberry32) so the shuffle is stable across renders
// once seeded — no flicker on every re-render.
function mulberry32(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Fill a target length by repeating items, shuffled so neighbours don't
// duplicate the same source item where possible.
function fillAndShuffle<T>(items: T[], target: number, seed: number): T[] {
    if (items.length === 0) return []
    const rand = mulberry32(seed)
    const out: T[] = []
    // Build a pool: one shuffled copy of items, refilled when exhausted.
    const refill = () => {
        const pool = items.slice()
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1))
            ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }
        return pool
    }
    let pool = refill()
    while (out.length < target) {
        if (pool.length === 0) pool = refill()
        const next = pool.pop()!
        // Try to avoid placing the same item immediately after itself.
        if (out.length > 0 && next === out[out.length - 1] && pool.length > 0) {
            const swap = pool.pop()!
            out.push(swap)
            pool.push(next)
        } else {
            out.push(next)
        }
    }
    return out
}

const COMPONENT_DEFAULTS = {
    items: defaultItems,
    columns: 12,
    imageWidth: 240,
    imageHeight: 300,
    rounded: 5,
    gap: 4,
    enableWheel: true,
    placeholderColor: "#121217",
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 600
 */
export default function DraggableGrid(props: DraggableGridProps) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        items,
        columns,
        imageWidth,
        imageHeight,
        rounded,
        gap,
        enableWheel,
        onItemClick,
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const [containerSize, setContainerSize] = useState({ w: 800, h: 600 })
    const [isDragging, setIsDragging] = useState(false)
    const initializedRef = useRef(false)

    const pointerDownPos = useRef<{ x: number; y: number; t: number } | null>(
        null
    )
    const wheelAnimX = useRef<ReturnType<typeof animate> | null>(null)
    const wheelAnimY = useRef<ReturnType<typeof animate> | null>(null)
    const failedImages = useRef<Set<number>>(new Set())
    const [, forceRender] = useState(0)

    const safeItems =
        Array.isArray(items) && items.length > 0 ? items : defaultItems
    const safeColumns = Math.max(1, Math.min(20, Math.floor(columns || 12)))
    // Image dimensions match CurveGallery (px, clamped 20–4000).
    const safeImageWidth = Math.max(20, Math.min(4000, imageWidth ?? 240))
    const safeImageHeight = Math.max(20, Math.min(4000, imageHeight ?? 300))
    // Gap matches CurveGallery: control is 0–100, ×4 → px. Same value spaces
    // tiles from each other AND the grid edge from the boundary (padding).
    const safeGap = Math.max(0, Math.min(100, gap ?? 4)) * 4
    // Rounded matches CurveGallery: 0 = square … 20 = circle (on short side).
    const r = Math.max(0, Math.min(20, rounded ?? 4))
    const radius = (r / 20) * (Math.min(safeImageWidth, safeImageHeight) / 2)

    // Square grid: rows === columns. Fill all cells by repeating items in a
    // shuffled order, so a small source list still produces a full grid.
    const rows = safeColumns
    const totalCells = safeColumns * rows
    const displayItems = useMemo(
        () => fillAndShuffle(safeItems, totalCells, 0xc0ffee),
        [safeItems, totalCells]
    )

    const gridW = safeColumns * safeImageWidth + (safeColumns - 1) * safeGap
    const gridH = rows * safeImageHeight + (rows - 1) * safeGap

    // Measure container with ResizeObserver
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const measure = () => {
            const rect = el.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
                setContainerSize({ w: rect.width, h: rect.height })
            }
        }
        measure()

        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Drag constraints: at either extreme the edge images stop exactly one
    // gap from the container border — no overshoot into empty space.
    // maxX/maxY: grid pinned `gap` from the top-left border.
    // minX/minY: grid's far edge `gap` from the bottom-right border.
    // When the grid is smaller than the container the range collapses to the
    // top-left position (min clamped to max), so it can't drift.
    const maxX = safeGap
    const minX = Math.min(maxX, containerSize.w - gridW - safeGap)
    const maxY = safeGap
    const minY = Math.min(maxY, containerSize.h - gridH - safeGap)

    const dragConstraints = {
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY,
    }

    // Pin the grid to the top-left corner so there are no centering margins —
    // the only spacing is the configured gap between images. Set once; after
    // that drag/wheel own the motion values.
    useEffect(() => {
        if (initializedRef.current) return
        if (containerSize.w === 0 || containerSize.h === 0) return

        x.set(maxX)
        y.set(maxY)
        initializedRef.current = true
    }, [containerSize.w, containerSize.h, maxX, maxY, x, y])

    // Wheel scrolling
    useEffect(() => {
        if (!enableWheel) return
        const el = containerRef.current
        if (!el) return

        const clamp = (v: number, mn: number, mx: number) =>
            Math.min(Math.max(v, mn), mx)

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const curX = x.get()
            const curY = y.get()
            const targetX = clamp(curX - e.deltaX, minX, maxX)
            const targetY = clamp(curY - e.deltaY, minY, maxY)
            if (wheelAnimX.current) wheelAnimX.current.stop()
            if (wheelAnimY.current) wheelAnimY.current.stop()
            wheelAnimX.current = animate(x, targetX, {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            })
            wheelAnimY.current = animate(y, targetY, {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            })
        }

        el.addEventListener("wheel", onWheel, { passive: false })
        return () => {
            el.removeEventListener("wheel", onWheel)
            if (wheelAnimX.current) wheelAnimX.current.stop()
            if (wheelAnimY.current) wheelAnimY.current.stop()
        }
    }, [enableWheel, minX, maxX, minY, maxY, x, y])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    }, [])

    const handlePointerUp = useCallback(
        (e: React.PointerEvent, item: GridItem, index: number) => {
            const start = pointerDownPos.current
            pointerDownPos.current = null
            if (!start) return
            const dx = e.clientX - start.x
            const dy = e.clientY - start.y
            const moved = Math.hypot(dx, dy)
            if (moved < 5) {
                onItemClick?.(item, index)
            }
        },
        [onItemClick]
    )

    const handleImageError = useCallback((index: number) => {
        failedImages.current.add(index)
        forceRender((n) => n + 1)
    }, [])

    const wrapperStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: "100%",
        minHeight: "100%",
        margin: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        ...style,
    }

    const gridStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: gridW,
        height: gridH,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: `repeat(${safeColumns}, ${safeImageWidth}px)`,
        gridAutoRows: `${safeImageHeight}px`,
        gap: `${safeGap}px`,
        willChange: "transform",
    }

    return (
        <div ref={containerRef} style={wrapperStyle}>
            <motion.div
                style={{ ...gridStyle, x, y }}
                drag
                dragConstraints={dragConstraints}
                dragElastic={0}
                dragMomentum={true}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
            >
                {displayItems.map((item, index) => {
                    const src = item?.image?.src
                    const alt = item?.alt ?? item?.image?.alt ?? ""
                    const title = item?.title ?? `Skill #${index + 1}`
                    const category = item?.category
                    const failed = failedImages.current.has(index)
                    return (
                        <div
                            key={index}
                            onPointerDown={handlePointerDown}
                            onPointerUp={(e) => handlePointerUp(e, item, index)}
                            className="group relative transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
                            style={{
                                position: "relative",
                                width: safeImageWidth,
                                height: safeImageHeight,
                                overflow: "hidden",
                                borderRadius: radius,
                                backgroundColor: getItemColor(index),
                                color: "rgba(255,255,255,0.92)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                fontFamily:
                                    "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                cursor: isDragging ? "grabbing" : "pointer",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    top: "14px",
                                    left: "14px",
                                    zIndex: 2,
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    padding: "3px 8px",
                                    borderRadius: "9999px",
                                }}
                            >
                                {category || `10,000h`}
                            </span>

                            {src && !failed ? (
                                <img
                                    src={src}
                                    alt={alt}
                                    draggable={false}
                                    onError={() => handleImageError(index)}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        pointerEvents: "none",
                                        userSelect: "none",
                                        display: "block",
                                        zIndex: 1,
                                    }}
                                />
                            ) : null}

                            {/* Dark Gradient Overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.92) 100%)",
                                    zIndex: 2,
                                    pointerEvents: "none",
                                }}
                            />

                            {/* Card Content Footer */}
                            <div
                                style={{
                                    position: "relative",
                                    zIndex: 3,
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        letterSpacing: "-0.02em",
                                        color: "#ffffff",
                                        lineHeight: 1.2,
                                        margin: 0,
                                    }}
                                >
                                    {title}
                                </h3>
                                {item.milestonePreview ? (
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(255, 255, 255, 0.65)",
                                            margin: 0,
                                            lineHeight: 1.3,
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {item.milestonePreview}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </motion.div>
        </div>
    )
}
