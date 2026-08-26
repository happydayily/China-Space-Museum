export default function ProcessHeader({ process }) {
  return (
    <header className="process-header">
      <div>
        <span className="section-kicker">{process.kicker}</span>
        <h2>{process.title}</h2>
      </div>
      <p>{process.description}</p>
    </header>
  )
}
