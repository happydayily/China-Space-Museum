import { useState } from 'react'
import missions from '../../data/missions.json'
import AssetGallery from '../AssetGallery/AssetGallery'
import { findRelatedAssets } from '../../utils/assetRegistry'

export default function MissionViewer() {
  const [activeId, setActiveId] = useState(missions[0]?.id)
  const mission = missions.find((item) => item.id === activeId) ?? missions[0]
  const missionAssets = findRelatedAssets(mission?.id, mission?.name)

  if (!mission) return null

  return (
    <section className="mission-section">
      <div className="mission-tabs" aria-label="选择航天任务">
        {missions.map((item) => (
          <button className={item.id === mission.id ? 'active' : ''} key={item.id} onClick={() => setActiveId(item.id)}>
            <span>{item.year}</span>{item.name}
          </button>
        ))}
      </div>
      <div className="mission-panel">
        <AssetGallery assets={missionAssets} title={mission.name} />
        <div className="mission-copy">
          <span className="section-kicker">任务档案 · {mission.year}</span>
          <h2>{mission.name}<br /><span>{mission.type}</span></h2>
          <p>{mission.description}</p>
        </div>
        <div className="mission-data">
          <div className="mission-meta"><span>运载火箭</span><strong>{mission.rocket}</strong></div>
          <div className="mission-route" aria-label={`${mission.name}任务路线`}>
            {mission.route.map((point, index) => (
              <div className="route-point" key={point}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{point}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
