import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingMode } from '../enums/drawing-mode.enum';
import { DrawingPath } from '../models/drawing-path.model';
import { Line } from '../models/line.model';
import { Offset } from '../models/offset.model';
import { DrawingState } from './../models/drawing-state.model';
import { Point } from './../models/point.model';
import { Rect } from './../models/rect.model';
import { CoordinateService } from './../services/coordinate.service';


@Injectable()
export class DrawableCanvasFacade {
  public canvasRef: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  public state$: Observable<DrawingState>;

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

    this.updateState({ canvasOffset: this.coordinate.calculateOffset(this.canvasRef.nativeElement) });
    this.updateState({ startPoint: this.coordinate.getPointFromMouseEvent(event) });

    if (this.coordinate.isPointInsideCanvas(this.state.startPoint)) {
      this.updateState({
        isActive: true,
        currentPath: new DrawingPath(this.state.strokeSize, this.state.strokeColor)
      });

      if (this.state.mode === DrawingMode.selection && this.state.selectedPaths.length > 0) {
        this.updateState({ isMoving: this.coordinate.isPointInsideRect(this.state.startPoint, this.state.selectionRect) });
      }
    }
  }

  public moveMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled || !this.state.isActive) {
      return;
    }

    event.preventDefault();

    this.updateState({ endPoint: this.coordinate.getPointFromMouseEvent(event) });

    if (this.state.mode === DrawingMode.drawing) {
      const step: Line = new Line(
        this.state.startPoint,
        this.state.endPoint
      );

      this.renderLine(this.state.currentPath, step);
      this.state.currentPath.lines.push(step);

      this.updateState({ startPoint: this.state.endPoint, endPoint: null });
    } else {
      if (this.state.isMoving) {
        const delta: Point = new Point(
          this.state.endPoint.x - this.state.startPoint.x,
          this.state.endPoint.y - this.state.startPoint.y,
        );

        console.log(delta);

        for (const path of this.state.selectedPaths) {
          path.translate(delta);
        }

        this.updateState({ tmpMovedRect: this.state.selectionRect.copy() });
        this.state.tmpMovedRect.translate(delta);

        this.redraw();
        this.renderRect(this.state.tmpMovedRect);

      } else {
        this.renderSelectionRect();
      }
    }
  }

  public stopMouse(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }
    if (this.state.mode === DrawingMode.drawing) {
      if (this.state.currentPath && this.state.isActive) {
        this.state.paths.push(this.state.currentPath);
      }

      this.updateState({ startPoint: null, endPoint: null });

    } else {
      if (this.state.isMoving) {

      } else {
        this.updateState({ selectionRect: new Rect(this.state.startPoint, this.state.endPoint).getNormalizedCopy() });
        this.checkElementsInsideSelection();
      }
    }

    this.updateState({ isActive: false });
  }

  public checkElementsInsideSelection(): void {
    const selectedPaths: DrawingPath[] = this.state.paths.filter((path: DrawingPath) => {
      const neededSteps: number = path.lines.length / 3;
      let inside = 0;
      let outside = 0;

      for (const line of path.lines) {
        const middlePoint: Point = new Point(
          (line.pointOne.x + line.pointTwo.x) / 2,
          (line.pointOne.y + line.pointTwo.y) / 2
        );

        if (this.coordinate.isPointInsideRect(middlePoint, this.state.selectionRect)) {
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

    this.updateState({ selectedPaths });
  }

  public renderSelectionRect(): void {
    this.redraw();
    this.renderRect(new Rect(this.state.startPoint, this.state.endPoint));
  }

  public renderPath(path: DrawingPath): void {
    for (const step of path.lines) {
      this.renderLine(path, step);
    }
  }

  public renderLine(path: DrawingPath, line: Line): void {
    this.context.beginPath();
    this.context.lineCap = 'round';
    this.context.lineWidth = path.lineWidth;
    this.context.strokeStyle = path.strokeColor;
    this.context.moveTo(line.pointOne.x, line.pointOne.y);
    this.context.lineTo(line.pointTwo.x, line.pointTwo.y);
    this.context.stroke();
    this.context.closePath();
  }

  public renderRect(rect: Rect): void {
    this.context.beginPath();
    this.context.lineCap = 'round';
    this.context.lineWidth = 1;
    this.context.setLineDash([5, 3]);
    this.context.strokeStyle = '#000';
    this.context.rect(
      rect.pointOne.x,
      rect.pointOne.y,
      (rect.pointTwo.x - rect.pointOne.x),
      (rect.pointTwo.y - rect.pointOne.y)
    );
    this.context.stroke();
  }

  public back(): void {
    if (this.state.paths.length > 0) {
      this.state.paths.pop();
      this.redraw();
    }
  }

  public redraw(): void {
    this.context.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    for (const path of this.state.paths) {
      this.renderPath(path);
    }
  }

  public setStrokeColor(strokeColor: string): void {
    this.updateState({ strokeColor });
  }

  public setStrokeSize(strokeSize: number): void {
    this.updateState({ strokeSize });
  }

  public setEnabled(isEnabled: boolean): void {
    this.updateState({ isEnabled });
  }

  public actiateDrawingMode(): void {
    this.updateState({ mode: DrawingMode.drawing });
    this.redraw();
  }

  public activateSelectionMode(): void {
    this.updateState({ mode: DrawingMode.selection });
  }

  protected initializeState(): void {
    this.state = {
      isEnabled: true,
      mode: DrawingMode.drawing,
      isActive: false,
      isMoving: false,

      strokeColor: '#00ccffff',
      strokeSize: 5,
      canvasOffset: new Offset(),

      startPoint: null,
      endPoint: null,

      selectionRect: null,
      selectedPaths: [],

      currentPath: null,
      paths: [],
    };

    this.stateSubject = new BehaviorSubject(this.state);
    this.state$ = this.stateSubject.asObservable();
  }

  protected updateState(state: DrawingState): void {
    this.stateSubject.next(this.state = { ...this.state, ...state });
  }
}
