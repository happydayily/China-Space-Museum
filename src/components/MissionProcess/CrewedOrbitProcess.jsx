import ProcessHeader from './ProcessHeader'
import StageList from './StageList'
import useProcessPlayback from './useProcessPlayback'

export default function CrewedOrbitProcess({ process }) {
  const [activeIndex, setActiveIndex] = useProcessPlayback(process.stages.length)
  const activeStage = process.stages[activeIndex]

  return (
    <section className="mission-process mission-process--crewed">
      <ProcessHeader process={process} />
      <div className="process-stats">
        {process.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
      </div>
      <div className="crewed-process-layout">
        <div className={`crew-orbit-visual crew-orbit-visual--${activeStage.id}`}>
          <div className="orbit-earth"><span>地球</span></div>
          <div className="near-earth-orbit"><i className="crew-spacecraft" /></div>
          <div className="orbit-count"><strong>14</strong><span>圈近地绕飞</span></div>
          <div className="active-stage-readout"><span>{String(activeIndex + 1).padStart(2, '0')}</span><strong>{activeStage.title}</strong><p>{activeStage.description}</p></div>
        </div>
        <StageList stages={process.stages} activeIndex={activeIndex} onSelect={setActiveIndex} compact />
      </div>
    </section>
  )
}
