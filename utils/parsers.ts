export class Parser<E> {

    private parser: (input: string) => [E, string] | null;

    constructor(parser: (input: string) => [E, string] | null) {
        this.parser = parser;
    }

    parse(input: string): E | null {
        const result = this.parser(input);
        if (result) {
            return result[0];
        }
        return result;
    }

    runParser(input: string): [E, string] | null {
        return this.parser(input);
    }

    map<T>(mapper: (x: E) => T): Parser<T> {
        return new Parser(input => {
            const intermediateResult = this.runParser(input);
            if (!intermediateResult) {
                return null;
            }
            return [ mapper(intermediateResult[0]), intermediateResult[1] ];
        });
    }

    andThen<T>(next: (x: E) => Parser<T>): Parser<T> {
        return new Parser(input => {
            const intermediateResult = this.runParser(input);
            if (!intermediateResult) {
                return null;
            }
            return next(intermediateResult[0]).runParser(intermediateResult[1]);
        });
    }

    or(other: Parser<E>): Parser<E> {
        return new Parser(input => {
            const result = this.runParser(input);
            if (!result) {
                return other.runParser(input);
            }
            return result;
        });
    }

    followedBy<T>(other: Parser<T>): Parser<E> {
        return this.andThen(result => other.map(_ => result));
    }

    preceding<T>(other: Parser<T>): Parser<T> {
        return this.andThen(_ => other);
    }
    
}

const item: Parser<string> = new Parser(input => {
    if (input.length === 0) {
        return null;
    }
    return [ input[0], input.substring(1) ];
});

export function many<E>(parser: Parser<E>): Parser<E[]> {
    return parser.andThen(result => many(parser).map(results => [ result, ...results ])).or(succeed([]));
}

export function some<E>(parser: Parser<E>): Parser<E[]> {
    return new Parser(input => {
        const result = many(parser).runParser(input)!;
        if (result[0].length === 0) {
            return null;
        }
        return result;
    });
}

export function pure<E>(elem: E): Parser<E> {
    return new Parser(input => [ elem, input ]);
}

export const succeed = pure;

export function fail<E>(): Parser<E> {
    return new Parser(input => null);
}

export function satisfy(predicate: (char: string) => boolean): Parser<string> {
    return item.andThen(x => predicate(x) ? succeed(x) : fail());
}

export function character(character: string): Parser<string> {
    return satisfy(x => x === character);
}

export function string(target: string): Parser<string> {
    if (target.length === 0) {
        return succeed('');
    }
    return character(target[0]).andThen(_ => string(target.substring(1))).andThen(_ => succeed(target));
}

export const newline: Parser<string> = character('\n');
export const endOfInput: Parser<null> = new Parser(input => /$/.test(input) ? [ null, input ] : null);
export const endOfLine: Parser<null> = newline.map(_ => null).or(endOfInput);
export const whitespace: Parser<string> = many(satisfy(c => /\s/.test(c))).map(xs => xs.join(''));

export const digit: Parser<number> = satisfy(c => '123467890'.includes(c)).map(c => +c);
export const naturalNumber: Parser<number> = some(satisfy(c => '1234567890'.includes(c))).map(cs => +cs.join(''));
export const int: Parser<number> = character('-').andThen(_ => naturalNumber.map(n => -n)).or(naturalNumber);
export const double: Parser<number> = int.andThen(i => character('.').andThen(_ => naturalNumber).map(d => +`${i}.${d}`)).or(int);

export const bool: Parser<boolean> = string('true').andThen(_ => succeed(true)).or(string('false').andThen(_ => succeed(false)));