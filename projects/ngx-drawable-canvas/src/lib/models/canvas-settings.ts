import { Offset } from './offset.model';

export class CanvasSettings {
    public width: number;
    public height: number;
    public offset: Offset;

    constructor(width?: number, height?: number, offset?: Offset) {
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.offset = offset ?? new Offset();
    }
}
