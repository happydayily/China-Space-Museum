import { useEffect, useRef, useState } from 'react'
import { findAssetSourceRecord, resolveAssetSource } from '../../utils/assetRegistry'

function AssetPlaceholder({ label }) {
  return (
    <div className="viewer-placeholder" role="img" aria-label={`${label}暂无公开影像`}>
      <span>历史档案</span>
      <strong>暂无公开影像</strong>
      <small>{label}</small>
    </div>
  )
}

export default function ImageViewer({ asset, label, variant = 'main' }) {
  const imageUrl = resolveAssetSource(asset)
  const source = findAssetSourceRecord(asset)
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const modalRef = useRef(null)
  const title = asset?.name || label || '数字航天展品'
  const roleLabels = { main: '任务代表视觉', secondary: '辅助展品', technical: '技术解释', archive: '历史档案' }

  useEffect(() => setFailed(false), [imageUrl])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const requestFullscreen = async () => {
    if (modalRef.current?.requestFullscreen) await modalRef.current.requestFullscreen()
  }

  if (!imageUrl || failed) return <AssetPlaceholder label={title} />

  return (
    <>
      <figure className={`image-viewer image-viewer--${variant}`}>
        <button className="image-viewer-trigger" type="button" onClick={() => setOpen(true)} aria-label={`放大查看${title}`}>
          <img src={imageUrl} alt={asset?.description || title} onError={() => setFailed(true)} />
          <span className="image-viewer-scan" />
          <span className="image-viewer-zoom">放大查看 <b>↗</b></span>
        </button>
        {variant !== 'card' && (
          <figcaption>
            <span>{roleLabels[asset?.displayRole] || '历史档案'}</span>
            <strong>{title}</strong>
            <small>{source?.source_name || '馆藏档案'}</small>
          </figcaption>
        )}
      </figure>

      {open && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={title} ref={modalRef}>
          <div className="lightbox-toolbar">
            <span>影像资料 · 中国航天发展史数字博物馆</span>
            <div>
              <button type="button" onClick={requestFullscreen}>全屏查看</button>
              <button type="button" onClick={() => setOpen(false)} aria-label="关闭图片">关闭 ×</button>
            </div>
          </div>
          <div className="lightbox-stage">
            <img src={imageUrl} alt={asset?.description || title} />
          </div>
          <aside className="lightbox-meta">
            <div>
              <span>展品名称</span>
              <h2>{title}</h2>
              <p>{asset?.description || '暂无公开说明。'}</p>
            </div>
            <dl>
              <div><dt>历史意义</dt><dd>{asset?.historicalImportance || '相关历史档案尚未公开'}</dd></div>
              <div><dt>技术成就</dt><dd>{asset?.technicalAchievement || '相关技术档案尚未公开'}</dd></div>
              <div><dt>来源</dt><dd>{source?.source_name || '馆藏档案'}</dd></div>
              <div><dt>版权信息</dt><dd>{source?.source_name?.match(/\(([^)]+)\)/)?.[1] || '请以来源页面说明为准'}</dd></div>
            </dl>
            {source?.source_url && <a href={source.source_url} target="_blank" rel="noreferrer">访问原始来源 ↗</a>}
          </aside>
        </div>
      )}
    </>
  )
}
