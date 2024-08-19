/**
 * Tests for Puzzle ADT.
 */
describe('Puzzle', function(){
    // Testing Strategy:
    // 
    // addStar(), removeStar(): 
    //      partition on whether the given grid alrealdy has a star: yes, no
    // addStar():
    //      partition on state of the board before the change: unsolved, partially solved
    //      partition on state of the board after the change: partially solved, solved
    // removeStar():
    //      partition on state of the board before the change: unsolved, partially solved
    //      partition on state of the board after the change: unsolved, partially solved, solved
    // startOver():
    //      partition on state of the board before the change: unsolved, partially solved, solved
});