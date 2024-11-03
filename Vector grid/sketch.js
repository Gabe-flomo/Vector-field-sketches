
/**
 * @type {Grid}
 */
let grid;

/**
 * Checks if spacebar is currently pressed
 * @type {boolean}
 */
let isSpacePressed;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  rectMode(CENTER);
  colorMode(RGB, 1);
  grid = new Grid(ROWS, COLS, SIZE);
  isSpacePressed = false;


  // outputs
  cell_count_output = createP("waiting for output");
  active_cell_count = createP("waiting for output");

}

function draw() {
  background(BACKGROUND_COLOR);
  noStroke();

  fill(CELL_COLOR);
  
  if (keyIsDown(SHIFT) == true && mouseIsPressed){
    let selectedCell = grid.findCellUnderMouseFast();
    grid.deactivateCell(selectedCell, callback = (selectedCell) => selectedCell.setColor(CELL_COLOR));
  }
  else if (mouseIsPressed){
    let selectedCell = grid.findCellUnderMouseFast();
    grid.activateCell(selectedCell, callback = (selectedCell) => selectedCell.setColor(color(0)));
  } //else {
  //   grid.hoverEffect();
  // }

  
  // grid.render();
  grid.renderNoise(8);
  cell_count_output.html(out(grid.cell_count, 'Cell count: '));
  active_cell_count.html(out(grid.activeCellCount(), 'Active cells: '))
  NOISE_SLICE += .005;
  
}


