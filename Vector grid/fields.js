class Coloring{

    constructor(){
        this.palettes = {
            1: palette1,
            2: palette2,
            3: palette3,
            4: palette4,
            5: palette5,
            6: palette6,
            7: palette7,
            8: palette8,
            9: palette9,
            10: palette10
            
        }

        this._current_palette = 1;
        this._current_angle = random(360);
        this._current_color = createVector(1, 1, 1);
        this._generated_vector_string = null;
        this._palette_count = Object.keys(this.palettes).length;
         
    }

    /**
     * Keeps track of the total number of palettes that the object has created
     * @returns {number}
     */
    get palette_count(){
        this._palette_count = Object.keys(this.palettes).length;
        return this._palette_count;
    }

    set palette_count(newCount){
        this._palette_count = newCount;
    }

    /**
     * Keeps track of the color that the object is representing
     * @returns {p5.Vector}
     */
    get current_color(){return this._current_color;}

    /**
     * Keeps track of the color that the object is representing
     * @param {p5.Vector} newColor - New color vector
     */
    set current_color(newColor){this._current_color = newColor;}


    get current_palette(){
        return this._current_palette;
    }

    /**
     * Keeps track of the palette that the object is representing
     * @param {number} newPalette
     */
    set current_palette(newPalette){
        this._current_palette = newPalette;
    }

    get info(){

        return ` ---Color vector: ${vectorString(this.current_color, 2, 3)} --- Color palette: ${this.current_palette} --- Number of palettes: ${this.palette_count} --- Angle ${this.current_angle}`;
    }

    get x(){
        return this.current_color.x;
    }

    get y(){
        return this.current_color.y;
    }

    get z(){
        return this.current_color.z;
    }

    get current_angle(){
        return this._current_angle;
    }

    set current_angle(newAngle){
        this._current_angle = newAngle;
    }


    /**
     * 
     * @param {number|string} color_palette optional parameter that determines which color palette to choose from. If no palette is given, it will choose from a random palette.
     * @returns {p5.Vector}  returns a 3D color vector
     */
    randomColor(color_palette = null){
        this.current_angle = noise(frameCount / 120) * 200;

        // if no palette chosen, choose a random one
        if (color_palette === null){
            // chooses a random palette based on a noise function
            this.current_palette = 1 + int(noise(frameCount / 200) * 10);
            this.current_palette = this.clamp(this.current_palette);
            // choose the palette from the default palettes
            this.current_color = this.current_palette > 10 ? color_from_coefficients(this.current_angle, this.palettes[this.current_palette]) : this.palettes[this.current_palette](this.current_angle);

        // if the palette is a list of coefficients such as '[[1 2 3] [4 5 6]]'
        } else {
            this.color(this.current_angle, color_palette);
        }

        // return the internal color
        return this.current_color;
    }

    /**
     * Selects a color from a palette. Default palettes are 1-10, 11+ will be considered
     * generated and will be handled with the `coefficient` function.
     * @param {number} angle - position in the palette (determines the color)
     * @param {number|string} palette - choose one of these options
     *      - `number` Choose from one of the default palettes [1-10]
     *      - `string` Provide a color palette such as `'[[1 2 3] [4 5 6]]'`
     *      - `string` Type in `generate` to create a new palette on the fly (perlin noise based)
     */
    getColor(angle, palette = 1){

        this.current_angle = angle;

        // default picker
        if (typeof palette === 'number'){
            // if the palette is one of the default palettes
            if (this.is_default(palette)){
                this.current_palette = palette;
                this.current_color = this.palettes[this.current_palette](this.current_angle);
            
            // if the palette has been added or generated
            } else {
                // clamp just ensures that a valid palette is returned and not out of bounds
                this.current_palette = this.clamp(palette)
                this.current_color = color_from_coefficients(this.current_angle, this.palettes[this.current_palette])
            }

    
        } else if (typeof palette === 'string'){
            // if the palette are coefficients then pick the color from coefficients, otherwise generate the palette
            if (isCoefficientLike(palette)){
                this.current_color =  color_from_coefficients(this.current_angle, palette)
            } else {
                let generated = this.generate_palette(use_noise = true, inplace = false);
                this.current_color = color_from_coefficients(this.current_angle, generated)
            }
             
        }

        return this.current_color;
    }


    /**
     * ensure that you always choose a color within a real color palette
     * @param {*} palette 
     * @returns 
     */
    clamp(palette){
        print(`clamping ${palette}`)
        if (palette > this.palette_count){
            return this.palette_count;
        } else if (palette < 1){
            return 1;
        } else {
            return palette;
        }
    }

    /**
     * This function will randomly generate 4 vectors and create a new color palette
     * @param {boolean} use_noise - if the randomness should be based on perlin noise or not
     * @returns {string} will add a new vector string to the dictionary of generated vectors
     */
    generate_palette(use_noise = true, inplace = true){
       
        // if (inplace){
        //     this.add_palette()
        // }
        
        return '';
    }

    /**
     * 
     * @param {string} coefficients adds a new palette to the palette object (aka dictionary)
     */
    add_palette(coefficients){
        let palette_size = Object.keys(this.palettes).length + 1;
        this.palettes[palette_size] = coefficients;
        this.palette_count += 1;
    }



    /**
     * Calls the fill function so that any shapes 
     */
    apply(){
        fill(this.x, this.y, this.z);
    }

    update_from_palette(){
        return this.current_palette > 10 ? color_from_coefficients(this.current_angle, this.palettes[this.current_palette]) : this.palettes[this.current_palette](this.current_angle);
    }

    /**
     * Returns true if the palette is a default palette and false otherwise
     * @param {number} palette 
     * @returns {boolean}
     */
    is_default(palette){
        if (typeof palette === 'number'){
            if (palette <= 10){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Returns true if the palette is added or generated and false otherwise
     * @param {number} palette 
     * @returns {boolean}
     */
    is_generated(palette){
        if (typeof palette === 'number'){
            if (palette <= 10){
                return false;
            } else {
                return true;
            }
        } else if (typeof palette === 'string'){
            return true;
        }
    }

}

class Particle extends Coloring{

    constructor(position) {
        
      super();
      // create a vector at the center of the screen, if no position is given
      this._position = position == null ? createVector(width / 2, height / 2) : position;
  
      // gives the object a random, normalized speed with a maximum magnitude of 5, if no velocity is given
      this._velocity = p5.Vector.random2D().normalize();
  
      // sets the initial acceleration
      this._acceleration = createVector(0, 0);
  
      // properties
      this._radius = random(1, 8);
      this.mass = random(1, 1000);

      this.G = 50.1;

      this._collisions = true;

    }
  
    // SETTERS
    /**
    * @param {p5.Vector} newPosition
    */
    set position(newPosition) {this._position = newPosition;}
    /**
     * @param {p5.Vector} newVelocity
     */
    set velocity(newVelocity) {this._velocity = newVelocity;}
    set radius(newradius) {this._radius = newradius;}
    set acceleration(newAcceleration) {this._acceleration = newAcceleration;}
    /**
     * @param {boolean} condition
     */
    set collisions(condition){this._collisions = condition;}
    
    // GETTERS
    get position() {return this._position;}
    get velocity() {return this._velocity;}
    get radius() {return this._radius;}
    get acceleration() {return this._acceleration;}
    get collisions(){return this._collisions;}
    
  
  
    /* 
    GETTERS FOR COLLISIONS
        -----------------------------------------------
        xposition + _radius is equivalent to looking ahead.
        xposition - _radius is equivalent to looking behind.
        yposition + _radius is equivalent to looking down.
        yposition - _radius is equivalent to looking up.
        this is regardless of the actual direction
    */
    get collided_with_left() { return this.position.x - this.radius <= 0; }
    get collided_with_right() { return this.position.x + this.radius >= width; }
    get collided_with_top() { return this.position.y - this.radius <= 0; }
    get collided_with_bottom() { return this.position.y + this.radius >= height; }
    get sideCollision() { return this.collided_with_left || this.collided_with_right; }
    get topBottomCollision() { return this.collided_with_top || this.collided_with_bottom; }
    get wallCollision() { return this.sideCollision || this.topBottomCollision; }
  
    /**
     * 
     * @param {String} add_color  - How to add color to the particle
     */
    show() {
        this.apply();
        circle(this.position.x, this.position.y, this.radius);
    }
  
    showCoordinates() {
      noStroke();
      fill(255);
      text(`(${nf(int(this.position.x))}, ${nf(int(this.position.y))})`, this.position.x - 25, this.position.y - 15);
  
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);

      // Wrap around edges
      this.position.x = (this.position.x + width) % width;
      this.position.y = (this.position.y + height) % height;
      this.acceleration.mult(0);

      // adds slowmotion effect
    //   this.velocity.limit(.95);

    }
  
    display() {
      this.update();
      this.show();
    }
  
    pseudoForce(force) {
      this.acceleration = createVector(0, 0);
      this.acceleration.add(force);
    }

    realForce(force) {
        // F = ma, so a = F/m
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
      }

    
  
    bounce() {
      // if the ball is off any side of the screen
      // reverse the current speed (turn it around)
      if (this.sideCollision) {
        this.velocity.x *= -1;
  
  
      } else if (this.topBottomCollision) {
        this.velocity.y *= -1;
        // this.position.y = height - this.radius;
  
      }
  
    }

    /**
     * Changes the velocity vector so that the particle turns
     * @param {number} angle the angle to rotate a vector by
     * @param {p5.Vector} vector (optional) the vector to rotate
     */
    turn(angle, vector = null){

        // handles a null vector
        this.velocity = vector === null ? this.velocity : vector;
        return createVector(
            this.velocity.x * cos(angle) - this.velocity.y * sin(angle),
            this.velocity.x * sin(angle) + this.velocity.y * cos(angle)
        );
    }

    move_towards(vector){
        // calculates the distance between the current particle and the destination vector
        let force = p5.Vector.sub(vector, this.position);
        let magnitude = force.mag();

        // Normalizes the forceance vector (forceance between the ball and the mouse).
        // This controls how fast the forceance between the ball and mouse is reduced by.
        // If the original magnitude is used, the ball will basically teleport to the mouse.
        // force.limit((50/magnitude));
        force.limit(magnitude / 1000);
        // force.limit(1);

        // Apply the force to the velocity
        this.pseudoForce(force);
        
        // normalize the velocity vector, which controls the speed
        // let newMag = p5.Vector.setMag(this.velocity, 1)
        this.velocity.limit(1);
    }

    gravitate(attractor){
        // Vector pointing from the particle to the attractor
        let force = p5.Vector.sub(attractor, this.position);
        
        // Calculate distance (magnitude) squared
        let distanceSquared = force.magSq();
        
        // Limit the force to avoid extreme values when distance is very small
        distanceSquared = constrain(distanceSquared, 25, 2500);

        // Calculate the strength of the gravitational force
        let strength = this.G * (this.mass) / distanceSquared;
        
        // Set the magnitude of the force
        force.limit(strength);
        
        // Apply the force
        this.realForce(force);
        // this.velocity.limit(0.05);
        this.velocity.limit(2);
    }

    spiral(attractor){
        let force = p5.Vector.sub(attractor, this.position);
        let distance = force.mag();
        // distance = force.magSq();
        // force.limit((distance/5000));
        force.limit((5));

        
        
        let spiralStrength = 1500;

        // let probability = random(1);
        // let spinDirection = probability > 0.9 ? -HALF_PI : HALF_PI


        
        
        // Spiral force
        let spiralForce = force.copy();
        spiralForce.rotate(HALF_PI); // Rotate 90 degrees
        spiralForce.limit(spiralStrength / (distance)); // Increase spiral as particle gets closer
        
        // Combine forces
        force.add(spiralForce);
        // force.limit(2);
        
        this.realForce(force);
        this.velocity.limit(2);
    }



    
    radial_respawn(position){

        let angle = random(TWO_PI);

        // Calculate the minimum distance from the edge of the screen
        let edgeDistance = min(position.x, position.y, width - position.x, height - position.y);
        
        // determine the spawn radius
        // let spawnradius = max(min_distance, edgeDistance);
        
        // calculate the spawn position
        let spawnPosition = p5.Vector.fromAngle(angle).mult(edgeDistance).add(position);

        // Ensure the spawn position is within the canvas
        // spawnPosition.x = constrain(spawnPos.x, 0, width);
        // spawnPosition.y = constrain(spawnPos.y, 0, height);

        this.position = spawnPosition;
    }

    respawn_outside_circle(position, min_distance){

        let distance = random(min_distance, width);
        let angle = random(TWO_PI);

        // calculate new point coordinates
        let x = position.x + distance * cos(angle);
        let y = position.y + distance * sin(angle);

        let spawnPoint = createVector(x, y);

        this.position = spawnPoint;
    }



}




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