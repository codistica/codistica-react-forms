import {norm} from './norm';

describe('ArrayUtils - normalize', () => {
    it('should always return and array, eventually containing input element if not array itself.', () => {
        expect(norm([1, 2, 3, 4, 5])).toStrictEqual([1, 2, 3, 4, 5]);
        expect(norm('A')).toStrictEqual(['A']);
    });
});
