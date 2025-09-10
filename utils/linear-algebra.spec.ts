import { Vector, Matrix } from './linear-algebra';

describe('LinearAlgebra', () => {
  describe('Vector', () => {
    describe('getComponents', () => {
      it('should return the components of the vector in order', () => {
        const vector: Vector<4> = new Vector(7, 0, 2, 8);

        const result = vector.getComponents();

        expect(result).toEqual([7, 0, 2, 8]);
      });
    });

    describe('magnitude', () => {
      it('should return the magnitude of the vector', () => {
        const vector: Vector<4> = new Vector(7, 0, 2, 8);
        const expected = Math.sqrt(7 * 7 + 2 * 2 + 8 * 8);

        const result = vector.magnitude();

        expect(result).toEqual(expected);
      });
    });

    describe('plus', () => {
      it('should add two vectors of the same order', () => {
        const v1: Vector<3> = new Vector(2, 5, 4);
        const v2: Vector<3> = new Vector(1, 1, 8);
        const expected: Vector<3> = new Vector(3, 6, 12);

        const result = v1.plus(v2);

        expect(result).toEqual(expected);
      });
    });

    describe('scale', () => {
      it('should multiply the vector by a scalar', () => {
        const vector: Vector<4> = new Vector(7, 0, 2, 8);
        const expected: Vector<4> = new Vector(14, 0, 4, 16);

        const result = vector.scale(2);

        expect(result).toEqual(expected);
      });
    });

    describe('dotProduct', () => {
      it('should return the dot product of two vectors', () => {
        const v1: Vector<3> = new Vector(2, 5, 4);
        const v2: Vector<3> = new Vector(1, 1, 8);

        const result = v1.dotProduct(v2);

        expect(result).toEqual(39);
      });
    });

    describe('angleBetween', () => {
      it('should return the angle between two vectors in radians', () => {
        const v1: Vector<2> = new Vector(1, 0);
        const v2: Vector<2> = new Vector(0, 1);

        const result = v1.angleBetween(v2);

        expect(result).toEqual(Math.PI / 2);
      });
    });

    describe('asRowMatrix', () => {
      it('should return the vector as a 1xN matrix', () => {
        const vector: Vector<3> = new Vector(2, 5, 4);
        const expected: Matrix<1, 3> = new Matrix(
          new Vector(2, 5, 4)
        );

        const result = vector.asRowMatrix();

        expect(result).toEqual(expected);
      });
    });

    describe('asColumnMatrix', () => {
      it('should return the vector as a Nx1 matrix', () => {
        const vector: Vector<3> = new Vector(2, 5, 4);
        const expected: Matrix<3, 1> = new Matrix(
          new Vector(2),
          new Vector(5),
          new Vector(4)
        );

        const result = vector.asColumnMatrix();

        expect(result).toEqual(expected);
      });
    });
  });

  describe('Matrix', () => {
    describe('identity', () => {
      it('should return the identity matrix for the given order', () => {
        const expected: Matrix<3, 3> = new Matrix(
          new Vector(1, 0, 0),
          new Vector(0, 1, 0),
          new Vector(0, 0, 1)
        );

        const result = Matrix.identity(3);

        expect(result).toEqual(expected);
      });

      it('should throw an error when the order is < 1', () => {
        try {
          Matrix.identity(0);
          fail();
        } catch (e: any) {
          expect(e.message).toEqual('order must be >=1');
        }
      });
    });

    describe('getColumns', () => {
      it('should return the columns as vectors', () => {
        const matrix: Matrix<2, 3> = new Matrix(
          new Vector(1, 2, 3),
          new Vector(4, 5, 6)
        );
        const expected: Vector<2>[] = [
          new Vector(1, 4),
          new Vector(2, 5),
          new Vector(3, 6)
        ];

        const result = matrix.getColumns();

        expect(result).toEqual(expected);
      });
    });

    describe('getRows', () => {
      it('should return the rows as vectors', () => {
        const matrix: Matrix<2, 3> = new Matrix(
          new Vector(1, 2, 3),
          new Vector(4, 5, 6)
        );
        const expected: Vector<3>[] = [
          new Vector(1, 2, 3),
          new Vector(4, 5, 6)
        ];

        const result = matrix.getRows();

        expect(result).toEqual(expected);
      });
    });

    describe('transpose', () => {
      it('should transpose the matrix', () => {
        const matrix: Matrix<2, 3> = new Matrix(
          new Vector(1, 2, 3),
          new Vector(4, 5, 6)
        );
        const expected: Matrix<3, 2> = new Matrix(
          new Vector(1, 4),
          new Vector(2, 5),
          new Vector(3, 6)
        );

        const result = matrix.transpose();

        expect(result).toEqual(expected);
      });
    });

    describe('plus', () => {
      it('should add two matricies', () => {
        const matrixA: Matrix<2, 4> = new Matrix(
          new Vector(7, 0, 2, 8),
          new Vector(4, 6, 0, 7)
        );
        const matrixB: Matrix<2, 4> = new Matrix(
          new Vector(5, 1, 7, 2),
          new Vector(1, 6, 7, 8)
        );
        const expected: Matrix<2, 4> = new Matrix(
          new Vector(12, 1, 9, 10),
          new Vector(5, 12, 7, 15)
        );

        const result = matrixA.plus(matrixB);

        expect(result).toEqual(expected);
      });
    });

    describe('scale', () => {
      it('should multiply the matrix by the scalar', () => {
        const matrix: Matrix<2, 4> = new Matrix(
          new Vector(7, 0, 2, 8),
          new Vector(4, 6, 0, 7)
        );
        const expected: Matrix<2, 4> = new Matrix(
          new Vector(14, 0, 4, 16),
          new Vector(8, 12, 0, 14)
        );

        const result = matrix.scale(2);

        expect(result).toEqual(expected);
      });
    });

    describe('times', () => {
      it('should return the result of multiplying this matrix by the other matrix', () => {
        const matrixA: Matrix<2, 3> = new Matrix(
          new Vector(1, 2, 3),
          new Vector(4, 5, 6)
        );
        const matrixB: Matrix<3, 4> = new Matrix(
          new Vector(1, 2, 3, 4),
          new Vector(5, 6, 7, 8),
          new Vector(9, 10, 11, 12)
        );
        const expected: Matrix<2, 4> = new Matrix(
          new Vector(38, 44, 50, 56),
          new Vector(83, 98, 113, 128)
        );

        const result = matrixA.times(matrixB);

        expect(result).toEqual(expected);
      });
    });

    describe('determinant', () => {
      it('should return the determinant for a 2x2 matrix', () => {
        const matrix: Matrix<2, 2> = new Matrix(
          new Vector(-5, 8),
          new Vector(4, 9)
        );

        const result = matrix.determinant();

        expect(result).toEqual(-77);
      });

      it('should return the determinant for a 3x3 matrix', () => {
        const matrix: Matrix<3, 3> = new Matrix(
          new Vector(5, 3, 7),
          new Vector(2, -5, 8),
          new Vector(-6, 4, 9)
        );

        const result = matrix.determinant();

        expect(result).toEqual(-737);
      });

      it('should return undefined for a non-square matrix', () => {
        const matrix: Matrix<2, 3> = new Matrix(
          new Vector(2, 5, 4),
          new Vector(1, 1, 8)
        );

        const result = matrix.determinant();

        expect(result).toBeUndefined();
      });
    });
  });
});