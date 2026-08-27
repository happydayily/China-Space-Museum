import { useState } from 'react'
import developmentLines from '../../data/developmentLines.json'

const years = ['1956', '1970', '1988', '1992', '2003', '2007', '2013', '2016', '2020', '2021', '2022', '2024', '未来']
const lanes = [
  { id: 'access-to-space', nodes: [['1956', '航天起步'], ['1970', '长征一号'], ['2016', '长征五号']] },
  { id: 'satellite-applications', nodes: [['1970', '东方红一号'], ['1988', '风云'], ['2020', '北斗三号']] },
  { id: 'human-spaceflight', nodes: [['1992', '921工程'], ['2003', '神舟五号'], ['2022', '空间站']] },
  { id: 'lunar-exploration', nodes: [['2007', '嫦娥一号'], ['2013', '嫦娥三号'], ['2024', '嫦娥六号']] },
  { id: 'planetary-exploration', nodes: [['2020', '天问一号'], ['2021', '祝融巡视'], ['未来', '火星采样']] },
]
const laneY = { 'access-to-space': 58, 'satellite-applications': 116, 'human-spaceflight': 174, 'lunar-exploration': 232, 'planetary-exploration': 290 }
const xForYear = (year) => 60 + Math.max(0, years.indexOf(String(year))) * 75

export default function DevelopmentLines({ onEnter }) {
  const [hovered, setHovered] = useState(null)
  const lineById = Object.fromEntries(developmentLines.map((line) => [line.id, line]))
  const isDimmed = (id) => hovered && hovered !== id && !lineById[hovered].relatedLineIds.includes(id)

  return (
    <section className="development-lines" id="development-lines">
      <div className="section-heading"><span className="section-kicker">中国航天五大发展主线 · 1956—至今</span><h2>五条主线，一部中国航天史</h2><p>不是五个孤岛，而是一张彼此支撑的航天网络。</p></div>
      <div className="development-network-wrap">
        <svg className="development-network" viewBox="0 0 1010 365" role="img" aria-label="中国航天五大发展主线与关键交汇关系">
          <g className="network-years">{years.map((year) => <text key={year} x={xForYear(year)} y="22" textAnchor="middle">{year}</text>)}</g>
          <g className="network-crossings" aria-hidden="true">
            <path className={hovered === 'access-to-space' || hovered === 'satellite-applications' ? 'network-crossing is-active' : 'network-crossing'} d={`M${xForYear('1970')} ${laneY['access-to-space']} C${xForYear('1970') + 30} ${laneY['access-to-space'] + 28}, ${xForYear('1970') + 45} ${laneY['satellite-applications'] - 28}, ${xForYear('1970') + 70} ${laneY['satellite-applications']}`} />
            <path className={hovered === 'access-to-space' || hovered === 'human-spaceflight' ? 'network-crossing is-active' : 'network-crossing'} d={`M${xForYear('2003')} ${laneY['access-to-space']} C${xForYear('2003') + 20} ${laneY['access-to-space'] + 50}, ${xForYear('2003') + 60} ${laneY['human-spaceflight'] - 35}, ${xForYear('2003')} ${laneY['human-spaceflight']}`} />
            <path className={hovered === 'access-to-space' || hovered === 'lunar-exploration' ? 'network-crossing is-active' : 'network-crossing'} d={`M${xForYear('2020')} ${laneY['access-to-space']} C${xForYear('2020') - 30} ${laneY['access-to-space'] + 60}, ${xForYear('2020') - 50} ${laneY['lunar-exploration'] - 50}, ${xForYear('2020')} ${laneY['lunar-exploration']}`} />
            <path className={hovered === 'access-to-space' || hovered === 'planetary-exploration' ? 'network-crossing is-active' : 'network-crossing'} d={`M${xForYear('2020')} ${laneY['access-to-space']} C${xForYear('2020') + 25} ${laneY['access-to-space'] + 65}, ${xForYear('2020') + 20} ${laneY['planetary-exploration'] - 55}, ${xForYear('2020')} ${laneY['planetary-exploration']}`} />
            <path className={hovered === 'human-spaceflight' || hovered === 'satellite-applications' ? 'network-crossing is-active' : 'network-crossing'} d={`M${xForYear('2003')} ${laneY['satellite-applications']} C${xForYear('2003') - 22} ${laneY['satellite-applications'] + 40}, ${xForYear('2003') + 30} ${laneY['human-spaceflight'] - 35}, ${xForYear('2003')} ${laneY['human-spaceflight']}`} />
          </g>
          {lanes.map((lane) => {
            const line = lineById[lane.id]
            const dimmed = isDimmed(lane.id)
            return <g className={`network-lane ${dimmed ? 'is-dimmed' : ''} ${hovered === lane.id ? 'is-hovered' : ''}`} key={lane.id} onMouseEnter={() => setHovered(lane.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(lane.id)} onBlur={() => setHovered(null)} onClick={() => onEnter(line.grandHallId)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEnter(line.grandHallId) } }} role="button" tabIndex="0" aria-label={`进入${line.name}主题展厅`}>
              <path className="network-lane-path" d={`M48 ${laneY[lane.id]} H950`} style={{ stroke: line.color }} />
              {lane.nodes.map(([year, label], index) => <g className={`network-node network-node--${index + 1}`} key={`${year}-${label}`}><circle cx={xForYear(year)} cy={laneY[lane.id]} r={hovered === lane.id ? 7 : 5} style={{ stroke: line.color }} /><text x={xForYear(year)} y={laneY[lane.id] - 14} textAnchor="middle">{label}</text></g>)}
              <text className="network-lane-label" x="10" y={laneY[lane.id] + 5} style={{ fill: line.color }}>{line.name}</text>
            </g>
          })}
        </svg>
        <div className="development-network-hint">悬停主线查看关键节点与能力交汇 · 点击进入主题展厅</div>
      </div>
      <div className="development-network-note"><strong>跨线支撑</strong><span>长征一号 → 天基中国</span><span>长征二号F → 人在太空</span><span>长征五号 → 奔向月球 / 走向行星</span><span>测控通信 → 连接所有深空任务</span></div>
    </section>
  )
}
