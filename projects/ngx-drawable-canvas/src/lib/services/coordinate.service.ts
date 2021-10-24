import { Injectable } from '@angular/core';
import { DrawableCanvasFacade } from './../facades/drawable-canvas.facade';
import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';
import { Position } from './../models/position.model';


@Injectable()
export class CoordinateService {
  protected state: DrawingState;
  protected drawingCanvasFacade: DrawableCanvasFacade;

  constructor() { }

  public initialize(drawingCanvasFacade: DrawableCanvasFacade): void {
    this.drawingCanvasFacade = drawingCanvasFacade;
    this.drawingCanvasFacade.state$.subscribe((state: DrawingState) => this.state = state);
  }

  public getPosition(event: MouseEvent | TouchEvent): Position {
    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - this.state.canvasOffset.left,
        y: event.clientY - this.state.canvasOffset.top,
      };
    } else {
      return {
        x: event.touches[0].clientX - this.state.canvasOffset.left,
        y: event.touches[0].clientY - this.state.canvasOffset.top,
      };
    }
  }

  public checkInsideCanvas(): boolean {
    return (this.state.currentPosition.x >= 0
      && this.state.currentPosition.x <= this.drawingCanvasFacade.canvasRef.nativeElement.width
      && this.state.currentPosition.y >= 0
      && this.state.currentPosition.y <= this.drawingCanvasFacade.canvasRef.nativeElement.height);
  }

  public calculateOffset(element: HTMLElement): PositionOffset {
    let offset = new PositionOffset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
