import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import { getAssetById } from '../../utils/assetRegistry'

const stages = [['绕', '嫦娥一号', '2007', '进入绕月轨道', null], ['落', '嫦娥三号', '2013', '月面软着陆与巡视', null], ['回', '嫦娥五号', '2020', '月球采样返回', 'media-lunar-change5-launch-live']]

export default function LunarExplorationStory({ hall, nodes, missions, onOpenMission }) {
  const mission = missions.find((item) => item.id === 'chang-e')
  return (
    <div className="story-page story-page--lunar">
      <header className="story-hero story-hero--lunar" id="story-overview"><div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国怎样一步一步掌握月球探测能力？</p></div><div className="story-hero-visual lunar-hero-visual" aria-label="地球与月球示意"><i>地球</i><span /><b>月球</b></div></header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'lunar-core', label: '绕 · 落 · 回' }, { id: 'lunar-evidence', label: '月背与返回' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--lunar" id="lunar-core"><div className="story-heading"><span className="section-kicker">主能力路线</span><h2>绕 → 落 → 回，<br />月背从侧面突破</h2><p>月球探测不是四个并列目标，而是一条逐步增加难度的能力链；月背探测则在中继通信和自主控制上打开新的侧支。</p></div><div className="lunar-main-route">{stages.map(([stage, title, year, description, mediaId]) => <article key={stage}><b>{stage}</b><span /><time>{year}</time><h3>{title}</h3><p>{description}</p>{mediaId ? <StoryMedia ids={[mediaId]} mode="inline" color={hall.color} /> : null}</article>)}<div className="lunar-side-branch" id="lunar-evidence"><span>月背突破</span><strong>嫦娥四号 · 首次月背软着陆</strong><StoryMedia ids={['media-lunar-change6-sample-process']} mode="inline" color={hall.color} /><strong>嫦娥六号 · 首次月背采样返回</strong></div></div><div className="lunar-images"><div><AssetMedia asset={getAssetById('collected-chang-e-350bd2395f82')} label="嫦娥四号月球背面全景影像" /><small className="story-media-meta">公开任务影像 · 2019 · 月背全景</small></div><div><AssetMedia asset={getAssetById('asset-change-6')} label="嫦娥六号月背采样任务现场" /><small className="story-media-meta">中国国家航天局 · 2024 · 真实任务影像</small></div></div><div className="lunar-future-path"><span>2024</span><b>嫦娥六号</b><i /><span>未来</span><strong>嫦娥七号 · 嫦娥八号 · 国际月球科研站</strong></div>{mission ? <button className="story-mission-link" type="button" onClick={() => onOpenMission(mission.id)}>进入嫦娥任务档案 ↗</button> : null}<div className="story-node-strip">{nodes.filter((node) => ['嫦娥一号', '嫦娥三号', '嫦娥四号', '嫦娥五号', '嫦娥六号'].includes(node.name)).map((node) => <span className="story-node" key={node.id}><b>{node.year}</b>{node.name}</span>)}</div></section>
      <section className="story-tail story-tail--lunar" id="story-next"><div><span className="section-kicker">本线已经建立的能力</span><h2>从月球探测到月球科研站</h2></div><div><span className="section-kicker">下一步通向</span><p>持续探测月球南极，并为载人登月积累能力。</p></div></section>
    </div>
  )
}
