import { Line } from './line.model';
import { Point } from './point.model';
import { RenderSettings } from './render-settings';

export class DrawingPath {
    public settings: RenderSettings;
    public lines: Line[];

    constructor(settings?: RenderSettings) {
        this.settings = settings ?? new RenderSettings();
        this.lines = [];
    }

    public translate(delta: Point): void {
        for (const line of this.lines) {
            line.translate(delta);
        }
    }

    public copy(): DrawingPath {
        const copy: DrawingPath = new DrawingPath(this.settings);
        for (const line of this.lines) {
            copy.lines.push(line.copy());
        }
        return copy;
    }

    public getMinPoint(): Point {
        let minPoint: Point = new Point();
        minPoint.x = null;
        minPoint.y = null;

        for (const line of this.lines) {
            const tmpMinPoint: Point = line.getMinPoint();

            if (minPoint.x === null && minPoint.y === null) {
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
        maxPoint.x = null;
        maxPoint.y = null;

        for (const line of this.lines) {
            const tmpMinPoint: Point = line.getMaxPoint();

            if (maxPoint.x === null && maxPoint.y === null) {
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
