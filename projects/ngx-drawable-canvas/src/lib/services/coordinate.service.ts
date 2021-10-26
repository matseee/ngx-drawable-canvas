import { Injectable } from '@angular/core';
import { Offset } from '../models/offset.model';
import { DrawableCanvasFacade } from './../facades/drawable-canvas.facade';
import { DrawingState } from './../models/drawing-state.model';
import { Point } from './../models/point.model';
import { Rect } from './../models/rect.model';


@Injectable()
export class CoordinateService {
  protected state: DrawingState;
  protected drawingCanvasFacade: DrawableCanvasFacade;

  constructor() { }

  public initialize(drawingCanvasFacade: DrawableCanvasFacade): void {
    this.drawingCanvasFacade = drawingCanvasFacade;
    this.drawingCanvasFacade.state$.subscribe((state: DrawingState) => this.state = state);
  }

  public getPointFromMouseEvent(event: MouseEvent | TouchEvent): Point {
    if (event instanceof MouseEvent) {
      return new Point(
        event.clientX - this.state.canvasOffset.left,
        event.clientY - this.state.canvasOffset.top
      );
    } else {
      return new Point(
        event.touches[0].clientX - this.state.canvasOffset.left,
        event.touches[0].clientY - this.state.canvasOffset.top
      );
    }
  }

  public isPointInsideCanvas(point: Point): boolean {
    return this.isPointInsideRect(
      point,
      new Rect(
        new Point(0, 0),
        new Point(
          this.drawingCanvasFacade.canvasRef.nativeElement.width,
          this.drawingCanvasFacade.canvasRef.nativeElement.height
        )
      )
    );
  }

  public isPointInsideRect(point: Point, rect: Rect): boolean {
    const normalizedRect: Rect = rect.getNormalizedCopy();

    return (point.x >= normalizedRect.pointOne.x
      && point.x <= normalizedRect.pointTwo.x
      && point.y >= normalizedRect.pointOne.y
      && point.y <= normalizedRect.pointTwo.y);
  }

  public calculateOffset(element: HTMLElement): Offset {
    let offset = new Offset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
