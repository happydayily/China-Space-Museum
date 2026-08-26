import { getAssetById, resolveAssetSource } from '../../utils/assetRegistry'

export default function ExhibitionCard({ hall, onEnter }) {
  const asset = getAssetById(hall.mainAssetId)
  const imageUrl = resolveAssetSource(asset)

  return (
    <button
      type="button"
      className="exhibition-card"
      style={{ '--hall-color': hall.color, '--hall-image': imageUrl ? `url("${imageUrl}")` : 'none' }}
      onClick={() => onEnter(hall.id)}
      aria-label={`进入${hall.name}展厅`}
    >
      <span className="exhibition-card-image" role="img" aria-label={asset?.description || hall.name} />
      {!imageUrl && <span className="exhibition-card-placeholder">暂无公开影像</span>}
      <span className="exhibition-card-shade" />
      <span className="exhibition-card-index">{hall.index}</span>
      <span className="exhibition-card-copy">
        <small>{hall.period}</small>
        <strong>{hall.name}</strong>
        <b>{hall.year}</b>
        <em>“{hall.tagline}”</em>
      </span>
      <span className="exhibition-card-enter">进入展厅 ↗</span>
    </button>
  )
}
