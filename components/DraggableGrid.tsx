// Draggable Grid — Originkit
// Using component defaults.

"use client"

import Image from "next/image"
import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"

type GridItem = {
    image?: { src?: string; srcSet?: string; alt?: string }
    alt?: string
}

interface DraggableGridProps {
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
        image: { src: "/images/piano.jpg" },
        alt: "Piano",
    },
    {
        image: { src: "/images/chess.jpg" },
        alt: "Chess",
    },
    {
        image: { src: "/images/gym.jpg" },
        alt: "Gym",
    },
    {
        image: { src: "/images/cycling.jpg" },
        alt: "Cycling",
    },
    {
        image: { src: "/images/guitar.jpg" },
        alt: "Guitar",
    },
    {
        image: { src: "/images/coding.jpg" },
        alt: "Coding",
    },
    {
        image: { src: "/images/basketball.jpg" },
        alt: "Basketball",
    },
    {
        image: { src: "/images/boxing.jpg" },
        alt: "Boxing",
    },
    {
        image: { src: "/images/cooking.jpg" },
        alt: "Cooking",
    },
    {
        image: { src: "/images/jee.jpg" },
        alt: "JEE",
    },
    {
        image: { src: "/images/painting.jpg" },
        alt: "Painting",
    },
    {
        image: { src: "/images/swimming.jpg" },
        alt: "Swimming",
    },
    {
        image: { src: "/images/archery.jpg" },
        alt: "Archery",
    },
    {
        image: { src: "/images/cali.jpg" },
        alt: "Calisthenics",
    },
    {
        image: { src: "/images/dancing.jpg" },
        alt: "Dancing",
    },
    {
        image: { src: "/images/golfing.jpg" },
        alt: "Golfing",
    },
    {
        image: { src: "/images/ice-skating.jpg" },
        alt: "Ice Skating",
    },
    {
        image: { src: "/images/karting.jpg" },
        alt: "Karting",
    },
    {
        image: { src: "/images/martial-arts.png" },
        alt: "Martial Arts",
    },
    {
        image: { src: "/images/running.jpg" },
        alt: "Running",
    },
]

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

// Spatially disperses items across a 2D grid such that identical/repeating items
// are maximally separated in 2D Euclidean distance (no repeating images adjacent
// horizontally, vertically, or diagonally, and separated as far as possible).
function distribute2DGrid<T>(items: T[], cols: number, rows: number, seed: number): T[] {
    const K = items.length
    const N = cols * rows
    if (K === 0 || N === 0) return []
    if (K === 1) return new Array(N).fill(items[0])
    const rand = mulberry32(seed)

    // Build balanced item counts across the grid
    const counts = new Array(K).fill(Math.floor(N / K))
    const remainder = N % K
    const perm = Array.from({ length: K }, (_, i) => i)
    for (let i = K - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[perm[i], perm[j]] = [perm[j], perm[i]]
    }
    for (let i = 0; i < remainder; i++) counts[perm[i]]++

    const grid = new Array(N).fill(-1)
    const itemPos: number[][] = Array.from({ length: K }, () => [])

    const distSq = (idx1: number, idx2: number) => {
        const r1 = Math.floor(idx1 / cols)
        const c1 = idx1 % cols
        const r2 = Math.floor(idx2 / cols)
        const c2 = idx2 % cols
        const dr = r1 - r2
        const dc = c1 - c2
        return dr * dr + dc * dc
    }

    // Step 1: Greedy electrostatic potential placement
    for (let cell = 0; cell < N; cell++) {
        let bestScore = -Infinity
        let bestCandidates: number[] = []

        for (let item = 0; item < K; item++) {
            if (counts[item] <= 0) continue
            const positions = itemPos[item]
            if (positions.length === 0) {
                bestCandidates = [item]
                bestScore = Infinity
                break
            }
            let minDistSq = Infinity
            for (let i = 0; i < positions.length; i++) {
                const d2 = distSq(cell, positions[i])
                if (d2 < minDistSq) minDistSq = d2
            }
            if (minDistSq > bestScore) {
                bestScore = minDistSq
                bestCandidates = [item]
            } else if (minDistSq === bestScore) {
                bestCandidates.push(item)
            }
        }

        const chosenItem =
            bestCandidates[Math.floor(rand() * bestCandidates.length)]
        grid[cell] = chosenItem
        counts[chosenItem]--
        itemPos[chosenItem].push(cell)
    }

    // Step 2: Steep repulsion energy penalty to eliminate close identical pairs
    const pairEnergy = (d2: number) => {
        if (d2 <= 1) return 1000000 // immediate orthogonal neighbor (dist 1)
        if (d2 <= 2) return 500000 // immediate diagonal neighbor (dist ~1.414)
        if (d2 <= 4) return 100000 // 2 steps away (dist 2)
        if (d2 <= 5) return 50000 // knight move (dist ~2.236)
        if (d2 <= 8) return 20000 // dist ~2.828
        if (d2 <= 9) return 10000 // dist 3
        if (d2 <= 13) return 3000 // dist ~3.6
        if (d2 <= 16) return 1000 // dist 4
        return 100 / d2
    }

    const cellEnergy = (cell: number, item: number) => {
        let energy = 0
        const positions = itemPos[item]
        for (let i = 0; i < positions.length; i++) {
            const p = positions[i]
            if (p === cell) continue
            energy += pairEnergy(distSq(cell, p))
        }
        return energy
    }

    // Step 3: Local swap optimization to maximize distances
    const iterations = Math.min(10000, N * 50)
    for (let it = 0; it < iterations; it++) {
        const c1 = Math.floor(rand() * N)
        const c2 = Math.floor(rand() * N)
        if (c1 === c2) continue
        const item1 = grid[c1]
        const item2 = grid[c2]
        if (item1 === item2) continue

        const currentE = cellEnergy(c1, item1) + cellEnergy(c2, item2)

        const idx1InArr = itemPos[item1].indexOf(c1)
        const idx2InArr = itemPos[item2].indexOf(c2)
        itemPos[item1][idx1InArr] = c2
        itemPos[item2][idx2InArr] = c1

        const newE = cellEnergy(c1, item2) + cellEnergy(c2, item1)

        if (newE <= currentE) {
            grid[c1] = item2
            grid[c2] = item1
        } else {
            // Revert
            itemPos[item1][idx1InArr] = c1
            itemPos[item2][idx2InArr] = c2
        }
    }

    return grid.map((idx) => items[idx])
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
        placeholderColor,
        onItemClick,
        style,
    } = props

    const safeColumns = Math.max(1, Math.min(20, Math.floor(columns || 5)))
    // Image dimensions match CurveGallery (px, clamped 20–4000).
    const safeImageWidth = Math.max(20, Math.min(4000, imageWidth ?? 150))
    const safeImageHeight = Math.max(20, Math.min(4000, imageHeight ?? 210))
    // Gap matches CurveGallery: control is 0–100, ×4 → px. Same value spaces
    // tiles from each other AND the grid edge from the boundary (padding).
    const safeGap = Math.max(0, Math.min(100, gap ?? 4)) * 4
    // Rounded matches CurveGallery: 0 = square … 20 = circle (on short side).
    const r = Math.max(0, Math.min(20, rounded ?? 3))
    const radius = (r / 20) * (Math.min(safeImageWidth, safeImageHeight) / 2)

    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(safeGap)
    const y = useMotionValue(safeGap)

    const [containerSize, setContainerSize] = useState({ w: 800, h: 600 })
    const [isDragging, setIsDragging] = useState(false)
    const initializedRef = useRef(false)

    const pointerDownPos = useRef<{ x: number; y: number; t: number } | null>(
        null
    )
    const wheelAnimX = useRef<ReturnType<typeof animate> | null>(null)
    const wheelAnimY = useRef<ReturnType<typeof animate> | null>(null)
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

    const safeItems =
        Array.isArray(items) && items.length > 0 ? items : defaultItems

    // Square grid: rows === columns. Fill all cells by repeating items in a
    // shuffled order, so a small source list still produces a full grid.
    const rows = safeColumns
    const displayItems = useMemo(
        () => distribute2DGrid(safeItems, safeColumns, rows, 0xc0ffee),
        [safeItems, safeColumns, rows]
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
        setFailedImages((prev) => {
            if (prev.has(index)) return prev
            const next = new Set(prev)
            next.add(index)
            return next
        })
    }, [])

    const wrapperStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 600,
        minHeight: 600,
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
                    const failed = failedImages.has(index)
                    return (
                        <div
                            key={index}
                            onPointerDown={handlePointerDown}
                            onPointerUp={(e) => handlePointerUp(e, item, index)}
                            style={{
                                position: "relative",
                                width: safeImageWidth,
                                height: safeImageHeight,
                                overflow: "hidden",
                                borderRadius: radius,
                                backgroundColor: placeholderColor || "#1a1a1f",
                                color: "rgba(255,255,255,0.85)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily:
                                    "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                cursor: isDragging ? "grabbing" : "pointer",
                            }}
                        >
                            {src && !failed ? (
                                <Image
                                    src={src}
                                    alt={alt}
                                    draggable={false}
                                    onError={() => handleImageError(index)}
                                    fill
                                    priority={index < 25}
                                    loading={index < 25 ? "eager" : "lazy"}
                                    sizes={`${safeImageWidth}px`}
                                    style={{
                                        objectFit: "cover",
                                        pointerEvents: "none",
                                        userSelect: "none",
                                        zIndex: 1,
                                    }}
                                />
                            ) : null}
                        </div>
                    )
                })}
            </motion.div>
        </div>
    )
}

const COMPONENT_DEFAULTS = {
    items: defaultItems,
    columns: 15,
    imageWidth: 200,
    imageHeight: 200,
    rounded: 3,
    gap: 5,
    enableWheel: false,
    placeholderColor: "#1a1a1f",
}
