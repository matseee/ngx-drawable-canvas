import { Point } from './point.model';

describe('Point', () => {
    let point: Point;

    beforeEach(() => {
        point = new Point(5, -5);
    });

    it('should create an instance with x === 5 and y === -5', () => {
        expect(point).toBeTruthy();
        expect(point.x).toBe(5);
        expect(point.y).toBe(-5);
    });

    it('should translate towards x = 0 and y = 0', () => {
        point.translate(new Point(-5, 5));
        expect(point.x).toBe(0);
        expect(point.y).toBe(0);
    });

    it('should give a copy with the same x and y values', () => {
        const copy = point.copy();
        expect(copy).toEqual(point);
    });
});
