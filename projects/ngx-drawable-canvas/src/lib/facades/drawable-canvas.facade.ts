import { ElementRef, Injectable } from '@angular/core';
import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';
import { CoordinateService } from './../services/coordinate.service';
import { ImageStackService } from './../services/image-stack.service';


@Injectable()
export class DrawableCanvasFacade {
  canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  state: DrawingState;

  constructor(
    protected coordinate: CoordinateService,
    protected imageStack: ImageStackService,
  ) { }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');

    this.state = {
      isEnabled: true,
      isDrawing: false,
      color: '#00ccffff',
      canvasOffset: new PositionOffset(),
      currentPosition: {
        x: 0,
        y: 0,
      },
    };

    this.coordinate.initialize(this);
    this.imageStack.initialize(this);
  }

  startMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.state.canvasOffset = this.coordinate.calculateOffset(this.canvasRef.nativeElement);
    this.coordinate.setPosition(event);

    if (this.coordinate.checkInsideCanvas()) {
      this.state.isDrawing = true;
      this.imageStack.save();
    }
  }

  stopMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.state.isDrawing = false;
    this.context.closePath();
  }

  drawMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled || !this.state.isDrawing) {
      return;
    }

    event.preventDefault();

    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.state.color;

    this.context.moveTo(this.state.currentPosition.x, this.state.currentPosition.y);
    this.coordinate.setPosition(event);

    this.context.lineTo(this.state.currentPosition.x, this.state.currentPosition.y);
    this.context.stroke();
  }

  back(): void {
    this.imageStack.back();
  }

  setColor(color: string): void {
    this.state.color = color;
  }

  setEnabled(enabled: boolean): void {
    this.state.isEnabled = enabled;
  }
}
