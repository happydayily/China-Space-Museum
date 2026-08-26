import MissionHall from '../../components/MissionHall/MissionHall'
import grandHalls from '../../data/grandHalls.json'

export default function HallPage({ hall, onBack, onBackToGrandHall }) {
  const grandHall = grandHalls.find((item) => item.id === hall.grandHallId)

  return (
    <div className="hall-page">
      <nav className="hall-page-nav">
        <button type="button" onClick={onBackToGrandHall ? () => onBackToGrandHall(hall.grandHallId) : onBack}>← 返回“{grandHall?.name || '博物馆大厅'}”</button>
        <div className="brand">
          <span className="brand-mark">中</span>
          <span>中国航天<br /><em>数字博物馆</em></span>
        </div>
        <span>任务档案</span>
      </nav>
      <div className="mission-breadcrumb"><span>中国航天发展史</span><b>/</b><span>{grandHall?.name || '任务详情'}</span><b>/</b><strong>{hall.name}</strong></div>
      <MissionHall hall={hall} grandHall={grandHall} />
      <footer className="footer">
        <span>中国航天发展史数字博物馆</span>
        <span>{hall.name} · 数字展陈</span>
      </footer>
    </div>
  )
}
