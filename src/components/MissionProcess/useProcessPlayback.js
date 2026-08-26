import { useEffect, useState } from 'react'

export default function useProcessPlayback(length, resetKey = '') {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => setActiveIndex(0), [resetKey])

  useEffect(() => {
    if (length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [length, resetKey])

  return [activeIndex, setActiveIndex]
}
