import * as Utils from './utils';

describe('Utils', () => {
  describe('sum', () => {
    it('should sum the elements of a list', () => {
      const result = Utils.sum([3, 6, 1, 9, 2]);
      expect(result).toEqual(21);
    });

    it('should return 0 when the list is empty', () => {
      const result = Utils.sum([]);
      expect(result).toEqual(0);
    });
  });

  describe('product', () => {
    it('should return the product of the elements of a list', () => {
      const result = Utils.product([3, 6, 1, 9, 2]);
      expect(result).toEqual(324);
    });

    it('should return 1 when the list is empty', () => {
      const result = Utils.product([]);
      expect(result).toEqual(1);
    });
  });

  describe('transpose', () => {
    it('should transpose a 2-dimensional array', () => {
      const startMatrix = [
        [ 1, 2, 3 ],
        [ 4, 5, 6 ],
        [ 7, 8, 9 ]
      ];
      const expectedMatrix = [
        [ 1, 4, 7 ],
        [ 2, 5, 8 ],
        [ 3, 6, 9 ]
      ];
      const result = Utils.transpose(startMatrix);
      expect(result).toEqual(expectedMatrix);
    });
  });

  describe('zip', () => {
    it('should zip two lists together', () => {
      const list1 = [ 1, 2, 3 ];
      const list2 = [ 4, 5, 6, 7 ];
      const expected = [ [1, 4], [2, 5], [3, 6] ] as [number, number][];
      const result = Utils.zip(list1, list2);
      expect(result).toEqual(expected);
    });
  });

  describe('zipWith', () => {
    it('should zip two lists together using function', () => {
      const zipperFunction = (a: number, b: number) => a * b + 1;
      const list1 = [ 1, 2, 3 ];
      const list2 = [ 4, 5, 6, 7 ];
      const expected = [ 5, 11, 19 ];
      const result = Utils.zipWith(list1, list2, zipperFunction);
      expect(result).toEqual(expected);
    });
  });

  describe('count', () => {
    it('should return the number of elements in the list that pass the predicate', () => {
      const predicate = (x: number) => x > 10;
      const result = Utils.count([ 1, 8, 11, 3, 15, 16, 10 ], predicate);
      expect(result).toEqual(3);
    });
  });

  describe('fold', () => {
    it('should reduce the list using the reduction function', () => {
      const list = [{ a: 1 }, { a: 4 }, { a: 9 }];

      const result = Utils.fold(list, (acc, x) => x.a + acc, 0);

      expect(result).toEqual(14);
    });
  });

  describe('distinct', () => {
    it('should remove duplicate elements', () => {
      const list = [ 1, 2, 3, 4, 3, 5 ];
      const expected = [ 1, 2, 3, 4, 5 ];

      const result = Utils.distinct(list);

      expect(result).toEqual(expected);
    });
  });

  describe('gcd', () => {
    it('should return the greatest common denominator for two numbers', () => {
      const result = Utils.gcd(24, 18);

      expect(result).toEqual(6);
    });
  });
});