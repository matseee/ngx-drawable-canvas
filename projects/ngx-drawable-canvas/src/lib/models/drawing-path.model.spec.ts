import { DrawingPath } from './drawing-path.model';
import { Line } from './line.model';
import { Point } from './point.model';
import { RenderSettings } from './render-settings';

describe('DrawingPath', () => {
    describe('with default RenderSettings', () => {
        let drawingPath: DrawingPath;

        beforeEach(() => {
            drawingPath = new DrawingPath();
            drawingPath.lines.push(new Line(new Point(0, 0), new Point(5, 5)));
            drawingPath.lines.push(new Line(new Point(5, 5), new Point(10, 10)));
        });

        it('should initialize a empty DrawingPath with default RenderSettings', () => {
            expect(drawingPath).toBeTruthy();
            expect(drawingPath.lines).toEqual([
                new Line(new Point(0, 0), new Point(5, 5)),
                new Line(new Point(5, 5), new Point(10, 10))
            ]);
            expect(drawingPath.settings).toEqual(new RenderSettings());
        });

        it('should translate the DrawingPath with the delta D(5,5)', () => {
            const expectedResult = [
                new Line(new Point(5, 5), new Point(10, 10)),
                new Line(new Point(10, 10), new Point(15, 15))
            ];
            drawingPath.translate(new Point(5, 5));
            expect(drawingPath.lines).toEqual(expectedResult);
        });

        it('should create a copy of the current DrawingPath', () => {
            const copy = drawingPath.copy();
            expect(copy).toEqual(drawingPath);
            expect(copy).not.toBe(drawingPath);
        });

        it('should return the min point P(0,0)', () => {
            drawingPath.lines.push(
                new Line(new Point(-10, -10))
            );
            expect(drawingPath.getMinPoint()).toEqual(new Point(-10, -10));
        });

        it('should return the max point P(10,10)', () => {
            expect(drawingPath.getMaxPoint()).toEqual(new Point(10, 10));
        });
    });

    describe('with RenderSettings', () => {
        let drawingPath: DrawingPath;
        let renderSettings: RenderSettings;

        beforeEach(() => {
            renderSettings = new RenderSettings();
            renderSettings.color = '#ffffff';
            renderSettings.width = 15;
            drawingPath = new DrawingPath(renderSettings);
        });

        it('should initialize a empty DrawingPath with RenderSettings', () => {
            expect(drawingPath).toBeTruthy();
            expect(drawingPath.lines).toEqual([]);
            expect(drawingPath.settings).toEqual(renderSettings);
        });
    });
});
