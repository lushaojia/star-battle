/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watch-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.

import assert from 'assert';
import { Puzzle } from './Puzzle.js';
import { parsePuzzle } from './Parser.js';
import {StarServer} from '../src/StarbServer.js';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { StatusCodes }  from 'http-status-codes';
import type { Canvas, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas';

/**
 * Either: a CanvasRenderingContext2D in the web browser,
 *      or a NodeCanvasRenderingContext2D in Node (for testing)
 */
type WebOrNodeCanvasRenderingContext2D = CanvasRenderingContext2D | NodeCanvasRenderingContext2D;

/**
 * Either: a HTMLCanvasElement representing a `<canvas>` on the web page,
 *      or a Canvas representing a canvas in Node (for testing)
 */
type WebOrNodeCanvas = Omit<HTMLCanvasElement | Canvas, 'getContext'> & {
    getContext(contextId: '2d'): WebOrNodeCanvasRenderingContext2D | null;
};

/**
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-1-1-1";

// see ExamplePage.ts for an example of an interactive web page

// constants
const leftBound = 0; // left bound of the canvas
const upperBound = 0; // upper bound of the canvas
const gridLength = 400; // board length

/**
 * Get the puzzle with filename PUZZLE (defined above).
 * @param filename filename, must not contain extension
 * @returns an empty puzzle fetched from the given filename.
 * @throws an error if the puzzle cannot be fetched.
 */
export async function getPuzzle(filename: string = PUZZLE): Promise<Puzzle>{
    try{
        const response = await fetch(`http://localhost:8789/${filename}`);
        const puzzleText = await response.text();
        const puzzle = parsePuzzle(puzzleText);
        return puzzle;
    } catch(error){
        throw new Error('Cannot get puzzle.');
    }
}

export class Client {
    // fields
    private readonly canvas: HTMLCanvasElement;
    private readonly gridSideLength: number;


    // Abstraction Function:
    //      AF (canvas, puzzle, gridSideLength) = represents the current puzzle that the client is showing, 
    //                                            with the canvas object containing thedrawing of the puzzle;
    //                                            in the canvas element, the puzzle board is displayed with grid side length as gridSideLength.
    // Representation Invariant:
    //      true
    // Safety From Rep Exposure:
    //      canvas is private and readonly, and it is not passed or returned in any operations.
    //      puzzle is private and immutable.
    //      gridSideLength is private,readonly, and a primitive type

    /**
     * Create a new Client object.
     * @param puzzle the puzzle for this client. 
     */
    public constructor(private puzzle: Puzzle){
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas.addEventListener('click', this.handleClick.bind(this)); //.bind(): https://www.w3schools.com/js/js_function_bind.asp
        this.gridSideLength = gridLength / this.puzzle.getSize();
        this.checkRep();
    }

    /**
     * Checks the RI.
     */
    private checkRep(): void{
    }
    

    /**
     * Display the empty puzzle, along with the opening instructions for the game.
     */
    public displayPuzzle(): void{
        this.initializePuzzle(); // draw the puzzle
        this.displayInstruction(); // show the instructions
    }

    /**
     * Handle a click. 
     * Determine the grid that the player is clicking.
     * Try to add a star if the grid is empty.
     * Try to remove a star if the grid already has a star.
     * @param event the click event.
     */
    private handleClick(event: MouseEvent): void{
        let rect: DOMRect = new DOMRect();
        if (this.canvas instanceof HTMLCanvasElement){
            rect = this.canvas.getBoundingClientRect();
        }
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // check if the click is on the board
        if (x < leftBound || x > (leftBound + gridLength)
            || y < upperBound || y > (upperBound + gridLength)){
            return;
        }

        // get the row and column number of the click on the board
        const row = Math.floor((y - leftBound) / this.gridSideLength)+1;
        const col = Math.floor((x - upperBound) / this.gridSideLength)+1;

        if (this.puzzle.hasStar(row, col)){
            this.removeStar(row, col);
        } else{
            this.addStar(row, col);
        }
    }

    /**
     * Try to add a new star on the given puzzle at the grid with the given row and column 
     * and returns the new puzzle after the addtion
     * @param puzzle the puzzle given
     * @param row the row number
     * @param col the column number
     * @returns the puzzle board with specified star added
     * @throws throws error if this is a third star added to a row/column/region; or if the new star is adjacent to another star as defined in handout
     */
    public static addStarToPuzzle(puzzle: Puzzle, row: number, col: number): Puzzle{
        const newPuzzle =  puzzle.addStar(row, col);
        return newPuzzle;
    }

    /**
     * Remove a star on the given puzzle at the grid with given row and column number 
     * and returns a new puzzle after the removel. 
     * Require star to exists at the given position.
     * @param puzzle the puzzle given
     * @param row the row number
     * @param col the column number
     * @returns the puzzle board with specified star removed
     */
    public static removeStarFromPuzzle(puzzle: Puzzle, row: number, col: number): Puzzle{
        const newPuzzle = puzzle.removeStar(row, col);
        return newPuzzle;
    }

    /**
     * Try to add a star on the grid with given row and column number.
     * Display a message if the star cannot be added because the row/column/region already has two stars or if the new star is adjacent to another star as defined in handout
     * @param row the row number.
     * @param col the column number.
     */
    public addStar(row: number, col: number): void{
        try{
            this.puzzle = Client.addStarToPuzzle(this.puzzle, row, col);
            this.drawStar(row, col);
            this.checkSolved();
        } catch(error){
            assert (error instanceof Error);
            this.displayMessage(error.message);
        }
    }

    /**
     * Check if the puzzle is solved. Display winning message if so.
     */
    private checkSolved(): void{
        if (this.puzzle.isSolved()){ 
            this.displayMessage("You won!");
        }
    }

    /**
     * Remove a star at the grid with the given row and column number.
     * Require that star should be at the given position
     * @param row the given row number. Need to be an integer in range [0,9].
     * @param col the given column number. Need to be an integer in range [0,9].
     */
    public removeStar(row: number, col: number): void{
        this.puzzle = Client.removeStarFromPuzzle(this.puzzle, row, col);
        this.eraseStar(row, col);
        this.checkSolved();
    }

    // drawing methods

    /**
     * Initialize a puzzle on the Canvas instance.
     * The puzzle should have its corresponding size as the dimensions, where each tile is a unit square
     * Each tile should be colored with its corresponding hex code.
     * If a tile is a star, the star should also be drawn onto the color.
     */
    private initializePuzzle(): void {
        const context = this.canvas.getContext('2d');
        assert(context);
        context.strokeStyle = "black";
        //fill in colors
        for (let row = 1; row<this.puzzle.getSize() + 1; row++) {
            for (let col = 1; col<this.puzzle.getSize() + 1; col++) {
                const hexColorCode = this.puzzle.getGridColor(row, col);
                context.fillStyle = hexColorCode;
                //subtract 1 as canvas objects use zero indexing in contrast to one-indexing of puzzle
                context.fillRect(this.gridSideLength*(col-1), this.gridSideLength*(row-1), this.gridSideLength, this.gridSideLength);
                context.strokeRect(this.gridSideLength*(col-1), this.gridSideLength*(row-1), this.gridSideLength, this.gridSideLength);
                // check if there is a star, if so draw the star
                if (this.puzzle.hasStar(row,col)) {
                    this.drawStar(row, col);
                }
            }
        }
    }


    /**
     * Removes a star from its position in the board. There must be a star at position (row, col).
     * After removing the star, recolors the board to have its old color.
     * @param row Row index of tile containing a star, must be in the range [1, size of puzzle]
     * @param col Col index of tile containing a star, must be in the range [1, size of puzzle]
     */
    private eraseStar(row: number, col: number): void{
        const context = this.canvas.getContext('2d');
        assert(context);

        const gridXCoord = (col-1) * this.gridSideLength;
        const gridYCoord = (row-1) * this.gridSideLength;

        // clear the tile
        context.clearRect(gridXCoord, gridYCoord, this.gridSideLength, this.gridSideLength);

        //recolor the tile
        context.fillStyle = this.puzzle.getGridColor(row, col);
        context.fillRect(gridXCoord, gridYCoord, this.gridSideLength, this.gridSideLength);
        context.strokeStyle = "black";
        context.strokeRect(this.gridSideLength*(col-1), this.gridSideLength*(row-1), this.gridSideLength, this.gridSideLength);
    }

    /**
     * Draw a star at the grid with the given row and column.
     * The grid at the given row and column should not already have a star
     * @param row the given row number. Need to be an integer in range [1,size of puzzle].
     * @param col the given column number. Need to be an integer in range [1, size of puzle].
     */
     public drawStar(row: number, col: number): void{
        // Code source: https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
        // Adapted from Andre Marques's reply

        const gridXCoord =  (col-1) * this.gridSideLength;
        const gridYCoord =  (row-1) * this.gridSideLength;
        const context = this.canvas.getContext('2d');
        assert(context);

        const radiusScalar = 0.5;
        const numStarPetals = 10;
        const angleDivider = 5;
        const centerX = gridXCoord + this.gridSideLength / 2;
        const centerY = gridYCoord + this.gridSideLength / 2;
        const radius = this.gridSideLength * radiusScalar; 

        context.beginPath();
        for (let i = 0; i < numStarPetals; i++) {
            const angle = i * Math.PI / angleDivider; 
            const r = (i % 2 === 0) ? radius : radius * radiusScalar;
            const x = centerX + r * Math.sin(angle);
            const y = centerY - r * Math.cos(angle); 
            if (i === 0) {
                context.moveTo(x, y); // move to the first point
            } else {
                context.lineTo(x, y); // draw line to next point
            }
        }
        context.closePath();
        context.fillStyle = 'gold';
        context.fill();
    }

    /**
     * Display a message in the message box.
     * @param message the given message.
     */
    private displayMessage(message: string): void{
        const outputArea = document.getElementById('outputArea');
        assert(outputArea);
        const text = outputArea.textContent ?? "";
        const needsBreak = !text.endsWith("\n");
        outputArea.textContent = text + (needsBreak ? "\n" : "") + message + "\n";
    }

    /**
     * Display the starter instructions for a star battle game.
     */
    private displayInstruction(): void{
        const outputArea = document.getElementById('outputArea');
        assert(outputArea);
        outputArea.textContent += "Welcome to Star Battle Puzzle!\n"
                                + "Goal:\n"
                                + "Add stars to the grids so that each row, column, and region contains exactly 2 stars.\n"
                                + "Instructions:\n"
                                + "1. Click on an empty grid to add a star.\n"
                                + "2. Click on a grid with a star to remove it.\n"
                                + "3. You can place up to 2 stars in each row, column, and region; afterwards, no more stars can be added.\n\n";
    }
}

/**
 * 
 */
async function main(): Promise<void> {
    const puzzle: Puzzle = await getPuzzle(PUZZLE);
    const client: Client = new Client(puzzle);
    client.displayPuzzle();
}

void main();
