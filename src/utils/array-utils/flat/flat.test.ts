import {flat} from './flat';

describe('ArrayUtils - flat', () => {
    it('should return a flat array containing all elements from received nested array.', () => {
        [
            {
                input: [0, 1, [2, [[3]]]],
                maxDepth: undefined,
                output: [0, 1, 2, 3]
            },
            {
                input: [1, 2, [3, 4, [5, 6]], 7, 8, 9],
                maxDepth: undefined,
                output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                input: [1, 2, [3, 4, [5, 6]], 7, 8, 9],
                maxDepth: 1,
                output: [1, 2, 3, 4, [5, 6], 7, 8, 9]
            }
        ].forEach(({input, maxDepth, output}) => {
            const result = flat(input, maxDepth);

            expect(result).toStrictEqual(output);
        });
    });
});
