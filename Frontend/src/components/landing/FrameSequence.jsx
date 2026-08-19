import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 240

export default function FrameSequence({ scrollProgress }) {
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)

  // Preload frames
  useEffect(() => {
    const loadedImages = []
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const paddedNum = i.toString().padStart(3, '0')
      img.src = `/frames/ezgif-frame-${paddedNum}.png`
      loadedImages.push(img)
    }
    setImages(loadedImages)
  }, [])

  // Update target frame when scroll changes
  useEffect(() => {
    targetFrameRef.current = scrollProgress * (TOTAL_FRAMES - 1)
  }, [scrollProgress])

  // Render loop for buttery smooth easing
  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return
    const context = canvasRef.current.getContext('2d')
    let animationFrameId

    const render = () => {
      // Lerp current frame towards target frame
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.08
      
      const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)))
      const img = images[frameIndex]

      if (img && img.complete) {
        const canvas = canvasRef.current
        if (!canvas) return
        const { width, height } = canvas.getBoundingClientRect()
        
        // Match canvas internal resolution to display size
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        // Draw image using 'contain' logic to ensure the whole product is visible.
        // Since the image background matches the page background, there are no visible edges.
        const hRatio = canvas.width / img.width
        const vRatio = canvas.height / img.height
        const ratio  = Math.min(hRatio, vRatio)
        const centerShift_x = (canvas.width - img.width * ratio) / 2
        const centerShift_y = (canvas.height - img.height * ratio) / 2
        
        // Fill canvas with page background color just in case
        context.fillStyle = 'var(--clr-bg, #FFFFFF)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        context.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)
      }

      animationFrameId = requestAnimationFrame(render)
    }
    
    render()

    return () => cancelAnimationFrame(animationFrameId)
  }, [images])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
