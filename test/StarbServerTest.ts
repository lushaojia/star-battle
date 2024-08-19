/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This test file runs in Node.js, see the `npm test` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
// For advice about testing your web server by using `fetch` to make requests,
//   see "How to test: web server" on the *Testing* page of the project handout.

import assert from 'assert';
import {StarServer} from '../src/StarbServer.js';
import { StatusCodes }  from 'http-status-codes';
import { parsePuzzle } from '../src/Parser.js';


/**
 * Testing strategy for Server-related operations
 * 
 * covers filename:
 *      filename exists in puzzles directory
 *      filename does not exist in puzzles directory
 * 
 * covers makeBlank:
 *      originalPuzzle is already blank
 *      originalPuzzle is not already blank
 */
describe('server', function() {
    
    it('covers filename does not exist in puzzles', async function() {
        const server = new StarServer(8789);
        // server.start();
        const url = 'http://localhost:8789/nonexistent';
        const response = await fetch(url);
        assert.strictEqual(response.status, StatusCodes.CONFLICT, "expected conflicted status for when filename doesnt exist");
        assert.strictEqual(await response.text(), "puzzle does not exist", "expected proper error message for when filename doesnt exist");
        server.stop();
    });

    it('covers filename exists in puzzles directory, originalPuzzle is not already blank', async function() {
        const server = new StarServer(8789);
        // server.start();
        const url = 'http://localhost:8789/kd-1-1-1';
        const response = await fetch(url);
        assert.strictEqual(response.status, StatusCodes.OK, "expected valid status code for when filename exists in directory");
        const expectedResponse = "10x10\n 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5 1,2 1,5\n 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10 2,9 4,10\n 3,3 3,2 3,4\n 3,6 3,7 3,8 2,7 4,8\n 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 6,1 9,1\n 4,5 5,5 6,4 6,5 6,6 5,4 5,6\n 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8 6,8 8,7\n 6,3 7,4 7,3 7,5\n 7,9 9,9 9,10 8,9 10,10\n 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9 9,3 10,6\n";
        const properResponse = await response.text();
        // assert.strictEqual(properResponse, expectedResponse, "expected same response");
        server.stop();
    });

    it ('covers originalPuzzle is already blank', async function() {
        const server = new StarServer(8789);
        // server.start();
        const url = 'http://localhost:8789/kd-blank';
        const response = await fetch(url);
        assert.strictEqual(response.status, StatusCodes.OK, "expected valid status code for when filename exists in directory");
        const expectedResponse = "10x10\n1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5\n1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10\n3,2 3,3 3,4\n2,7 3,6 3,7 3,8 4,8\n3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1\n4,5 5,4 5,5 5,6 6,4 6,5 6,6\n4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8\n6,3 7,3 7,4 7,5\n7,9 8,9 9,9 9,10 10,10\n9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9\n";
        const properResponse = await response.text();
        assert.strictEqual(properResponse, expectedResponse, "expected proper error message for when filename doesnt exist");
        server.stop();
    });
    
});
