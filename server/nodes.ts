import type { ComputeNode } from '@/types'

// Static for now. When testing UI behaviour (routing decisions, status badges,
// power draw visualisation), consider replacing with randomised data to observe
// how the dashboard responds to different fleet states.
export const NODES: ComputeNode[] = [
  { id: 'node-1', name: 'Van-01', status: 'ONLINE',  powerDraw: 450, zone: 'CA_BC'       },
  { id: 'node-2', name: 'Van-02', status: 'IDLE',    powerDraw: 120, zone: 'CA_BC'       },
  { id: 'node-3', name: 'Tor-01', status: 'ONLINE',  powerDraw: 520, zone: 'CA_ON'       },
  { id: 'node-4', name: 'Tor-02', status: 'OFFLINE', powerDraw: 0,   zone: 'CA_ON'       },
  { id: 'node-5', name: 'Fra-01', status: 'ONLINE',  powerDraw: 490, zone: 'DE'          },
  { id: 'node-6', name: 'Fra-02', status: 'IDLE',    powerDraw: 95,  zone: 'DE'          },
  { id: 'node-7', name: 'Dal-01', status: 'ONLINE',  powerDraw: 340, zone: 'US_TEX_ERCO' },
  { id: 'node-8', name: 'Dal-02', status: 'OFFLINE', powerDraw: 0,   zone: 'US_TEX_ERCO' },
]
