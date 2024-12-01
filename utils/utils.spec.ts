import * as Utils from './utils';

describe('Utils', () => {
    describe('sum', () => {
        it('should sum the elements of a list', () => {
            const result = Utils.sum([ 3, 6, 1, 9, 2 ]);
            expect(result).toEqual(21);
        });

        it('should return 0 when the list is empty', () => {
            const result = Utils.sum([]);
            expect(result).toEqual(0);
        });
    });

    describe('product', () => {
        it('should return the product of the elements of a list', () => {
            const result = Utils.product([ 3, 6, 1, 9, 2 ]);
            expect(result).toEqual(324);
        });

        it('should return 1 when the list is empty', () => {
            const result = Utils.product([]);
            expect(result).toEqual(1);
        });
    });
});