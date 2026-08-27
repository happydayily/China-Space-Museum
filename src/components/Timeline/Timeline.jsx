import { useEffect, useMemo, useRef, useState } from 'react'
import timeline from '../../data/timeline.json'
import ImageViewer from '../ImageViewer/ImageViewer'
import { findRelatedAsset } from '../../utils/assetRegistry'

const primaryCompactIds = new Set(['dongfanghong-1-1970', 'shenzhou-5-2003', 'tianwen-1-2021'])

export default function Timeline({ category, compact = false }) {
  const items = useMemo(
    () => category ? timeline.filter((item) => item.category === category) : timeline.filter((item) => item.featured),
    [category],
  )
  const [activeId, setActiveId] = useState(items[0]?.id)
  const storyRef = useRef(null)

  useEffect(() => {
    setActiveId(items[0]?.id)
  }, [items])

  useEffect(() => {
    const nodes = storyRef.current?.querySelectorAll('[data-timeline-id]')
    if (!nodes?.length) return undefined
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveId(visible.target.dataset.timelineId)
    }, { rootMargin: '-30% 0px -42%', threshold: [0.2, 0.45, 0.7] })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  return (
    <section className={`timeline-section narrative-timeline ${compact ? 'timeline-section--compact' : ''}`}>
      <div className="section-heading">
        <span className="section-kicker">共同时间底座 · {String(items.length).padStart(2, '0')} 个节点</span>
        <h2>{compact ? '中国航天关键时刻' : '七十年，向星河深处。'}</h2>
        <p>{compact ? '六个节点，串起五条发展路径；主展项与支撑节点各有位置。' : '向下滚动，让关键年份依次点亮。'}</p>
      </div>
      {compact ? <div className="timeline-compact-grid timeline-compact-wall" aria-label="中国航天历史展墙"><div className="timeline-wall-rule" aria-hidden="true" />{items.map((item, index) => <article data-emphasis={primaryCompactIds.has(item.id) ? 'major' : 'supporting'} key={item.id}><time>{item.year}</time><span className="timeline-wall-index">{String(index + 1).padStart(2, '0')} · {item.category}</span><i className="timeline-wall-marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div> : null}
      {!compact ? (
      <div className="timeline-story" ref={storyRef}>
        <div className="timeline-spine" aria-hidden="true" />
        {items.map((item, index) => {
          const asset = findRelatedAsset(item.relatedMission, item.id, item.title)
          const active = item.id === activeId
          return (
            <article
              className={`timeline-chapter ${active ? 'active' : ''}`}
              data-timeline-id={item.id}
              aria-current={active ? 'step' : undefined}
              key={item.id}
            >
              <div className="timeline-chapter-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="timeline-chapter-copy">
                <span className="timeline-year">{item.year}</span>
                <small>{item.category}</small>
                <h3>{item.title}</h3>
                <div className="timeline-exhibit-intro">
                  <span>展品介绍</span>
                  <p>{item.description}</p>
                </div>
                <dl>
                  <div><dt>历史意义</dt><dd>{item.historicalSignificance || '持续推动中国航天能力演进。'}</dd></div>
                  <div><dt>技术突破</dt><dd>{item.technicalBreakthrough || '完成关键工程技术验证。'}</dd></div>
                </dl>
              </div>
              <div className="timeline-chapter-media">
                <ImageViewer asset={asset} label={item.title} variant="narrative" />
              </div>
            </article>
          )
        })}
      </div>
      ) : null}
    </section>
  )
}
