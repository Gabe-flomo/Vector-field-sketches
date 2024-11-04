


/**
* Represents a single cell in the grid
* Each cell knows its position in the grid coordinate system and canvas coordinate system
* Each cell has a color that can be changed
*/
class Cell extends Coloring {
    /**
     * Creates a new cell
     * @param {number} row - The row (x) position in the grid
     * @param {number} col - The column (y) position in the grid  
     * @param {number} size - The size of the cell in pixels
     */
    constructor(row, col, size) {
        super();
        // Now row represents y (vertical) and col represents x (horizontal)
        this.gridPos = createVector(row, col);
        this.row = row;
        this.column = col;
        this.ID = `${row}${col}`;

        this.size = size;
        // Swap the calculations so col determines x and row determines y
        let x = XPAD + (col * this.size) + (this.size / 2); // col for horizontal position
        let y = YPAD + (row * this.size) + (this.size / 2); // row for vertical position
        this.canvasPos = createVector(x, y);

        this.defaultColor = hexToColor("#C1ABA6");
        this.color = this.defaultColor;
        this._active = false;
        this._noise = noise(this.row * NOISE_SCALE, this.column * NOISE_SCALE, NOISE_SLICE);
        this._noiseAngle = TAU * this.noise;
    }

    get active(){
        return this._active;
    }

    set active(newState){
        this._active = newState;
    }

    get noise(){
        return this._noise;
    }

    set noise(newValue){
        this._noise = newValue;
    }

    get noiseAngle(){
        return TAU * this.noise;
    }



 
    /**
     * Changes the cell's color
     * @param {string|p5.Color} newColor - The new color to set
     */
    setColor(newColor, alpha = 1) {
        // if newColor is string, assume it's a Hex code
        this.color = typeof newColor === 'string' ? hexToColor(newColor, alpha = alpha) : color(newColor, alpha);
        // this.x = this.color;
        // this.y = this.color;
        // this.z = this.color;
    }
 
    /**
     * Draws the cell on the canvas
     * Uses stored canvas position and size
     * Renders as a rectangle with slight offset for spacing between cells
     */
    draw() {
        // fill(this.color);
        this.apply();
        rect(this.canvasPos.x, this.canvasPos.y, this.size - OFFSET, this.size - OFFSET);
    }

    /**
     * Checks if mouse position is within cell bounds
     * @returns {boolean} true if mouse is over cell
     */
    isMouseOver() {
        // Since we're using rectMode(CENTER), check distance from center
        const halfSize = SIZE / 2;
        
        return mouseX > this.canvasPos.x - halfSize && 
               mouseX < this.canvasPos.x + halfSize &&
               mouseY > this.canvasPos.y - halfSize && 
               mouseY < this.canvasPos.y + halfSize;
    }

 }
 
 /**
 * Represents a 2D grid of cells
 * Grid coordinate system: row = x axis, column = y axis
 * Origin (0,0) is at top-left
 */
 class Grid{
    /**
     * Creates a new grid
     * @param {number} rows - Number of rows (width)
     * @param {number} cols - Number of columns (height)
     * @param {number} cell_size - Size of each cell in pixels
     */
    constructor(rows, cols, cell_size) {
        // super();
        this.cells = [];
        this.grid = {};
        this.columns = cols;  // Height of grid (y-axis)
        this.rows = rows;     // Width of grid (x-axis)
        this.lastHoveredCell = null;
        this.cell_count = rows * cols;
    
        
        // Initialize 2D array of cells
        // First dimension is rows (x), second is columns (y)
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.columns; col++) {
                this.cells[row][col] = new Cell(row, col, cell_size);
                let cellID = this.cells[row][col].ID;
                this.grid[cellID] = this.cells[row][col];
                

            }
        }

    }


    
    activateCell(selectedCell, callback = null) {

        if (selectedCell && !selectedCell.active) {
            console.assert(typeof callback === 'function', 'Callback must be a function');
            callback(selectedCell);
            selectedCell.active = true;
            
        }  

        
    }


    deactivateCell(selectedCell, callback = null) {

        if (selectedCell && selectedCell.active){
            console.assert(typeof callback === 'function', 'Callback must be a function');
            callback(selectedCell);
            selectedCell.active = false;
            
        }
    }


    /**
     * Returns an array of IDs for all currently active cells in the grid.
     * 
     * 
     * The cell IDs are strings combining the row and column position,
     * for example: "23" represents the cell at row 2, column 3.
     * 
     * @returns {string[]} Array of cell IDs for all active cells
     * 
     * @example
     * // If cells at positions [2,3] and [4,5] are active
     * grid.getActiveCells(); // Returns ["23", "45"]
     * 
     * @see activeCellCount() for getting just the number of active cells
     */
    getActiveCells() {
        // Initialize array to store active cell IDs
        let cellList = []
        
        // Iterate through every cell in the grid
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                // If the cell is active, add its ID to our list
                if (this.cells[row][col].active) {
                    cellList.push(this.cells[row][col].ID);
                }
            }
        }

        return cellList;
    }

    /**
     * Returns the total number of active cells in the grid.
     * 
     * @returns {number} The count of active cells
     * 
     * @example
     * // If 5 cells have been painted
     * grid.activeCellCount(); // Returns 5
     * 
     * @see getActiveCells() for getting the actual cell IDs
     */
    activeCellCount() {
        // Use the getActiveCells() method and get the length of the returned array
        return this.getActiveCells().length;
    }

 
    /**
     * Renders the entire grid
     * Iterates through all cells in row-major order (row by row)
     * and calls each cell's draw method
     */
    render() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.cells[row][col].draw();
            }
        }
    }

    updateNoise(cell){
        let n = noise(cell.row * NOISE_SCALE, cell.column * NOISE_SCALE, NOISE_SLICE);
        cell.noise = n;
    } 


    renderNoise(colorChoice = 8){

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                let cell = this.cells[row][col];
                // angle = TAU * cell.noise;
                this.updateNoise(cell);
                
                if (colorChoice < 1){
                    cell.setColor(color(sin(cell.noise)));
                } else {
                    cell.getColor(cell.noiseAngle + millis() * 0.0005, colorChoice);
                }
                // cell.setColor(color(sin(cell.noiseAngle)));
                
                // cell.getColor(cell.noiseAngle , 9);
                cell.draw();
            }
        }        

    }

    /**
     * Checks if given row and column positions are within grid boundaries
     * @param {number} row - The row to check
     * @param {number} col - The column to check
     * @returns {boolean} True if position is valid, false otherwise
     */
    isWithinBounds(row, col) {
        return row >= 0 && row < this.rows && 
               col >= 0 && col < this.columns;
    }
 
    /**
     * Gets the cell at the specified grid coordinates
     * @param {number} row - Row (x) coordinate
     * @param {number} col - Column (y) coordinate
     * @returns {Cell|null} The cell at the specified position, or null if coordinates are invalid
     */
    getCellAt(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
            return this.cells[row][col];
        }
        return null;
    }


    /**
     * Gets cell that mouse is currently over, if any. Checks all cells an words
     * regardless of various sizes or spacings
     * @returns {Cell|null} The cell under mouse or null if none
     */
    findCellUnderMouse() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.cells[row][col].isMouseOver()) {
                    return this.cells[row][col];
                }
            }
        }
        return null;
    }

    /**
    * Efficiently finds the cell under the mouse cursor using grid math
    * Converts mouse pixel coordinates to grid position by:
    * 1. Subtracting grid offset to get position relative to grid
    * 2. Dividing by cell size to get grid coordinates
    * 3. Checking if resulting position is within grid bounds
    * 
    * @returns {Cell|null} The cell under the mouse cursor, or null if mouse is outside grid
    */
    findCellUnderMouseFast() {
        // Convert mouse X position to column number
        // Subtract grid offset (GRID.X_PADDING) to get position relative to grid start
        // Divide by cell size to convert from pixels to grid units
        const col = Math.floor((mouseX - XPAD) / SIZE);
    
        // Convert mouse Y position to row number using same process
        const row = Math.floor((mouseY - YPAD) / SIZE);
        
        // Return the cell if position is valid, otherwise null
        // isWithinBounds() checks if row/col are within grid boundaries
        if (this.isWithinBounds(row, col)) {
            return this.cells[row][col];
        }
        return null;
    }


    /**
    * Updates hover effect for cells in the grid
    * Makes undrawn cells semi-transparent when hovered over
    * Maintains color of cells that have been drawn on
    */
    hoverEffect() {
        // Step 1: Find which cell the mouse is currently over (if any)
        let hoveredCell = this.findCellUnderMouseFast();
        
        // Step 2: Set up our checking variables
        
        // Was there a cell being hovered over in the previous frame?
        let hadPreviousHover = this.lastHoveredCell !== null;
        // Example:
        // this.lastHoveredCell = cell[1][1] → hadPreviousHover = true
        // this.lastHoveredCell = null → hadPreviousHover = false
        
        // Did the mouse move to a different cell?
        let hoverChanged = this.lastHoveredCell !== hoveredCell;
        // Example:
        // lastHoveredCell = cell[1][1], hoveredCell = cell[1][2] → hoverChanged = true
        // lastHoveredCell = cell[1][1], hoveredCell = cell[1][1] → hoverChanged = false
        
        // Was the previous cell not drawn on permanently?
        let wasNotDrawnOn = this.lastHoveredCell && !this.lastHoveredCell.active;
        // Example:
        // lastHoveredCell.active = true → wasNotDrawnOn = false (cell was drawn on)
        // lastHoveredCell.active = false → wasNotDrawnOn = true (cell was just hovered)
        
        // Step 3: Reset previous cell if needed
        // If ALL these are true:
        // - We were hovering over a cell last frame (hadPreviousHover)
        // - We moved to a different cell (hoverChanged)
        // - The previous cell wasn't drawn on permanently (wasNotDrawnOn)
        if (hadPreviousHover && hoverChanged && wasNotDrawnOn) {
            // Reset the previous cell back to normal
            this.lastHoveredCell.color = CELL_COLOR;
        }
        
        // Step 4: Handle current hover
        // If we're hovering over a cell AND it hasn't been drawn on
        if (hoveredCell && !hoveredCell.active) {
            // Show hover effect
            console.log(hoveredCell.ID)
            hoveredCell.setColor(CELL_COLOR, 0.05);
            // Remember this cell for next frame
            this.lastHoveredCell = hoveredCell;
            
        } else {
            // No hover effect needed
            this.lastHoveredCell = null;
        }
    }

    


 }