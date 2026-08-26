import ImageViewer from '../ImageViewer/ImageViewer'
import MissionProcess from '../MissionProcess/MissionProcess'
import OfficialMedia from '../OfficialMedia/OfficialMedia'
import { getAssetById, getAssetsByIds } from '../../utils/assetRegistry'

export default function MissionHall({ hall }) {
  const mainAsset = getAssetById(hall.mainAssetId)
  const secondaryAssets = getAssetsByIds(hall.secondaryAssetIds)
  const technicalAssets = getAssetsByIds(hall.technicalAssetIds)
  const narrativeAsset = mainAsset ?? secondaryAssets[0] ?? technicalAssets[0]

  return (
    <main className="mission-hall" style={{ '--hall-color': hall.color }}>
      <header className="mission-hall-hero">
        <div>
          <span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span>
          <h1>{hall.name}</h1>
        </div>
        <div className="mission-hall-year">{hall.year}</div>
        <p>{hall.tagline}</p>
      </header>

      <section className="mission-hall-grid">
        <div className="mission-hall-feature">
          <ImageViewer asset={mainAsset} label={hall.name} />
          <div className="mission-hall-intro">
            <span>展陈叙事</span>
            <p>{hall.introduction}</p>
          </div>
        </div>

        <aside className="technical-archive">
          <span className="section-kicker">展品解读</span>
          <h2>为什么重要</h2>
          <dl>
            <div><dt>展品介绍</dt><dd>{mainAsset?.description || hall.introduction}</dd></div>
            <div><dt>历史意义</dt><dd>{narrativeAsset?.historicalImportance || '相关历史档案尚未公开'}</dd></div>
            <div><dt>技术突破</dt><dd>{narrativeAsset?.technicalAchievement || '相关技术档案尚未公开'}</dd></div>
          </dl>
          <h3 className="technical-assets-title">技术资料</h3>
          <div className="technical-assets">
            {technicalAssets.length ? technicalAssets.map((asset) => (
              <ImageViewer asset={asset} variant="technical" key={asset.id} />
            )) : (
              <div className="technical-empty">
                <span>技术资料</span>
                <p>暂无公开技术图像</p>
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="secondary-collection">
        <div className="section-heading">
          <span className="section-kicker">辅助影像 · {String(secondaryAssets.length).padStart(2, '0')} 件</span>
          <h2>任务现场与实物</h2>
        </div>
        <div className="secondary-grid">
          {secondaryAssets.length ? secondaryAssets.map((asset) => (
            <ImageViewer asset={asset} variant="card" key={asset.id} />
          )) : (
            <div className="secondary-empty">
              <strong>历史档案</strong>
              <p>暂无公开辅助影像</p>
            </div>
          )}
        </div>
      </section>

      <MissionProcess hall={hall} />
      <OfficialMedia mission={hall.id} color={hall.color} />
    </main>
  )
}
