"use client"

import { useEffect, useRef } from "react"
import ForceGraph2D from "react-force-graph-2d"

const data = {
  nodes: [
    { id: "Marie Laurent", group: 1, size: 15 },
    { id: "INSERM", group: 2, size: 10 },
    { id: "Hôpital Necker", group: 2, size: 8 },
    { id: "CNRS", group: 2, size: 10 },
    { id: "INRIA", group: 2, size: 10 },
    { id: "Renault", group: 3, size: 8 },
    { id: "Valeo", group: 3, size: 8 },
    { id: "Jean Dupont", group: 4, size: 6 },
    { id: "Sarah Martin", group: 4, size: 6 },
    { id: "Thomas Chen", group: 4, size: 6 },
    { id: "Université Paris-Saclay", group: 5, size: 10 },
    { id: "École Normale Supérieure", group: 5, size: 8 },
    { id: "Sorbonne Université", group: 5, size: 8 },
  ],
  links: [
    { source: "Marie Laurent", target: "INSERM", value: 5 },
    { source: "Marie Laurent", target: "Hôpital Necker", value: 3 },
    { source: "Marie Laurent", target: "CNRS", value: 5 },
    { source: "Marie Laurent", target: "INRIA", value: 5 },
    { source: "Marie Laurent", target: "Renault", value: 2 },
    { source: "Marie Laurent", target: "Valeo", value: 2 },
    { source: "Marie Laurent", target: "Jean Dupont", value: 4 },
    { source: "Marie Laurent", target: "Sarah Martin", value: 3 },
    { source: "Marie Laurent", target: "Thomas Chen", value: 3 },
    { source: "Marie Laurent", target: "Université Paris-Saclay", value: 5 },
    { source: "Marie Laurent", target: "École Normale Supérieure", value: 3 },
    { source: "Marie Laurent", target: "Sorbonne Université", value: 2 },
    { source: "Jean Dupont", target: "CNRS", value: 2 },
    { source: "Sarah Martin", target: "INSERM", value: 2 },
    { source: "Thomas Chen", target: "INRIA", value: 2 },
    { source: "INSERM", target: "Hôpital Necker", value: 3 },
    { source: "CNRS", target: "INRIA", value: 3 },
    { source: "Renault", target: "Valeo", value: 1 },
  ],
}

export function NetworkGraph() {
  const containerRef = useRef(null)

  useEffect(() => {
    // Force re-render on window resize
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth
        const newHeight = containerRef.current.clientHeight
        containerRef.current.style.width = `${newWidth}px`
        containerRef.current.style.height = `${newHeight}px`
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph2D
        graphData={data}
        nodeRelSize={6}
        nodeAutoColorBy="group"
        linkWidth={link => link.value / 2}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={link => link.value / 2}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id
          const fontSize = 12 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

          // Add a background to the text for better readability
          const textWidth = ctx.measureText(label).width
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4)

          ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1],
          )

          ctx.fillStyle = "white"
          ctx.fillText(label, node.x, node.y)
        }}
      />
    </div>
  )
}
