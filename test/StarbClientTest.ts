import assert from 'assert';
import {StarServer} from '../src/StarbServer.js';
import { StatusCodes }  from 'http-status-codes';
import {Puzzle} from '../src/Puzzle.js';
import { parsePuzzle } from '../src/Parser.js';
import {getPuzzle, Client} from '../src/StarbClient.js';
import { createCanvas } from 'canvas';

/**
 * Testing strategy for Client
 * drawStar():
 *      Partition on regions of puzzle containing no stars:
 *          0 regions of this contain no stars
 *          >0 regions of this contain no stars
 *      Partition on regions of this containing 1 star:
 *          0 regions of this contain 1 star
 *          >0 regions of this contain 1 star
 *      Partition on regions of this containing 2 stars:
 *          0 regions of this contain 2 stars
 *          >0 regions of this contain 2 stars
 * getPuzzle():
 *      partition on filename:
 *          puzzle has a valid filename, returns blank puzzle
 *          puzzle does not have a valid filename
 * displayPuzzle():
 *      Manual Tests:
 *          puzzle initialized properly
 *          output message initialized properly
 * addStarToPuzzle(), removeStarFromPuzzle():
 *      Partition on row:
 *          row = 1,
 *          1 < row< size,
 *          row = size
 *      Partition on col:
 *          col = 1,
 *          1 < col< size,
 *          col = size
 * addStarToPuzzle():
 *      Partition on whether the addition is successful:
 *          yes, 
 *          no when trying to add 3rd star to a row,
 *          no when trying to add 3rd star to a column,
 *          no when trying to add 3rd star to a region,
 *          no when trying to add an adjacent star
 * addStar(), removeStar(), drawStar(), eraseStar():
 *      Partition on row:
 *          row = 1,
 *          1 < row< size,
 *          row = size
 *      Partition on col:
 *          col = 1,
 *          1 < col< size,
 *          col = size
 *      Manual tests:
 *          star is added to puzzle tile when clicked on empty tile,
 *          star is not added and an error message is displayed,
 *          star is removed from puzzle tile when clicked on tile with star and assigned color is back
 * addStar():
 *      Manual Tests:
 *          Partition on whether the addition is successful:
 *              yes, 
 *              no when trying to add 3rd star to a row and error message displayed,
 *              no when trying to add 3rd star to a column and error message displayed,
 *              no when trying to add 3rd star to a region and error message displayed,
 */
const PUZZLE = "kd-1-1-1";
describe('Client', function () {
    it('Didit getPuzzle(): covers valid filename', async function () {
        const server = new StarServer(8789);
        const puzzle: Puzzle = await getPuzzle(PUZZLE);
        // check that puzzle exists
        assert(puzzle !== undefined);
        // check if the puzzle is all blank
        for (let i = 1; i <= puzzle.getSize(); i++){
            for (let j = 1; j <= puzzle.getSize(); j++){
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });

    it('Didit getPuzzle(): covers invalid filename', async function () {
        const server = new StarServer(8789);
        const filename = 'invalid';
        try{
            const puzzle: Puzzle = await getPuzzle(filename);
        } catch(error) {
            assert(error instanceof Error);
            assert.strictEqual(error.message, 'Cannot get puzzle.');
        }
        server.stop();
    });

    it('Didit addStarToPuzzle(): row = 1, 1 < col < size, addition sucessful'
    + 'removeStarFromPuzzle: row = 1, 1 < col < size, removal successful', async function () {
        const server = new StarServer(8789);
        let puzzle: Puzzle = await getPuzzle(PUZZLE);
        const pos: [number, number] = [1, 3];
        puzzle = Client.addStarToPuzzle(puzzle, pos[0], pos[1]);
        // check if star has been added
        for (let i = 1; i <= puzzle.getSize(); i++){
            for (let j = 1; j <= puzzle.getSize(); j++){
                if (i === pos[0] && j === pos[1]){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        puzzle = Client.removeStarFromPuzzle(puzzle, pos[0], pos[1]);
        // check if star has been removed
        for (let i = 1; i <= puzzle.getSize(); i++){
            for (let j = 1; j <= puzzle.getSize(); j++){
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });

    it('Didit addStarToPuzzle(): 1 < row < size, col = size, addition unsucessful because two stars in a row'
    + 'removeStarFromPuzzle: 1 < row < size, col = size', async function () {
        const server = new StarServer(8789);
        let puzzle: Puzzle = await getPuzzle(PUZZLE);
        const pos1: [number, number] = [3, 2];
        const pos2: [number, number] = [3, 6];
        const pos3: [number, number] = [3, 10];
        puzzle = Client.addStarToPuzzle(puzzle, pos1[0], pos1[1]);
        puzzle= Client.addStarToPuzzle(puzzle, pos2[0], pos2[1]);
        try {
            puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        } catch(error){
            assert(error instanceof Error);
        }
        // remove the star at pos1
        puzzle = Client.removeStarFromPuzzle(puzzle, pos1[0], pos1[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been removed
            for (let j = 1; j <= puzzle.getSize(); j++){
                if (i === pos2[0] && j === pos2[1]){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        // check that the star at pos3 can not be added
        puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been added
            for (let j = 1; j <= puzzle.getSize(); j++){
                if ((i === pos2[0] && j === pos2[1]) || (i === pos3[0] && j === pos3[1])){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });

    it('Didit addStarToPuzzle(): row = size, col = 1, addition unsucessful because two stars in a column'
    + 'removeStarFromPuzzle: row = size, col = 1,', async function () {
        const server = new StarServer(8789);
        let puzzle: Puzzle = await getPuzzle(PUZZLE);
        const pos1: [number, number] = [3, 1];
        const pos2: [number, number] = [5, 1];
        const pos3: [number, number] = [10, 1];
        puzzle = Client.addStarToPuzzle(puzzle, pos1[0], pos1[1]);
        puzzle= Client.addStarToPuzzle(puzzle, pos2[0], pos2[1]);
        try {
            puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        } catch(error){
            assert(error instanceof Error);
        }
        // remove the star at pos1
        puzzle = Client.removeStarFromPuzzle(puzzle, pos1[0], pos1[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been removed
            for (let j = 1; j <= puzzle.getSize(); j++){
                if (i === pos2[0] && j === pos2[1]){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        // check that the star at pos3 can not be added
        puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been added
            for (let j = 1; j <= puzzle.getSize(); j++){
                if ((i === pos2[0] && j === pos2[1]) || (i === pos3[0] && j === pos3[1])){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });

    it('Didit addStarToPuzzle(): addition unsucessful because two stars in a region', async function () {
        const server = new StarServer(8789);
        let puzzle: Puzzle = await getPuzzle(PUZZLE);
        const pos1: [number, number] = [1, 1];
        const pos2: [number, number] = [1, 3];
        const pos3: [number, number] = [1, 5];
        puzzle = Client.addStarToPuzzle(puzzle, pos1[0], pos1[1]);
        puzzle= Client.addStarToPuzzle(puzzle, pos2[0], pos2[1]);
        try {
            puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        } catch(error){
            assert(error instanceof Error);
        }
        // remove the star at pos1
        puzzle = Client.removeStarFromPuzzle(puzzle, pos1[0], pos1[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been removed
            for (let j = 1; j <= puzzle.getSize(); j++){
                if (i === pos2[0] && j === pos2[1]){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        // check that the star at pos3 can not be added
        puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been added
            for (let j = 1; j <= puzzle.getSize(); j++){
                if ((i === pos2[0] && j === pos2[1]) || (i === pos3[0] && j === pos3[1])){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });

    it('Didit addStarToPuzzle(): addition unsucessful because two stars are adjacent', async function () {
        const server = new StarServer(8789);
        let puzzle: Puzzle = await getPuzzle(PUZZLE);
        const pos1: [number, number] = [1, 1];
        const pos2: [number, number] = [5, 5];
        const pos3: [number, number] = [1, 2];
        puzzle = Client.addStarToPuzzle(puzzle, pos1[0], pos1[1]);
        puzzle= Client.addStarToPuzzle(puzzle, pos2[0], pos2[1]);
        try {
            puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        } catch(error){
            assert(error instanceof Error);
        }
        // remove the star at pos1
        puzzle = Client.removeStarFromPuzzle(puzzle, pos1[0], pos1[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been removed
            for (let j = 1; j <= puzzle.getSize(); j++){
                if (i === pos2[0] && j === pos2[1]){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        // check that the star at pos3 can not be added
        puzzle = Client.addStarToPuzzle(puzzle, pos3[0], pos3[1]);
        for (let i = 1; i <= puzzle.getSize(); i++){ // check that star has been added
            for (let j = 1; j <= puzzle.getSize(); j++){
                if ((i === pos2[0] && j === pos2[1]) || (i === pos3[0] && j === pos3[1])){
                    assert(puzzle.hasStar(i, j));
                    continue;
                }
                assert(!puzzle.hasStar(i, j));
            }
        }
        server.stop();
    });
});

/**
 * Manual Tests:
 * 
 * displayPuzzle():
 * 1. Call displayPuzzle().
 * 2. Check that an empty puzzle is displayed. Specifically, there should be 10 regions, each with a distinctively different color. This color is randomly generated, but all the indices corresponding to a region should have uniform color. 
 * 3. Check that the instructions are displayed in the message box.
 * 
 * addStar():
 * Covers: row = 1, col = size, addition successful
 * 1. Add star at position (1, 10).
 * 2. Check that the star is added. The tile at position (1,10) should have a yellow star fully inside the tile, and the background of tile should have the unchanged color.
 * 
 * addStar():
 * Covers: row = size, 1 < col < size, addition insuccessful because two stars in a row
 * 1. Add star at position (10, 1), (10, 2)
 * 2. Add another star at position (10, 3)
 * 3. Check that the star is not added, error message is displayed in the message box
 * 
 * addStar():
 * Covers: row = 1, col = 1 addition insuccessful because two stars in a column
 * 1. Add star at position (10, 1), (9, 1)
 * 2. Add another star at position (1, 1)
 * 3. Check that the star is not added, error message is displayed in the message box
 * 
 * addStar():
 * Covers: 1 < row < size, col = size, addition insuccessful because two stars in region
 * 1. Add two stars in one region that includes the grid (2, 10)
 * 2. Add another star at position (2, 10)
 * 3. Check that the star is not added, error message is displayed in the message box
 * 
 * removeStar():
 * Covers: row = size, 1 < col < size
 * 1. Add a star at position (10, 2)
 * 2. Remove the star
 * 3. Check that the star is removed. Specifically, any remnant of the star should be gone from the tile at the desired position, and the tile should be fully recolored with its original color.
 * 
 * removeStar():
 * Covers:  row = 1, col = 1
 * 1. Add a star at position (1, 1)
 * 2. Remove the star
 * 3. Check that the star is removed
 * 
 * removeStar():
 * Covers:  1 < row < size, col = size
 * 1. Add a star at position (2, 10)
 * 2. Remove the star
 * 3. Check that the star is removed
 */
