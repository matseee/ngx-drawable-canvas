import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingMode } from '../enums/drawing-mode.enum';
import { DrawingPath } from '../models/drawing-path.model';
import { Line } from '../models/line.model';
import { Offset } from '../models/offset.model';
import { RenderSettings } from '../models/render-settings';
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

      if (this.state.mode === DrawingMode.selection && this.state.selectedPathIndicies.length > 0) {
        this.updateState({ isMoving: this.coordinate.isPointInsideRect(this.state.startPoint, this.state.selectionRect) });

        if (this.state.isMoving) {
          this.updateState({
            tmpPaths: this.copyDrawingPathArray(this.state.paths),
            tmpSelectionRect: this.state.selectionRect.copy()
          });
        }
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

        this.updateState({
          paths: this.copyDrawingPathArray(this.state.tmpPaths)
        });

        for (const index of this.state.selectedPathIndicies) {
          this.state.paths[index].translate(delta);
        }

        this.updateState({ selectionRect: this.state.tmpSelectionRect.copy() });
        this.state.selectionRect.translate(delta);
      } else {
        this.updateState({
          selectionRect: new Rect(this.state.startPoint, this.state.endPoint).getNormalizedCopy()
        });
      }

      this.redraw();
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
        this.checkElementsInsideSelection();
        if (this.state.selectedPathIndicies.length > 0) {
          this.getMinimumSelectionRect();
        } else {
          this.updateState({ selectionRect: null });
        }

        this.redraw();
      }
    }

    this.updateState({ isActive: false });
  }

  public getMinimumSelectionRect(): void {
    const selectionRect: Rect = new Rect();

    for (const index of this.state.selectedPathIndicies) {
      const minPoint: Point = this.state.paths[index].getMinPoint();
      const maxPoint: Point = this.state.paths[index].getMaxPoint();

      selectionRect.pointOne.x =
        (selectionRect.pointOne.x === 0
          || minPoint.x < selectionRect.pointOne.x) ? minPoint.x : selectionRect.pointOne.x;

      selectionRect.pointOne.y =
        (selectionRect.pointOne.y === 0
          || minPoint.y < selectionRect.pointOne.y) ? minPoint.y : selectionRect.pointOne.y;

      selectionRect.pointTwo.x =
        (selectionRect.pointTwo.x === 0
          || maxPoint.x > selectionRect.pointTwo.x) ? maxPoint.x : selectionRect.pointTwo.x;

      selectionRect.pointTwo.y =
        (selectionRect.pointTwo.y === 0
          || maxPoint.y > selectionRect.pointTwo.y) ? maxPoint.y : selectionRect.pointTwo.y;
    }

    selectionRect.pointOne.x -= 5;
    selectionRect.pointOne.y -= 5;

    selectionRect.pointTwo.x += 5;
    selectionRect.pointTwo.y += 5;

    this.updateState({ selectionRect });
  }

  public checkElementsInsideSelection(): void {
    const selectedPathIndicies: number[] = this.state.paths
      .map((path: DrawingPath, index: number) => {
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
            return index;
          } else if (outside > neededSteps) {
            return null;
          }
        }
      })
      .filter((index: number) => index !== null);

    this.updateState({ selectedPathIndicies });
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

    if (this.state.selectionRect) {
      this.renderRect(this.state.selectionRect);
    }
  }

  public setRenderSettings(renderSettings): void {
    this.updateState({ renderSettings });
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

  protected copyDrawingPathArray(paths: DrawingPath[]): DrawingPath[] {
    return paths.map((path: DrawingPath) => path.copy());
  }

  protected initializeState(): void {
    this.state = {
      isEnabled: true,
      mode: DrawingMode.drawing,
      isActive: false,
      isMoving: false,

      renderSettings: new RenderSettings(),
      canvasOffset: new Offset(),

      startPoint: null,
      endPoint: null,

      selectionRect: null,
      selectedPathIndicies: [],

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
