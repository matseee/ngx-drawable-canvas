import { PositionOffset } from './position-offset.model';
import { Position } from './position.model';

export interface DrawingState {
  isEnabled: boolean;

  isDrawing: boolean;

  strokeColor: string;
  strokeSize: number;

  currentPosition: Position;
  canvasOffset: PositionOffset;
}
