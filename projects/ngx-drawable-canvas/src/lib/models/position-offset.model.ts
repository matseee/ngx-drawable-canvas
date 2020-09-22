export class PositionOffset {
  public left: number;
  public top: number;

  constructor() {
    this.left = 0;
    this.top = 0;
  }

  add(offset: PositionOffset): PositionOffset {
    const result = new PositionOffset();
    result.left = this.left + offset.left;
    result.top = this.top + offset.top;
    return result;
  }
}
