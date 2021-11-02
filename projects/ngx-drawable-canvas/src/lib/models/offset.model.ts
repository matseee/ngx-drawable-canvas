export class Offset {
  public left: number;
  public top: number;

  constructor(left?: number, top?: number) {
    this.left = left ?? 0;
    this.top = top ?? 0;
  }

  public add(offset: Offset): Offset {
    const result = new Offset();
    result.left = this.left + offset.left;
    result.top = this.top + offset.top;
    return result;
  }
}
