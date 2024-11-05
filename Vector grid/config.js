const ROWS = 100, COLS = 100; // grid dimensions
const SIZE = 20; // size of the cell in pixels
const CELL_COLOR = "#C1ABA6";
const BACKGROUND_COLOR = "#533B4D"


const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const GRID_WIDTH = COLS * SIZE;
const GRID_HEIGHT = ROWS * SIZE;
const XPAD = (CANVAS_WIDTH - GRID_WIDTH) / 2;
const YPAD = (CANVAS_HEIGHT - GRID_HEIGHT) / 2; // dynamic spacing of the grid on a square canvas
const OFFSET = 0.0; // this adds spacing between cells


const NOISE_SCALE = .0029;
let NOISE_SLICE = 0; // equivalent to zOffset

let cell_count_output;
let active_cell_count;


/**
     * Converts hex color to p5 color with alpha
     * @param {string} hex - Hex color code
     * @param {number} alpha - Opacity between 0-1
     * @returns {p5.Color}
     */
function hexToColor(hex, alpha) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to rgb (0-1 range)
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    return color(r, g, b, alpha);
}

function out(variable, text = ''){

    if (variable instanceof p5.Vector){
        variable = vectorString(variable);
    }

    return `${text} ${variable}`;
}

