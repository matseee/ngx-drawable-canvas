import { ElementRef, Injectable } from '@angular/core';
import { RenderSettings } from '../models/render-settings';
import { Line } from './../models/line.model';
import { Rect } from './../models/rect.model';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  protected canvasRef: ElementRef<HTMLCanvasElement>;
  protected context: CanvasRenderingContext2D;

  constructor() { }

  public initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');
  }

  public line(line: Line, renderSettings?: RenderSettings): boolean {
    try {
      this.preparePath(renderSettings);

      this.context.moveTo(line.pointOne.x, line.pointOne.y);
      this.context.lineTo(line.pointTwo.x, line.pointTwo.y);

      this.closePath();
    } catch (error) {
      return false;
    }
    return true;
  }

  public rect(rect: Rect, renderSettings?: RenderSettings): boolean {
    try {
      this.preparePath(renderSettings);

      this.context.rect(
        rect.pointOne.x,
        rect.pointOne.y,
        (rect.pointTwo.x - rect.pointOne.x),
        (rect.pointTwo.y - rect.pointOne.y)
      );

      this.closePath();
    } catch (error) {
      return false;
    }
    return true;
  }

  protected preparePath(renderSettings?: RenderSettings): void {
    if (!renderSettings) {
      renderSettings = new RenderSettings();
    }

    this.context.beginPath();
    this.context.lineCap = renderSettings.cap;
    this.context.lineWidth = renderSettings.width;
    this.context.strokeStyle = renderSettings.color;

    if (renderSettings.lineDashSegments && renderSettings.lineDashSegments.length > 0) {
      this.context.setLineDash(renderSettings.lineDashSegments);
    }
  }

  protected closePath(): void {
    this.context.stroke();
    this.context.closePath();
  }
}
