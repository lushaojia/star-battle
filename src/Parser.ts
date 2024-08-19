import assert from 'assert';
import { Parser, ParseTree, compile, visualizeAsUrl } from 'parserlib';
import { Puzzle } from './Puzzle.js';

/**
 * Parser for a star board puzzle expression.
 */

const grammar = `
    @skip whitespaceAndPoundsign {
        line ::= dimensions newline (blank | solved)* (blankWithoutNewLine | solvedWithoutNewLine)*;
        dimensions ::= number 'x' number;
        solved ::= stars spacer blank;
        blank ::= coordinates+ newline?;
        blankWithoutNewLine ::= coordinates+ newline?;
        solvedWithoutNewLine ::= stars spacer blank blankWithoutNewLine?;
        stars ::= coordinates coordinates;
        coordinates ::= number ',' number;
    }
    whitespaceAndPoundsign ::=  poundsign* | whitespace;
    whitespace ::= ' '*; 
    newline ::= [\\r]? [\\n];
    poundsign ::= '#' [^\\n]* [\\n];
    spacer ::= '|';
    number ::= [1-9] | '10';`;

// nonterminals of the grammar
enum Grammar {
    line, dimensions, solved, blank, spacer, stars, coordinates, number, newline, whitespaceAndPoundsign, whitespace, poundsign, blankWithoutNewLine, solvedWithoutNewLine
}

// compile grammar into a parser
const parser: Parser<Grammar> = compile(grammar, Grammar, Grammar.line);

/**
 * Parse a star board puzzle.
 * @param input the input text.
 * @returns a new puzzle object parsed from the given input.
 */
export function parsePuzzle(input: string): Puzzle{
    const parseTree: ParseTree<Grammar> = parser.parse(input);
    return makeAbstractSyntaxTree(parseTree);
}

/**
 * Convert a parse tree into an abstract syntax tree.
 * @param parseTree contructed according to grammar for star board puzzle.
 * @returns abstract syntax tree corresponding to the parse tree.
 */
function makeAbstractSyntaxTree(parseTree: ParseTree<Grammar>): Puzzle{
    const currColorSet: Set<Array<number>> = new Set(); // record all colors that have been used on this board; each array record three rgb values

    let size = -1;
    const regionsMap: Map<string, number[]> = new Map();
    const regionsArray: string[] = [];
    const stars: boolean[] = [];

    const children: ReadonlyArray<ParseTree<Grammar>> = parseTree.children;
    for (const child of children){
        if (child.name === Grammar.dimensions){
            const children = parseTree.children;
            assert(children[0] !== undefined);
            size = parseInt(children[0].text);
            // initialize stars
            for (let i = 0; i < size * size; i++){
                stars[i] = false;
            }
        } else if (child.name === Grammar.solved || child.name === Grammar.solvedWithoutNewLine){
            let starsCoords: Array<number> = [];
            let blankCoords: Array<number> = [];
            for (const subchild of child.children){
                if (subchild.name === Grammar.stars){
                    starsCoords = starsCoords.concat(subchild.childrenByName(Grammar.coordinates).map(coord => {
                        const [row, col] = coord.text.split(',').map(x => parseInt(x));
                        assert(row !== null && row !== undefined && col !== null && col !== undefined);
                        return (row - 1) * size + col - 1;
                    }));
                }  else if (subchild.name === Grammar.blank || subchild.name === Grammar.blankWithoutNewLine){
                    blankCoords = blankCoords.concat(subchild.childrenByName(Grammar.coordinates).map(coord => {
                        const [row, col] = coord.text.split(',').map(x => parseInt(x));
                        assert(row !== null && row !== undefined && col !== null && col !== undefined);
                        return (row - 1) * size + col - 1;
                    }));
                }
            }
            // add new coordinates to regionsMap and regionsArray
            const regionColor = getRandomColor(currColorSet);
            addCoords(regionsMap, regionsArray, starsCoords, regionColor);
            addCoords(regionsMap, regionsArray, blankCoords, regionColor);
            // add stars
            for (const index of starsCoords){
                stars[index] = true;
            }
        } else if (child.name === Grammar.blank || child.name === Grammar.blankWithoutNewLine){
            const coords = child.childrenByName(Grammar.coordinates).map(coord => {
                const [row, col] = coord.text.split(',').map(x => parseInt(x));
                assert(row !== null && row !== undefined && col !== null && col !== undefined);
                return (row - 1) * size + col - 1;
            });
             // add new coordinates to regionsMap and regionsArray
             const regionColor = getRandomColor(currColorSet);
             addCoords(regionsMap, regionsArray, coords, regionColor);
        }
    } 
    return new Puzzle(size, regionsMap, regionsArray, stars);
}

/**
 * Mutates the given regionsMap and regionsArray to add coordinates to them.
 * @param regionsMap the given regionsMap that maps region color to an array of coordinates in thie region.
 * @param regionsArray the given regionsArray where the value at each index indicates the color of that grid at that index.
 * @param coords the array of coordinaets to be added.
 * @param regionColor the color of the region given by the coordinates.
 */
function addCoords(regionsMap: Map<string, Array<number>>, regionsArray: Array<string>, coords: Array<number>, regionColor: string): void{
    if (!regionsMap.has(regionColor)){
        regionsMap.set(regionColor, coords);
    } else{
        const newArray = regionsMap.get(regionColor)?.concat(coords);
        assert(newArray);
        regionsMap.set(regionColor, newArray);
    }
    for (const coord of coords){
        regionsArray[coord] = regionColor;
    }
}

/**
 * Generate a random color in RGB format that is different from all other colors in the given set of colors.
 * Modify the given currColorSet to include the new color.
 * @param currColorSet the given set of colors. 
 * @returns a new RGB color in the format of a string.
 */
export function getRandomColor(currColorSet: Set<Array<number>>): string{
    const maxRGBValue = 256;
    const getRandomRGBValue = ():number => Math.floor(Math.random() * maxRGBValue);

    let r = getRandomRGBValue();
    let g = getRandomRGBValue();
    let b = getRandomRGBValue();
    // continue generating new RGB values if the new color looks like any previous color
    while (!differentFromOtherColors(r, g, b, currColorSet)){
        r = getRandomRGBValue();
        g = getRandomRGBValue();
        b = getRandomRGBValue();
    }

    currColorSet.add([r, g, b]);
    // code source on how to represent an rgb value in string:
    // https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    return `rgb(${r}, ${g}, ${b})`;

}

/**
 * Check whether the new color formed by the given RGB value is different from all other colors in the given set of colors
 * by at least 75 in Euclidean distance.
 * @param r the R value of the new color.
 * @param g the G value of the new color. 
 * @param b the B value of the new color.
 * @param currColorSet the given set of colors.
 * @returns true if the new color is 75 apart from all colors in the given set; false otherwise.
 */
function differentFromOtherColors(r: number, g: number, b: number, currColorSet: Set<Array<number>>): boolean{
    const minDistance = 75; // the minimum Euclidean distance between two colors so that the colors don't look alike
    for (const otherRGB of currColorSet){
        assert(otherRGB[0] !== null && otherRGB[0] !== undefined 
            && otherRGB[1] !== null && otherRGB[1] !== undefined
            && otherRGB[2] !== null && otherRGB[2] !== undefined);
        if (Math.sqrt(
            Math.pow(r - otherRGB[0], 2) + 
            Math.pow(g - otherRGB[1], 2) + 
            Math.pow(b - otherRGB[2], 2)
        ) < minDistance){
            return false;
        }
    }
    return true;
}