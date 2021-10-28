import { Line } from './line.model';
import { Point } from './point.model';


describe('Line', () => {
    let line: Line;

    beforeEach(() => {
        line = new Line(new Point(0, 0), new Point(5, 5));
    });

    it('should create an instance with point (0,0) and point (5,5)', () => {
        expect(line).toBeTruthy();
        expect(line.pointOne.x).toBe(0);
        expect(line.pointOne.y).toBe(0);
        expect(line.pointTwo.x).toBe(5);
        expect(line.pointTwo.y).toBe(5);
    });

    it('should translate to point (5,10) and point (10,15)', () => {
        line.translate(new Point(5, 10));
        expect(line.pointOne.x).toBe(5);
        expect(line.pointOne.y).toBe(10);
        expect(line.pointTwo.x).toBe(10);
        expect(line.pointTwo.y).toBe(15);
    });

    it('should create a copy of the current line', () => {
        const copy = line.copy();
        expect(copy).toEqual(line);
    });

    it('should return the min point (0,0)', () => {
        const point = new Point();
        expect(line.getMinPoint()).toEqual(point);
    });

    it('should return the max point (5,5)', () => {
        const point = new Point(5, 5);
        expect(line.getMaxPoint()).toEqual(point);
    });
});
