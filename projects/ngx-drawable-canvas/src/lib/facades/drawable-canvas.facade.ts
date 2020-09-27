import { ElementRef, Injectable } from '@angular/core';

import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';

@Injectable()
export class DrawableCanvasFacade {
  canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  state: DrawingState;

  constructor() { }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');

    this.state = {
      isDrawing: false,
      currentCoordinateX: 0,
      currentCoordinateY: 0,
    };
  }

  startMouse(event: MouseEvent | TouchEvent): void {
    this.state.isDrawing = true;
    this.setPosition(event);
  }

  stopMouse(event: MouseEvent | TouchEvent): void {
    this.state.isDrawing = false;
    this.context.closePath();
  }

  drawMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isDrawing) {
      return;
    }

    event.preventDefault();

    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'green';

    this.context.moveTo(this.state.currentCoordinateX, this.state.currentCoordinateY);
    this.setPosition(event);

    this.context.lineTo(this.state.currentCoordinateX, this.state.currentCoordinateY);
    this.context.stroke();
  }

  protected setPosition(event: MouseEvent | TouchEvent): void {
    const calculatedOffset = this.calculateOffset(this.canvasRef.nativeElement);

    if (event instanceof MouseEvent) {
      this.state.currentCoordinateX = event.clientX - calculatedOffset.left;
      this.state.currentCoordinateY = event.clientY - calculatedOffset.top;
    } else {
      this.state.currentCoordinateX = event.touches[0].clientX - calculatedOffset.left;
      this.state.currentCoordinateY = event.touches[0].clientY - calculatedOffset.top;
    }
  }

  protected calculateOffset(element: HTMLElement): PositionOffset {
    let offset = new PositionOffset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
