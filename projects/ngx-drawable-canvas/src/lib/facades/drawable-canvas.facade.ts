import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingMode } from '../enums/drawing-mode.enum';
import { DrawingLineStep } from './../models/drawing-line-step.model';
import { DrawingLine } from './../models/drawing-line.model';
import { DrawingState } from './../models/drawing-state.model';
import { PositionOffset } from './../models/position-offset.model';
import { Position } from './../models/position.model';
import { CoordinateService } from './../services/coordinate.service';


@Injectable()
export class DrawableCanvasFacade {
  public canvasRef: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  public state$: Observable<DrawingState>;

  // public lines: DrawingLine[];
  // public currentLine: DrawingLine;

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
      startPosition: this.coordinate.getPosition(event)
    });

    if (this.coordinate.checkInsideCanvas(this.state.startPosition)) {
      this.updateState({
        ...this.state,
        isDrawing: true,
        currentLine: {
          lineWidth: this.state.strokeSize,
          strokeColor: this.state.strokeColor,
          steps: []
        }
      });
    }
  }

  public moveMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled || !this.state.isDrawing) {
      return;
    }

    event.preventDefault();

    this.updateState({
      ...this.state,
      endPosition: this.coordinate.getPosition(event)
    });

    if (this.state.mode === DrawingMode.drawing) {
      const step: DrawingLineStep = {
        start: this.state.startPosition,
        end: this.state.endPosition
      };

      this.renderStep(this.state.currentLine, step);
      this.state.currentLine.steps.push(step);

      this.updateState({
        ...this.state,
        startPosition: this.state.endPosition,
        endPosition: null,
      });
    } else {
      this.renderSelectionRect();
    }
  }

  public stopMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }
    if (this.state.mode === DrawingMode.drawing) {
      if (this.state.currentLine && this.state.isDrawing) {
        this.state.lines.push(this.state.currentLine);
      }
    } else {
      this.checkElementsInsideSelection();
    }

    this.updateState({
      ...this.state,
      startPosition: null,
      endPosition: null,
      isDrawing: false,
    });
  }

  public checkElementsInsideSelection(): void {
    const rectStart: Position = {
      x: this.state.startPosition.x < this.state.endPosition.x ? this.state.startPosition.x : this.state.endPosition.x,
      y: this.state.startPosition.y < this.state.endPosition.y ? this.state.startPosition.y : this.state.endPosition.y,
    };

    const rectEnd: Position = {
      x: this.state.startPosition.x > this.state.endPosition.x ? this.state.startPosition.x : this.state.endPosition.x,
      y: this.state.startPosition.y > this.state.endPosition.y ? this.state.startPosition.y : this.state.endPosition.y,
    };

    const elementsInsideSelection: DrawingLine[] = this.state.lines.filter((line: DrawingLine) => {
      const neededSteps: number = line.steps.length / 3;
      let inside = 0;
      let outside = 0;

      for (const step of line.steps) {
        const middleX: number = (step.start.x + step.end.x) / 2;
        const middleY: number = (step.start.y + step.end.y) / 2;

        if (rectStart.x <= middleX && middleX <= rectEnd.x
          && rectStart.y <= middleY && middleY <= rectEnd.y) {
          inside++;
        } else {
          outside++;
        }

        if (inside > neededSteps) {
          return true;
        } else if (outside > neededSteps) {
          return false;
        }
      }
    });

    console.log(elementsInsideSelection);
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

  public renderSelectionRect(): void {
    this.redraw();

    this.context.beginPath();
    this.context.lineCap = 'round';
    this.context.lineWidth = 1;
    this.context.setLineDash([5, 3]);
    this.context.strokeStyle = '#000';
    this.context.rect(
      this.state.startPosition.x,
      this.state.startPosition.y,
      (this.state.endPosition.x - this.state.startPosition.x),
      (this.state.endPosition.y - this.state.startPosition.y)
    );
    this.context.stroke();
  }

  public back(): void {
    if (this.state.lines.length > 0) {
      this.state.lines.pop();
      this.redraw();
    }
  }

  public redraw(): void {
    this.context.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    for (const line of this.state.lines) {
      this.renderLine(line);
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

  public actiateDrawingMode(): void {
    this.updateState({ ...this.state, mode: DrawingMode.drawing });
    this.redraw();
  }

  public activateSelectionMode(): void {
    this.updateState({ ...this.state, mode: DrawingMode.selection });
  }

  protected initializeState(): void {
    this.state = {
      isEnabled: true,
      mode: DrawingMode.drawing,
      isDrawing: false,
      strokeColor: '#00ccffff',
      strokeSize: 5,
      canvasOffset: new PositionOffset(),
      startPosition: null,
      endPosition: null,
      currentLine: null,
      lines: [],
    };

    this.stateSubject = new BehaviorSubject(this.state);
    this.state$ = this.stateSubject.asObservable();
  }

  protected updateState(state: DrawingState): void {
    this.stateSubject.next(this.state = state);
  }
}
