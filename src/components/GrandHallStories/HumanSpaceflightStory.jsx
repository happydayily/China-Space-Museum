import AssetMedia from '../AssetMedia/AssetMedia'
import StoryMedia from '../StoryMedia/StoryMedia'
import StoryTour from './StoryTour'
import DeepDiveSection from './DeepDiveSection'
import { getAssetById } from '../../utils/assetRegistry'

export default function HumanSpaceflightStory({ hall, nodes, missions, onOpenMission }) {
  const shenzhou = missions.find((mission) => mission.id === 'shenzhou5')
  const station = missions.find((mission) => mission.id === 'tiangong')
  return (
    <div className="story-page story-page--human">
      <header className="story-hero story-hero--human" id="story-overview">
        <div className="story-hero-copy title-safe-area"><span className="section-kicker">第 {hall.index} 展厅 · {hall.period}</span><h1>{hall.name}</h1><p className="story-subtitle">{hall.subtitle}</p><p className="story-question">中国如何从无人验证，走到长期有人驻留？</p></div>
        <div className="story-hero-visual human-hero-visual" aria-label="飞船与空间站对接示意"><span>飞船</span><i>对接</i><b>空间站</b></div>
      </header>
      <StoryTour items={[{ id: 'story-why', label: '为什么重要' }, { id: 'human-core', label: '三章路线' }, { id: 'deep-dive', label: '重点展项' }, { id: 'story-next', label: '下一步' }]} />
      <section className="story-why" id="story-why"><span className="section-kicker">为什么这条路线重要？</span><p>{hall.hallWhyItMatters}</p></section>
      <section className="grand-story grand-story--human" id="human-core">
        <div className="story-heading"><span className="section-kicker">载人航天三章</span><h2>从把人送上去，<br />到让人在轨道上工作</h2><p>载人航天的进步，体现在任务持续时间、空间活动复杂度和轨道生活能力的连续增加。</p></div>
        <div className="human-chapters"><article><span>第一章 · 1992—2002</span><h3>无人验证</h3><p>先让飞船完成发射、返回和系统可靠性验证，再把人员安全交给完整系统。</p><b>神舟一号—四号</b></article><article className="human-chapter-feature" id="human-evidence"><div><AssetMedia asset={getAssetById('curated-shenzhou5-yang-liwei-2003')} label="杨利伟在神舟五号飞船内" /><small className="story-media-meta">中国新闻社 · 2003 · 真实任务影像</small><StoryMedia ids={['media-human-shenzhou5-flight-review']} mode="inline" color={hall.color} /></div><div><span>第二章 · 2003—2016</span><h3>人进入太空</h3><p>神舟五号首次载人，神舟七号实现出舱，天宫目标飞行器与飞船完成交会对接，验证完整载人飞行闭环。</p>{shenzhou ? <button type="button" onClick={() => onOpenMission(shenzhou.id)}>进入神舟五号任务档案 ↗</button> : null}</div></article><article className="human-chapter-station"><div><AssetMedia asset={getAssetById('curated-tiangong-0e4562ea9470')} label="中国空间站完整组合体" /><small className="story-media-meta">新华社 · 2022—至今 · 真实任务影像</small></div><div><AssetMedia asset={getAssetById('collected-tiangong-754c526f7813')} label="问天实验舱舱内工作场景" /><small className="story-media-meta">公开展品资料 · 2022 · 在轨工作影像</small><StoryMedia ids={['media-human-space-station-video-hub']} mode="inline" color={hall.color} /></div><div><span>第三章 · 2021—至今</span><h3>轨道家园</h3><p>空间站支持长期生活、长期工作和长期实验，把居住、维修、补给与空间科学实验纳入长期运营。</p>{station ? <button type="button" onClick={() => onOpenMission(station.id)}>进入中国空间站任务档案 ↗</button> : null}</div></article></div>
        <div className="human-stage-strip">{nodes.filter((node) => ['神舟五号', '神舟七号', '天宫一号', '天和、问天、梦天', '长期运营'].includes(node.name)).map((node) => <span key={node.id}><b>{node.year}</b>{node.name}</span>)}</div>
        <div className="human-people-strip" aria-label="与能力节点直接相关的航天员">
          <div><span>2003 · 首次载人</span><strong>杨利伟</strong><p>神舟五号航天员，中国首次载人航天飞行。</p></div>
          <div><span>2008 · 首次出舱</span><strong>翟志刚</strong><p>神舟七号航天员，完成中国航天员首次空间出舱。</p></div>
          <div><span>空间站时代</span><strong>景海鹏</strong><p>多次执行载人飞行任务，见证从短时飞行到长期驻留。</p></div>
        </div>
      </section>
      <DeepDiveSection variant="human" layout="chapters" hall={hall} onOpenMission={onOpenMission} items={[{ year: '2003', label: '人物 · 首次载人', title: '神舟五号', metric: '21 小时 23 分 · 绕地 14 圈', description: '杨利伟的首次飞行验证了人、船、火箭、测控和返回系统如何共同工作。', assetId: 'curated-shenzhou5-yang-liwei-2003', missionId: 'shenzhou5' }, { year: '2011—2017', label: '阶段 · 交会对接', title: '从靠近到连接', metric: '目标飞行器 · 空间实验室', description: '交会对接把短时飞行变成可扩展的空间设施，为空间站组装和补给建立接口。', diagram: 'rendezvous', diagramLabel: '交会对接', mediaIds: ['media-station-configurations'] }, { year: '2022—至今', label: '生活 · 工作 · 实验', title: '中国空间站', metric: '长期有人驻留', description: '空间站把居住、维修、补给和空间科学实验整合为持续运行的轨道平台。', assetId: 'curated-tiangong-0e4562ea9470', missionId: 'tiangong' }]} />
      <section className="story-tail story-tail--human" id="story-next"><div><span className="section-kicker">本线已经建立的能力</span><h2>长期有人照料的轨道平台</h2></div><div><span className="section-kicker">下一步通向</span><p>从空间站走向载人月球。</p></div></section>
    </div>
  )
}
