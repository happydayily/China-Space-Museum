import { useEffect, useMemo, useState } from 'react'
import SpaceScene from './components/SpaceScene/SpaceScene'
import Timeline from './components/Timeline/Timeline'
import TechTree from './components/TechTree/TechTree'
import HallPage from './pages/HallPage/HallPage'
import GrandHallPage from './pages/GrandHallPage/GrandHallPage'
import DevelopmentLines from './components/DevelopmentLines/DevelopmentLines'
import halls from './data/halls.json'
import grandHalls from './data/grandHalls.json'

function routeFromLocation() {
  const hash = window.location.hash
  const missionId = hash.match(/^#hall\/([^/]+)$/)?.[1]
  if (missionId) return { type: 'mission', id: missionId }
  const grandHallId = hash.match(/^#grand-hall\/([^/]+)$/)?.[1]
  if (grandHallId) return { type: 'grandHall', id: grandHallId }
  return { type: 'home', id: null }
}

export default function App() {
  const [route, setRoute] = useState(routeFromLocation)
  const activeHall = useMemo(
    () => halls.find((hall) => hall.id === route.id) ?? null,
    [route],
  )
  const activeGrandHall = useMemo(
    () => grandHalls.find((hall) => hall.id === route.id) ?? null,
    [route],
  )

  useEffect(() => {
    const syncLocation = () => setRoute(routeFromLocation())
    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [])

  const openMission = (missionId) => {
    window.history.pushState({}, '', `#hall/${missionId}`)
    setRoute({ type: 'mission', id: missionId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openGrandHall = (grandHallId) => {
    window.history.pushState({}, '', `#grand-hall/${grandHallId}`)
    setRoute({ type: 'grandHall', id: grandHallId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeToHome = () => {
    window.history.pushState({}, '', window.location.pathname)
    setRoute({ type: 'home', id: null })
    window.scrollTo({ top: 0 })
  }

  const closeToGrandHall = (grandHallId) => {
    if (!grandHallId) return closeToHome()
    openGrandHall(grandHallId)
  }

  if (route.type === 'mission' && activeHall) {
    return <HallPage hall={activeHall} onBack={closeToHome} onBackToGrandHall={closeToGrandHall} />
  }
  if (route.type === 'grandHall' && activeGrandHall) {
    return <GrandHallPage hall={activeGrandHall} onBack={closeToHome} onOpenMission={openMission} />
  }

  return (
    <main className="museum-shell">
      <SpaceScene />
      <div className="noise" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">中</span>
          <span>中国航天<br /><em>数字博物馆</em></span>
        </div>
        <div className="status"><span className="status-dot" />数字展览 · V5.0</div>
        <button className="enter-button" onClick={() => document.getElementById('halls')?.scrollIntoView({ behavior: 'smooth' })}>
          选择主线 <span>↘</span>
        </button>
      </header>

      <section className="hero museum-hero">
        <div className="museum-hero-copy">
          <p className="eyebrow">中国航天发展史 · 1956—2026</p>
          <h1><small>《</small>中国航天发展史<small>》</small></h1>
          <p>从东方红一号到中国空间站<br />进入一座生长在星河中的数字博物馆</p>
          <button className="primary-button" onClick={() => document.getElementById('development-lines')?.scrollIntoView({ behavior: 'smooth' })}>
            开始参观 <span>↓</span>
          </button>
        </div>
        <div className="hero-orbit-label"><span className="orbit-line" />地球轨道<br /><strong>展览运行中</strong></div>
        <div className="hero-year">1956—2026<span>中国航天发展史</span></div>
      </section>

      <section className="museum-entrance" id="halls">
        <DevelopmentLines onEnter={openGrandHall} />
      </section>

      <Timeline compact />
      <TechTree compact />
      <footer className="footer">
        <span>中国航天发展史数字博物馆</span>
        <span>愿人类探索永无止境 · V5.0</span>
      </footer>
    </main>
  )
}
