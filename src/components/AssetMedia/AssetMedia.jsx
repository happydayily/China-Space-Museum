import { useEffect, useState } from 'react'
import { resolveAssetSource } from '../../utils/assetRegistry'

export default function AssetMedia({ asset, label, compact = false }) {
  const source = resolveAssetSource(asset)
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [source])

  if (!source || failed) {
    return (
      <div className={`asset-placeholder ${compact ? 'compact' : ''}`} role="img" aria-label={`${label}暂无公开影像`}>
        <span>历史档案</span>
        <strong>暂无公开影像</strong>
        <small>{label}</small>
      </div>
    )
  }

  return (
    <figure className={`asset-media ${compact ? 'compact' : ''}`}>
      <img src={source} alt={asset?.description || label} onError={() => setFailed(true)} />
      {asset?.description && <figcaption>{asset.description}</figcaption>}
    </figure>
  )
}
