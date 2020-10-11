import { ElementRef, Injectable } from '@angular/core';

import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';

@Injectable()
export class DrawableCanvasFacade {
  protected statesStack: any[] = [];

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

      canvasOffset: new PositionOffset(),
    };
  }

  startMouse(event: MouseEvent | TouchEvent): void {
    this.state.canvasOffset = this.calculateOffset(this.canvasRef.nativeElement);
    this.setPosition(event);

    if (this.checkInsideCanvas()) {
      this.state.isDrawing = true;
      this.pushState();
    }
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

  back(): void {
    if (this.statesStack.length > 0) {
      const lastImage = this.statesStack.pop();
      this.context.putImageData(
        lastImage,
        0, 0,
        0, 0,
        this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height
      );
    }
  }

  protected setPosition(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent) {
      this.state.currentCoordinateX = event.clientX - this.state.canvasOffset.left;
      this.state.currentCoordinateY = event.clientY - this.state.canvasOffset.top;
    } else {
      this.state.currentCoordinateX = event.touches[0].clientX - this.state.canvasOffset.left;
      this.state.currentCoordinateY = event.touches[0].clientY - this.state.canvasOffset.top;
    }
  }

  protected checkInsideCanvas(): boolean {
    return (this.state.currentCoordinateX >= 0 && this.state.currentCoordinateX <= this.canvasRef.nativeElement.width
      && this.state.currentCoordinateY >= 0 && this.state.currentCoordinateY <= this.canvasRef.nativeElement.height);
  }

  protected pushState(): void {
    this.statesStack.push(this.context.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));
    console.log('ImageStackCount: ', this.statesStack.length);
    console.log('LastImage', this.statesStack[this.statesStack.length - 1]);
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
