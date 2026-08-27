const branches = [
  ['运载', '把航天器送往不同轨道', '连接五条发展主线'],
  ['测控', '让任务跨越距离可靠运行', '支撑载人、探月与行星际'],
  ['导航', '提供定位、授时与协同', '让卫星应用进入日常生活'],
  ['材料与制造', '支撑更轻、更强、更耐久', '把设计变成可工作的航天器'],
  ['空间科学', '把在轨与深空变成实验室', '把工程能力转化为科学问题'],
]

export default function TechTree({ compact = false }) {
  return <section className={`tech-section ${compact ? 'tech-section--compact' : ''}`}>
    <div className="section-heading"><span className="section-kicker">共同技术底座 · 五大方向</span><h2>{compact ? '一项能力，支撑多条主线。' : '技术发展树'}</h2><p>{compact ? '它们不是五张并列名片，而是随着任务边界一起生长的基础能力。' : '每一项突破，都是下一次远征的起点。'}</p></div>
    <div className="tech-tree" aria-label="共同技术底座五个方向">
      {branches.map(([branch, summary, relation], i) => <div className="tech-branch" key={branch}>
        <span className="branch-node">0{i + 1}</span>
        <div><h3>{branch}</h3><p>{summary}</p><small className="branch-relation">{relation}</small></div>
        <span className="branch-arrow" aria-hidden="true">→</span>
      </div>)}
    </div>
  </section>
}
