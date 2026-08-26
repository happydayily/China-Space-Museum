import ProcessHeader from './ProcessHeader'
import useProcessPlayback from './useProcessPlayback'

export default function MarsProcess({ process }) {
  const stages = process.chapters.flatMap((chapter) => chapter.stages.map((stage) => ({ ...stage, chapterId: chapter.id })))
  const [activeIndex, setActiveIndex] = useProcessPlayback(stages.length)
  const activeStage = stages[activeIndex]

  return (
    <section className="mission-process mission-process--mars">
      <ProcessHeader process={process} />
      <div className={`mars-visual mars-visual--${activeStage.chapterId}`}>
        <div className="mars-sun"><span>太阳</span></div>
        <div className="mars-earth"><span>地球</span></div>
        <div className="mars-planet"><span>火星</span></div>
        <div className="mars-transfer-line"><i /></div>
        <div className="mars-lander"><i /></div>
        <div className="mars-rover"><i /><span>祝融号</span></div>
        <div className="mars-stage-readout"><span>{String(activeIndex + 1).padStart(2, '0')}</span><strong>{activeStage.title}</strong><p>{activeStage.description}</p></div>
      </div>
      <div className="mars-chapters">
        {process.chapters.map((chapter) => {
          const chapterIndexes = stages.map((stage, index) => stage.chapterId === chapter.id ? index : -1).filter((index) => index >= 0)
          const isActive = chapter.id === activeStage.chapterId
          return (
            <article className={isActive ? 'active' : ''} key={chapter.id}>
              <header><span>{chapter.title}</span><p>{chapter.description}</p></header>
              <ol>
                {chapterIndexes.map((index) => (
                  <li className={index === activeIndex ? 'active' : ''} key={stages[index].id}>
                    <button type="button" onClick={() => setActiveIndex(index)}>
                      <span>{String(index + 1).padStart(2, '0')}</span><strong>{stages[index].title}</strong>
                    </button>
                  </li>
                ))}
              </ol>
            </article>
          )
        })}
      </div>
    </section>
  )
}
