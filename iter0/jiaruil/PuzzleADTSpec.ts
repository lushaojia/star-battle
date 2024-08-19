export class Puzzle{
    // Abstraction Function:
    //      AF (state, regions, gridRegion, solution) = 
    //              represents a puzzle with state of unsolved, partially-solved, or solved;
    //              for each grid at the i-th row and j-th column,
    //              the grid is in the region identified by a string found in gridRegion[i * 10 + j];
    //              all grids in that region can be found in regions, which maps the identification string to an array of indices of the grids in that region;
    //              the current solution has a star at that grid if solution[i * 10 + j] === true, and no start otherwise.
    // Representation Invariant:
    //      gridRegion and solution must be of length 100;
    //      for any integer index i in range [0, 99], 
    //      gridRegion[i] must be a key in regions, and regions[gridRegion[i]] must contain i;
    //      for each (key, array) pair in gridRegion, 
    //      any index found in array must not appear twice in either this array or any array mapped to another key;
    //      if state === PuzzleState.Solved, the stars should be placed in a valid way as defined in the project handout;
    //      if state === PuzzleState.Unsolved, all values in solution should be false.
    // Safety from Rep Exposure:
    //      all fields are private and readonly;
    //      all fields are not passed or returned in any operations.

    /**
     * Create a new Puzzle object.
     * @param state 
     * @param regions 
     * @param solution 
     */
    public constructor(
        private readonly state: PuzzleState,
        private readonly regions: Map<string, Array<number>>,
        private readonly gridRegion: Array<string>,
        private readonly solution: Array<boolean>){
    }

    /**
     * Check the RI.
     */
    private checkRep(): void{
        throw new Error("Not Implemented");
    }

    /**
     * Return a string that represents this puzzle.
     */
    public toString(): string{
        throw new Error("Not Implemented");
    }

    /**
     * Add a star at a given index, or do nothing if a star alrealdy exists at that position.
     * Check if the puzzle is solved/empty after the addition, and change the state of the puzzle if necessary. 
     * Require that the state of the board cannot be solved.
     * @param index the given index. Must be an integer in range [0,99].
     * @returns the new puzzle with star added
     */
    public addStar(index: number): Puzzle{
        throw new Error("Not Implemented");
    }

    /**
     * Remove a star at a given index, or do nothing if no star exists at that position.
     * Check if the puzzle is solved/empty after the removal, and change the state of the puzzle if necessary. 
     * Require that the state of the board cannot be solved.
     * @param index the given index. Must be an integer in range [0,99].
     * @returns the new puzzle with star removed
     */
    public removeStar(index: number): Puzzle{
        throw new Error("Not Implemented");
    }

    /**
     * Clear the puzzle board and change the state to unsovled to start over.
     * @returns the new blank puzzle
     */
    public startOver(): Puzzle{
        throw new Error("Not Implemented");
    }

    /**
     * Check if the puzzle is solved.
     * @returns true if the puzzle is solved, and false otherwise. 
     */
    private checkSuccess(): boolean{
        throw new Error("Not Implemented");
    }

    /**
     * Check if the puzzle is empty (i.e. no star is placed).
     * @returns true if the puzzle is empty, and false otherwise.
     */
    private checkEmpty(): boolean{
        throw new Error("Not Implemented");
    }
}

/**
 * An enum class representing all possible puzzle states.
 * Unsolved represents an empty puzzle board (i.e. no star has been placed).
 * PartiallySolved represents a puzzle board with stars placed but not in a valid way deinfed in the project handout.
 * Solved represents a puzzle board with all stars placed in a valid way defined in the project handout.
 */
enum PuzzleState{
    Solved,
    PartiallySolved,
    Unsolved
}