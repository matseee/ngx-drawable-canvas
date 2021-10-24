import { DrawingLineStep } from './drawing-line-step.model';

export interface DrawingLine {
    lineWidth: number;
    strokeColor: string;
    steps: DrawingLineStep[];
}
