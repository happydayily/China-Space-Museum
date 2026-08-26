import { getAssetById, resolveAssetSource } from '../../utils/assetRegistry'
import ProcessHeader from './ProcessHeader'
import StageList from './StageList'
import useProcessPlayback from './useProcessPlayback'

export default function HistoricalProcess({ process }) {
  const [activeIndex, setActiveIndex] = useProcessPlayback(process.stages.length)
  const archive = getAssetById('curated-dongfanghong-1-news-1970')
  const archiveUrl = resolveAssetSource(archive)

  return (
    <section className="mission-process mission-process--historical">
      <ProcessHeader process={process} />
      <div className="historical-process-layout">
        <div className="historical-archive-card">
          {archiveUrl && <img src={archiveUrl} alt={archive.description} />}
          <div>
            <span>历史档案</span>
            <strong>{archive.name}</strong>
            <p>{process.stages[activeIndex].description}</p>
          </div>
        </div>
        <StageList stages={process.stages} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </div>
    </section>
  )
}
