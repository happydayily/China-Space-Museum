import MissionHall from '../../components/MissionHall/MissionHall'

export default function HallPage({ hall, onBack }) {
  return (
    <div className="hall-page">
      <nav className="hall-page-nav">
        <button type="button" onClick={onBack}>← 返回博物馆大厅</button>
        <div className="brand">
          <span className="brand-mark">中</span>
          <span>中国航天<br /><em>数字博物馆</em></span>
        </div>
        <span>第 {hall.index} 展厅</span>
      </nav>
      <MissionHall hall={hall} />
      <footer className="footer">
        <span>中国航天发展史数字博物馆</span>
        <span>{hall.name} · 数字展陈</span>
      </footer>
    </div>
  )
}
