import express, { Request, Response } from 'express';

const app = express();
app.set('etag', false); // disable ETag caching
app.use((request, response, next) => {
    // allow requests from web pages hosted anywhere
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

// serve ???
app.use(express.static('???'));

// GET /<filename: string>
// response is a parsable string of a blank puzzle
// throws an error if filename does not 
// correspond to a puzzle found in the puzzles subdirectory

app.get(':filename', (request: Request, response: Response) => {
    
});

/**
 * Testing strategy
 *      partition on filename: found in ./puzzles, not
 *      manual test for validating response:
 *          1. request a blank puzzle
 *          2. display it using displayPuzzle
 *          3. assert that the regions are correctly outlined in bold black lines and
 *             that the grids are outlined in thin gray lines
 *          
 */