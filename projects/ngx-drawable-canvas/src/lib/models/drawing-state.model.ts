import { PositionOffset } from './position-offset.model';

export interface DrawingState {
  isDrawing: boolean;
  currentCoordinateX: number;
  currentCoordinateY: number;

  canvasOffset: PositionOffset;
}
