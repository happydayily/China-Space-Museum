import mediaLinks from '../../data/mediaLinks.json'
import assets from '../../data/assets.json'
import OfficialMediaCard from '../OfficialMediaCard/OfficialMediaCard'

function findMedia(id) {
  return mediaLinks.find((item) => item.id === id) ?? assets.find((item) => item.id === id)
}

function normalizeMedia(item, mode) {
  return {
    ...item,
    title: item.title || item.sourceTitle || item.name,
    type: item.type || item.mediaType,
    source: item.source || item.sourceName,
    url: item.url || item.sourceUrl,
    thumbnailUrl: item.localPath ? item.thumbnailUrl : '',
    displayMode: item.displayMode || mode,
  }
}

export default function StoryMedia({ ids = [], mode = 'inline', color }) {
  const items = ids.map(findMedia).filter(Boolean).map((item) => normalizeMedia(item, mode))
  if (!items.length) return null

  return (
    <div className={`story-media story-media--${mode}`} style={{ '--hall-color': color }}>
      {items.map((item, index) => <OfficialMediaCard item={item} index={index} mode={mode} key={item.id} />)}
    </div>
  )
}
