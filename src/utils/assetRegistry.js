import assets from '../data/assets.json'
import sources from '../data/sources.json'

const localFiles = {
  ...import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', { eager: true, query: '?url', import: 'default' }),
  ...import.meta.glob('../assets/videos/**/*.{mp4,webm,ogg}', { eager: true, query: '?url', import: 'default' }),
  ...import.meta.glob('../assets/models/**/*.{glb,gltf,obj,fbx}', { eager: true, query: '?url', import: 'default' }),
}

function normalizeLocalPath(localPath = '') {
  return localPath
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .replace(/^\/?src\/assets\//, '')
    .replace(/^\/?assets\//, '')
}

export function resolveAssetSource(asset) {
  if (!asset?.localPath) return ''
  const normalizedPath = normalizeLocalPath(asset.localPath)
  return localFiles[`../assets/${normalizedPath}`] ?? ''
}

export function findRelatedAsset(...references) {
  return findRelatedAssets(...references)[0] ?? null
}

export function findRelatedAssets(...references) {
  const validReferences = references.filter(Boolean)
  return assets.filter((asset) => validReferences.includes(asset.relatedMission))
}

export function getAssetById(id) {
  return assets.find((asset) => asset.id === id) ?? null
}

export function getAssetsByIds(ids = []) {
  return ids.map(getAssetById).filter(Boolean)
}

export function findAssetSourceRecord(asset) {
  if (!asset) return null
  const filename = normalizeLocalPath(asset.localPath).split('/').pop()
  return sources.find((source) => source.id === asset.id || source.filename === filename) ?? null
}

export function getAssetsByRole(category, role) {
  return assets.filter((asset) => asset.category === category && asset.displayRole === role)
}

export { assets, sources }
