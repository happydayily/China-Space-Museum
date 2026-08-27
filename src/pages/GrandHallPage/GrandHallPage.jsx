import halls from '../../data/halls.json'
import LaunchCapabilityStory from '../../components/GrandHallStories/LaunchCapabilityStory'
import SatelliteNetworkStory from '../../components/GrandHallStories/SatelliteNetworkStory'
import HumanSpaceflightStory from '../../components/GrandHallStories/HumanSpaceflightStory'
import LunarExplorationStory from '../../components/GrandHallStories/LunarExplorationStory'
import PlanetaryScaleStory from '../../components/GrandHallStories/PlanetaryScaleStory'

const stories = {
  'access-to-space': LaunchCapabilityStory,
  'space-based-china': SatelliteNetworkStory,
  'humans-in-space': HumanSpaceflightStory,
  'to-the-moon': LunarExplorationStory,
  'toward-planets': PlanetaryScaleStory,
}

export default function GrandHallPage({ hall, onBack, onOpenMission }) {
  const Story = stories[hall.id]
  const missions = halls.filter((mission) => mission.grandHallId === hall.id)

  return (
    <main className={`grand-hall-page grand-hall-page--${hall.id}`} style={{ '--hall-color': hall.color }}>
      <nav className="hall-page-nav">
        <button type="button" onClick={onBack}>← 返回序厅</button>
        <div className="brand"><span className="brand-mark">中</span><span>中国航天<br /><em>数字博物馆</em></span></div>
        <span>主题展厅 {hall.index}</span>
      </nav>
      <div className="grand-breadcrumb"><span>中国航天发展史</span><b>/</b><strong>{hall.name}</strong></div>
      {Story ? <Story hall={hall} nodes={hall.nodes} missions={missions} onOpenMission={onOpenMission} /> : null}
      <footer className="footer"><span>中国航天发展史数字博物馆</span><span>{hall.name} · 主题展厅</span></footer>
    </main>
  )
}
