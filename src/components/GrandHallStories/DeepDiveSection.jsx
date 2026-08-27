import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import { getAssetById } from '../../utils/assetRegistry'

function DeepDiveVisual({ item, label }) {
  const asset = item.assetId ? getAssetById(item.assetId) : null
  if (asset?.localPath) return <AssetMedia asset={asset} label={label} />

  return (
    <div className={`deep-dive-schematic deep-dive-schematic--${item.diagram || 'archive'}`} aria-label={label}>
      <span>{item.diagramLabel || label}</span>
      {item.diagram === 'constellation' ? <><i /><b /><em /></> : null}
      {item.diagram === 'clouds' ? <><i /><i /><i /></> : null}
      {item.diagram === 'rendezvous' ? <><i>飞船</i><b>对接</b><em>空间站</em></> : null}
      {item.diagram === 'deep-space' ? <><i>地月</i><b>→</b><em>行星际</em></> : null}
    </div>
  )
}

export default function DeepDiveSection({ id = 'deep-dive', variant, layout = variant, hall, items, onOpenMission }) {
  return (
    <section className={`deep-dive deep-dive--${variant} deep-dive--layout-${layout}`} id={id} data-depth="second-layer" aria-labelledby={`${id}-heading`}>
      <div className="deep-dive-heading">
        <span className="section-kicker">数字博物馆第二层</span>
        <h2 id={`${id}-heading`}>重点展项 · 深入了解</h2>
        <p>从展厅总体叙事进入三个关键展项，再回到已有任务详情，补上“为什么需要这项能力”的具体证据。</p>
      </div>
      <div className="deep-dive-items">
        {items.slice(0, 3).map((item, index) => (
          <article className={`deep-dive-item deep-dive-item--${item.kind || (item.assetId ? 'image' : 'diagram')}`} data-exhibit-index={index + 1} key={item.title}>
            <div className="deep-dive-meta"><b>{String(index + 1).padStart(2, '0')}</b><time>{item.year}</time></div>
            <DeepDiveVisual item={item} label={item.visualLabel || item.title} />
            <div className="deep-dive-copy">
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              {item.metric ? <strong>{item.metric}</strong> : null}
              <p>{item.description}</p>
              {item.mediaIds?.length ? <StoryMedia ids={item.mediaIds} mode={item.mediaMode || 'compact'} color={hall.color} /> : null}
              {item.missionId && onOpenMission ? <button type="button" onClick={() => onOpenMission(item.missionId)}>进入任务详情 ↗</button> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
