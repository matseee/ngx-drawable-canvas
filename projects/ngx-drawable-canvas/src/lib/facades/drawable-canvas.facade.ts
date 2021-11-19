import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawingMode } from '../enums/drawing-mode.enum';
import { CanvasSettings } from '../models/canvas-settings';
import { DrawingPath } from '../models/drawing-path.model';
import { RenderSettings } from '../models/render-settings';
import { RenderService } from '../services/render.service';
import { DrawingState } from './../models/drawing-state.model';
import { Line } from './../models/line.model';
import { CoordinateService } from './../services/coordinate.service';


@Injectable({
  providedIn: 'root',
})
export class DrawableCanvasFacade {
  public state$: Observable<DrawingState>;

  protected state: DrawingState;
  protected stateSubject: BehaviorSubject<DrawingState>;

  protected canvas: HTMLCanvasElement;

  constructor(
    protected render: RenderService,
    protected coordinate: CoordinateService,
  ) {
    this.initializeState();
  }

  public initialize(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.render.initialize(canvasRef, this.state$);
    this.coordinate.initialize(this.state$);

    this.canvas = canvasRef.nativeElement;
  }

  public getSnapshot(): DrawingState {
    return this.state;
  }

  public setMode(mode: DrawingMode): void {
    this.updateState({ mode });
  }

  public setEnabled(isEnabled: boolean): void {
    this.updateState({ isEnabled });
  }

  public handleMouseStart(event: MouseEvent | TouchEvent): void {
    if (!this.state.isEnabled) {
      return;
    }

    this.updateCanvasSettings();

    const point = this.coordinate.getPointFromMouseEvent(event);
    if (!this.coordinate.isPointInsideCanvas(point)) {
      return;
    }

    this.updateState({
      isActive: true,
      startPoint: point,
    });
  }

  public handleMouseMove(event: MouseEvent | TouchEvent): void {
    if (!this.state.isActive) {
      return;
    }

    const point = this.coordinate.getPointFromMouseEvent(event);
    if (!this.coordinate.isPointInsideCanvas(point)) {
      return;
    }

    let currentPath = this.state.currentPath;
    const line = new Line(this.state.startPoint, point);

    if (!currentPath) {
      currentPath = new DrawingPath(this.state.renderSettings);
    }

    currentPath.lines.push(line);
    this.updateState({ currentPath });

    this.render.rerender();
  }

  public handleMouseEnd(event: MouseEvent | TouchEvent): void {
    const paths = this.state.paths;
    paths.push(this.state.currentPath);

    this.updateState({
      isActive: false,
      currentPath: null,
      paths,
    });

    this.render.rerender();
  }

  protected updateCanvasSettings(): void {
    this.updateState({
      canvasSettings: {
        height: this.canvas.height,
        width: this.canvas.width,
        offset: this.coordinate.calculateOffset(this.canvas)
      }
    });
  }

  protected initializeState(): void {
    this.state = {
      isEnabled: true,

      mode: DrawingMode.drawing,
      isActive: false,
      isMoving: false,

      renderSettings: new RenderSettings(),
      canvasSettings: new CanvasSettings(),

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
