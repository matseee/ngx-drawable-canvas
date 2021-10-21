import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';
import { CoordinateService } from './../services/coordinate.service';
import { ImageStackService } from './../services/image-stack.service';


@Injectable()
export class DrawableCanvasFacade {
  public canvasRef: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  public state$: Observable<DrawingState>;

  protected state: DrawingState;
  protected stateSubject: BehaviorSubject<DrawingState>;

  constructor(
    protected coordinate: CoordinateService,
    protected imageStack: ImageStackService,
  ) {
    this.initializeState();
  }

  public initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');

    this.coordinate.initialize(this);
    this.imageStack.initialize(this);
  }

  public startMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.state.canvasOffset = this.coordinate.calculateOffset(this.canvasRef.nativeElement);
    this.updateState({ ...this.state, currentPosition: this.coordinate.setPosition(event) });

    if (this.coordinate.checkInsideCanvas()) {
      this.state.isDrawing = true;
      this.imageStack.save();
    }
  }

  public stopMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.state.isDrawing = false;
    this.context.closePath();
  }

  public drawMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled || !this.state.isDrawing) {
      return;
    }

    event.preventDefault();

    this.context.beginPath();
    this.context.lineCap = 'round';
    this.context.lineWidth = this.state.strokeSize;
    this.context.strokeStyle = this.state.strokeColor;

    this.context.moveTo(this.state.currentPosition.x, this.state.currentPosition.y);
    this.updateState({ ...this.state, currentPosition: this.coordinate.setPosition(event) });

    this.context.lineTo(this.state.currentPosition.x, this.state.currentPosition.y);
    this.context.stroke();
  }

  public back(): void {
    this.imageStack.back();
  }

  public setStrokeColor(strokeColor: string): void {
    this.updateState({ ...this.state, strokeColor });
  }

  public setStrokeSize(strokeSize: number): void {
    this.updateState({ ...this.state, strokeSize });
  }

  public setEnabled(isEnabled: boolean): void {
    this.updateState({ ...this.state, isEnabled });
  }

  protected initializeState(): void {
    this.state = {
      isEnabled: true,
      isDrawing: false,
      strokeColor: '#00ccffff',
      strokeSize: 5,
      canvasOffset: new PositionOffset(),
      currentPosition: {
        x: 0,
        y: 0,
      },
    };

    this.stateSubject = new BehaviorSubject(this.state);
    this.state$ = this.stateSubject.asObservable();
  }

  protected updateState(state: DrawingState): void {
    this.stateSubject.next(this.state = state);
  }
}
