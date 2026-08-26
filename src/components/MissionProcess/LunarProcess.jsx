import { useState } from 'react'
import ProcessHeader from './ProcessHeader'
import StageList from './StageList'
import useProcessPlayback from './useProcessPlayback'

export default function LunarProcess({ process }) {
  const [missionId, setMissionId] = useState(process.defaultMission)
  const mission = process.missions.find((item) => item.id === missionId) ?? process.missions[0]
  const [activeIndex, setActiveIndex] = useProcessPlayback(mission.stages.length, mission.id)
  const progress = mission.stages.length > 1 ? activeIndex / (mission.stages.length - 1) : 0

  return (
    <section className="mission-process mission-process--lunar">
      <ProcessHeader process={process} />
      <div className="lunar-mission-tabs" aria-label="选择探月任务">
        {process.missions.map((item) => (
          <button className={item.id === mission.id ? 'active' : ''} type="button" onClick={() => setMissionId(item.id)} key={item.id}>
            <strong>{item.name}</strong><span>{item.summary}</span>
          </button>
        ))}
      </div>
      <div className="lunar-process-visual">
        <svg viewBox="0 0 1000 310" role="img" aria-label={`${mission.name}地月任务线路`}>
          <path className="lunar-route-base" d="M150 190 C330 20 600 25 800 150 C650 265 360 285 150 190" />
          <path className="lunar-route-progress" pathLength="1" style={{ strokeDasharray: `${Math.max(.04, progress)} 1` }} d="M150 190 C330 20 600 25 800 150 C650 265 360 285 150 190" />
        </svg>
        <div className="lunar-earth"><span>地球</span></div>
        <div className="lunar-moon"><span>月球</span></div>
        <div className="lunar-vehicle" style={{ '--process-progress': progress }}><i /></div>
        <div className="lunar-active-stage"><span>{mission.name} · {String(activeIndex + 1).padStart(2, '0')}</span><strong>{mission.stages[activeIndex].title}</strong><p>{mission.stages[activeIndex].description}</p></div>
        {mission.stats && <div className="lunar-stats">{mission.stats.map((stat) => <span key={stat.label}>{stat.label}<strong>{stat.value}</strong></span>)}</div>}
      </div>
      <StageList stages={mission.stages} activeIndex={activeIndex} onSelect={setActiveIndex} compact />
    </section>
  )
}
