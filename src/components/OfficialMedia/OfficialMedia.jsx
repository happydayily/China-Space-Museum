import mediaLinks from '../../data/mediaLinks.json'

export default function OfficialMedia({ mission, color }) {
  const links = mediaLinks.filter((item) => item.mission === mission)
  if (!links.length) return null

  return (
    <section className="official-media" style={{ '--hall-color': color }}>
      <header className="official-media-heading">
        <div><span className="section-kicker">权威来源 · 外链浏览</span><h2>官方影像</h2></div>
        <p>以下内容来自中国航天官方机构、新华社或央视官方平台。项目不保存大型视频文件。</p>
      </header>
      <div className="official-media-grid">
        {links.map((item, index) => (
          <article className="official-media-card" key={item.id}>
            <div className="official-media-cover">
              <span>{item.type}</span><strong>{String(index + 1).padStart(2, '0')}</strong><i>▶</i>
            </div>
            <div className="official-media-copy">
              <span>{item.source}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noreferrer">查看官方影像 <b>↗</b></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
