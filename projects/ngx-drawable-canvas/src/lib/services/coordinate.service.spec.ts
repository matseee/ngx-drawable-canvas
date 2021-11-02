import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CanvasSettings } from '../models/canvas-settings';
import { Offset } from '../models/offset.model';
import { Point } from '../models/point.model';
import { RenderSettings } from '../models/render-settings';
import { DrawingMode } from './../enums/drawing-mode.enum';
import { DrawingState } from './../models/drawing-state.model';
import { CoordinateService } from './coordinate.service';

describe('CoordinateService', () => {
    let coordinate: CoordinateService;
    const drawingState: DrawingState = {
        isEnabled: true,
        mode: DrawingMode.drawing,
        isActive: false,
        isMoving: false,

        renderSettings: new RenderSettings(),
        canvasSettings: new CanvasSettings(1000, 1000, new Offset(100, 100)),

        startPoint: null,
        endPoint: null,

        selectionRect: null,
        selectedPathIndicies: [],

        currentPath: null,
        paths: [],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        coordinate = TestBed.inject(CoordinateService);
        coordinate.initialize(of(drawingState));
    });

    it('should be created', () => {
        expect(coordinate).toBeTruthy();
        coordinate.initialize(of(drawingState));
        expect(coordinate).toBeTruthy();
    });

    it('should return the P(100,100) from mouse event(200,200)', () => {
        const mouseEvent = new MouseEvent('MouseEvent', {
            clientX: 200,
            clientY: 200
        });
        expect(coordinate.getPointFromMouseEvent(mouseEvent)).toEqual(new Point(100, 100));
    });

    it('should return the P(100,100) from touch event(200,200)', () => {
        const touchEvent = {
            touches: [{
                identifier: 1,
                clientX: 200,
                clientY: 200,
                target: null
            } as any as Touch]
        };
        expect(coordinate.getPointFromMouseEvent(touchEvent as any as TouchEvent)).toEqual(new Point(100, 100));
    });

    it('should check if point P(150,300) is inside canvas', () => {
        expect(coordinate.isPointInsideCanvas(new Point(150, 300))).toBe(true);
    });

    it('should check if point P(-150,-300) is inside canvas', () => {
        expect(coordinate.isPointInsideCanvas(new Point(-150, -300))).toBe(false);
    });

    it('should calculate the offset of an html element (100,50)', () => {
        const element = {
            offsetTop: 10,
            offsetLeft: 10,
            offsetParent: {
                offsetTop: 10,
                offsetLeft: 10,
                offsetParent: {
                    offsetTop: 80,
                    offsetLeft: 30,
                }
            }
        };
        expect(
            coordinate.calculateOffset(element as any as HTMLElement)
        ).toEqual(
            new Offset(50, 100)
        );
    });
});
