/**
 * Node workload simulation.
 *
 * Runs a 3.5-minute cycle for BC (Vancouver) nodes to demonstrate routing shifts:
 *   normal  (120s) — BC nodes run steady, routed here due to low carbon
 *   ramp    (30s)  — BC nodes spike toward max capacity under demand surge
 *   offline (60s)  — BC nodes go OFFLINE for maintenance; routing shifts to CA_ON
 *   recovery(30s)  — BC nodes come back idle, routing returns to BC
 *
 * All other non-OFFLINE nodes get a small random-walk on every 5s tick.
 */

import { NODES } from './nodes'
import type { ComputeNode } from '@/types'

const MAX_POWER_W = 600
const TICK_MS = 5_000

type Phase = 'normal' | 'ramp' | 'offline' | 'recovery'

const PHASE_TICKS: Record<Phase, number> = {
  normal:   24,   // 120s
  ramp:      6,   // 30s
  offline:  12,   // 60s
  recovery:  6,   // 30s
}

const NEXT_PHASE: Record<Phase, Phase> = {
  normal:   'ramp',
  ramp:     'offline',
  offline:  'recovery',
  recovery: 'normal',
}

let phase: Phase = 'normal'
let ticksInPhase = 0

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function rand(range: number) {
  return (Math.random() - 0.5) * 2 * range
}

function node(name: string): ComputeNode {
  return NODES.find(n => n.name === name)!
}

function tick() {
  ticksInPhase++
  if (ticksInPhase >= PHASE_TICKS[phase]) {
    ticksInPhase = 0
    phase = NEXT_PHASE[phase]
  }

  const van1 = node('Van-01')
  const van2 = node('Van-02')

  switch (phase) {
    case 'normal':
      van1.status = 'ONLINE'
      van1.powerDraw = Math.round(clamp(van1.powerDraw + rand(25), 300, 520))
      van2.status = 'IDLE'
      van2.powerDraw = Math.round(clamp(van2.powerDraw + rand(10), 80, 180))
      break

    case 'ramp':
      // Demand surge — both nodes climb toward capacity
      van1.status = 'ONLINE'
      van1.powerDraw = Math.round(clamp(van1.powerDraw + 15 + Math.random() * 10, 300, MAX_POWER_W - 10))
      van2.status = 'ONLINE'
      van2.powerDraw = Math.round(clamp(van2.powerDraw + 20 + Math.random() * 15, 80, 480))
      break

    case 'offline':
      // Maintenance triggered by overload
      van1.status = 'OFFLINE'
      van1.powerDraw = 0
      van2.status = 'OFFLINE'
      van2.powerDraw = 0
      break

    case 'recovery':
      // Nodes come back idle, power draw resets low
      van1.status = 'IDLE'
      van1.powerDraw = Math.round(clamp(120 + rand(30), 80, 200))
      van2.status = 'IDLE'
      van2.powerDraw = Math.round(clamp(90 + rand(20), 60, 150))
      break
  }

  // General random walk for all other active nodes
  for (const n of NODES) {
    if (n.name === 'Van-01' || n.name === 'Van-02') continue
    if (n.status === 'OFFLINE') continue

    const drift = n.status === 'IDLE' ? 8 : 20
    const next = Math.round(clamp(n.powerDraw + rand(drift), 60, MAX_POWER_W - 20))
    n.powerDraw = next

    // Smooth status transitions driven by load
    if (n.status === 'ONLINE' && next < 90) n.status = 'IDLE'
    else if (n.status === 'IDLE' && next > 260) n.status = 'ONLINE'
  }
}

let started = false

export function startSimulation() {
  if (started) return
  started = true
  setInterval(tick, TICK_MS)
}

export function getSimulationPhase(): { phase: Phase; ticksInPhase: number; totalTicks: number } {
  return { phase, ticksInPhase, totalTicks: PHASE_TICKS[phase] }
}
