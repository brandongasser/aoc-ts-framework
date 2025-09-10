import { sum, transpose, zipWith } from './utils';

type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []>: never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

/**
 * vector with order of N
 */
export class Vector<N extends number = never> {
  
  private components: Tuple<number, N>;
  readonly order: number;

  constructor(...components: Tuple<number, N>) {
    this.components = components;
    this.order = components.length;
  }

  /**
   * returns the components of this vector as a list of numbers
   * @returns components as a list of numbers
   */
  getComponents(): number[] {
    return [...this.components];
  }

  /**
   * returns the magnitude of the vector
   * @returns magnitude of the vector
   */
  magnitude(): number {
    return Math.sqrt(sum(this.components.map(x => x * x)));
  }

  /**
   * adds this vector and the other vector and returns the result as a new vector
   * @param other vector to add to this vector
   * @returns addition result as a vector
   */
  plus<X>(other: X extends N ? Vector<X> : Vector<N>): Vector<N> {
    return new Vector(...zipWith(this.components, other.components, (x, y) => x + y) as Tuple<number, N>);
  }

  /**
   * multiplies this vector by a scalar and returns the result as a new vector
   * @param scalar scalar to multiply this vector by
   * @returns multiplication result as a new vector
   */
  scale(scalar: number): Vector<N> {
    return new Vector<N>(...this.components.map(component => component * scalar) as Tuple<number, N>);
  }

  /**
   * returns the dot product of this vector and the other vector
   * @param other vector to take the dot product with
   * @returns dot product of this vector and the other vector
   */
  dotProduct<X>(other: X extends N ? Vector<X> : Vector<N>): number {
    return sum(zipWith(this.components, other.components, (a, b) => a * b));
  }

  /**
   * returns the angle between this vector and the other vector in radians
   * @param other vector to take the angle between
   * @returns angle between this vector and the other vector in radians
   */
  angleBetween<X>(other: X extends N ? Vector<X> : Vector<N>): number {
    return Math.acos((this.dotProduct(other)) / (this.magnitude() * other.magnitude()));
  }

  /**
   * returns this vector as a 1xN matrix
   * @returns this vector as a 1xN matrix
   */
  asRowMatrix(): Matrix<1, N> {
    return new Matrix(this);
  }

  /**
   * returns this vector as a Nx1 matrix
   * @returns this vector as a Nx1 matrix
   */
  asColumnMatrix(): Matrix<N, 1> {
    return new Matrix(...this.components.map(x => new Vector(x)) as Tuple<Vector<1>, N>);
  }

}

/**
 * MxN matrix composed of N vectors of order M
 */
export class Matrix<M extends number = never, N extends number = never> {

  private rows: Tuple<Vector<N>, M>;
  readonly width: number;
  readonly height: number;

  constructor(...rows: Tuple<Vector<N>, M>) {
    this.rows = rows;
    this.width = (rows[0] || { order: 0 }).order;
    this.height = rows.length;
  }

  /**
   * returns the identity matrix for the given order
   * @param order order of identity matrix
   * @returns identity matrix for the given order
   */
  static identity<O extends number>(order: O): Matrix<O, O> {
    if (order < 1) {
      throw new Error('order must be >=1');
    }
    const vectors: Vector<O>[] = [];
    for (let i = 0; i < order; i++) {
      const components: number[] = [];
      for (let j = 0; j < order; j++) {
        components.push(j === i ? 1 : 0);
      }
      vectors.push(new Vector(...components as Tuple<number, O>));
    }
    return new Matrix(...vectors as Tuple<Vector<O>, O>);
  }

  /**
   * returns the rows of the matrix as a list of Vectors
   * @returns rows of the matrix as a list of Vectors
   */
  getRows(): Vector<N>[] {
    return [...this.rows];
  }

  /**
   * returns the columns of the matrix as a list of Vectors
   * @returns columns of the matrix as a list of Vectors
   */
  getColumns(): Vector<M>[] {
    return this.transpose().getRows();
  }

  /**
   * transposes the matrix and returns a new matrix containing the result
   * @returns new matrix containing the transposition of this matrix
   */
  transpose(): Matrix<N, M> {
    const matrix: number[][] = this.rows.map(v => v.getComponents());
    const transposed = transpose(matrix);

    return new Matrix(...transposed.map(elements => new Vector(...elements as Tuple<number, M>)) as Tuple<Vector<M>, N>);
  }

  /**
   * adds the other matrix to this matrix and returns a new matrix containing the result of the addition
   * @param other matrix to add to this matrix
   * @returns result of adding the other matrix to this matrix as a new matrix
   */
  plus<Y, X>(other: Y extends M ? X extends N ? Matrix<Y, X> : Matrix<M, N> : Matrix<M, N>): Matrix<M, N> {
    return new Matrix(...zipWith(this.rows, other.rows as any, (v1, v2: any) => v1.plus(v2)) as Tuple<Vector<N>, M>);
  }

  /**
   * multiplies this matrix by a scalar and returns the result as a new matrix
   * @param scalar scalar to multiply this matrix by
   * @returns multiplication result as a new matrix
   */
  scale(scalar: number): Matrix<M, N> {
    return new Matrix(...this.rows.map(row => row.scale(scalar)) as Tuple<Vector<N>, M>);
  }

  /**
   * multiplies this matrix by the other matrix and returns a new matrix containing the result
   * @param other matrix to multiply this matrix by
   * @returns result of multiplying this matrix by the other matrix as a new matrix
   */
  times<Y extends number, X extends number>(other: Y extends N ? Matrix<Y, X> : Matrix<M, N>): Matrix<M, X> {
    const otherCols = other.getColumns();
    const rows: Vector<X>[] = [];
    for (let i = 0; i < this.height; i++) {
      const row: number[] = [];
      for (let j = 0; j < other.width; j++) {
        row.push((this.rows[i] as Vector<N>).dotProduct(otherCols[j] as any));
      }
      rows.push(new Vector(...row as Tuple<number, X>));
    }
    return new Matrix(...rows as Tuple<Vector<X>, M>);
  }

  /**
   * returns the determinant of this matrix if it is square, otherwise returns undefined
   * @returns determinant of this matrix if it is square, otherwise undefined
   */
  determinant(): number | undefined {
    if (this.height !== this.width || this.height < 2) {
      return undefined;
    }

    function det(matrix: number[][]): number {
      if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1];
      }
      let d = 0;
      for (let i = 0; i < matrix.length; i++) {
        let newMatrix: number[][] = [];
        for (let j = 1; j < matrix.length; j++) {
          newMatrix.push([...matrix[j].slice(0, i), ...matrix[j].slice(i + 1)]);
        }
        d += (matrix[0][i] * (i % 2 === 0 ? 1 : -1)) * det(newMatrix);
      }
      return d;
    }

    return det(this.getRows().map(row => row.getComponents()));
  }

}