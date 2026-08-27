import { useEffect, useState } from 'react'

export default function StoryTour({ items = [] }) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveId(visible[0].target.id)
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 1] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav className="story-tour" aria-label="本厅导览">
      <span>本厅导览</span>
      {items.map((item) => <a className={activeId === item.id ? 'is-active' : ''} href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined} key={item.id}>{item.label}</a>)}
    </nav>
  )
}
