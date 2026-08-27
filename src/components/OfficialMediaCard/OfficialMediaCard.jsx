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

function SourceDetails({ item, attribution, license }) {
  if (!attribution && !item.licenseUrl && !item.licenseNote) return null
  return (
    <details className="official-media-details">
      <summary>来源详情</summary>
      <p>{attribution ? `署名：${attribution}` : null}{license ? ` · ${license}` : null}{item.licenseNote ? ` · ${item.licenseNote}` : null}{item.licenseUrl ? <> · <a href={item.licenseUrl} target="_blank" rel="noreferrer">许可页面 ↗</a></> : null}</p>
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
  const shortLicense = item.license || (item.mediaType === 'official-video' ? '官方外链' : '官方来源')
  const actionLabel = item.mediaType === 'official-video' ? '观看官方影像' : '查看来源'

  if (mode === 'inline' || mode === 'compact') {
    return (
      <article className={`official-media-card official-media-card--${mode}`}>
        <div className="official-media-inline-mark" aria-hidden="true">{item.mediaType === 'official-video' ? '▶' : '◌'}</div>
        <div className="official-media-copy">
          <span>{type} · {source}{item.year ? ` · ${item.year}` : ''} · {shortLicense}</span>
          <h3>{item.title || item.sourceTitle}</h3>
          {item.description ? <p>{item.description}</p> : null}
          <div className="official-media-status"><b>{statusLabels[usageStatus] || '资料状态待标注'}</b></div>
          <SourceDetails item={item} attribution={attribution} license={license} />
          {url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${actionLabel}：${item.title || item.sourceTitle || ''}`}>{actionLabel} <b>↗</b></a> : null}
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
        <span>{source}{item.year ? ` · ${item.year}` : ''}</span>
        <h3>{item.title || item.sourceTitle}</h3>
        {item.description ? <p>{item.description}</p> : null}
        <div className="official-media-status"><b>{item.year ? `${item.year} · ${shortLicense}` : (statusLabels[usageStatus] || '资料状态待标注')}</b></div>
        <SourceDetails item={item} attribution={attribution} license={license} />
        {url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${actionLabel}：${item.title || item.sourceTitle || ''}`}>{actionLabel} <b>↗</b></a> : null}
      </div>
    </article>
  )
}
