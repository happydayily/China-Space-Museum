import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import DeepDiveSection from './DeepDiveSection'
import { getAssetById } from '../../utils/assetRegistry'

const applications = ['通信', '气象', '遥感', '导航', '资源', '高分']

export default function SatelliteNetworkStory({ hall, nodes, missions, onOpenMission }) {
  const origin = missions.find((mission) => mission.id === 'origin-one')
  return (
    <div className="story-page story-page--satellite">
      <header className="story-hero story-hero--satellite" id="story-overview">
        <div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国如何从第一颗卫星，发展出服务整个社会的天基网络？</p></div>
        <div className="story-hero-visual satellite-hero-visual" aria-label="地球与卫星网络示意"><i>地球</i>{applications.slice(0, 4).map((application, index) => <span key={application} className={`satellite-hero-node satellite-hero-node-${index + 1}`}>{application}</span>)}</div>
      </header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'satellite-core', label: '天基网络' }, { id: 'deep-dive', label: '重点展项' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--satellite" id="satellite-core">
        <div className="story-heading"><span className="section-kicker">卫星应用网络</span><h2>先问三个问题，<br />再看卫星怎样工作。</h2><p>天基系统的价值不在于星座图本身，而在于它持续把观测、定位和通信数据送到地面，变成可以依赖的社会服务。</p></div>
        <div className="satellite-use-cases" aria-label="卫星应用进入日常生活的三个问题">
          <article><span>01 · 导航</span><h3>我在哪里？</h3><strong>北斗三号</strong><p>定位、导航与授时进入交通、农业、测绘和应急系统。</p></article>
          <article><span>02 · 气象</span><h3>天气正在发生什么？</h3><strong>风云卫星</strong><p>连续观测云图、台风和天气变化，让预报与灾害响应有了共同的天空视野。</p></article>
          <article><span>03 · 遥感</span><h3>从太空能看清什么？</h3><strong>高分工程</strong><p>对地观测把土地、海洋和灾害变化转化为可分析的数据。</p></article>
        </div>
        <p className="satellite-use-case-note"><b>卫星</b><span>→</span><b>数据</b><span>→</span><b>服务与决策</b>　空间能力由此进入日常生活。</p>
        <div className="satellite-origin-card"><div><AssetMedia asset={getAssetById('curated-dongfanghong-1-news-1970')} label="东方红一号历史报道" /><small className="story-media-meta">《人民日报》 · 1970 · 历史档案</small></div><div><span className="section-kicker">1970 · 中国天基能力起点</span><h3>东方红一号</h3><p>从第一颗人造地球卫星开始，空间能力逐步进入国家治理、产业和日常生活。</p>{origin ? <button type="button" onClick={() => onOpenMission(origin.id)}>从东方红一号看起 ↗</button> : null}</div></div>
        <div className="satellite-evidence-grid" id="satellite-evidence"><article><b>导航 · 我在哪里？</b><strong>北斗三号</strong><span>定位、导航、授时进入交通与应急系统。</span><StoryMedia ids={['official-beidou-3-constellation-2020']} mode="compact" color={hall.color} /></article><article><b>气象 · 天气正在发生什么？</b><strong>风云卫星</strong><span>持续观测云图、台风和天气变化。</span><StoryMedia ids={['official-fy4a-cloud-image-2017']} mode="compact" color={hall.color} /></article><article><b>遥感 · 从太空能看清什么？</b><strong>高分工程</strong><span>高分辨率对地观测服务国土与资源管理。</span><StoryMedia ids={['open-gaofen-3-radar-images-2022']} mode="feature" color={hall.color} /></article></div>
        <div className="story-node-strip">{nodes.filter((node) => ['东方红一号', '返回式卫星', '风云气象卫星', '资源与海洋卫星', '高分工程', '北斗三号'].includes(node.name)).map((node) => <span className="story-node" key={node.id}><b>{node.year}</b>{node.name}</span>)}</div>
      </section>
      <DeepDiveSection variant="satellite" layout="observation" hall={hall} items={[{ year: '2020', label: '导航 · 全球覆盖', title: '北斗三号', metric: '定位 · 导航 · 授时', description: '全球卫星导航系统把时间和位置变成交通、农业、应急可以调用的基础服务。', diagram: 'constellation', diagramLabel: '北斗星座', mediaIds: ['official-beidou-3-constellation-2020'] }, { year: '1988—至今', label: '气象 · 连续观测', title: '风云', metric: '云图 · 台风 · 预报', description: '气象卫星把大范围、连续的云系观测送入天气预报和灾害响应流程。', diagram: 'clouds', diagramLabel: '云图观测', mediaIds: ['official-fy4a-cloud-image-2017'] }, { year: '2010—至今', label: '遥感 · 看见地表', title: '高分', metric: '全天时 · 全天候', description: '雷达遥感不依赖可见光，把海洋、土地与灾害变化转化为可分析的数据。', assetId: 'open-gaofen-3-radar-images-2022' }]} />
      <section className="story-tail story-tail--satellite" id="story-next"><div><span className="section-kicker">空间能力如何进入日常生活</span><h2>看得见天气，找得到方向，连得上远方。</h2></div><div><span className="section-kicker">下一步通向</span><p>更高分辨率、更低轨道、更智能的卫星数据服务。</p></div></section>
    </div>
  )
}
