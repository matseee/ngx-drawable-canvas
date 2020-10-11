import { PositionOffset } from './position-offset.model';
import { Position } from './position.model';

export interface DrawingState {
  isDrawing: boolean;

  currentPosition: Position;
  canvasOffset: PositionOffset;
}
