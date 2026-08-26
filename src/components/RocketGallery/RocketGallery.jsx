import rockets from '../../data/rockets.json'
import AssetMedia from '../AssetMedia/AssetMedia'
import { findRelatedAsset } from '../../utils/assetRegistry'

export default function RocketGallery() {
  return (
    <section className="rocket-section">
      <div className="section-heading">
        <span className="section-kicker">运载火箭 · {String(rockets.length).padStart(2, '0')} 型</span>
        <h2>长征火箭谱系</h2>
        <p>从送东方红一号升空，到面向载人登月的新一代运载系统。</p>
      </div>
      <div className="rocket-grid">
        {rockets.map((rocket, index) => (
          <article className="rocket-card" key={rocket.name}>
            <header className="rocket-card-heading">
              <div className="rocket-index">{String(index + 1).padStart(2, '0')}</div>
              <h3>{rocket.name}</h3>
            </header>
            <AssetMedia asset={findRelatedAsset(rocket.name)} label={rocket.name} compact />
            <p className="rocket-introduction">{rocket.introduction}</p>
            <div className="rocket-narrative">
              <div><span>历史意义</span><p>{rocket.historicalImportance}</p></div>
              <div><span>技术突破</span><p>{rocket.technicalAchievement}</p></div>
            </div>
            <dl className="rocket-facts">
              <div><dt>首飞</dt><dd>{rocket.firstFlight}</dd></div>
              <div><dt>代表运力</dt><dd>{rocket.payload}</dd></div>
            </dl>
            <div className="rocket-missions">
              <span>代表任务</span>
              <p>{rocket.missions.join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
