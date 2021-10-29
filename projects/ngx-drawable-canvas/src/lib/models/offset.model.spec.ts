import { Offset } from './offset.model';

describe('Offset', () => {
    let offset: Offset;

    beforeEach(() => {
        offset = new Offset();
    });

    it('should create an instance with left equals 0 and top equals 0', () => {
        expect(offset).toBeTruthy();
        expect(offset.left).toBe(0);
        expect(offset.top).toBe(0);
    });

    it('should add an other offset and the result should be left=10 and top=-10', () => {
        const otherOffset = new Offset();
        otherOffset.left = 10;
        otherOffset.top = -10;

        const result = offset.add(otherOffset);

        expect(result.left).toBe(10);
        expect(result.top).toBe(-10);
    });
});
