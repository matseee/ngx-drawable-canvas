export class Offset {
  public left: number;
  public top: number;

  constructor() {
    this.left = 0;
    this.top = 0;
  }

  public add(offset: Offset): Offset {
    const result = new Offset();
    result.left = this.left + offset.left;
    result.top = this.top + offset.top;
    return result;
  }
}
