import { useState } from 'react'
import RocketGallery from '../RocketGallery/RocketGallery'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import rockets from '../../data/rockets.json'

const featuredRockets = ['长征一号', '长征二号F', '长征三号B', '长征五号', '长征七号', '长征十号']

export default function LaunchCapabilityStory({ hall, nodes }) {
  const [showFullGallery, setShowFullGallery] = useState(false)
  const selected = featuredRockets.map((name) => rockets.find((rocket) => rocket.name === name)).filter(Boolean)
  return (
    <div className="story-page story-page--launch">
      <header className="story-hero story-hero--launch" id="story-overview"><div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国怎样一步步获得把更大航天器送到更远轨道的能力？</p></div><div className="story-hero-visual launch-hero-visual" aria-label="火箭高度与上升示意"><i /><b>高度</b><span>近地轨道</span><em>深空任务</em></div></header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'launch-core', label: '运力阶梯' }, { id: 'launch-evidence', label: '重点展项' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--launch" id="launch-core"><div className="story-heading"><span className="section-kicker">运力阶梯</span><h2>从“能送上去”<br />到“能送得更大、更远”</h2><p>火箭高度和运力不只是参数变化，它们直接打开了卫星、空间站、月球与火星任务的边界。</p></div><div className="launch-ladder">{selected.map((rocket, index) => <article className={`launch-step launch-step-${index + 1}`} key={rocket.name}><span>{String(index + 1).padStart(2, '0')} · {rocket.firstFlight}</span><div className="rocket-silhouette" style={{ '--rocket-height': `${Math.max(44, Math.min(175, Number.parseFloat(rocket.height) * 1.8))}px` }} aria-hidden="true" /><h3>{rocket.name}</h3><small>高度 {rocket.height}</small><div className="payload-bar" style={{ '--payload-width': `${22 + index * 15}%` }} /><p>{rocket.payload}</p><small>{rocket.missions.join(' · ')}</small></article>)}</div><div className="launch-support-media" id="launch-evidence"><div className="launch-support-copy"><span className="section-kicker">重点展项 · 长征五号</span><h3>从转运现场，看见大推力时代</h3><p>连续的火箭谱系回答“能否进入空间”，长征五号进一步回答“能否把更大的任务送往月球与行星际空间”。</p><StoryMedia ids={['open-long-march-5-rollout-2021']} mode="feature" color={hall.color} /></div><div className="launch-support-copy launch-support-copy--compact"><span className="section-kicker">配套资料 · 长征二号 F</span><h3>载人运输需要更高可靠</h3><p>载人火箭在运力之外，还必须满足逃逸、安全与高可靠要求。</p><StoryMedia ids={['media-human-shenzhou5-flight-review']} mode="compact" color={hall.color} /></div></div><div className="story-node-strip">{nodes.filter((node) => ['长征一号', '长征二号系列', '长征三号系列', '长征五号与文昌', '长征七号', '新一代运载火箭'].includes(node.name)).map((node) => <span className={`story-node story-node--${node.status}`} key={node.id}><b>{node.year}</b>{node.name}<em>{node.status === 'planned' ? '规划中' : '已完成'}</em></span>)}</div></section>
      <section className="story-tail story-tail--launch" id="story-next"><div><span className="section-kicker">本线已经建立的能力</span><h2>可靠进入不同轨道</h2><p>多级火箭、绿色推进剂、载人高可靠和重型运力，构成持续拓展任务边界的基础。</p></div><div className="story-tail-link"><span className="section-kicker">下一步通向</span><h2>载人登月与更远深空</h2><button type="button" onClick={() => setShowFullGallery((value) => !value)}>{showFullGallery ? '收起完整火箭谱系' : '查看完整长征火箭谱系'} ↗</button></div></section>
      {showFullGallery ? <div className="story-gallery-drawer"><RocketGallery /></div> : null}
    </div>
  )
}
