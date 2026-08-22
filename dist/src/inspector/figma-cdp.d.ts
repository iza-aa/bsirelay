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
export declare function calculateAdaptiveDeltaY(scrollIndex: number, direction?: 'DOWN' | 'UP'): number;
/**
 * Chrome DevTools Protocol helper for Figma WebGL canvas inspection
 */
export declare class FigmaCDPInspector {
    private host;
    private port;
    constructor(host?: string, port?: number);
    isAvailable(): Promise<boolean>;
    getAdaptivePlan(maxSteps?: number, direction?: 'DOWN' | 'UP'): ScrollStep[];
    printInspectionGuide(): void;
}
