import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import { getAssetById } from '../../utils/assetRegistry'

const deepDiveCopy = {
  launch: {
    label: '运力与任务边界',
    title: '把任务送过边界',
    intro: '从第一颗卫星到大推力火箭，展项呈现运载能力怎样把载荷送入不同轨道，并打开新的任务尺度。',
  },
  satellite: {
    label: '数据落地',
    title: '从天上观测到地面服务',
    intro: '这里不只看卫星本身，也看它们留下的结果：位置、云图和地表信息如何成为可以调用的社会服务。',
  },
  human: {
    label: '能力跃迁',
    title: '从首次飞行到长期驻留',
    intro: '三个展项沿着载人航天的能力跃迁展开：先保证人能安全往返，再把工作、生活和实验留在轨道上。',
  },
  lunar: {
    label: '能力叠加',
    title: '绕、落、回：月球能力叠加',
    intro: '绕月、软着陆和采样返回不是并列成果，而是逐段叠加的月球工程能力；月背由此成为一条真正的侧支。',
  },
  planetary: {
    label: '深空工程链',
    title: '行星际飞行的工程链',
    intro: '从发射窗口到火星表面，展项把距离、转移轨道、通信时延和自主运行放回同一条任务链中。',
  },
}

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
  const copy = deepDiveCopy[variant] ?? deepDiveCopy.launch
  return (
    <section className={`deep-dive deep-dive--${variant} deep-dive--layout-${layout}`} id={id} data-depth="second-layer" aria-labelledby={`${id}-heading`}>
      <div className="deep-dive-heading">
        <span className="section-kicker">数字博物馆第二层 · {copy.label}</span>
        <h2 id={`${id}-heading`}>{copy.title}</h2>
        <p>{copy.intro}</p>
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
