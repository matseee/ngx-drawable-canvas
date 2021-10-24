import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingLine } from '../models/drawing-line.model';
import { DrawingLineStep } from './../models/drawing-line-step.model';
import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';
import { CoordinateService } from './../services/coordinate.service';


@Injectable()
export class DrawableCanvasFacade {
  public canvasRef: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  public state$: Observable<DrawingState>;

  public lines: DrawingLine[];
  public currentLine: DrawingLine;

  protected state: DrawingState;
  protected stateSubject: BehaviorSubject<DrawingState>;

  constructor(
    protected coordinate: CoordinateService,
  ) {
    this.initializeState();
  }

  public initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasRef = canvasRef;
    this.context = this.canvasRef.nativeElement.getContext('2d');

    this.lines = [];

    this.coordinate.initialize(this);
  }

  public startMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.updateState({
      ...this.state,
      canvasOffset: this.coordinate.calculateOffset(this.canvasRef.nativeElement)
    });

    this.updateState({
      ...this.state,
      currentPosition: this.coordinate.getPosition(event)
    });

    if (this.coordinate.checkInsideCanvas()) {
      this.state.isDrawing = true;

      this.currentLine = {
        lineWidth: this.state.strokeSize,
        strokeColor: this.state.strokeColor,
        steps: []
      };
    }
  }

  public stopMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    if (this.currentLine && this.state.isDrawing) {
      this.lines.push(this.currentLine);
    }

    this.state.isDrawing = false;
  }

  public drawMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled || !this.state.isDrawing) {
      return;
    }

    event.preventDefault();

    const step: DrawingLineStep = {
      start: this.state.currentPosition,
      end: this.coordinate.getPosition(event)
    };

    this.updateState({ ...this.state, currentPosition: step.end });

    this.renderStep(this.currentLine, step);
    this.currentLine.steps.push(step);
  }

  public renderLine(line: DrawingLine): void {
    for (const step of line.steps) {
      this.renderStep(line, step);
    }
  }

  public renderStep(line: DrawingLine, step: DrawingLineStep): void {
    this.context.beginPath();
    this.context.lineCap = 'round';
    this.context.lineWidth = line.lineWidth;
    this.context.strokeStyle = line.strokeColor;
    this.context.moveTo(step.start.x, step.start.y);
    this.context.lineTo(step.end.x, step.end.y);
    this.context.stroke();
    this.context.closePath();
  }

  public back(): void {
    if (this.lines.length > 0) {
      this.context.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.lines.pop();

      for (const line of this.lines) {
        this.renderLine(line);
      }
    }
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
