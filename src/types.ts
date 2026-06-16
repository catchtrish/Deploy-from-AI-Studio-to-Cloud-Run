/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SimulationType = 'none' | 'snowflakes' | 'balloons';

export interface Particle {
  id: number;
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  opacity: number;
  // Specific to snowflakes
  rotation?: number;
  rotSpeed?: number;
  // Specific to balloons
  color?: string;
  stringLength?: number;
}
