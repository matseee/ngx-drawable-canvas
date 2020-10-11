import { Injectable } from '@angular/core';

import { DrawableCanvasFacade } from './../facades/drawable-canvas.facade';
import { PositionOffset } from './../models/position-offset.model';

@Injectable()
export class CoordinateService {
  protected drawingCanvasFacade: DrawableCanvasFacade;

  constructor() { }

  initialize(drawingCanvasFacade: DrawableCanvasFacade): void {
    this.drawingCanvasFacade = drawingCanvasFacade;
  }

  setPosition(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent) {
      this.drawingCanvasFacade.state.currentPosition.x = event.clientX - this.drawingCanvasFacade.state.canvasOffset.left;
      this.drawingCanvasFacade.state.currentPosition.y = event.clientY - this.drawingCanvasFacade.state.canvasOffset.top;
    } else {
      this.drawingCanvasFacade.state.currentPosition.x = event.touches[0].clientX - this.drawingCanvasFacade.state.canvasOffset.left;
      this.drawingCanvasFacade.state.currentPosition.y = event.touches[0].clientY - this.drawingCanvasFacade.state.canvasOffset.top;
    }
  }

  checkInsideCanvas(): boolean {
    return (this.drawingCanvasFacade.state.currentPosition.x >= 0
      && this.drawingCanvasFacade.state.currentPosition.x <= this.drawingCanvasFacade.canvasRef.nativeElement.width
      && this.drawingCanvasFacade.state.currentPosition.y >= 0
      && this.drawingCanvasFacade.state.currentPosition.y <= this.drawingCanvasFacade.canvasRef.nativeElement.height);
  }

  calculateOffset(element: HTMLElement): PositionOffset {
    let offset = new PositionOffset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
