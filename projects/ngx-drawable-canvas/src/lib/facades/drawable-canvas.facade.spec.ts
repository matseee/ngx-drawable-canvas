import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingMode } from '../enums/drawing-mode.enum';
import { DrawableCanvasFacade } from './drawable-canvas.facade';

describe('DrawableCanvasFacade', () => {
    let facade: DrawableCanvasFacade;

    let canvas: HTMLCanvasElement;
    let canvasRef: ElementRef<HTMLCanvasElement>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        facade = TestBed.inject(DrawableCanvasFacade);

        canvas = document.createElement('canvas');
        canvas.height = 500;
        canvas.width = 500;
        canvasRef = new ElementRef(canvas);

        facade.initialize(canvasRef);
    });

    it('should create an initialized DrawableCanvasFacade', (done) => {
        expect(facade).toBeTruthy();
        expect(facade.state$).toBeTruthy();

        facade.state$.subscribe(state => {
            expect(state).toBeTruthy();
            expect(state.renderSettings).toBeTruthy();
            expect(state.canvasSettings).toBeTruthy();
            done();
        });
    });

    it('should return the current state as a snapshot', (done) => {
        const snapshot = facade.getSnapshot();

        facade.state$.subscribe(state => {
            expect(state).toEqual(snapshot);
            done();
        });
    });

    it('should set the mode to selection and afterwards to drawing', () => {
        facade.setMode(DrawingMode.selection);
        let snapshot = facade.getSnapshot();
        expect(snapshot.mode).toEqual(DrawingMode.selection);

        facade.setMode(DrawingMode.drawing);
        snapshot = facade.getSnapshot();
        expect(snapshot.mode).toEqual(DrawingMode.drawing);
    });

    it('should handle a mouse start event', () => {
        const mouseEvent = new MouseEvent('MouseEvent', {
            clientX: 200,
            clientY: 200
        });

        facade.handleMouseStart(mouseEvent);

        const state = facade.getSnapshot();
        expect(state.isActive).toBe(true);
    });

    it('should not handle a mouse start event while disabled', () => {
        const mouseEvent = new MouseEvent('MouseEvent', {
            clientX: 200,
            clientY: 200
        });

        facade.setEnabled(false);
        facade.handleMouseStart(mouseEvent);

        const state = facade.getSnapshot();
        expect(state.isActive).toBe(false);
    });

    it('should not handle a mouse start event outside the canvas', () => {
        const mouseEvent = new MouseEvent('MouseEvent', {
            clientX: 700,
            clientY: 700
        });

        facade.handleMouseStart(mouseEvent);

        const state = facade.getSnapshot();
        expect(state.isActive).toBe(false);
    });

    it('should handle a mouse move event, mouse stop event and create a drawing path', () => {
        const mouseStartEvent = new MouseEvent('MouseEvent', {
            clientX: 200,
            clientY: 200
        });
        const mouseMoveEvent = new MouseEvent('MouseEvent', {
            clientX: 300,
            clientY: 300
        });

        facade.handleMouseStart(mouseStartEvent);
        facade.handleMouseMove(mouseMoveEvent);
        facade.handleMouseEnd(mouseMoveEvent);

        const state = facade.getSnapshot();
        expect(state.isActive).toBe(false);

        expect(state.paths.length).toBe(1);
        expect(state.paths[0].lines.length).toBe(1);
        expect(state.paths[0].lines[0].pointOne.x).toBe(200);
        expect(state.paths[0].lines[0].pointOne.y).toBe(200);
        expect(state.paths[0].lines[0].pointTwo.x).toBe(300);
        expect(state.paths[0].lines[0].pointTwo.y).toBe(300);
    });

    it('should handle multiple mouse movement events', () => {
        const event1 = new MouseEvent('MouseEvent', { clientX: 200, clientY: 200 });
        const event2 = new MouseEvent('MouseEvent', { clientX: 300, clientY: 300 });
        const event3 = new MouseEvent('MouseEvent', { clientX: 250, clientY: 100 });
        const event4 = new MouseEvent('MouseEvent', { clientX: 50, clientY: 50 });

        const event5 = new MouseEvent('MouseEvent', { clientX: 190, clientY: 220 });
        const event6 = new MouseEvent('MouseEvent', { clientX: 310, clientY: 330 });
        const event7 = new MouseEvent('MouseEvent', { clientX: 60, clientY: 60 });
        const event8 = new MouseEvent('MouseEvent', { clientX: 50, clientY: 50 });

        facade.handleMouseStart(event1);
        facade.handleMouseMove(event2);
        facade.handleMouseMove(event3);
        facade.handleMouseMove(event4);
        facade.handleMouseEnd(event4);

        facade.handleMouseStart(event5);
        facade.handleMouseMove(event6);
        facade.handleMouseMove(event7);
        facade.handleMouseMove(event8);
        facade.handleMouseEnd(event8);

        const state = facade.getSnapshot();
        expect(state.isActive).toBe(false);

        expect(state.paths.length).toBe(2);
        expect(state.paths[0].lines.length).toBe(3);
        expect(state.paths[0].lines[0].pointTwo.x).toBe(300);
        expect(state.paths[0].lines[2].pointTwo.y).toBe(50);
        expect(state.paths[1].lines[0].pointOne.x).toBe(190);
        expect(state.paths[1].lines[2].pointTwo.y).toBe(50);
    });
});
