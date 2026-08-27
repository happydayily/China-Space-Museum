import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Timeline from './components/Timeline/Timeline'
import TechTree from './components/TechTree/TechTree'
import DevelopmentLines from './components/DevelopmentLines/DevelopmentLines'
import halls from './data/halls.json'
import grandHalls from './data/grandHalls.json'

const SpaceScene = lazy(() => import('./components/SpaceScene/SpaceScene'))
const HallPage = lazy(() => import('./pages/HallPage/HallPage'))
const GrandHallPage = lazy(() => import('./pages/GrandHallPage/GrandHallPage'))

function RouteFallback() {
  return <main className="route-loading" aria-live="polite">正在加载展厅…</main>
}

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
    return <Suspense fallback={<RouteFallback />}><HallPage hall={activeHall} onBack={closeToHome} onBackToGrandHall={closeToGrandHall} /></Suspense>
  }
  if (route.type === 'grandHall' && activeGrandHall) {
    return <Suspense fallback={<RouteFallback />}><GrandHallPage hall={activeGrandHall} onBack={closeToHome} onOpenMission={openMission} /></Suspense>
  }

  return (
    <main className="museum-shell">
      <Suspense fallback={<div className="space-scene space-scene--fallback" aria-hidden="true" />}><SpaceScene /></Suspense>
      <div className="noise" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">中</span>
          <span>中国航天<br /><em>数字博物馆</em></span>
        </div>
        <div className="topbar-status-group">
          <div className="status"><span className="status-dot" />序厅 · 展览开放中</div>
          <a className="online-link" href="https://happydayily.github.io/China-Space-Museum/" target="_blank" rel="noreferrer">在线展馆 ↗</a>
        </div>
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
        <div className="hero-orbit-label"><span className="orbit-line" />地球轨道<br /><strong>轨道示意</strong></div>
        <div className="hero-year">1956—2026<span>中国航天发展史</span></div>
      </section>

      <section className="museum-entrance" id="halls">
        <DevelopmentLines onEnter={openGrandHall} />
      </section>

      <section className="museum-prologue" aria-labelledby="prologue-heading">
        <div className="prologue-heading">
          <span className="section-kicker">入馆导言 · 先看尺度如何改变</span>
          <h2 id="prologue-heading">一部航天史，<br />也是一部能力不断外扩的历史。</h2>
        </div>
        <div className="prologue-register">
          <article><time>1956</time><h3>建立国家体系</h3><p>从总体设计、试验到组织协同，航天事业开始拥有自己的起点。</p></article>
          <article><time>1970</time><h3>进入地球轨道</h3><p>东方红一号让“进入太空”从目标变成可重复的工程能力。</p></article>
          <article><time>2003</time><h3>把人送入太空</h3><p>神舟五号把火箭、飞船、测控、生命保障和安全返回连成闭环。</p></article>
          <article><time>2024</time><h3>触及月球背面</h3><p>嫦娥六号完成月背采样返回，探测尺度继续向地月之外延伸。</p></article>
        </div>
      </section>

      <Timeline compact />
      <TechTree compact />
      <footer className="footer">
        <span>中国航天发展史数字博物馆</span>
        <span>愿人类探索永无止境</span>
      </footer>
    </main>
  )
}
