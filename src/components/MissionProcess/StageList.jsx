export default function StageList({ stages, activeIndex, onSelect, compact = false }) {
  return (
    <ol className={`process-stages ${compact ? 'process-stages--compact' : ''}`}>
      {stages.map((stage, index) => (
        <li className={index === activeIndex ? 'active' : ''} key={stage.id}>
          <button type="button" onClick={() => onSelect(index)} aria-current={index === activeIndex ? 'step' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{stage.title}</strong>
            <p>{stage.description}</p>
          </button>
        </li>
      ))}
    </ol>
  )
}
