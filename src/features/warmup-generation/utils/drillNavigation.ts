import type { WarmUp, FlatDrillReference } from '../types'

/**
 * Flatten all drills from all phases into a single array with references
 * This makes navigation and progress tracking easier
 */
export function flattenDrills(warmup: WarmUp): FlatDrillReference[] {
  const result: FlatDrillReference[] = []
  let globalIndex = 0

  warmup.phases.forEach((phase, phaseIndex) => {
    phase.drills.forEach((drill, drillIndex) => {
      result.push({
        phaseIndex,
        drillIndex,
        phase,
        drill,
        globalIndex,
        totalDrills: 0, // Will be set after counting
      })
      globalIndex++
    })
  })

  // Set total on all references
  const totalDrills = result.length
  result.forEach((ref) => {
    ref.totalDrills = totalDrills
  })

  return result
}

/**
 * Get drill at a specific global index
 */
export function getDrillAtIndex(
  flatDrills: FlatDrillReference[],
  globalIndex: number
): FlatDrillReference | null {
  return flatDrills[globalIndex] ?? null
}

/**
 * Calculate global index from phase and drill indices
 */
export function getGlobalIndex(
  warmup: WarmUp,
  phaseIndex: number,
  drillIndex: number
): number {
  let globalIndex = 0

  for (let p = 0; p < phaseIndex; p++) {
    globalIndex += warmup.phases[p].drills.length
  }
  globalIndex += drillIndex

  return globalIndex
}

/**
 * Get phase and drill indices from global index
 */
export function getIndicesFromGlobal(
  warmup: WarmUp,
  globalIndex: number
): { phaseIndex: number; drillIndex: number } | null {
  let remaining = globalIndex

  for (let p = 0; p < warmup.phases.length; p++) {
    const phase = warmup.phases[p]
    if (remaining < phase.drills.length) {
      return { phaseIndex: p, drillIndex: remaining }
    }
    remaining -= phase.drills.length
  }

  return null
}

/**
 * Count total drills in a warm-up
 */
export function countTotalDrills(warmup: WarmUp): number {
  return warmup.phases.reduce((sum, phase) => sum + phase.drills.length, 0)
}

/**
 * Check if this is the last drill in the warm-up
 */
export function isLastDrill(flatDrills: FlatDrillReference[], globalIndex: number): boolean {
  return globalIndex >= flatDrills.length - 1
}

/**
 * Check if this is the first drill in the warm-up
 */
export function isFirstDrill(globalIndex: number): boolean {
  return globalIndex === 0
}
