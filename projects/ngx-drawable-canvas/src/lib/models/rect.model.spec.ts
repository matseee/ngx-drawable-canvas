import { Point } from './point.model';
import { Rect } from './rect.model';

describe('Rect', () => {
    let rectEmpty: Rect;
    let rectWithPoints: Rect;

    beforeEach(() => {
        rectEmpty = new Rect();
        rectWithPoints = new Rect(new Point(10, -15), new Point(20, 20));
    });

    it('should create an empty instance', () => {
        expect(rectEmpty).toBeTruthy();
        expect(rectEmpty.pointOne).toEqual(new Point());
        expect(rectEmpty.pointTwo).toEqual(new Point());
    });

    it('should create an instance with P(10,-15) and P(20, 20)', () => {
        expect(rectWithPoints).toBeTruthy();
        expect(rectWithPoints.pointOne).toEqual(new Point(10, -15));
        expect(rectWithPoints.pointTwo).toEqual(new Point(20, 20));
    });

    it('should translate the rect to R(P(50,25),P(60,60))', () => {
        rectWithPoints.translate(new Point(40, 40));
        expect(rectWithPoints.pointOne).toEqual(new Point(50, 25));
        expect(rectWithPoints.pointTwo).toEqual(new Point(60, 60));
    });

    it('should copy the instance with the same points', () => {
        const copy = rectWithPoints.copy();
        expect(copy).not.toBe(rectWithPoints);
        expect(copy.pointOne).toEqual(new Point(10, -15));
        expect(copy.pointTwo).toEqual(new Point(20, 20));
    });

    it('should return the normalized version of R(P(50,10),P(20,20))', () => {
        const unnormalizedRect = new Rect(
            new Point(50, 10),
            new Point(20, 20)
        );

        const normalizedRect = unnormalizedRect.getNormalizedCopy();
        expect(normalizedRect.pointOne).toEqual(new Point(20, 10));
        expect(normalizedRect.pointTwo).toEqual(new Point(50, 20));
    });
});
