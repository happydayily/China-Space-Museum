import { useEffect, useMemo, useState } from 'react'
import SpaceScene from './components/SpaceScene/SpaceScene'
import Timeline from './components/Timeline/Timeline'
import MissionViewer from './components/MissionViewer/MissionViewer'
import RocketGallery from './components/RocketGallery/RocketGallery'
import TechTree from './components/TechTree/TechTree'
import ExhibitionCard from './components/ExhibitionCard/ExhibitionCard'
import HallPage from './pages/HallPage/HallPage'
import halls from './data/halls.json'

function hallIdFromLocation() {
  return window.location.hash.match(/^#hall\/([^/]+)$/)?.[1] ?? null
}

export default function App() {
  const [activeHallId, setActiveHallId] = useState(hallIdFromLocation)
  const activeHall = useMemo(
    () => halls.find((hall) => hall.id === activeHallId) ?? null,
    [activeHallId],
  )

  useEffect(() => {
    const syncLocation = () => setActiveHallId(hallIdFromLocation())
    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [])

  const openHall = (hallId) => {
    window.history.pushState({}, '', `#hall/${hallId}`)
    setActiveHallId(hallId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeHall = () => {
    window.history.pushState({}, '', window.location.pathname)
    setActiveHallId(null)
    window.scrollTo({ top: 0 })
  }

  if (activeHall) return <HallPage hall={activeHall} onBack={closeHall} />

  return (
    <main className="museum-shell">
      <SpaceScene />
      <div className="noise" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">中</span>
          <span>中国航天<br /><em>数字博物馆</em></span>
        </div>
        <div className="status"><span className="status-dot" />数字展览 · V4.4</div>
        <button className="enter-button" onClick={() => document.getElementById('halls')?.scrollIntoView({ behavior: 'smooth' })}>
          选择展厅 <span>↘</span>
        </button>
      </header>

      <section className="hero museum-hero">
        <div className="museum-hero-copy">
          <p className="eyebrow">中国航天发展史 · 1956—2026</p>
          <h1><small>《</small>中国航天发展史<small>》</small></h1>
          <p>从东方红一号到中国空间站<br />进入一座生长在星河中的数字博物馆</p>
          <button className="primary-button" onClick={() => document.getElementById('halls')?.scrollIntoView({ behavior: 'smooth' })}>
            开始参观 <span>↓</span>
          </button>
        </div>
        <div className="hero-orbit-label"><span className="orbit-line" />地球轨道<br /><strong>展览运行中</strong></div>
        <div className="hero-year">1956—2026<span>中国航天发展史</span></div>
      </section>

      <section className="museum-entrance" id="halls">
        <div className="entrance-heading">
          <div><span className="section-kicker">五大主题展厅</span><h2>选择一段航天史，<br />进入任务现场。</h2></div>
          <p>五个独立展厅连接卫星、载人航天、探月、火星与空间站。每张图片都保留来源和版权记录。</p>
        </div>
        <div className="exhibition-grid">
          {halls.map((hall) => <ExhibitionCard hall={hall} onEnter={openHall} key={hall.id} />)}
        </div>
      </section>

      <Timeline />
      <MissionViewer />
      <RocketGallery />
      <TechTree />
      <footer className="footer">
        <span>中国航天发展史数字博物馆</span>
        <span>愿人类探索永无止境 · V4.4</span>
      </footer>
    </main>
  )
}
