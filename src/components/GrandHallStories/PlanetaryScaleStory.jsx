import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import DeepDiveSection from './DeepDiveSection'
import { getAssetById } from '../../utils/assetRegistry'

export default function PlanetaryScaleStory({ hall, nodes, missions, onOpenMission }) {
  const mission = missions.find((item) => item.id === 'tianwen')
  return (
    <div className="story-page story-page--planetary">
      <header className="story-hero story-hero--planetary" id="story-overview"><div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国如何从地月空间，第一次跨入真正的行星际探测？</p></div><div className="story-hero-visual planetary-hero-visual" aria-label="地球到火星的尺度示意"><i /><span>地球</span><b>火星</b></div></header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'planetary-core', label: '行星际尺度' }, { id: 'deep-dive', label: '深空工程' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--planetary" id="planetary-core">
        <div className="story-heading"><span className="section-kicker">行星际尺度</span><h2>离开地球，穿越<br />七个月级的行星际飞行</h2><p>这是一条概念尺度示意，非真实比例：距离拉远，通信时延增加，任务需要更多自主导航和环境判断。</p></div>
        <div className="planetary-distance" aria-label="从地球到火星的概念距离示意"><div className="distance-earth"><i />地球</div><div className="distance-moon"><span />月球轨道</div><div className="distance-flight"><b>约七个月级</b><small>地火转移 · 中途修正 · 深空测控</small></div><div className="distance-mars"><i />火星</div><div className="distance-beyond">更远深空</div></div>
        <div className="planetary-distance-note"><span>为什么不是直线？</span><p>行星持续运动，任务要等待发射窗口并沿转移轨道飞行；距离拉远后，指令往返时延也让祝融号必须自主判断。</p></div>
        <div className="planetary-engineering-chain" aria-label="距离带来的三种工程变化"><div className="planetary-chain-intro"><span>距离带来的变化</span><p>越远，任务越不能依赖实时指挥。</p></div><div className="planetary-chain-items"><article><span>发射窗口</span><strong>等待合适的几何位置</strong><p>任务出发时间由地球与火星的相对位置决定。</p></article><article><span>通信时延</span><strong>指令不能实时往返</strong><p>地面需要把计划、规则和边界提前交给探测器。</p></article><article><span>自主运行</span><strong>在现场完成判断</strong><p>导航、避障、状态管理成为任务本身的一部分。</p></article></div></div>
        <div className="planetary-anchor-grid" id="planetary-evidence"><article><div><AssetMedia asset={getAssetById('curated-tianwen-206aa3f3bc23')} label="天问一号与火星合影" /><small className="story-media-meta">维基共享资源 / 中国国家航天局供图 · 2021 · 真实任务影像</small></div><div><span>绕 · 火星捕获</span><h3>天问一号</h3><p>完成从地火转移到火星环绕的深空导航。</p><StoryMedia ids={['open-tianwen1-launch-2020']} mode="feature" color={hall.color} /></div></article><article><div><AssetMedia asset={getAssetById('curated-tianwen-16526f52a3ea')} label="祝融号与着陆平台" /><small className="story-media-meta">公开任务影像 · 2021 · 火星表面影像</small></div><div><span>落 · 巡 · 火星表面工作</span><h3>祝融号</h3><p>在乌托邦平原着陆并开展巡视探测。</p><StoryMedia ids={['media-planetary-tianwen-landing-series']} mode="inline" color={hall.color} /><StoryMedia ids={['media-zhurong-motion']} mode="inline" color={hall.color} /></div></article></div>{mission ? <button className="story-mission-link" type="button" onClick={() => onOpenMission(mission.id)}>进入天问一号任务现场 ↗</button> : null}<div className="planetary-future">{nodes.filter((node) => node.status === 'planned').map((node) => <span className="story-node story-node--planned" key={node.id}><b>{node.year}</b>{node.name}<em>规划中</em></span>)}</div>
      </section>
      <DeepDiveSection variant="planetary" layout="distance" hall={hall} onOpenMission={onOpenMission} items={[{ year: '2020—2021', label: '绕 · 地火转移', title: '天问一号：绕、着、巡', metric: '一次任务完成三步', description: '在更远距离和更长时延条件下，完成转移、捕获、着陆与巡视的连续任务。', assetId: 'curated-tianwen-206aa3f3bc23', mediaIds: ['media-planetary-tianwen-landing-series'], missionId: 'tianwen' }, { year: '2021', label: '巡 · 火星表面工作', title: '祝融号', metric: '自主巡视 · 环境探测', description: '火星车需要在通信间歇中完成移动、避障、观测和状态判断。', assetId: 'curated-tianwen-16526f52a3ea', mediaIds: ['media-zhurong-motion'] }, { year: '下一阶段', label: '距离 · 自主 · 深空测控', title: '下一阶段行星际探索', metric: '更远目标 · 更长等待', description: '小行星、火星采样返回和更远太阳系任务，将把自主导航与深空测控推向更长时间尺度。', diagram: 'deep-space', diagramLabel: '从地月到行星际', mediaIds: ['official-tianwen-science-images-2021'] }]} />
      <section className="story-tail story-tail--planetary" id="story-next"><div><span className="section-kicker">本线已经建立的能力</span><h2>一次任务完成绕、落、巡</h2></div><div><span className="section-kicker">下一站在哪里</span><p>小行星、火星采样返回，以及更远的太阳系。</p></div></section>
    </div>
  )
}
