import assert from 'assert';
import { Puzzle } from '../src/Puzzle.js';
import { parsePuzzle } from '../src/Parser.js';


describe('puzzle', function() {
    /**
     * Testing strategy
     * 
     * constructor, toString, addStar, removeStar:
     *      partition on row: row = 1, 1 < row < size, row = size
     *      partition on col: col = 1, 1 < col < size, col = size
     * 
     * constructor, toString, equalValue:
     *      partition on size: odd, even
     * 
     * equalValue: 
     *      partition on this and other: are equal, not
     * 
     * addStar:
     *      partition on location of star(s) in this:
     *          there is a star at (row, col)
     *          there is no star at (row, col)
     *      partition on possible effects of adding a star:
     *          a star is added to a row which already contains 2 stars
     *          a star is added to a column which already contains 2 stars
     *          a star is added to a region which already contains 2 stars
     *          a star is in the eight-star neighborhood of (row, col)
     *          none of the above
     * 
     * removeStar, hasStar:
     *      partition on this: there is a star at (row, col), not
     * 
     * isSolved:
     *      partition on this: is solved, not
     * 
     * clearStars: 
     *      partition on the number of stars in this: 
     *          0, 
     *          1 <= number of stars < this.size * this.size,
     *          this.size * this.size
     */


    // clearStars
    it('clearing an empty puzzle should do nothing', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, false,
        ];

        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const after: Puzzle = before.clearStars();
        assert(before.equalValue(after) && after.equalValue(before));
    });

    it('should be able to clear board with some stars in it', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            true, true, false,
            false, true, true,
            true, true, false,
        ];

        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const actual: Puzzle = before.clearStars();
        const expected: Puzzle = new Puzzle(
            size, 
            regionsMap, 
            regionsArray, 
            [false, false, false,
            false, false, false,
            false, false, false,]);
        assert(actual.equalValue(expected) && expected.equalValue(actual));
    })

    it('should be able to clear board filled completely with stars', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            true, true, true,
            true, true, true,
            true, true, true,
        ];

        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const actual: Puzzle = before.clearStars();
        const expected: Puzzle = new Puzzle(
            size, 
            regionsMap, 
            regionsArray, 
            [false, false, false,
            false, false, false,
            false, false, false,]);
        assert(actual.equalValue(expected) && expected.equalValue(actual));
    })

    // equalValue
    it('odd size, this and other are equal', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, false,
        ];
        const thisPuzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const other: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(thisPuzzle.equalValue(other) && other.equalValue(thisPuzzle));
    });

    it('even size, this and other are equal', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            false, true, false, true,
            false, false, false, false
        ];

        const thisPuzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const other: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(thisPuzzle.equalValue(other) && other.equalValue(thisPuzzle));
    });

    it('odd size, this and that are not equal', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const thisStars: boolean[] = [
            true, false, false,
            false, false, false,
            false, false, false,
        ];
        const otherStars: boolean[] = [
            true, false, false,
            false, false, false,
            false, true, false,
        ];

        const thisPuzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, thisStars);
        const other: Puzzle = new Puzzle(size, regionsMap, regionsArray, otherStars);
        assert(!thisPuzzle.equalValue(other) && !other.equalValue(thisPuzzle));
    });

    it('even size, this and that are not equal', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const thisRegionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const otherRegionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            false, true, false, true,
            false, false, false, false
        ];

        const thisPuzzle: Puzzle = new Puzzle(size, regionsMap, thisRegionsArray, stars);
        const other: Puzzle = new Puzzle(size, regionsMap, otherRegionsArray, stars);
        assert(!thisPuzzle.equalValue(other) && !other.equalValue(thisPuzzle));
    });

    // constructor, toString
    it('odd size, star at (1, 1)', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            true, false, false,
            false, false, false,
            false, false, false,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const copy: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr: string = `3x3\n1,1 | 1,2 1,3 2,3\n2,1 2,2 3,1\n3,2 3,3\n`;
        assert(puzzle.equalValue(copy) && copy.equalValue(puzzle));
        assert(puzzle.toString() === expr);
    });

    it('even size, star at (1, 1)', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            true, false,
            false, false
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const copy: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr: string = `2x2\n1,1 | 2,1\n1,2 2,2\n`;
        assert(puzzle.toString() === expr);
        assert(puzzle.equalValue(copy) && copy.equalValue(puzzle));
    });

    it('odd size, star at (size, size)', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, true,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr: string = `3x3\n1,1 1,2 1,3 2,3\n2,1 2,2 3,1\n3,3 | 3,2\n`;
        assert(puzzle.toString() === expr);
    });

    it('even size, star at (size, size)', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            false, false,
            false, true
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr: string = `2x2\n1,1 2,1\n2,2 | 1,2\n`;
        assert(puzzle.toString() === expr);
    });

    it('odd size, star at 1 < row < size and 1 < col < size', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, true, false,
            false, false, false,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr = `3x3\n1,1 1,2 1,3 2,3\n2,2 | 2,1 3,1\n3,2 3,3\n`;
        assert(puzzle.toString() === expr);
    });

    // addStar
    it('adding star at (1, 1), no star at (1, 1), no error thrown', function() {

        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            false, true, false, true,
            false, false, false, false
        ];

        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const after: Puzzle = before.addStar(1, 1);
        const expr = `4x4\n1,1 1,3 | 1,2 1,4\n3,2 | 2,1 2,2 2,3\n3,1 4,1 4,2\n3,4 | 2,4 3,3 4,3 4,4\n`;
        assert(expr === after.toString());
    });

    it('adding star at (size, size), no star at (size, size), no error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            true, false, true, false,
            false, false, false, false,
            false, true, false, false,
            false, false, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const after: Puzzle = before.addStar(size, size);
        const expr = `4x4\n1,1 1,3 | 1,2 1,4\n3,2 | 2,1 2,2 2,3\n3,1 4,1 4,2\n4,4 | 2,4 3,3 3,4 4,3\n`;
        assert(expr === after.toString());
    });

    it('adding star at (1<row<size, 1<col<size), no star there, no error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            false, false, false, true,
            false, false, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 3; const col = 2;
        const after: Puzzle = before.addStar(row, col);
        const expr = `4x4\n1,3 | 1,1 1,2 1,4\n3,2 | 2,1 2,2 2,3\n3,1 4,1 4,2\n3,4 | 2,4 3,3 4,3 4,4\n`;
        assert(expr === after.toString());
    });

    it('adding star at (1<row<size, 1<col<size), there is a star there, error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            false, true, false, true,
            false, false, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 3; const col = 2;
        assert.throws(() => {before.addStar(row, col)});
    });

    it('adding star at (1<row<size, 1<col<size), >2 stars in row, error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, false, true, false,
            false, false, false, false,
            true, false, false, true,
            false, false, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 3; const col = 2;
        assert.throws(() => {before.addStar(row, col)});
    });

    it('adding star at (1<row<size, 1<col<size), >2 stars in col, error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            false, true, false, false,
            false, false, false, false,
            false, false, false, true,
            false, true, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 3; const col = 2;
        assert.throws(() => {before.addStar(row, col)});
    });

    it('adding star at (1<row<size, 1<col<size), >2 stars in region, error thrown', function() {
        const size = 5;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3, 4]],
            ['rgb(11, 22, 33)', [5, 6, 7, 8, 9, 13, 14, 18, 19]],
            ['rgb(40, 50, 60)', [10, 11, 12]],
            ['rgb(4, 5, 6)', [15, 16, 17, 20, 21]],
            ['rgb(44, 55, 66)', [22, 23, 24]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)',
            'rgb(4, 5, 6)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)',
            'rgb(4, 5, 6)', 'rgb(4, 5, 6)', 'rgb(44, 55, 66)', 'rgb(44, 55, 66)', 'rgb(44, 55, 66)'
        ];
        const stars: boolean[] = [
            false, false, false, false, false,
            true, false, false, false, false,
            false, false, false, false, false,
            false, false, false, false, true,
            false, false, false, false, false,
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 2; const col = 4;
        assert.throws(() => {before.addStar(row, col)});
    });

    it('adding star at (1<row<size, 1<col<size), stars adjacent, error thrown', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            true, false, false, false,
            true, false, false, true,
            true, false, false, true,
            false, false, false, false
        ];
        const before: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const row = 2; const col = 2;
        assert.throws(() => {before.addStar(row, col)});
    });

    // removeStar
    it('removing a star at (1, 1), there is a star there', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            true, false, false,
            false, false, false,
            false, false, false,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const beforeExpr = `3x3\n1,1 | 1,2 1,3 2,3\n2,1 2,2 3,1\n3,2 3,3\n`;
        assert(puzzle.toString() === beforeExpr);

        const after: Puzzle = puzzle.removeStar(1, 1);
        const afterExpr = `3x3\n1,1 1,2 1,3 2,3\n2,1 2,2 3,1\n3,2 3,3\n`;
        assert(after.toString() === afterExpr);
    });

    it('removing a star at (1, 1), no star there', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, false,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr = `3x3\n1,1 1,2 1,3 2,3\n2,1 2,2 3,1\n3,2 3,3\n`;
        assert(puzzle.toString() === expr);
        assert.throws(() => puzzle.removeStar(1, 1));
    });

    it('removing a star at (size, size), there is a star there', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, true,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const beforeExpr = `3x3\n1,1 1,2 1,3 2,3\n2,1 2,2 3,1\n3,3 | 3,2\n`;
        assert(puzzle.toString() === beforeExpr);

        const after: Puzzle = puzzle.removeStar(size, size);
        const afterExpr = `3x3\n1,1 1,2 1,3 2,3\n2,1 2,2 3,1\n3,2 3,3\n`;
        assert(after.toString() === afterExpr);
    });

    it('removing a star at (size, size), no star there', function() {
        const size = 3;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 5]],
            ['rgb(11, 22, 33)', [3, 4, 6]],
            ['rgb(40, 50, 60)', [7, 8]] 
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(40, 50, 60)', 'rgb(40, 50, 60)'
        ];
        const stars: boolean[] = [
            false, false, false,
            false, true, false,
            false, false, false,
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expr = `3x3\n1,1 1,2 1,3 2,3\n2,2 | 2,1 3,1\n3,2 3,3\n`;
        assert(puzzle.toString() === expr);
        assert.throws(() => puzzle.removeStar(1, 1));
    });

    it('removing a star at (1<row<size, 1<col<size), there is a star there', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            true, false, true, false,
            false, false, false, false,
            false, true, false, false,
            false, false, false, true
        ];
        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const beforeExpr =  `4x4\n1,1 1,3 | 1,2 1,4\n3,2 | 2,1 2,2 2,3\n3,1 4,1 4,2\n4,4 | 2,4 3,3 3,4 4,3\n`;
        assert(puzzle.toString() === beforeExpr);

        const after: Puzzle = puzzle.removeStar(3, 2);
        const afterExpr =  `4x4\n1,1 1,3 | 1,2 1,4\n2,1 2,2 2,3 3,2\n3,1 4,1 4,2\n4,4 | 2,4 3,3 3,4 4,3\n`;
        assert(after.toString() === afterExpr);
    });

    it('removing a star at (1<row<size, 1<col<size), no star there', function() {
        const size = 4;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 1, 2, 3]],
            ['rgb(11, 22, 33)', [4, 5, 6, 9]],
            ['rgb(40, 50, 60)', [8, 12, 13]],
            ['rgb(4, 5, 6)', [7, 10, 11, 14, 15]]
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)', 'rgb(1, 2, 3)',
            'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(11, 22, 33)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)',
            'rgb(40, 50, 60)', 'rgb(40, 50, 60)', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'
        ];
        const stars: boolean[] = [
            true, false, true, false,
            false, false, false, false,
            false, true, false, false,
            false, false, false, true
        ];
        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert.throws(() => puzzle.removeStar(3, 3));
    });

    it('puzzle is solved', function() {
        const size = 10;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(0, 0, 0)', [0, 20, 10]],
            ['rgb(1, 1, 1)', [12, 24, 1, 2, 3, 4, 11, 13, 14]],
            ['rgb(2, 2, 2)', [5, 17, 6, 7, 8, 9, 18, 19]],
            ['rgb(3, 3, 3)', [51, 43, 21, 22, 23, 30, 31, 32, 33, 34, 40, 41, 42, 44, 50, 52, 53, 54, 60, 61, 64, 70, 74, 80, 90]],
            ['rgb(4, 4, 4)', [45, 37, 15, 16, 25, 26, 27, 28, 35, 36, 38, 46, 55, 56, 57, 65]],
            ['rgb(5, 5, 5)', [39, 59, 29, 47, 48, 49, 58, 68, 69, 79, 89, 99]],
            ['rgb(6, 6, 6)', [63, 71, 62, 72, 73, 81, 91]],
            ['rgb(7, 7, 7)', [84, 92, 75, 76, 82, 83, 85, 93, 94]],
            ['rgb(8, 8, 8)', [66, 78, 67, 77, 87]],
            ['rgb(9, 9, 9)', [86, 98, 88, 95, 96, 97]]
        ]);
        const regionsArray: string[] = new Array<string>();
        for (const [rgb, indices] of regionsMap.entries()) {
            for (const i of indices) {
                regionsArray[i] = rgb;
            }
        }
        const stars: boolean[] = new Array<boolean>(100).fill(false);
        for (const indices of regionsMap.values()) {
            const numOfStars = 2;
            const starIndices: number[] = indices.slice(0, numOfStars);
            for (const i of starIndices) {
                stars[i] = true;
            }
        }
        const solved: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(solved.isSolved());
    });

    it('puzzle is not solved', function() {
        const size = 10;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(0, 0, 0)', [0, 20, 10]],
            ['rgb(1, 1, 1)', [12, 24, 1, 2, 3, 4, 11, 13, 14]],
            ['rgb(2, 2, 2)', [5, 17, 6, 7, 8, 9, 18, 19]],
            ['rgb(3, 3, 3)', [51, 43, 21, 22, 23, 30, 31, 32, 33, 34, 40, 41, 42, 44, 50, 52, 53, 54, 60, 61, 64, 70, 74, 80, 90]],
            ['rgb(4, 4, 4)', [45, 37, 15, 16, 25, 26, 27, 28, 35, 36, 38, 46, 55, 56, 57, 65]],
            ['rgb(5, 5, 5)', [39, 59, 29, 47, 48, 49, 58, 68, 69, 79, 89, 99]],
            ['rgb(6, 6, 6)', [63, 71, 62, 72, 73, 81, 91]],
            ['rgb(7, 7, 7)', [84, 92, 75, 76, 82, 83, 85, 93, 94]],
            ['rgb(8, 8, 8)', [66, 78, 67, 77, 87]],
            ['rgb(9, 9, 9)', [86, 98, 88, 95, 96, 97]]
        ]);
        const regionsArray: string[] = new Array<string>();
        for (const [rgb, indices] of regionsMap.entries()) {
            for (const i of indices) {
                regionsArray[i] = rgb;
            }
        }
        const stars: boolean[] = new Array<boolean>(100).fill(false);
        for (const indices of regionsMap.values()) {
            const numOfStars = 2;
            const starIndices: number[] = indices.slice(0, numOfStars - 1);
            for (const i of starIndices) {
                stars[i] = true;
            }
        }
        const notSolved: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(! notSolved.isSolved());
    });

    it('getColors should work', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            true, false,
            false, false
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expected: Set<string> = new Set([
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ])
        assert.deepStrictEqual(puzzle.getColors(), expected);
    });

    it('getGridColor should work', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            true, false,
            false, false
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        const expected = 'rgb(11, 22, 33)'
        assert.deepStrictEqual(puzzle.getGridColor(2, 2), expected);
    });

    it('hasStar should work when cell contains a star', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            true, false,
            false, false
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(puzzle.hasStar(1, 1));
    });

    it('hasStar should work when cell does not contain a star', function() {
        const size = 2;
        const regionsMap: Map<string, number[]> = new Map([
            ['rgb(1, 2, 3)', [0, 2]],
            ['rgb(11, 22, 33)', [1, 3]],
        ]);
        const regionsArray: string[] = [
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)',
            'rgb(1, 2, 3)', 'rgb(11, 22, 33)'
        ];
        const stars: boolean[] = [
            true, false,
            false, false
        ];

        const puzzle: Puzzle = new Puzzle(size, regionsMap, regionsArray, stars);
        assert(!puzzle.hasStar(1, 2));
    });
})