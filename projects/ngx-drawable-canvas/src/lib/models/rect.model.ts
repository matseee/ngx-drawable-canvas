import { Point } from './point.model';

export class Rect {
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

    public getNormalizedCopy(): Rect {
        return new Rect(
            new Point(
                this.pointOne.x < this.pointTwo.x ? this.pointOne.x : this.pointTwo.x,
                this.pointOne.y < this.pointTwo.y ? this.pointOne.y : this.pointTwo.y
            ),
            new Point(
                this.pointOne.x > this.pointTwo.x ? this.pointOne.x : this.pointTwo.x,
                this.pointOne.y > this.pointTwo.y ? this.pointOne.y : this.pointTwo.y
            )
        );
    }

    public copy(): Rect {
        return new Rect(this.pointOne.copy(), this.pointTwo.copy());
    }
}
