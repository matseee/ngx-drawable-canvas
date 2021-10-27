import { Point } from './point.model';

export class Line {
    public pointOne: Point;
    public pointTwo: Point;

    constructor(pointOne?: Point, pointTwo?: Point) {
        this.pointOne = pointOne ?? new Point();
        this.pointTwo = pointTwo ?? new Point();
    }

    public translate(delta: Point): void {
        this.pointOne.translate(delta);
        this.pointTwo.translate(delta);
    }

    public copy(): Line {
        return new Line(this.pointOne.copy(), this.pointTwo.copy());
    }

    public getMinPoint(): Point {
        return new Point(
            this.pointOne.x < this.pointTwo.x ? this.pointOne.x : this.pointTwo.x,
            this.pointOne.y < this.pointTwo.y ? this.pointOne.y : this.pointTwo.y
        );
    }

    public getMaxPoint(): Point {
        return new Point(
            this.pointOne.x > this.pointTwo.x ? this.pointOne.x : this.pointTwo.x,
            this.pointOne.y > this.pointTwo.y ? this.pointOne.y : this.pointTwo.y
        );
    }
}
