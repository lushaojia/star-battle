import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

const app = express();

const PORT = 8000;
app.listen(PORT);
console.log('now listening at http://localhost:' + PORT);

// GET /<filename: string>
// Load a new blank puzzle board from a file
app.get(':filename', asyncHandler(async (request: Request, response: Response) => {
    throw new Error("Not Implemented");
}));
