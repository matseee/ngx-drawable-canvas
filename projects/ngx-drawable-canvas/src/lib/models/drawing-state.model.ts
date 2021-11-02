import { DrawingMode } from './../enums/drawing-mode.enum';
import { CanvasSettings } from './canvas-settings';
import { DrawingPath } from './drawing-path.model';
import { Point } from './point.model';
import { Rect } from './rect.model';
import { RenderSettings } from './render-settings';

export interface DrawingState {
  isEnabled?: boolean;
  mode?: DrawingMode;

  isActive?: boolean;
  isMoving?: boolean;

  renderSettings?: RenderSettings;
  canvasSettings?: CanvasSettings;

  currentPath?: DrawingPath;
  paths?: DrawingPath[];

  startPoint?: Point;
  endPoint?: Point;

  selectionRect?: Rect;
  selectedPathIndicies?: number[];
  tmpPaths?: DrawingPath[];
  tmpSelectionRect?: Rect;
}
