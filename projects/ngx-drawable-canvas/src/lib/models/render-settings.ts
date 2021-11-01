export class RenderSettings {
    public cap: CanvasLineCap;
    public width: number;
    public color: string;
    public lineDashSegments: number[];

    constructor() {
        this.cap = 'round';
        this.width = 5;
        this.color = '#000000';
    }

    public set(renderingContext: CanvasRenderingContext2D): CanvasRenderingContext2D {
        renderingContext.lineCap = this.cap;
        renderingContext.lineWidth = this.width;
        renderingContext.strokeStyle = this.color;

        renderingContext.setLineDash(this.lineDashSegments ? this.lineDashSegments : []);
        return renderingContext;
    }
}
