import { resolveAssetSource } from '../../utils/assetRegistry'

const statusLabels = {
  'local-approved': '已获本地使用许可',
  'link-only': '仅保留官方外链',
  'review-needed': '待版权复核',
}

const mediaLabels = {
  'official-image': '官方图片',
  'official-video': '官方视频',
  'open-license-image': '开放许可影像',
  'mission-image': '任务影像',
  archive: '历史档案',
  '官方图片': '官方图片',
  '官方视频': '官方视频',
  '官方图集': '官方图片',
  '官方回顾': '官方资料',
}

function SourceDetails({ item, type, source, url, attribution, license, usageStatus }) {
  const title = item.sourceTitle || item.title || item.name
  const hasDetails = Boolean(type || source || title || url || attribution || license || item.licenseNote || usageStatus)
  if (!hasDetails) return null
  return (
    <details className="official-media-details">
      <summary>授权与来源登记</summary>
      <dl>
        {type ? <div><dt>资料类型</dt><dd>{type}</dd></div> : null}
        {source ? <div><dt>来源机构</dt><dd>{source}</dd></div> : null}
        {title ? <div><dt>原始标题</dt><dd>{title}</dd></div> : null}
        {attribution ? <div><dt>作者 / 署名</dt><dd>{attribution}</dd></div> : null}
        {license ? <div><dt>许可</dt><dd>{license}</dd></div> : null}
        {item.licenseNote ? <div><dt>授权说明</dt><dd>{item.licenseNote}</dd></div> : null}
        {usageStatus ? <div><dt>使用状态</dt><dd>{statusLabels[usageStatus] || usageStatus}</dd></div> : null}
        {url ? <div><dt>来源页面</dt><dd><a href={url} target="_blank" rel="noreferrer">打开来源页面 ↗</a></dd></div> : null}
        {item.licenseUrl ? <div><dt>许可页面</dt><dd><a href={item.licenseUrl} target="_blank" rel="noreferrer">打开许可页面 ↗</a></dd></div> : null}
      </dl>
    </details>
  )
}

export default function OfficialMediaCard({ item, index = 0, mode = item.displayMode || 'compact' }) {
  const type = mediaLabels[item.displayLabel || item.type || item.mediaType] || '官方资料'
  const source = item.source || item.sourceName || '官方机构'
  const url = item.url || item.sourceUrl
  const usageStatus = item.usageStatus || 'link-only'
  const imageSource = resolveAssetSource(item) || item.thumbnailUrl
  const attribution = item.attribution || item.author
  const license = item.license || item.licenseNote
  const actionLabel = item.mediaType === 'official-video' ? '观看官方影像' : '查看来源'

  if (mode === 'inline' || mode === 'compact') {
    return (
      <article className={`official-media-card official-media-card--${mode}`}>
        <div className="official-media-inline-mark" aria-hidden="true">{item.mediaType === 'official-video' ? '▶' : '◌'}</div>
        <div className="official-media-copy">
          <div className="official-media-source-line"><span>{source}{item.year ? ` · ${item.year}` : ''}</span>{url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${actionLabel}：${item.title || item.sourceTitle || ''}`}>来源详情 <b>↗</b></a> : null}</div>
          <h3>{item.title || item.sourceTitle}</h3>
          {item.description ? <p>{item.description}</p> : null}
          <SourceDetails item={item} type={type} source={source} url={url} attribution={attribution} license={license} usageStatus={usageStatus} />
        </div>
      </article>
    )
  }

  return (
    <article className={`official-media-card official-media-card--feature${imageSource ? ' official-media-card--image' : ''}`}>
      <div className="official-media-cover">
        {imageSource ? <img src={imageSource} alt={item.title || item.sourceTitle || ''} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} /> : null}
        <span>{type}</span><strong>{String(index + 1).padStart(2, '0')}</strong><i aria-hidden="true">{item.mediaType === 'official-video' ? '▶' : '✦'}</i>
      </div>
      <div className="official-media-copy">
        <div className="official-media-source-line"><span>{source}{item.year ? ` · ${item.year}` : ''}</span>{url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${actionLabel}：${item.title || item.sourceTitle || ''}`}>来源详情 <b>↗</b></a> : null}</div>
        <h3>{item.title || item.sourceTitle}</h3>
        {item.description ? <p>{item.description}</p> : null}
        <SourceDetails item={item} type={type} source={source} url={url} attribution={attribution} license={license} usageStatus={usageStatus} />
      </div>
    </article>
  )
}
