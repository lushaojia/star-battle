/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.

import assert from 'assert';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { StatusCodes }  from 'http-status-codes';
import {Puzzle} from '../src/Puzzle.js';
import { parsePuzzle } from '../src/Parser.js';

/**
 * Web-game server for StarBattle puzzles
 */
export class StarServer {
    //AF: StarServer(app, Server, port): represents a StarServer Server application running on the port number represented by port,
    //    with app representing the Express application and server representing the server the port is running on.
    // RI: true
    // Safety from Rep Exposure: all rep values are private, so can't be accessed outside of the class
    //                           no reference to the rep values are returned in any of the methods, as all methods but makeBlank are void, and makeBlank doesn't access any rep values directly.
    private readonly app;
    private server: Server | undefined;
    private readonly port: number;
    /**
     * Creates a new StarServer object
     * @param port port number on which the server runs
     */
    public constructor(port:number) {
        this.app = express();
        this.app.use(express.static('.')); // Look inside cwd for file to serve
        this.port = port;
        this.app.set('etag', false); // disable ETag caching
        // allow request from any webpage
        this.app.use((request, response, next) => {
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        this.providePuzzle();
    }

    /**
     * Given a filename, returns it as a blank puzzle to the client, where a blank puzzle does not identify stars.
     * If the filename does not correspond to a puzzle found in the puzzles subdirectory, throw an error
     * Response: a parsable string of a blank puzzle, which is blank
     */
    public providePuzzle(): void {
        this.app.get('/:filename', asyncHandler(async(request: Request, response: Response) => {
            const {filename}= request.params;
            const filePath = `puzzles/${filename}.starb`;
            try {
                const originalPuzzleText = await fs.promises.readFile(filePath, 'utf8');
                const originalPuzzle = parsePuzzle(originalPuzzleText);
                const blankPuzzle: Puzzle = originalPuzzle.clearStars();
                const blankPuzzleString = blankPuzzle.toString();
                response.status(StatusCodes.OK)
                .type('text')
                .send(blankPuzzleString);
            }
            catch (error) {
                response.status(StatusCodes.CONFLICT)
                .type('text')
                .send("puzzle does not exist");
            }
        }));
    }

   
    /**
     * Reformats a puzzle to make it "blank"
     * @param originalPuzzle original string representation of a puzzle
     * @returns a puzzle which is now "blank", meaning that any tiles that are currently formatted as stars
     * will now be formatted as normal tiles that belong to a region, while no tiles should now be formatted as stars
     */
    private makeBlank(originalPuzzle: string): string {
        // split by newlines
        const lines = originalPuzzle.split("\n");
        const transformedPuzzleStringArray: Array<string> = [];
        for (const line of lines) {
            // split by |
            const splits = line.split("|");
            if (splits.length == 2) {
                const starsPortion= splits[0] ?? assert.fail("static checking");
                const blankPart = splits[1] ?? assert.fail("static checking");
                let starsPart = "";
                // process all stars with proper spaces
                const splitStars = starsPortion.split(" ");
                for (const star of splitStars) {
                    if (star.length > 0) {
                        starsPart += ` ${star}`;
                    }
                }
                // combine with a newline
                if (starsPart.length > 0) {
                    transformedPuzzleStringArray.push(`${blankPart}${starsPart}`);
                }
                // can just use old line if already blank
                else {
                    transformedPuzzleStringArray.push(` ${line}`);
                }
            }
            else if (splits.length == 1) {
                const part = splits[0] ?? assert.fail("static checking");
                if (part[0] !== "#") {
                    // only want to add the dimensions string
                    transformedPuzzleStringArray.push(part);
                }
            }
        }
        // join together with a newline
        return transformedPuzzleStringArray.join("\n");
    }
    /**
     * Starts a new server
     * @returns a Promise that the server is listening at the desired port once the connection is established
     */
    public start(): Promise<void> {
        console.log('server initializing');
        return new Promise(resolve => {
            this.server = this.app.listen(this.port, () => {
                console.log('server now listening at', this.port);
                resolve();
            });
        });
    }
    /**
     * Ends the server
     */
    public stop(): void {
        this.server?.close();
        console.log('server stopped');
    }

}






/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main(): Promise<void> {
    const defaultPortNumber = 8789;
    const portNumber = Number(process.env['PORT'] ?? defaultPortNumber);
    const server = new StarServer(portNumber);
    await server.start();
}

void main();
