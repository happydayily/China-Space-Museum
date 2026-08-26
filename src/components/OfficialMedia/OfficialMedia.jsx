import mediaLinks from '../../data/mediaLinks.json'
import assets from '../../data/assets.json'
import OfficialMediaCard from '../OfficialMediaCard/OfficialMediaCard'

export default function OfficialMedia({ mission, hallId, color }) {
  const linkedMedia = mediaLinks.filter((item) => (mission && item.mission === mission) || (hallId && item.hallId === hallId))
  const imageMedia = assets
    .filter((item) => hallId && item.hallId === hallId && item.usageStatus)
    .map((item) => ({
      ...item,
      title: item.sourceTitle || item.name,
      type: item.mediaType || 'official-image',
      source: item.sourceName,
      url: item.sourceUrl,
    }))
  const links = [...imageMedia, ...linkedMedia]
  if (!links.length) return null

  return (
    <section className="official-media" style={{ '--hall-color': color }}>
      <header className="official-media-heading">
        <div><span className="section-kicker">权威来源 · 外链浏览</span><h2>官方影像</h2></div>
        <p>以下内容来自中国航天官方机构、新华社或央视官方平台。项目不保存大型视频文件。</p>
      </header>
      <div className="official-media-grid">
        {links.map((item, index) => <OfficialMediaCard item={item} index={index} mode={item.displayMode || 'feature'} key={item.id} />)}
      </div>
    </section>
  )
}
