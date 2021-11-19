import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RenderSettings } from '../models/render-settings';
import { DrawingState } from './../models/drawing-state.model';
import { Line } from './../models/line.model';
import { Rect } from './../models/rect.model';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  protected canvasRef: ElementRef<HTMLCanvasElement>;
  protected context: CanvasRenderingContext2D;
  protected state: DrawingState;

  constructor() { }

  public initialize(canvasRef: ElementRef<HTMLCanvasElement>, state$: Observable<DrawingState>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');

    state$.subscribe(state => this.state = state);
  }

  public rerender(): boolean {
    let success = true;
    let tmp = true;

    try {
      this.context.clearRect(0, 0, this.state.canvasSettings.width, this.state.canvasSettings.height);

      const paths = this.state.currentPath ? this.state.paths.concat(this.state.currentPath) : this.state.paths;

      for (const path of paths) {
        for (const line of path.lines) {
          tmp = this.line(line, path.settings);
          if (!tmp) {
            success = tmp;
          }
        }
      }
    } catch (error) {
      return false;
    }
    return success;
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
