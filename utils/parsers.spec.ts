import * as Parsers from './parsers';

describe('Parsers', () => {
    describe('Parser', () => {
        describe('parse', () => {
            it('should parse input using defined function', () => {
                const parser = new Parsers.Parser((input) => {
                    if (input.length === 0) {
                        return null;
                    }
                    return [input[0], input.substring(1)];
                });

                expect(parser.parse('hello')).toEqual('h');
                expect(parser.parse('')).toEqual(null);
            });
        });

        describe('runParser', () => {
            it('should parse input using defined function', () => {
                const parser = new Parsers.Parser((input) => {
                    if (input.length === 0) {
                        return null;
                    }
                    return [input[0], input.substring(1)];
                });

                expect(parser.runParser('hello')).toEqual(['h', 'ello']);
                expect(parser.runParser('')).toEqual(null);
            });
        });

        describe('map', () => {
            it('should return a new Parser with the mapper function applied', () => {
                const parser = new Parsers.Parser((input) => {
                    if (input.length === 0) {
                        return null;
                    }
                    return [input[0], input.substring(1)];
                });

                const resultParser = parser.map(x => +x);

                expect(resultParser.runParser('123')).toEqual([1, '23']);
                expect(resultParser.runParser('')).toEqual(null);
            });
        });

        describe('andThen', () => {
            it('should compose two Parsers together into a new Parser', () => {
                const parser = new Parsers.Parser((input) => {
                    if (input.length === 0) {
                        return null;
                    }
                    return [input[0], input.substring(1)];
                });

                const resultParser = parser.andThen(x => parser);

                expect(resultParser.runParser('abc')).toEqual(['b', 'c']);
                expect(resultParser.runParser('a')).toEqual(null);
                expect(resultParser.runParser('')).toEqual(null);
            });
        });

        describe('or', () => {
            it('should use the result of the first Parser if possible', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.or(rightParser);

                expect(resultParser.runParser('a')).toEqual(['a', '']);
            });

            it('should use the result of the second Parser if the first Parser fails', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.or(rightParser);

                expect(resultParser.runParser('b')).toEqual(['b', '']);
            });

            it('should fail if both Parsers fail', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.or(rightParser);

                expect(resultParser.runParser('c')).toEqual(null);
            });
        });

        describe('followedBy', () => {
            it('should return result of this Parser if both Parsers succeed', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.followedBy(rightParser);

                expect(resultParser.runParser('ab')).toEqual(['a', '']);
            });

            it('should fail if either Parser fails', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.followedBy(rightParser);

                expect(resultParser.runParser('a')).toEqual(null);
                expect(resultParser.runParser('b')).toEqual(null);
            });
        });

        describe('preceding', () => {
            it('should return result of other Parser if both Parsers succeed', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.preceding(rightParser);

                expect(resultParser.runParser('ab')).toEqual(['b', '']);
            });

            it('should fail if either Parser fails', () => {
                const leftParser = new Parsers.Parser((input) => {
                    if (input[0] === 'a') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });
                const rightParser = new Parsers.Parser((input) => {
                    if (input[0] === 'b') {
                        return [input[0], input.substring(1)];
                    }
                    return null;
                });

                const resultParser = leftParser.preceding(rightParser);

                expect(resultParser.runParser('a')).toEqual(null);
                expect(resultParser.runParser('b')).toEqual(null);
            });
        });
    });

    describe('item', () => {
        it('should parse the first character of a string', () => {
            expect(Parsers.item.runParser('hello')).toEqual(['h', 'ello']);
        });

        it('should fail on an empty string', () => {
            expect(Parsers.item.runParser('')).toEqual(null);
        });
    });

    describe('many', () => {
        it('should parse repeating patterns', () => {
            const parser = new Parsers.Parser((input) => {
                if (input[0] === 'a') {
                    return [input[0], input.substring(1)];
                }
                return null;
            });

            expect(Parsers.many(parser).runParser('aaabbbccc')).toEqual([['a', 'a', 'a'], 'bbbccc']);
        });

        it('should return an empty list when there is no match', () => {
            const parser = new Parsers.Parser((input) => {
                if (input[0] === 'a') {
                    return [input[0], input.substring(1)];
                }
                return null;
            });

            expect(Parsers.many(parser).runParser('bbbccc')).toEqual([[], 'bbbccc']);
        });
    });

    describe('some', () => {
        it('should parse repeating patterns', () => {
            const parser = new Parsers.Parser((input) => {
                if (input[0] === 'a') {
                    return [input[0], input.substring(1)];
                }
                return null;
            });

            expect(Parsers.some(parser).runParser('aaabbbccc')).toEqual([['a', 'a', 'a'], 'bbbccc']);
        });

        it('should fail when there is no match', () => {
            const parser = new Parsers.Parser((input) => {
                if (input[0] === 'a') {
                    return [input[0], input.substring(1)];
                }
                return null;
            });

            expect(Parsers.some(parser).runParser('bbbccc')).toEqual(null);
        });
    });

    describe('pure', () => {
        it('should return the element without consuming input', () => {
            const parser = Parsers.pure('test');

            expect(parser.runParser('hello')).toEqual(['test', 'hello']);
        });
    });

    describe('succeed', () => {
        it('should succeed with the element without consuming input', () => {
            const parser = Parsers.succeed('test');

            expect(parser.runParser('hello')).toEqual(['test', 'hello']);
        });
    });

    describe('fail', () => {
        it('should fail', () => {
            const parser = Parsers.fail();

            expect(parser.runParser('hello')).toEqual(null);
        });
    });

    describe('satisfy', () => {
        it('should parse the first character when the predicate is true', () => {
            const parser = Parsers.satisfy(c => c === 'a');

            expect(parser.runParser('abc')).toEqual(['a', 'bc']);
        });

        it('should fail when the first character does not meet the predicate', () => {
            const parser = Parsers.satisfy(c => c === 'a');

            expect(parser.runParser('bca')).toEqual(null);
        });
    });

    describe('character', () => {
        it('should parse the first character if it is the correct character', () => {
            const parser = Parsers.character('a');

            expect(parser.runParser('abc')).toEqual(['a', 'bc']);
        });

        it('should fail when the first character is not the correct character', () => {
            const parser = Parsers.character('a');

            expect(parser.runParser('bca')).toEqual(null);
        });
    });

    describe('string', () => {
        it('should parse the string if the input starts with the correct string', () => {
            const parser = Parsers.string('hello');
            
            expect(parser.runParser('hello world')).toEqual(['hello', ' world']);
        });

        it('should fail when the input does not start with the correct string', () => {
            const parser = Parsers.string('hello');

            expect(parser.runParser('world hello')).toEqual(null);
        });
    });

    describe('newline', () => {
        it('should parse a newline character', () => {
            expect(Parsers.newline.runParser('\nworld')).toEqual(['\n', 'world']);
        });

        it('should fail when the input does not start with a newline character', () => {
            expect(Parsers.newline.runParser('hello\nworld')).toEqual(null);
        });
    });

    describe('endOfInput', () => {
        it('should pass on an empty string', () => {
            expect(Parsers.endOfInput.runParser('')).toEqual([null, '']);
        });

        it('should fail on a nonempty string', () => {
            expect(Parsers.endOfInput.runParser('hello')).toEqual(null);
        });
    });

    describe('endOfLine', () => {
        it('should pass on a newline character', () => {
            expect(Parsers.endOfLine.runParser('\nworld')).toEqual([null, 'world']);
        });

        it('should pass on an empty string', () => {
            expect(Parsers.endOfLine.runParser('')).toEqual([null, '']);
        });

        it('should fail on a nonempty string that does not start with a newline character', () => {
            expect(Parsers.endOfLine.runParser('hello\nworld')).toEqual(null);
        });
    });

    describe('whitespace', () => {
        it('should consume all leading whitespace', () => {
            expect(Parsers.whitespace.runParser(' \n\tworld')).toEqual([' \n\t', 'world']);
        });

        it('should not fail when there is no leading whitespace', () => {
            expect(Parsers.whitespace.runParser('world')).toEqual(['', 'world']);
        });
    });

    describe('digit', () => {
        it('should parse the first character as a number when it is a digit', () => {
            expect(Parsers.digit.runParser('123abc')).toEqual([1, '23abc']);
        });

        it('should fail when the first character is not a digit', () => {
            expect(Parsers.digit.runParser('abc123')).toEqual(null);
        });
    });

    describe('naturalNumber', () => {
        it('should parse multiple digits as a single number', () => {
            expect(Parsers.naturalNumber.runParser('123abc')).toEqual([123, 'abc']);
        });

        it('should fail when the first character is not a digit', () => {
            expect(Parsers.naturalNumber.runParser('abc123')).toEqual(null);
        });
    });

    describe('int', () => {
        it('should parse multiple digits as a single number', () => {
            expect(Parsers.int.runParser('123abc')).toEqual([123, 'abc']);
        });

        it('should parse a negative number', () => {
            expect(Parsers.int.runParser('-123abc')).toEqual([-123, 'abc']);
        });

        it('should fail when the first character is not a digit or \'-\'', () => {
            expect(Parsers.int.runParser('abc-123')).toEqual(null);
        });
    });

    describe('double', () => {
        it('should parse multiple digits as a single number', () => {
            expect(Parsers.double.runParser('123abc')).toEqual([123, 'abc']);
        });

        it('should parse a negative integer', () => {
            expect(Parsers.double.runParser('-123abc')).toEqual([-123, 'abc']);
        });

        it('should parse a double', () => {
            expect(Parsers.double.runParser('-123.456abc')).toEqual([-123.456, 'abc']);
        });

        it('should fail when the first character is not a digit or \'-\'', () => {
            expect(Parsers.double.runParser('abc-123')).toEqual(null);
        });
    });

    describe('bool', () => {
        it('should parse true', () => {
            expect(Parsers.bool.runParser('true')).toEqual([true, '']);
        });

        it('should parse false', () => {
            expect(Parsers.bool.runParser('false')).toEqual([false, '']);
        });

        it('should fail when the input does not start with a boolean', () => {
            expect(Parsers.bool.runParser('hello')).toEqual(null);
        });
    });
});