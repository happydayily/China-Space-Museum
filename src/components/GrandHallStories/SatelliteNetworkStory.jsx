import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import { getAssetById } from '../../utils/assetRegistry'

const applications = ['通信', '气象', '遥感', '导航', '资源', '高分']

export default function SatelliteNetworkStory({ hall, nodes, missions, onOpenMission }) {
  const origin = missions.find((mission) => mission.id === 'origin-one')
  return (
    <div className="story-page story-page--satellite">
      <header className="story-hero story-hero--satellite">
        <div><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国如何从第一颗卫星，发展出服务整个社会的天基网络？</p></div>
        <div className="satellite-hero-visual" aria-label="地球与卫星网络示意"><i>地球</i>{applications.slice(0, 4).map((application, index) => <span key={application} className={`satellite-hero-node satellite-hero-node-${index + 1}`}>{application}</span>)}</div>
      </header>
      <section className="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--satellite">
        <div className="story-heading"><span className="section-kicker">卫星应用网络</span><h2>从单颗卫星，<br />到多系统协同</h2><p>天基能力逐步覆盖通信、气象、遥感、导航、资源和高分辨率对地观测，成为社会运行的空间基础设施。</p></div>
        <div className="satellite-network"><div className="satellite-core"><span>中国<br />天基系统</span><i /></div>{applications.map((application, index) => <div className={`satellite-orbit satellite-orbit-${index + 1}`} key={application}><span className="satellite-link" /><b>{application}</b></div>)}</div>
        <div className="satellite-origin-card"><div><AssetMedia asset={getAssetById('curated-dongfanghong-1-news-1970')} label="东方红一号历史报道" /><small className="story-media-meta">《人民日报》 · 1970 · 历史档案</small></div><div><span className="section-kicker">1970 · 中国天基能力起点</span><h3>东方红一号</h3><p>从第一颗人造地球卫星开始，空间能力逐步进入国家治理、产业和日常生活。</p>{origin ? <button type="button" onClick={() => onOpenMission(origin.id)}>从东方红一号看起 ↗</button> : null}</div></div>
        <div className="satellite-evidence-grid"><article><b>导航</b><strong>北斗三号</strong><span>定位、导航、授时进入交通与应急系统。</span><StoryMedia ids={['official-beidou-3-constellation-2020']} mode="compact" color={hall.color} /></article><article><b>气象</b><strong>风云卫星</strong><span>持续观测云图、台风和天气变化。</span><StoryMedia ids={['official-fy4a-cloud-image-2017']} mode="compact" color={hall.color} /></article><article><b>遥感</b><strong>高分工程</strong><span>高分辨率对地观测服务国土与资源管理。</span><StoryMedia ids={['open-gaofen-3-radar-images-2022']} mode="feature" color={hall.color} /></article></div>
        <div className="story-node-strip">{nodes.filter((node) => ['东方红一号', '返回式卫星', '风云气象卫星', '资源与海洋卫星', '高分工程', '北斗三号'].includes(node.name)).map((node) => <span className="story-node" key={node.id}><b>{node.year}</b>{node.name}</span>)}</div>
      </section>
      <section className="story-tail story-tail--satellite"><div><span className="section-kicker">空间能力如何进入日常生活</span><h2>看得见天气，找得到方向，连得上远方。</h2></div><div><span className="section-kicker">下一步通向</span><p>更高分辨率、更低轨道、更智能的卫星数据服务。</p></div></section>
    </div>
  )
}
