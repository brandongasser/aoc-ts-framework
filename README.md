# Advent of Code TypeScript Framework

This framework is meant to provide structure to the many solutions present in an Advent of Code repository, allow code reuse between puzzles, and compartmentalize solutions.

- [Local Setup](#local-setup)
- [Usage](#usage)
- [Running](#running)

## Local Setup

Fork this repository and clone the fork. In the terminal, run

```bash
$ npm install
```

## Usage

### Day Folders

The project is structured into day folders where you will write your solutions.

### main.ts

This file manages the flow of the day's solutions and should not be modified.

### parser.ts

Includes the `parseInput` function. This function will be called by the main.ts file with the raw string input from the input file and the part (either `1` or `2`). This function should return the parsed input for the day (or the part using the part argument if necessary).

### part-\[x\].ts

Includes the `part[x]` function. This function will be called by the main.ts file with the parsed input for this part (from the parser.ts file). This function should return the solution for the day as a number.

### common.ts

This file should be used for any common functions or definitions between the two solutions for the day.

### utils

This folder includes the utils.ts file which should be used for any common functions to be used between days. This folder also includes the parsers.ts file which includes a monadic parser library similar to [Haskell Parsec](https://hackage.haskell.org/package/parsec).

### inputs

This folder must be created and each day's input should be added to this folder with the name matching the day's folder and the .txt file extension.

## Running

### Run Individual Day

```bash
$ npm run start:{day}
```

### Run All Solutions

```bash
$ npm run start
```