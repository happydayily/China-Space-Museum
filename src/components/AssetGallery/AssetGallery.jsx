import { useEffect, useMemo, useState } from 'react'
import AssetMedia from '../AssetMedia/AssetMedia'
import { resolveAssetSource } from '../../utils/assetRegistry'

export default function AssetGallery({ assets = [], title }) {
  const galleryAssets = useMemo(() => assets.length ? assets : [null], [assets])
  const [activeId, setActiveId] = useState(galleryAssets[0]?.id ?? 'placeholder')
  const activeAsset = galleryAssets.find((asset) => (asset?.id ?? 'placeholder') === activeId) ?? galleryAssets[0]
  const hasLocalImage = Boolean(resolveAssetSource(activeAsset))

  useEffect(() => {
    setActiveId(galleryAssets[0]?.id ?? 'placeholder')
  }, [galleryAssets])

  return (
    <div className="asset-gallery">
      <div className="asset-gallery-main">
        <AssetMedia asset={activeAsset} label={activeAsset?.name ?? title} />
        <div className="asset-gallery-caption">
          <div>
            <span>{activeAsset?.exhibitType || '历史档案'}</span>
            <strong>{activeAsset?.name ?? title}</strong>
          </div>
          <p>{activeAsset?.description ?? '该任务暂无公开影像。'}</p>
          <small>来源：{hasLocalImage ? '本地数字资产库' : '历史档案'}</small>
        </div>
      </div>
      <div className="asset-thumbnails" aria-label={`${title}图片缩略图`}>
        {galleryAssets.map((asset, index) => {
          const id = asset?.id ?? 'placeholder'
          return (
            <button
              type="button"
              className={id === (activeAsset?.id ?? 'placeholder') ? 'active' : ''}
              key={id}
              onClick={() => setActiveId(id)}
              aria-label={`查看${asset?.name ?? title}图片 ${index + 1}`}
            >
              <AssetMedia asset={asset} label={asset?.name ?? title} compact />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
