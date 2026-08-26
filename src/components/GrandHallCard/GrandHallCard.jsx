export default function GrandHallCard({ hall, onEnter }) {
  return (
    <button className="grand-hall-card" style={{ '--hall-color': hall.color }} type="button" onClick={() => onEnter(hall.id)}>
      <span className="grand-hall-card-index">{hall.index}</span>
      <strong>{hall.name}</strong>
      <small>{hall.shortName} · {hall.period}</small>
      <em>{hall.question}</em>
      <span>展开发展脉络 ↗</span>
    </button>
  )
}
