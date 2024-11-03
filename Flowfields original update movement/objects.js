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
    color(angle, palette = 1){

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

/**
 * SpawnBoundary class defines regions where particles can spawn and collide.
 * Supports multiple boundary types (rectangle, circle, grid, cell) and provides
 * collision detection functionality for particle interactions.
 * 
 * @example
 * // Create a rectangular boundary with collision support
 * const boundary = new SpawnBoundary('rect', {
 *     x: 100, y: 100, w: 400, h: 300
 * });
 * 
 * // Create a particle that respects this boundary
 * const particle = new Particle(null, boundary);
 */
class SpawnBoundary {
    /**
     * Creates a spawn boundary with specified type and parameters
     * 
     * @param {('rect'|'circle'|'grid'|'cell')} type - Type of boundary to create
     * @param {Object} params - Configuration parameters
     * @param {number} [params.x] - X coordinate for rect/circle center
     * @param {number} [params.y] - Y coordinate for rect/circle center
     * @param {number} [params.w] - Width for rectangular boundary
     * @param {number} [params.h] - Height for rectangular boundary
     * @param {number} [params.radius] - Radius for circular boundary
     * @param {number} [params.rows] - Number of rows for grid boundary
     * @param {number} [params.cols] - Number of columns for grid boundary
     * @param {number} [params.cellSize] - Size of each cell for grid/cell boundary
     * @param {number} [params.row] - Specific row for cell boundary
     * @param {number} [params.col] - Specific column for cell boundary
     * @param {number} [params.xOffset] - X offset for grid/cell positioning
     * @param {number} [params.yOffset] - Y offset for grid/cell positioning
     */
    constructor(type, params = {}) {
        this.type = type;
        this.params = params;
        
        // Initialize boundary parameters based on type
        switch(type) {
            case 'rect':
                // Rectangular boundary with optional position and size
                this.params = {
                    x: params.x || 0,
                    y: params.y || 0,
                    w: params.w || width,
                    h: params.h || height
                };
                break;

            case 'circle':
                // Circular boundary with optional center and radius
                this.params = {
                    x: params.x || width/2,
                    y: params.y || height/2,
                    radius: params.radius || 100
                };
                break;

            case 'grid':
                // Grid boundary for multiple cell regions
                this.params = {
                    rows: params.rows || 1,
                    cols: params.cols || 1,
                    cellSize: params.cellSize || 50,
                    xOffset: params.xOffset || 0,
                    yOffset: params.yOffset || 0
                };
                break;

            case 'cell':
                // Single cell boundary within a grid
                this.params = {
                    row: params.row || 0,
                    col: params.col || 0,
                    cellSize: params.cellSize || 50,
                    xOffset: params.xOffset || 0,
                    yOffset: params.yOffset || 0
                };
                break;
        }
    }

    /**
     * Retrieves the boundary edges for collision detection.
     * Converts different boundary types into a rectangular collision box.
     * 
     * @returns {Object} Boundary edges with properties:
     *   - left: Left edge x-coordinate
     *   - right: Right edge x-coordinate
     *   - top: Top edge y-coordinate
     *   - bottom: Bottom edge y-coordinate
     */
    getBoundaryEdges() {
        switch(this.type) {
            case 'rect':
                // Direct edge calculation for rectangular boundaries
                return {
                    left: this.params.x,
                    right: this.params.x + this.params.w,
                    top: this.params.y,
                    bottom: this.params.y + this.params.h
                };
            
            case 'grid':
                // Calculate edges for entire grid
                return {
                    left: this.params.xOffset,
                    right: this.params.xOffset + (this.params.cols * this.params.cellSize),
                    top: this.params.yOffset,
                    bottom: this.params.yOffset + (this.params.rows * this.params.cellSize)
                };
            
            case 'cell':
                // Calculate edges for specific cell
                return {
                    left: this.params.xOffset + (this.params.col * this.params.cellSize),
                    right: this.params.xOffset + ((this.params.col + 1) * this.params.cellSize),
                    top: this.params.yOffset + (this.params.row * this.params.cellSize),
                    bottom: this.params.yOffset + ((this.params.row + 1) * this.params.cellSize)
                };
            
            case 'circle':
                // Use bounding box of circle for edge detection
                return {
                    left: this.params.x - this.params.radius,
                    right: this.params.x + this.params.radius,
                    top: this.params.y - this.params.radius,
                    bottom: this.params.y + this.params.radius
                };
        }
    }

    // ... (keep existing spawn methods from previous implementation)
    /**
     * Generates a random position within the boundary constraints.
     * Uses different algorithms depending on boundary type.
     * 
     * @returns {p5.Vector} A valid spawn position within the boundary
     */
    getRandomPosition() {
        switch(this.type) {
            case 'rect':
                // Simple random position within rectangle
                return createVector(
                    random(this.params.x, this.params.x + this.params.w),
                    random(this.params.y, this.params.y + this.params.h)
                );
            
            case 'circle': {
                // Use sqrt for uniform distribution within circle
                const angle = random(TWO_PI);
                const r = sqrt(random(1)) * this.params.radius;
                return createVector(
                    this.params.x + r * cos(angle),
                    this.params.y + r * sin(angle)
                );
            }
            
            case 'grid': {
                // Pick random cell in grid
                const randomCell = {
                    row: floor(random(this.params.rows)),
                    col: floor(random(this.params.cols))
                };
                return this.getCellPosition(randomCell.row, randomCell.col);
            }
            
            case 'cell':
                // Get position within specific cell
                return this.getCellPosition(this.params.row, this.params.col);
        }
    }

    /**
     * Calculates a random position within a specific grid cell.
     * Used by both grid and cell boundary types.
     * 
     * @param {number} row - Grid row index
     * @param {number} col - Grid column index
     * @returns {p5.Vector} Random position within the specified cell
     */
    getCellPosition(row, col) {
        // Calculate cell position with offset and random position within cell
        const x = this.params.xOffset + (col * this.params.cellSize) + random(this.params.cellSize);
        const y = this.params.yOffset + (row * this.params.cellSize) + random(this.params.cellSize);
        return createVector(x, y);
    }

    /**
     * Checks if a given position is within the boundary constraints.
     * 
     * @param {p5.Vector} position - Position to check
     * @returns {boolean} True if position is within boundary, false otherwise
     */
    contains(position) {
        switch(this.type) {
            case 'rect':
                // Check if point is within rectangle bounds
                return position.x >= this.params.x && 
                       position.x <= this.params.x + this.params.w &&
                       position.y >= this.params.y && 
                       position.y <= this.params.y + this.params.h;
            
            case 'circle': {
                // Check if point is within circle radius
                const distance = dist(
                    position.x, position.y,
                    this.params.x, this.params.y
                );
                return distance <= this.params.radius;
            }
            
            case 'grid': {
                // Check if point is within any valid grid cell
                const row = floor((position.y - this.params.yOffset) / this.params.cellSize);
                const col = floor((position.x - this.params.xOffset) / this.params.cellSize);
                return row >= 0 && row < this.params.rows &&
                       col >= 0 && col < this.params.cols;
            }
            
            case 'cell': {
                // Check if point is within specific cell
                const cellX = this.params.xOffset + (this.params.col * this.params.cellSize);
                const cellY = this.params.yOffset + (this.params.row * this.params.cellSize);
                return position.x >= cellX && 
                       position.x <= cellX + this.params.cellSize &&
                       position.y >= cellY && 
                       position.y <= cellY + this.params.cellSize;
            }
        }
    }
}




class Particle extends Coloring{

    constructor(position) {
        
      super();
      // create a vector at the center of the screen, if no position is given
      this._position = position == null ? createVector(this.widthBound / 2, height / 2) : position;
  
      // gives the object a random, normalized speed with a maximum magnitude of 5, if no velocity is given
      this._velocity = p5.Vector.random2D().normalize();
  
      // sets the initial acceleration
      this._acceleration = createVector(0, 0);
  
      // properties
      this._radius = random(1, 8);
      this.mass = random(1, 1000);

      this.G = 50.1;

      this._collisions = true;

      this.widthBound = width - 100;
      this.heightBound = null;

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
    get collided_with_right() { return this.position.x + this.radius >= this.widthBound; }
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
      this.position.x = (this.position.x + this.widthBound) % this.widthBound;
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
        let edgeDistance = min(position.x, position.y, this.widthBound - position.x, height - position.y);
        
        // determine the spawn radius
        // let spawnradius = max(min_distance, edgeDistance);
        
        // calculate the spawn position
        let spawnPosition = p5.Vector.fromAngle(angle).mult(edgeDistance).add(position);

        // Ensure the spawn position is within the canvas
        // spawnPosition.x = constrain(spawnPos.x, 0, this.widthBound);
        // spawnPosition.y = constrain(spawnPos.y, 0, height);

        this.position = spawnPosition;
    }

    respawn_outside_circle(position, min_distance){

        let distance = random(min_distance, this.widthBound);
        let angle = random(TWO_PI);

        // calculate new point coordinates
        let x = position.x + distance * cos(angle);
        let y = position.y + distance * sin(angle);

        let spawnPoint = createVector(x, y);

        this.position = spawnPoint;
    }



}


