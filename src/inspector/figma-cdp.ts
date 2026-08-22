import * as http from 'http';
import { c } from '../utils/colors';

export interface ViewportParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScrollStep {
  deltaY: number;
  stepIndex: number;
  reason: string;
}

/**
 * Calculates adaptive deltaY according to BSI Relay SSOT:
 * Base deltaY = 3000 (DOWN = -3000, UP = +3000), increments by +500 per additional scroll
 */
export function calculateAdaptiveDeltaY(scrollIndex: number, direction: 'DOWN' | 'UP' = 'DOWN'): number {
  const magnitude = 3000 + scrollIndex * 500;
  return direction === 'DOWN' ? -magnitude : magnitude;
}

/**
 * Chrome DevTools Protocol helper for Figma WebGL canvas inspection
 */
export class FigmaCDPInspector {
  private host: string;
  private port: number;

  constructor(host = '127.0.0.1', port = 9222) {
    this.host = host;
    this.port = port;
  }

  async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const req = http.get(`http://${this.host}:${this.port}/json/version`, { timeout: 1500 }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  getAdaptivePlan(maxSteps = 4, direction: 'DOWN' | 'UP' = 'DOWN'): ScrollStep[] {
    const steps: ScrollStep[] = [];
    for (let i = 0; i < maxSteps; i++) {
      const dY = calculateAdaptiveDeltaY(i, direction);
      steps.push({
        stepIndex: i + 1,
        deltaY: dY,
        reason: i === 0 ? 'Base initial scroll' : `Adaptive increment +${i * 500}px for overlapping canvas`,
      });
    }
    return steps;
  }

  printInspectionGuide(): void {
    console.log(`\n${c.bold('📐 Figma DevTools MCP Adaptive Scroll Specification')}`);
    console.log(`${c.dim('─'.repeat(60))}`);
    console.log(`  • Macro Overview  : Zoom 25-30% to capture full layout hierarchy`);
    console.log(`  • Micro Inspection: Zoom 80% to verify tokens, paddings & borders`);
    console.log(`  • Scroll Formula  : Base |deltaY| = 3000, increment +500 per step`);
    console.log(`  • Exit Criterion  : Stop immediately once bottom border is captured`);
    console.log(`${c.dim('─'.repeat(60))}\n`);
  }
}
