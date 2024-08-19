/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This code is loaded into example-page.html, see the `npm watch-example` script.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.

import assert from 'assert';

const BOX_SIZE = 16;

// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS: Array<string> = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];

// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map( (color) => color + '60' );

/**
 * Draw a black square filled with a random color.
 * 
 * Note: this function is designed to draw on a <canvas> element in the browser,
 *   but we can adjust its signature so that it can be tested with Mocha in Node.
 *   See "How to test: canvas drawing" on the *Testing* page of the project handout.
 * 
 * @param canvas canvas to draw on
 * @param x x position of center of box
 * @param y y position of center of box
 */
function drawBox(canvas: HTMLCanvasElement, x: number, y: number): void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');

    // save original context settings before we translate and change colors
    context.save();

    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);

    // draw the outer outline box centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);

    // fill with a random semitransparent color
    context.fillStyle = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)] ?? assert.fail();
    context.fillRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);

    // reset the origin and styles back to defaults
    context.restore();
}
const thinOutlineColor = 'silver'; // uppercase camel
const thinLineWidth = 1;
const boldOutlineColor = 'black';
const boldLineWidth = 2;
const backgroundColor = 'whitesmoke';
const starColor = 'mediumslateblue';
const STAR_RADIUS = 2;
const starLineWidth = 1;
const CIRCLE_DEGREES = 360;
const RIGHT_ANGLE = 90;
const toRadians = (degrees: number): number => {return degrees * Math.PI / (CIRCLE_DEGREES / 2); };

/**
 * Draw a square cell filled with off-white and outlined in thin gray lines by default.
 * Side(s) specified by `bolded` are outlined in bold black line(s).
 * 
 * @param canvas canvas to draw on
 * @param dx x position of upper left corner of cell
 * @param dy y position of upper left corner of cell
 * @param bolded which side(s) to draw with bold black line(s)
 * @param bolded.top top side of cell
 * @param bolded.right right side of cell
 * @param bolded.bottom bottom side of cell
 * @param bolded.left left side of cell
 */
function drawCell(canvas: HTMLCanvasElement, 
    dx: number, dy: number,
    bolded: {top: boolean, right: boolean, bottom: boolean, left: boolean}): void {

    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');

    // save original context settings before we translate and change colors
    context.save();

    // draw outlines of the box with upper left corner at (dx, dy)
    context.strokeStyle = thinOutlineColor;
    context.lineWidth = thinLineWidth;
    context.strokeRect(dx, dy, BOX_SIZE, BOX_SIZE);
    
    // draw bolded lines, if applicable
    context.strokeStyle = boldOutlineColor;
    context.lineWidth = boldLineWidth;
    if (bolded.top) {
        context.moveTo(dx, dy);
        context.lineTo(dx + BOX_SIZE, dy);
        context.stroke();
    } 
    if (bolded.right) {
        context.moveTo(dx + BOX_SIZE, dy);
        context.lineTo(dx + BOX_SIZE, dy + BOX_SIZE);
        context.stroke();
    }
    if (bolded.bottom) {
        context.moveTo(dx, dy + BOX_SIZE);
        context.lineTo(dx + BOX_SIZE, dy + BOX_SIZE);
        context.stroke();
    }
    if (bolded.left) {
        context.moveTo(dx, dy);
        context.lineTo(dx, dy + BOX_SIZE);
        context.stroke();
    }

    // fill with an off-white color
    context.fillStyle = backgroundColor;
    context.fillRect(dx, dy, BOX_SIZE, BOX_SIZE);

    // reset the origin and styles back to defaults
    context.restore();
}

/**
 * Draw a five-pointed star centered at (x, y)
 * @param canvas canvas to draw on
 * @param x x position of center of star
 * @param y y position of center of star
 */
function drawPentagram(canvas: HTMLCanvasElement, x: number, y: number): void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');

    // save original context settings before we translate and change colors
    context.save();

    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);

    context.strokeStyle = starColor;
    context.lineWidth = starLineWidth;
    
    const sidesOfStar = 5;
    const interiorAngle = CIRCLE_DEGREES / sidesOfStar;

    context.beginPath();
    // draw horizontal side
    context.moveTo(-Math.acos(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS,
                   -Math.asin(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS);
    context.lineTo(Math.acos(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS,
                   -Math.asin(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS);
    context.stroke();
    // draw next side
    context.lineTo(-Math.acos(toRadians(RIGHT_ANGLE - interiorAngle / 2)) * STAR_RADIUS,
                   Math.asin(toRadians(RIGHT_ANGLE - interiorAngle / 2)) * STAR_RADIUS);
    context.stroke();
    // draw next side
    context.lineTo(0, -STAR_RADIUS);
    // draw next side
    context.lineTo(Math.acos(toRadians(RIGHT_ANGLE - interiorAngle / 2 )) * STAR_RADIUS,
                   Math.asin(toRadians(RIGHT_ANGLE - interiorAngle / 2)) * STAR_RADIUS);
    context.stroke();
    // draw last side
    context.lineTo(-Math.acos(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS,
                   -Math.asin(toRadians(RIGHT_ANGLE - interiorAngle)) * STAR_RADIUS);
    context.stroke();

    // fill with a semitransparent off-white
    context.fillStyle = starColor;
    context.fill();

    // reset the origin and styles back to defaults
    context.restore();
}

/**
 * Print a message by appending it to an HTML element.
 * 
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea: HTMLElement, message: string): void {
    // append the message to the output area
    outputArea.innerText += message + '\n';

    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}

/**
 * Set up the example page.
 */
function main(): void {
    
    // output area for printing
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
    // canvas for drawing
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
    
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event: MouseEvent) => {
        // drawCell(canvas, event.offsetX, event.offsetY, 
        //     {top: true, right: true, bottom: true, left: true});
        drawPentagram(canvas, event.offsetX, event.offsetY);
    });

    // add initial instructions to the output area
    printOutput(outputArea, `Click in the canvas above to draw a box centered at that point`);
}

main();
