import { PositionOffset } from './position-offset.model';
import { Position } from './position.model';

export interface DrawingState {
  isEnabled: boolean;

  isDrawing: boolean;

  color: string;

  currentPosition: Position;
  canvasOffset: PositionOffset;
}
