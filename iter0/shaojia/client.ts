import { Puzzle } from './puzzle'
import { Canvas } from 'canvas';

class Client {
    
    /**
     * Send a HTTP request to port 8787 for a blank puzzle.
     * @param puzzleName filename of puzzle being requested, must not contain an extension
     * @returns a Puzzle representation of the requested puzzle.
     * @throws an error if the puzzle with the specified filename does not exist
     */
    public static requestPuzzle(puzzleName: string): Puzzle {
        throw new Error('implement me!');
    }

    /**
     * @returns the filename of the puzzle being played, not containing an extension
     */
    public getPuzzle(): string {
        throw new Error('implement me!');
    }

    /**
     * @returns a canvas drawing of the current state of the puzzle,
     * where cells are outlined in thin gray lines, 
     * regions are outlined in bold black lines,
     * and stars placed by the user are rendered as five-pointed stars in the center of cells
     */
    public displayPuzzle(): Canvas {
        throw new Error('implement me!');
    }


    /**
     * Place a star in the cell at the specified row and column.
     * @param numRow row number of cell to add a star to,
     *                  must be an integer in [1, 10]
     * @param numCol column number of cell to add a star to,
     *                  must be an integer in [1, 10]
     * @returns the state of the puzzle after placing the star
     * @throws an error if a star already exists in the specified cell
     */
    public addStar(numRow: number, numCol: number): Puzzle {
        throw new Error('implement me!');
    }
    /**
     * Remove a star in the cell at the specified row and column.
     * If no star exists in the specified cell, return the
     * most current state of the puzzle.
     * @param numRow row number of cell to remove a star from,
     *                  must be an integer in [1, 10]
     * @param numCol column number of cell to remove a star from,
     *                  must be an integer in [1, 10]
     * @returns the state of the puzzle after removing the star
     */
    public removeStar(numRow: number, numCol: number): Puzzle {
        throw new Error('implement me!');
    }

    /**
     * @returns true if and only if each row, each column, and each region 
     * of the puzzle has exactly 2 stars, 
     * and no stars are vertically, horizontally, or diagonally adjacent.  
     */
    public isSolved(): boolean {
        throw new Error('implement me!');
    }
}

/**
 * Testing strategy for each operation of Client
 * 
 * requestPuzzle:
 *      partition on filename: corresponds to a valid puzzle, does not
 * 
 * displayPuzzle:
 *      partition on blankness of this (puzzle): 
 *          - puzzle is blank
 *          - is not (contains stars)
 *      manual test for rendering a blank puzzle:
 *          1. request a blank puzzle
 *          2. display it using displayPuzzle
 *          3. assert that the regions are correctly outlined in bold black lines and
 *             that the grids are outlined in thin gray lines
 *             
 * addStar, removeStar:
 *      partition on this (puzzle), numRow, and numCol:
 *          - cell at (numRow, numCol) contains a star
 *          - does not
 *      partition on numRow: numRow = 1, 1 < numRow < 10, numRow = 10
 *      partition on numCol: numCol = 1, 1 < numCol < 10, numCol = 10
 * 
 * isSolved:
 *      partition on state of this (puzzle): 
 *          - is blank
 *          - is not (contains stars)
 *      partition on # of stars in puzzle: 0, >0 and <2n, =2n
 *      partition on # of stars in one row: 0, 1, 2, >2
 *      partition on # of stars in one column: 0, 1, 2, >2
 *      partition on # of stars in one region: 0, 1, 2, >2
 *      partition on adjacency of stars in puzzle: at least 2 stars are vertically adjacent, not
 *      partition on adjacency of stars in puzzle: at least 2 stars are horizontally adjacent, not
 *      partition on adjacency of stars in puzzle: at least 2 stars are diagonally adjacent, not
 */
