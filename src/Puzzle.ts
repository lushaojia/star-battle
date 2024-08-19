import assert from 'assert';

// getRegions
// hasStar
// whatColor

export class Puzzle {
    // Abstraction function:
    //      AF(size, regionsMap, regionsArray, stars) 
    //      = a `size` by `size` Star Battle puzzle where coordinates are 1-indexed (row, column)
    //      from the top left of the puzzle, increasing downwards and to the right,
    //      where a cell at (r, c) for r = 1, ..., size and c = 1, ..., size,
    //      is in region `color` iff `regionsMap`.get(`color`).includes((r-1) * size + (c-1))
    //      and `regionsArray`[(r-1) * size + (c-1)] === `color` where `color` is a RGB value, 
    //      where a cell at (r, c) does not exist in the puzzle iff `regionsArray`[(r-1) * size + (c-1)] === undefined,
    //      and where a cell at (r, c) (for the same ranges as above) contains a star 
    //      iff `stars`[(r-1) * size + (c-1)] === true and does not contain a star iff `stars`[(r-1) * size + (c-1)] === false.

    // Rep invariant:
    //      - number of keys in regionsMap is equal to this.size
    //      - regionsArray.length === this.size * this.size
    //      - keys of regionsMap are valid RGB values
    //      - elements of regionsArray are valid RGB values
    //      - regionsMap.has(rgb) iff regionsArray.includes(rgb)
    //      - indices in this.regionsMap.values() are unique
    //      - index is in [0, this.size * this.size - 1] for index in indices for indices in this.regionsMap.values()

    // Safety from rep exposure:
    //      - size is immutable and readonly
    //      - regionsMap, regionsArray, and stars are private and readonly
    //      - constructor makes copies of regionsMap, regionsArray, and stars that are passed in 
    //      - no methods return references to regionsMap, regionsArray, and stars,
    //        so client can never access them
    //      - Puzzle is immutable (i.e. no mutators available to clients)



    /**
     * Make sure a RGB string is formatted properly
     * @param rgb string formatted as a RGB code
     * @returns True if RGB code is valid, False otherwise
     */
    private validRgb(rgb: string): boolean {
        return (/^rgb(\([1-2]?[0-9]?[0-9], [1-2]?[0-9]?[0-9], [1-2]?[0-9]?[0-9]\))$/.test(rgb)); 
    }

    /**
     * Checks if all rep invariants are satsified
     * Throws an error if any rep invariant is violated
     */
    private checkRep(): void {
        assert(this.regionsMap.size === this.size, 'regionsMap.size !== size');
        assert(this.regionsArray.length === this.size * this.size, 'wrong number of elements in regionsArray');

        const validateKeysOfRegionsMap: boolean = Array.from(this.regionsMap.keys()).map(
            (hex: string) => this.validRgb(hex)
        ).reduce(
            (isRgbSoFar: boolean, isRgb: boolean) => isRgbSoFar && isRgb
        );
        assert(validateKeysOfRegionsMap, 'expected regions to be labeled with valid RGB values');

        const validateEltsOfRegionsArray: boolean = this.regionsArray.map(
            (hex: string) => this.validRgb(hex)
        ).reduce(
            (isRgbSoFar: boolean, isRgb: boolean) => isRgbSoFar && isRgb
        );
        assert(validateEltsOfRegionsArray, 'expected regions to be labeled with valid RGB values');

        for (const rgb of this.regionsMap.keys()) {
            assert(this.regionsArray.includes(rgb));
        }
        for (const rgb of this.regionsArray) {
            assert(this.regionsMap.has(rgb));
        }

        const setOfIndices = new Set<number>();
        for (const indices of this.regionsMap.values()) {
            for (const index of indices) {
                setOfIndices.add(index);
            }
        }
        const arrayOfIndices = new Array<number>();
        for (const indices of this.regionsMap.values()) {
            for (const index of indices) {
                arrayOfIndices.push(index);
            }
        }
        assert(setOfIndices.size === arrayOfIndices.length);
    }

    private readonly regionsMap: Map<string, number[]>;
    private readonly regionsArray: string[];
    private readonly stars: boolean[];
    /**
     * Make a puzzle.
     * @param size side length of puzzle
     * @param regionsMap a mapping of RGB values to indices of cells,
     *                   where cells with the same RGB value are in the same region 
     * @param regionsArray RGB values corresponding to regions of the board in row-major order
     * @param stars stars of the board in row-major order,
     *              where a cell at (r, c) contains a star iff stars[r * size + c] === true
     * @requires regionsMap indices must be in [0, size * size - 1] and unique
     */
    public constructor(public readonly size: number,
        regionsMap: Map<string, number[]>,
        regionsArray: string[],
        stars: boolean[]) {
        this.regionsMap = Puzzle.copyRegionsMap(regionsMap);
        this.regionsArray = Puzzle.copyRegionsArray(regionsArray);
        this.stars = stars.slice(0);
        this.checkRep();
    }
    
    /**
     * @returns a representation of the current state of the puzzle, represented in the same form as a puzzle in its original state
     *          The first line gives its dimensions as 'size'x'size', followed by a newline
     *          After the newline, the lines go through all the regions of the board.
     *          If the region currently has at least one star, this should be formatted as {indices of stars} | {indices of blanks}, followed by a newline.
     *          If the region has no stars, this should be formatted as {indices of blanks}, followed by a newline.
     *          Indices should be represented as {row},{col} , and there should be a space between each index representation.
     *          Note that the corresponding stars and blanks should show the tiles in row major order.
     */
    public toString(): string {
        // get dimensions
        const dimensions = `${this.size}x${this.size}\n`;
        let tilePositions= ``;
        // loop through the keys of region map
        for (const key of this.regionsMap.keys()) {
            const indices = this.regionsMap.get(key) ?? assert.fail("region must have at least one element");
            const starIndices: number[] = [];
            const blankIndices: number[] = [];
            let regionString = ``;
            // loop through all indices of region
            for (const index of indices) {
                // check if blank or not
                const inBoard: boolean = this.stars[index] ?? assert.fail("static checking");
                if (inBoard) {
                    starIndices.push(index);
                }
                else {
                    blankIndices.push(index);
                }
            }
            // sort to be in row major order
            starIndices.sort((a,b) => a-b);
            blankIndices.sort((a,b) => a-b);
            // add stars and | if there are stars on the board
            if (starIndices.length>0) {
                for (let index = 0; index<starIndices.length; index++) {
                    const position = starIndices[index] ?? assert.fail("static checking");
                    const {row,col} = this.convertToCoords(position);
                    if (index === starIndices.length-1) {
                        regionString += `${row},${col} | `;

                    }
                    else {
                        regionString += `${row},${col} `;
                    }
                }
            }
            // otherwise add all indices and newline character at end, add to overall string
            for (let index = 0; index<blankIndices.length; index++) {
                const position = blankIndices[index] ?? assert.fail("static checking");
                const {row,col} = this.convertToCoords(position);
                if (index === blankIndices.length-1) {
                    regionString += `${row},${col}\n`;

                }
                else {
                    regionString += `${row},${col} `;
                }
            }
            tilePositions+=regionString;
        }
        // return complete string
        return dimensions+tilePositions;
    }
    
    /**
     * 
     * @returns copy of this puzzle but with no stars in it
     */
    public clearStars(): Puzzle {
        const stars: boolean[] = new Array<boolean>();
        for (let i = 0; i < this.size * this.size; i++) {
            stars.push(false);
        }

        this.checkRep();
        return new Puzzle(this.size, 
            Puzzle.copyRegionsMap(this.regionsMap), 
            Puzzle.copyRegionsArray(this.regionsArray), 
            stars);
    }

    public getLengthOfRegionsArray(): number {
        this.checkRep();
        return this.regionsArray.length;
    }

    /**
     * 
     * @param other puzzle to be compared with this puzzle
     * @returns true iff this puzzle and other puzzle have the same size, regions, and placement of stars
     */
    public equalValue(other: Puzzle): boolean {
        try {
            assert.deepStrictEqual(this.regionsArray, other.regionsArray);
            assert.deepStrictEqual(this.regionsMap, other.regionsMap);
            assert(this.size === other.size);
            assert.deepStrictEqual(this.stars, other.stars);
        } catch {
            this.checkRep();
            return false;
        }

        this.checkRep();
        return true;
    }

    /**
     * @returns the size of this puzzle
     */
    public getSize(): number {
        this.checkRep();
        return this.size;   
    }

    /**
     * Converts a row-major index to (row, col) coordinates using one-indexing
     * @param index index of a tile in the Puzzle, in row major-order using zero indexing
     * @returns Corresponding row and col, both values must be between 1 and size of board inclusive.
     */
    private convertToCoords(index: number): {row: number, col: number} {
        this.checkRep();
        return {row: Math.floor(index / this.size) + 1, col: index % this.size + 1};
    }
    /**
     * Converts a (row,col) position of a tile on the puzzle using one-indexing into a row-major order index
     * @param row row number of tile, must be between 1 and size of puzzle inclusive. If out of bounds, return -1
     * @param col col number of tile, must be between 1 and size of puzzle inclusive. If out of bounds, return -1
     * @returns Index of this tile in row-major order, start from 0 and going up to (size*size)-1
     */
    private convertToIndex(row: number, col: number): number {
        if (row<=0 || row>this.size || col<=0 || col>this.size) {
            this.checkRep();
            return -1;
        }

        this.checkRep();
        return (row - 1) * this.size + (col - 1);
    }

    /**
     * Calculates the number of stars in the column of a puzzle
     * @param col desired column number, must be between 1 and size of puzzle inclusive
     * @returns the number of stars located in this column
     */
    private numStarsInCol(col: number): number {
        this.checkRep();
        return this.stars.filter( // get values in col
            (val: boolean | undefined, index: number) => this.convertToCoords(index).col === col 
        ).filter( // count number of stars in col
            (val: boolean | undefined): boolean => val === true
        ).length;
    }

    /**
     * Calculates the number of stars in the row of a puzzle
     * @param row desired row number, must be between 1 and size of puzzle inclusive
     * @returns the number of stars located in this row
     */
    private numStarsInRow(row: number): number {
        const start: number = this.convertToIndex(row, 1);
        const end: number = start + this.size;

        this.checkRep();
        return this.stars.slice(start, end).filter(
            (val: boolean | undefined): boolean => val === true
        ).length;
    }

    /**
     * Calculates the number of stars in the region of a puzzle
     * @param region desired region, a RGB string corresponding to the color of the region
     * @returns the number of stars located in this region
     */
    private numStarsInRegion(region: string): number {
        const cellsInRegion: number[] = this.regionsMap.get(region) ?? assert.fail('missing region');

        const vals = this.stars.filter( // get values in region
            (val: boolean | undefined, index: number): boolean | undefined => cellsInRegion.includes(index)
        );

        const stars = vals.filter( // count number of stars in region
            (val: boolean | undefined): boolean => val === true
        );

        return stars.length;
    }

    // nearby = in the 8 cells adjacent to (row, col)
    private starNearby(row: number, col: number): boolean {
        
        this.checkRep();
        return this.stars[this.convertToIndex(row, col - 1)] === true // left
                || this.stars[this.convertToIndex(row - 1, col - 1)] === true // upper left
                || this.stars[this.convertToIndex(row - 1, col)] === true // up
                || this.stars[this.convertToIndex(row - 1, col + 1)] === true // upper right
                || this.stars[this.convertToIndex(row, col + 1)] === true // right
                || this.stars[this.convertToIndex(row + 1, col + 1)] === true // lower right
                || this.stars[this.convertToIndex(row + 1, col)] === true // low
                || this.stars[this.convertToIndex(row + 1, col - 1)] === true; //  lower left
    }

    /**
     * Return a copy of the RegionsMap to avoid rep exposure
     * @param regionsMap map representing the regions, where the key is a string of a RGB color code, value is an array of all the indices located in the region
     * @returns Copy of regionsMap without any rep exposure
     */
    private static copyRegionsMap(regionsMap: Map<string, number[]>): Map<string, number[]> {
        const newRegionsMap = new Map<string, number[]>();

        for (const [regionNumber, cells] of regionsMap.entries()) {
            newRegionsMap.set(regionNumber, cells.slice(0));
        }

        return newRegionsMap;
    }

    /**
     * Return a copy of regionsArray to avoid rep exposure
     * @param regionsArray array where each index is colored by the corresponding value in regionsArray
     * @returns Copy of regionsMap without any rep exposure
     */
    private static copyRegionsArray(regionsArray: string[]): string[] { 
        return regionsArray.slice(0); 
    }

    /**
     * Adds a star to the specified cell. 
     * @param row row number, must be in 1, ..., size
     * @param col column number, must be in 1, ..., size
     * @returns the puzzle resulting from adding a star to the cell at (row, col)
     *          or the puzzle unchanged if adding was unsuccessful
     * @throws an error if a star already exists in the specified cell
     * @throws an error if adding the star causes 
     *         - there to be more than two stars in a row, column, or region, or
     *         - two stars to be adjacent horizontally, vertically, or diagonally
     */
    public addStar(row: number, col: number): Puzzle {
        (1 < row && row < this.size) ?? assert.fail(`Expected row in [1, size], got ${row} instead`);
        (1 < col && col < this.size) ?? assert.fail(`Expected col in [1, size], got ${col} instead`);

        const thisRegion: string = this.regionsArray[this.convertToIndex(row, col)] ?? assert.fail('missing region label');

        if (this.hasStar(row, col)) { throw new Error(`Failed to add a star: cell at (row ${row}, col ${col}) has a star already!`); }
        if (this.numStarsInCol(col) === 2) { throw new Error(`Failed to add a star: col ${col} has 2 stars already!`); } // switch row and col for error msg
        if (this.numStarsInRow(row) === 2) { throw new Error(`Failed to add a star: row ${row} has 2 stars already!`); }
        if (this.numStarsInRegion(thisRegion) === 2) { throw new Error(`Failed to add a star: region ${thisRegion} has 2 stars already!`); }
        if (this.starNearby(row, col)) { throw new Error(`Failed to add a star: stars will be adjacent if a star is added at (row ${row}, col ${col})!`); }

        const newStars: boolean[] = this.stars.slice(0); // copy
        newStars[this.convertToIndex(row, col)] = true; // add star

        this.checkRep();
        return new Puzzle(this.size, this.regionsMap, this.regionsArray, newStars);
    }

    /**
     * Removes a star from the specified cell.
     * @param row row number, must be in 1, ..., size
     * @param col column number, must be in 1, ..., size
     * @returns the puzzle resulting from removing a star to the cell at (row, col)
     *          or the puzzle unchanged if there is no star there
     * @throws an error if no star exists at (row, col)
     */
    public removeStar(row: number, col: number): Puzzle {
        (1 < row && row < this.size) ?? assert.fail(`Expected row in [1, size], got ${row} instead`);
        (1 < col && col < this.size) ?? assert.fail(`Expected col in [1, size], got ${col} instead`);

        if (this.stars[this.convertToIndex(row, col)] !== true) {throw new Error(`Failed to remove a star: no star exists at (${row}, ${col})`);}

        const newStars: boolean[] = this.stars.slice(0); // copy
        newStars[this.convertToIndex(row, col)] = false; // remove star

        this.checkRep();
        return new Puzzle(this.size, this.regionsMap, this.regionsArray, newStars);
    }

    /**
     * @returns true if and only if each row, each column, and each region 
     * of the puzzle has exactly 2 stars, 
     * and no stars are vertically, horizontally, or diagonally adjacent.
     */
    public isSolved(): boolean {
        const noneAreAdjacent: boolean = this.stars.filter(
            (val: boolean | undefined, index: number) => 
                val === true &&
                this.starNearby(this.convertToCoords(index).row, this.convertToCoords(index).col)
        ).length === 0;

        const colCheck = new Array<boolean>();
        for (let col = 1; col <= this.size; col++) {
            colCheck.push(this.numStarsInCol(col) === 2);
        }
        const twoInEveryCol = colCheck.reduce((soFarOK: boolean, thisOK: boolean) => soFarOK && thisOK);

        const rowCheck = new Array<boolean>();
        for (let row = 1; row <= this.size; row++) {
            rowCheck.push(this.numStarsInRow(row) === 2);
        }
        const twoInEveryRow = rowCheck.reduce((soFarOK: boolean, thisOK: boolean) => soFarOK && thisOK);

        const regionCheck = new Array<boolean>();
        for (const region of this.regionsMap.keys()) {
            regionCheck.push(this.numStarsInRegion(region) === 2);
        }
        const twoInEveryRegion = regionCheck.reduce((soFarOK: boolean, thisOK: boolean) => soFarOK && thisOK);

        this.checkRep();
        return noneAreAdjacent && twoInEveryCol && twoInEveryRow && twoInEveryRegion;
    }

    /**
     * @returns the RGB values of colors used to label the regions of the puzzle
     */
    public getColors(): Set<string> {
        this.checkRep();
        return new Set(this.regionsMap.keys());
    }

    /**
     * @param row row number, must be in 1, ..., size
     * @param col column number, must be in 1, ..., size
     * @returns whether the cell at (row, col) contains a star
     */
    public hasStar(row: number, col: number): boolean {
        (1 < row && row < this.size) ?? assert.fail(`Expected row in [1, size], got ${row} instead`);
        (1 < col && col < this.size) ?? assert.fail(`Expected col in [1, size], got ${col} instead`);

        this.checkRep();
        return this.stars[this.convertToIndex(row, col)] === true;
    }

    /**
     * @param row row number, must be in 1, ..., size
     * @param col column number, must be in 1, ..., size
     * @returns the RGB value of the color of the grid at (row, col)
     */
    public getGridColor(row: number, col: number): string {
        (1 < row && row < this.size) ?? assert.fail(`Expected row in [1, size], got ${row} instead`);
        (1 < col && col < this.size) ?? assert.fail(`Expected col in [1, size], got ${col} instead`);

        this.checkRep();
        return this.regionsArray[this.convertToIndex(row, col)] ?? assert.fail('missing region label');
    }
}