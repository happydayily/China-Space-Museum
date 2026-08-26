import ProcessHeader from './ProcessHeader'
import StageList from './StageList'
import useProcessPlayback from './useProcessPlayback'

export default function StationAssemblyProcess({ process }) {
  const [activeIndex, setActiveIndex] = useProcessPlayback(process.stages.length)
  const activeStage = process.stages[activeIndex]

  return (
    <section className="mission-process mission-process--station">
      <ProcessHeader process={process} />
      <div className="station-process-layout">
        <div className={`station-assembly station-assembly--${activeStage.formation}`}>
          <div className="station-orbit-line" />
          <div className="station-module station-module--tianhe"><i /><strong>天和</strong></div>
          <div className="station-module station-module--wentian"><i /><strong>问天</strong></div>
          <div className="station-module station-module--mengtian"><i /><strong>梦天</strong></div>
          <div className="station-active-stage"><span>{String(activeIndex + 1).padStart(2, '0')}</span><strong>{activeStage.title}</strong><p>{activeStage.description}</p></div>
        </div>
        <StageList stages={process.stages} activeIndex={activeIndex} onSelect={setActiveIndex} compact />
      </div>
    </section>
  )
}
