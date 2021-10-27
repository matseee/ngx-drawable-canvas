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
            line.translate(delta);
        }
    }

    public copy(): DrawingPath {
        const copy: DrawingPath = new DrawingPath(this.lineWidth, this.strokeColor);
        for (const line of this.lines) {
            copy.lines.push(line.copy());
        }
        return copy;
    }

    public getMinPoint(): Point {
        let minPoint: Point = new Point();

        for (const line of this.lines) {
            const tmpMinPoint: Point = line.getMinPoint();

            if (minPoint.x === 0 && minPoint.y === 0) {
                minPoint = tmpMinPoint;
            }
            if (minPoint.x > tmpMinPoint.x) {
                minPoint.x = tmpMinPoint.x;
            }
            if (minPoint.y > tmpMinPoint.y) {
                minPoint.y = tmpMinPoint.y;
            }
        }

        return minPoint;
    }

    public getMaxPoint(): Point {
        let maxPoint: Point = new Point();

        for (const line of this.lines) {
            const tmpMinPoint: Point = line.getMaxPoint();

            if (maxPoint.x === 0 && maxPoint.y === 0) {
                maxPoint = tmpMinPoint;
            }
            if (maxPoint.x < tmpMinPoint.x) {
                maxPoint.x = tmpMinPoint.x;
            }
            if (maxPoint.y < tmpMinPoint.y) {
                maxPoint.y = tmpMinPoint.y;
            }
        }

        return maxPoint;
    }
}
