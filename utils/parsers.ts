/**
 * Monadic parser for parsing strings similar to parsers in Haskell's Parsec library
 */
export class Parser<E> {

  private parser: (input: string) => [E, string] | null;

  constructor(parser: (input: string) => [E, string] | null) {
    this.parser = parser;
  }

  /**
   * parses the input, consumes the parsed part, and returns the result or null if the parser fails
   * @param input input to parse
   * @returns result of parsing or null
   */
  parse(input: string): E | null {
    const result = this.parser(input);
    if (result) {
      return result[0];
    }
    return result;
  }

  /**
   * parses the input, consumes the parsed part, and returns a tuple containing the result and the unconsumed part of the input or null if the parser fails
   * @param input input to parse
   * @returns tuple containing the result and the unconsumed part of the input or null
   */
  runParser(input: string): [E, string] | null {
    return this.parser(input);
  }

  /**
   * applies the mapper function to the result of the parser if possible
   * @param mapper function to apply
   * @returns a new parser that does the parsing and then applies the mapper function
   */
  map<T>(mapper: (x: E) => T): Parser<T> {
    return new Parser(input => {
      const intermediateResult = this.runParser(input);
      if (!intermediateResult) {
        return null;
      }
      return [mapper(intermediateResult[0]), intermediateResult[1]];
    });
  }

  /**
   * creates a new parser which runs this parser and then the next parser
   * @param next function that takes the result of this parser and returns the next parser to run
   * @returns new parser that runs this parser and then the next parser
   */
  andThen<T>(next: (x: E) => Parser<T>): Parser<T> {
    return new Parser(input => {
      const intermediateResult = this.runParser(input);
      if (!intermediateResult) {
        return null;
      }
      return next(intermediateResult[0]).runParser(intermediateResult[1]);
    });
  }

  /**
   * creates a new parser that tries this parser and returns the result of the other parser if this one fails
   * @param other other parser to try
   * @returns new parser which passes if either parser passes or fails if both fail
   */
  or(other: Parser<E>): Parser<E> {
    return new Parser(input => {
      const result = this.runParser(input);
      if (!result) {
        return other.runParser(input);
      }
      return result;
    });
  }

  /**
   * creates a new parser that runs this parser and then the other parser and returns the result of this parser
   * @param other other parser
   * @returns new parser that runs both parsers and returns the value of the first
   */
  followedBy<T>(other: Parser<T>): Parser<E> {
    return this.andThen(result => other.map(_ => result));
  }

  /**
   * creates a new parser that runs this parser and then the other parser and returns the result of the other parser
   * @param other other parser
   * @returns new parser that runs both parsers and returns the value of the second
   */
  preceding<T>(other: Parser<T>): Parser<T> {
    return this.andThen(_ => other);
  }

}

/**
 * parser that always parses the first character or fails on an empty string
 */
export const item: () => Parser<string> = () => new Parser(input => {
  if (input.length === 0) {
    return null;
  }
  return [input[0], input.substring(1)];
});

/**
 * creates a new parser that runs the parser repeatedly until a failure and returns the results as a list
 * @param parser parser to run
 * @returns new parser that runs the parser repeatedly until it fails and returns the results as a list
 */
export function many<E>(parser: Parser<E>): Parser<E[]> {
  return parser.andThen(result => many(parser).map(results => [result, ...results])).or(succeed([]));
}

/**
 * creates a new parser that runs the parser repeatedly until a failure and returns the results as a list or fails if the first iteration of the parser fails
 * @param parser parser to run
 * @returns new parser that runs the parser repeatedly until it fails and returns the results as a list or fails if the first iteration of the parser fails
 */
export function some<E>(parser: Parser<E>): Parser<E[]> {
  return new Parser(input => {
    const result = many(parser).runParser(input)!;
    if (result[0].length === 0) {
      return null;
    }
    return result;
  });
}

/**
 * creates a new parser that does not consume any input and returns the element
 * @param elem element to return
 * @returns new parser that returns the element and does not consume input
 */
export function pure<E>(elem: E): Parser<E> {
  return new Parser(input => [elem, input]);
}

/**
 * creates a new parser that does not consume any input and returns the element
 * @param elem element to return
 * @returns new parser that returns the element and does not consume input
 */
export const succeed = pure;

/**
 * returns a parser that always fails
 * @returns new parser that always fails
 */
export function fail<E>(): Parser<E> {
  return new Parser(input => null);
}

/**
 * creates a new parser that parses a character if the predicate is true for that character
 * @param predicate predicate to test for the character
 * @returns new parser that succeeds if the predicate is true
 */
export function satisfy(predicate: (char: string) => boolean): Parser<string> {
  return item().andThen(x => predicate(x) ? succeed(x) : fail());
}

/**
 * creates a new parser taht only parses a specific character
 * @param character character to succeed on
 * @returns new parser that succeeds only for a specific character
 */
export function character(character: string): Parser<string> {
  return satisfy(x => x === character);
}

/**
 * creates a new parser that only parses a specific string
 * @param target string to succeed on
 * @returns new parser that only succeeds for a specific string
 */
export function string(target: string): Parser<string> {
  if (target.length === 0) {
    return succeed('');
  }
  return character(target[0]).andThen(_ => string(target.substring(1))).andThen(_ => succeed(target));
}

/**
 * parses a newline character
 */
export const newline: () => Parser<string> = () => character('\n');
/**
 * succeeds on an empty string
 */
export const endOfInput: () => Parser<null> = () => new Parser(input => input === '' ? [null, input] : null);
/**
 * succeeds on a newline character or an empty string
 */
export const endOfLine: () => Parser<null> = () => newline().map(_ => null).or(endOfInput());
/**
 * consumes all whitespace characters until a nonwhitespace character or empty string is encountered
 */
export const whitespace: () => Parser<string> = () => many(satisfy(c => /\s/.test(c))).map(xs => xs.join(''));

/**
 * parses a single digit as a number
 */
export const digit: () => Parser<number> = () => satisfy(c => '123467890'.includes(c)).map(c => +c);
/**
 * parses a positive integer as a number
 */
export const naturalNumber: () => Parser<number> = () => some(satisfy(c => '1234567890'.includes(c))).map(cs => +cs.join(''));
/**
 * parses an integer as a number
 */
export const int: () => Parser<number> = () => character('-').andThen(_ => naturalNumber().map(n => -n)).or(naturalNumber());
/**
 * parses a decimal number as a number
 */
export const double: () => Parser<number> = () => int().andThen(i => character('.').andThen(_ => naturalNumber()).map(d => +`${i}.${d}`)).or(int());

/**
 * parses 'true' or 'false' as a boolean
 */
export const bool: () => Parser<boolean> = () => string('true').andThen(_ => succeed(true)).or(string('false').andThen(_ => succeed(false)));