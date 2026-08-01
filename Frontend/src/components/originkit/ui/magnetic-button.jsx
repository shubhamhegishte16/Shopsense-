import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState } from "react"

const MAX_PULL = 0.35

export default function MagneticButton({
  label = "Log In",
  onClick,
  type = "submit",
  className = "",
  style = {},
  disabled = false,
  children,
}) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX * MAX_PULL)
    y.set(distanceY * MAX_PULL)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: "16px 28px",
        background: "var(--clr-primary, #154539)",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "999px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 12px 32px rgba(21, 69, 57, 0.4)"
          : "0 4px 16px rgba(21, 69, 57, 0.15)",
        transition: "box-shadow 0.3s ease",
        ...style,
      }}
      className={className}
      whileTap={{ scale: 0.98 }}
    >
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "8px" }}>
        {label}
        {children}
      </span>

      {/* Hover Sweep Glow Effect */}
      <motion.div
        animate={{
          scale: hovered ? 2 : 0,
          opacity: hovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, #2F5D50 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </motion.button>
  )
}
