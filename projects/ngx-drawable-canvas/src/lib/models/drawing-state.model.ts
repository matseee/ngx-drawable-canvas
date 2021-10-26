import { DrawingMode } from './../enums/drawing-mode.enum';
import { DrawingPath } from './drawing-path.model';
import { Offset } from './offset.model';
import { Point } from './point.model';
import { Rect } from './rect.model';

export interface DrawingState {
  isEnabled?: boolean;
  mode?: DrawingMode;

  isActive?: boolean;
  isMoving?: boolean;

  strokeColor?: string;
  strokeSize?: number;

  canvasOffset?: Offset;

  currentPath?: DrawingPath;
  paths?: DrawingPath[];

  startPoint?: Point;
  endPoint?: Point;

  selectionRect?: Rect;
  selectedPaths?: DrawingPath[];
  tmpMovedPaths?: DrawingPath[];
  tmpMovedRect?: Rect;
}
