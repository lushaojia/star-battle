// Manual Testing:
//
// Testing Strategy:
//      partition on player move: 
//              add star to an empty grid, add star to a grid with star,
//              remove star from an empty grid, remove star from a grid with star,
//              start over
//      partition on afterwards puzzle status: solved, partially solved, unsolved (empty)

// Test Cases:
/**
 * Manual Test: add a star to an empty grid on a partially solved board, and then the puzzle is solved
 * Covers: move = add star to an empty grid, afterwards puzzle status = solved
 * 1. Click on an empty grid on an partially solved board
 * 2. Click "Add" to add a star to that grid
 * 3. Check that the grid now has a star
 * 4. Check that the puzzle status is now changed to solved
 */

/**
 * Manual Test: add a star to a grid with star on a partially solved board
 * Covers: move = add star to an empty grid, afterwards puzzle status = partially solved
 * 1. Click on a grid with star on a partially solved board
 * 2. Click "Add" to add a star to that grid
 * 3. Check that nothing has changed on the board
 * 4. Check that the puzzle status is still partially solved
 */

/**
 * Manual Test: remove a star from an empty grid on an unsolved board
 * Covers: move = remove star from an empty grid, afterwards puzzle status = unsolved
 * 1. Click on an empty grid on an unsolved board
 * 2. Click "Remove" to remove a star from that grid
 * 3. Check that nothing has changed on the board
 * 4. Check that the puzzle status is still unsolved
 */

/**
 * Manual Test: remove a star from a grid with star on a partially solved board with one star, and then the puzzle board is empty
 * Covers: move = remove star from an empty grid, afterwards puzzle status = unsolved
 * 1. Click on a grid with star on a partially removed board
 * 2. Click "Remove" to remove a star from that grid
 * 3. Check that the star disappears from that grid
 * 4. Check that the puzzle status is now changed to unsolved
 */

/**
 * Manual Test: start over a puzzle on a partially solved board
 * Covers: move = start over, afterwards puzzle status = unsolved
 * 1. Click on "Start Over"
 * 2. Check that all stars disappear from the board
 * 4. Check that the puzzle status is now changed to unsolved
 */