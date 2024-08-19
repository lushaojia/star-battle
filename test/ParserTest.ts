import assert from 'assert';
import { Parser, ParseTree, compile, visualizeAsUrl } from 'parserlib';
import { Puzzle } from '../src/Puzzle.js';
import { parsePuzzle, getRandomColor } from '../src/Parser.js';

/**
 * Tests for Parser.
 */
describe('Parser', function () {
    // Testing Strategy
    // getRandomColor():
    //      partition on number of colors in the given color set: 0, >0
    // parsePuzzle():
    //      partition on whether the puzzle is solved: yes, no
    //      partition on whether comment exists: 1 line comments, >1 lines of comments, no comment

    it('getRandomColor: covers 0 color in the given color set', function () {
        const currColorSet: Set<Array<number>> = new Set();
        const colorString = getRandomColor(currColorSet);
        const color = colorString.replace(/[^\d,]/g, '').split(',').map(str => parseInt(str, 10));
        // check the color is valid
        assert(color[0] && color[0] >= 0 && color[0] <= 256
            && color[1] && color[1] >= 0 && color[1] <= 256
            && color[2] && color[2] >= 0 && color[2] <= 256);
    });
    it('getRandomColor: covers >0 color in the given color set', function () {
        const currColorSet: Set<Array<number>> = new Set([[1, 1, 1]]);
        const colorString = getRandomColor(currColorSet);
        const color: Array<number> = colorString.replace(/[^\d,]/g, '').split(',').map(str => parseInt(str, 10));
        // check the color is valid
        assert(color[0] && color[0] >= 0 && color[0] <= 256
            && color[1] && color[1] >= 0 && color[1] <= 256
            && color[2] && color[2] >= 0 && color[2] <= 256);
        // check that the new color is at least 75 away from the existing color in Euclidean distance
        for (const otherColor of currColorSet){
            if (otherColor[0] === color[0] && otherColor[1] === color[1] &&otherColor[2] === color[2]){
                continue;
            }
            assert(otherColor[0] && otherColor[1] && otherColor[2]);
            assert(Math.sqrt(
                Math.pow(color[0] - otherColor[0], 2) + 
                Math.pow(color[1] - otherColor[1], 2) + 
                Math.pow(color[2] - otherColor[2], 2)) >= 75);
        }

    });

    it('parsePuzzle(): covers solved puzzle, no comment', async function () {
        const puzzle: Puzzle = parsePuzzle('10x10\n' + 
            '1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5\n' + 
            '2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10\n' + 
            '3,2  3,4  | 3,3\n' + 
            '2,7  4,8  | 3,6 3,7 3,8\n' + 
            '6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6\n' + 
            '5,4  5,6  | 4,5 5,5 6,4 6,5 6,6\n' + 
            '6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8\n' + 
            '7,3  7,5  | 6,3 7,4\n' + 
            '8,9 10,10 | 7,9 9,9 9,10\n' + 
            '9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9\n');
        const starPositions = [[1,2], [1,5],[2,9],[4,10],[3,2],[3,4],[2,7],[4,8],[6,1],[9,1],[5,4],[5,6],[6,8],[8,7],[7,3],[7,5],[8,9],[10,10],[9,3],[10,6]];
        for (const pos of starPositions){ // check that there are stars at the given positions
            assert(pos[0] && pos[1] && puzzle.hasStar(pos[0], pos[1]));
        }
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that other positions have no stars
            for (let j = 1; j <= puzzle.getSize(); j++){
                let testOrNot = true;
                for (const starPos of starPositions){ // skip star positions
                    if (starPos[0] === i && starPos[1] === j){
                        testOrNot = false;
                        break;
                    }
                }
                if (testOrNot === true){
                    assert(!puzzle.hasStar(i, j));
                }
            }
        }
        assert.strictEqual(puzzle.getSize(), 10); // check the size
        assert(puzzle.isSolved()); // check is the puzzle is solved
    });

    it('parsePuzzle(): covers solved puzzle, 1 line of comment', async function () {
        const puzzle: Puzzle = parsePuzzle('# hellohello \n' + '10x10\n' + 
            '1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5\n' + 
            '2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10\n' + 
            '3,2  3,4  | 3,3\n' + 
            '2,7  4,8  | 3,6 3,7 3,8\n' + 
            '6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6\n' + 
            '5,4  5,6  | 4,5 5,5 6,4 6,5 6,6\n' + 
            '6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8\n' + 
            '7,3  7,5  | 6,3 7,4\n' + 
            '8,9 10,10 | 7,9 9,9 9,10\n' + 
            '9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9\n');
        const starPositions = [[1,2], [1,5],[2,9],[4,10],[3,2],[3,4],[2,7],[4,8],[6,1],[9,1],[5,4],[5,6],[6,8],[8,7],[7,3],[7,5],[8,9],[10,10],[9,3],[10,6]];
        for (const pos of starPositions){ // check that there are stars at the given positions
            assert(pos[0] && pos[1] && puzzle.hasStar(pos[0], pos[1]));
        }
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that other positions have no stars
            for (let j = 1; j <= puzzle.getSize(); j++){
                let testOrNot = true;
                for (const starPos of starPositions){ // skip star positions
                    if (starPos[0] === i && starPos[1] === j){
                        testOrNot = false;
                        break;
                    }
                }
                if (testOrNot === true){
                    assert(!puzzle.hasStar(i, j));
                }
            }
        }
        assert.strictEqual(puzzle.getSize(), 10); // check the size
        assert(puzzle.isSolved()); // check is the puzzle is solved
    });

    it('parsePuzzle(): covers blank puzzle, comment exists, >1 lines of comment', async function () {
        const puzzle: Puzzle = parsePuzzle('# hellohello\n#hello\n' + '10x10\n' + 
            '1,2 1,5 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5\n' + 
            '2,9 4,10 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10\n' + 
            '3,2 3,4 3,3\n' + 
            '2,7 4,8 3,6 3,7 3,8\n' + 
            '6,1 9,1 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6\n' + 
            '5,4 5,6 4,5 5,5 6,4 6,5 6,6\n' + 
            '6,8 8,7 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8\n' + 
            '7,3 7,5 6,3 7,4\n' + 
            '8,9 10,10 7,9 9,9 9,10\n' + 
            '9,3 10,6 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9\n');
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that the puzzle is blank
            for (let j = 1; j <= puzzle.getSize(); j++){
                assert(!puzzle.hasStar(i, j));
            }
        }
        assert.strictEqual(puzzle.getSize(), 10); // check the size
    });
});