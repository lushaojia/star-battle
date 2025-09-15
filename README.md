# star-battle ⭐️⚔️

## The Rules
Add stars to the grids so that each row, each column, and each region of the puzzle has exactly 2 stars, and no stars are vertically, horizontally, or diagonally adjacent.

## Play it
https://star-battle-1014707612287.us-east1.run.app/starb-client.html

## Project Overview
This client-server interactive web game was developed collaboratively in a team of 3 as part of a course project for 6.1020 Software Construction at MIT.

### Tech Stack
- TypeScript
- HTML5 Canvas (UI)
- Express (Node.js)
- Mocha + c8 (testing & coverage)
- Docker + Cloud Run (deployment)

### Server-Side (Express.js Backend)
- Serves static assets (e.g. puzzle files, HTML/JS) from the project root.
- Exposes `GET /:filename` endpoint that:
  - reads the requested `puzzles/<filename>.starb`
  - parses it into an internal `Puzzle`
  - clears stars to produce a “blank” puzzle using the `Puzzle` interface
  - converts the `Puzzle` back to a parsable string and returns it to the client

### Client-Side (HTML5 Canvas Frontend)
- On load, makes a `GET /<filename>` request and parses the response into a `Puzzle`
- Renders the board grids and colored regions on Canvas
- Listens for clicks → maps locations of clicks from pixels to grid cells → validates legality of moves → updates game state and board
- Displays human-readable errors for illegal moves and a win message when solved

### Puzzle Internals
- Parsing: both client and server use a common grammar to transform puzzle files into structured data via [parserlib]([https://web.mit.edu/6.031/www/parserlib/3.2.3/typedoc/interfaces/Parser.html])
- Game Model: a `Puzzle` ADT that provides operations for
  - updating the game state (i.e. adding and removing stars)
  - enforcing rules (i.e. adjacency and row/column/region constraints for stars)
  - checking if the game has been won
 
### My Contributons & Division of Work
The project is divided into many parts (`Puzzle` ADT, grammar, server API, client ADT, UI graphics, integration tests).
Each person provided initial designs for the specs and testing strategies for some parts in the first iteration and implemented the specs and tests of other parts in the second iteration.
In the first iteration, I 
- designed a grammar for parsing puzzle files
- designed specs and testing strategy for the server API and client ADT
- created canvas drawing prototypes for rendering grids, regions, and stars
In the second iteration, I
- implemented the spec and unit testing for the `Puzzle` ADT
- validated server-client integration and UI rendering through manual end-to-end tests

