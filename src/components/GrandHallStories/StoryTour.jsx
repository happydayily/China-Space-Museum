export default function StoryTour({ items = [] }) {
  return (
    <nav className="story-tour" aria-label="本厅导览">
      <span>本厅导览</span>
      {items.map((item) => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}
    </nav>
  )
}
