import { DrawingMode } from './../enums/drawing-mode.enum';
import { DrawingLine } from './drawing-line.model';
import { PositionOffset } from './position-offset.model';
import { Position } from './position.model';

export interface DrawingState {
  isEnabled: boolean;
  mode: DrawingMode;

  isDrawing: boolean;

  strokeColor: string;
  strokeSize: number;

  startPosition: Position;
  endPosition: Position;
  canvasOffset: PositionOffset;

  currentLine: DrawingLine;
  lines: DrawingLine[];
}
