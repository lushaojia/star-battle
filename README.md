# star-battle ⭐️⚔️

## Play it
https://star-battle-1014707612287.us-east1.run.app/starb-client.html

## Project Overview
This client-server interactive web game was developed in 2 weeks as part of a team project for the course 6.1020 Software Construction at MIT.

### Server-Side (Express.js Backend)
The server implements a RESTful API that
* serves puzzle files stored statically in a local directory
* parses "solved" puzzle files into an internal abstract data type (ADT) representation, clears the stars, and converts it back to a parsable string for the client

### Client-Side (HTML5 Canvas Frontend)
The client implements an interactive canvas-based UI that
* fetches "blank" puzzle data via a GET request to the server and parses it into an instance of the ADT
* dynamically renders the game state using 2D context API
* validates user actions in real-time (e.g. putting two stars adjacent to each other) before state and UI updates
* provides immediate feedback by displaying error messages for illegal moves and 
