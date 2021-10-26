export class Point {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  public translate(delta: Point): void {
    this.x = this.x + delta.x;
    this.y = this.y + delta.y;
  }

  public copy(): Point {
    return new Point(this.x, this.y);
  }
}
