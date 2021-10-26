import { Line } from './line.model';
import { Point } from './point.model';

export class DrawingPath {
    public lineWidth: number;
    public strokeColor: string;
    public lines: Line[];

    constructor(lineWidth?: number, strokeColor?: string) {
        this.lineWidth = lineWidth ?? 5;
        this.strokeColor = strokeColor ?? '#000';
        this.lines = [];
    }

    public translate(delta: Point): void {
        for (const line of this.lines) {
            // step.start.translate;
        }
    }
}
