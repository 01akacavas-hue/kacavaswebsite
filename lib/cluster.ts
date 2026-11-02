export type ClusterPoint = {
  id: string
  x: number
  y: number
}

export type Cluster<T extends ClusterPoint> = {
  id: string
  x: number
  y: number
  members: T[]
}

/**
 * Groups points that fall inside `radius` of a seed, in projected map units.
 * A group of one is a single pin. Member order does not change the id.
 */
export function clusterPoints<T extends ClusterPoint>(points: readonly T[], radius: number): Cluster<T>[] {
  const pending = points.map((point, index) => ({ point, index }))
  const clusters: Cluster<T>[] = []
  const radiusSq = radius * radius

  while (pending.length > 0) {
    const seed = pending.shift()
    if (!seed) break
    const members = [seed.point]
    for (let i = pending.length - 1; i >= 0; i -= 1) {
      const candidate = pending[i]
      if (!candidate) continue
      const dx = candidate.point.x - seed.point.x
      const dy = candidate.point.y - seed.point.y
      if (dx * dx + dy * dy <= radiusSq) {
        members.push(candidate.point)
        pending.splice(i, 1)
      }
    }
    const x = members.reduce((sum, member) => sum + member.x, 0) / members.length
    const y = members.reduce((sum, member) => sum + member.y, 0) / members.length
    const id =
      members.length === 1 ? members[0].id : `cluster:${members.map((member) => member.id).sort().join("|")}`
    clusters.push({ id, x, y, members })
  }

  return clusters
}
