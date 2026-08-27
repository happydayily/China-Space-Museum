import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import DeepDiveSection from './DeepDiveSection'
import { getAssetById } from '../../utils/assetRegistry'

const stages = [['绕', '嫦娥一号', '2007', '进入绕月轨道，建立地月转移与月球捕获能力', null], ['落', '嫦娥三号', '2013', '动力下降、悬停避障与月面软着陆', null], ['回', '嫦娥五号', '2020', '采样、起飞、月轨交会与返回', 'media-lunar-change5-launch-live']]

export default function LunarExplorationStory({ hall, nodes, missions, onOpenMission }) {
  const mission = missions.find((item) => item.id === 'chang-e')
  return (
    <div className="story-page story-page--lunar">
      <header className="story-hero story-hero--lunar" id="story-overview"><div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国怎样一步一步掌握月球探测能力？</p></div><div className="story-hero-visual lunar-hero-visual" aria-label="地球与月球示意"><i>地球</i><span /><b>月球</b></div></header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'lunar-core', label: '绕 · 落 · 回' }, { id: 'deep-dive', label: '月背与返回' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--lunar" id="lunar-core">
        <div className="story-heading"><span className="section-kicker">主能力路线</span><h2>绕 → 落 → 回，<br />月背从侧面突破</h2><p>月球探测不是四个并列目标，而是一条逐步增加难度的能力链；月背探测则在中继通信和自主控制上打开新的侧支。</p></div>
        <div className="lunar-main-route">{stages.map(([stage, title, year, description, mediaId]) => <article key={stage}><b>{stage}</b><span /><time>{year}</time><h3>{title}</h3><p>{description}</p>{mediaId ? <StoryMedia ids={[mediaId]} mode="inline" color={hall.color} /> : null}</article>)}<div className="lunar-side-branch" id="lunar-evidence"><span>月背突破</span><strong>嫦娥四号 · 首次月背软着陆</strong><StoryMedia ids={['media-lunar-change6-sample-process']} mode="inline" color={hall.color} /><strong>嫦娥六号 · 首次月背采样返回</strong></div></div>
        <div className="lunar-sample-note"><span>2024 · 嫦娥六号</span><strong>从月球背面带回 1935.3 克样品</strong><p>月背没有直视地球的通信条件，鹊桥中继、采样封装、月面起飞和月轨交会共同完成了这次返回。</p><a href="https://www.cnsa.gov.cn/n6758823/n6758844/n10518102/n10518157/c10570691/content.html" target="_blank" rel="noreferrer">中国国家航天局 · 任务资料 ↗</a></div>
        <div className="lunar-images"><div><AssetMedia asset={getAssetById('collected-chang-e-350bd2395f82')} label="嫦娥四号月球背面全景影像" /><small className="story-media-meta">公开任务影像 · 2019 · 月背全景</small></div><div><AssetMedia asset={getAssetById('asset-change-6')} label="嫦娥六号月背采样任务现场" /><small className="story-media-meta">中国国家航天局 · 2024 · 真实任务影像</small></div></div>
        <div className="lunar-future-path"><span>2024</span><b>嫦娥六号</b><i /><span>未来</span><strong>嫦娥七号 · 嫦娥八号 · 国际月球科研站</strong></div>{mission ? <button className="story-mission-link" type="button" onClick={() => onOpenMission(mission.id)}>进入嫦娥任务档案 ↗</button> : null}<div className="story-node-strip">{nodes.filter((node) => ['嫦娥一号', '嫦娥三号', '嫦娥四号', '嫦娥五号', '嫦娥六号'].includes(node.name)).map((node) => <span className="story-node" key={node.id}><b>{node.year}</b>{node.name}</span>)}</div>
      </section>
      <DeepDiveSection variant="lunar" layout="route" hall={hall} onOpenMission={onOpenMission} items={[{ year: '2007', label: '绕 · 获取全球月面', title: '嫦娥一号：绕', metric: '进入绕月轨道', description: '先把月球看完整，建立地月转移、月球捕获和绕月遥感的第一段能力。', assetId: 'collected-chang-e-b13ef29ef990', missionId: 'chang-e', mediaIds: ['media-change5-topic'] }, { year: '2013—2019', label: '落 · 月背需要中继', title: '嫦娥三 / 四号：落与月背', metric: '软着陆 · 巡视 · 中继通信', description: '月背无法直接看到地球，鹊桥中继让着陆器、巡视器与地面保持通信链路。', assetId: 'collected-chang-e-350bd2395f82', mediaIds: ['media-lunar-change6-sample-process'] }, { year: '2020—2024', label: '回 · 采样返回', title: '嫦娥五 / 六号：采样返回', metric: '世界首次月背采样返回', description: '采样、起飞、月轨交会与返回把月面操作推进到完整的地外往返任务。', assetId: 'asset-change-6', mediaIds: ['media-lunar-change6-sample-process'], missionId: 'chang-e' }]} />
      <section className="story-tail story-tail--lunar" id="story-next"><div><span className="section-kicker">本线已经建立的能力</span><h2>从月球探测到月球科研站</h2></div><div><span className="section-kicker">下一步通向</span><p>持续探测月球南极，并为载人登月积累能力。</p></div></section>
    </div>
  )
}
