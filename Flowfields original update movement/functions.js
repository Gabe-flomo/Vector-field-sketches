function exp2d(vector){
    return createVector(exp(vector.x), exp(vector.x));
}

function vector_cosine(vector){
    return createVector(cos(vector.x), cos(vector.y), cos(vector.z));
}

/**
    * A brownish-blue hue 
    * @param {number} t
    * @return {p5.Vector}
*/
function palette1 (t) {
    let a = createVector(0.5, 0.5, 0.5);
    let b = createVector(0.1, 0.4, 0.5);
    let c = createVector(1.0, 1.0, 1.0);
    let d = createVector (0.00, 0.10, 0.20);

    return color_transformation(t, a, b, c, d);
}

/**
    * A black and white hue 
    * @param {number} t
    * @return {p5.Vector}
*/
function palette2 (t) {
    let a = createVector(0.5, 0.5, 0.5);
    let b = createVector(0.5, 0.5, 0.5);
    let c = createVector(1.0, 1.0, 1.0);
    let d = createVector (0.00, 0.33, 0.67);

    return color_transformation(t, a, b, c, d);
}

/**
    * A pinkish yellow hue (strawberry lemonade)
    * @param {number} t
    * @return {p5.Vector}
*/
function palette3 (t) {
    let a = createVector(0.5, 0.2, 0.5);
    let b = createVector(0.5, 0.5, 0.3);
    let c = createVector(.0, .20, .9);
    let d = createVector (0.30, 0.20, 0.20);

    return color_transformation(t, a, b, c, d);
}

/**
    * A pink blueish orange hue (tinted sunset)
    * @param {number} t
    * @return {p5.Vector}
*/
function palette4 (t) {
    let a = createVector(0.5, 0., 0.5);
    let b = createVector(0.6, 0.5, 0.1);
    let c = createVector(1.0, 1.0, 0.5);
    let d = createVector (0.85, 0.20, 0.30);

    return color_transformation(t, a, b, c, d);
}

/**
    * A pinkish turquoise hue (sea sherbert)
    * @param {number} t
    * @return {p5.Vector}
*/
function palette5 (t) {
    let a = createVector(0.5, 0.5, 0.5);
    let b = createVector(0.4431, 0.1235, 0.004235);
    let c = createVector(1.0, 0.7, 0.4);
    let d = createVector (.00, .15, 0.20);

    return color_transformation(t, a, b, c, d);
}

/**
    * A pink blue and white hue (popsicle)
    * @param {number} t
    * @return {p5.Vector}
*/
function palette6 (t) {
    let a = createVector(0.5, 0.5, 0.5);
    let b = createVector(0.4431, 0.4235, 0.4235);
    let c = createVector(2.0, 1.0, 0.0);
    let d = createVector (0.50, 0.20, 0.25);

    return color_transformation(t, a, b, c, d);
}

function palette7 (t) {
    let a = createVector(0.2, 0.3, 0.5);
    let b = createVector(0.3, 0.165, 0.254);
    let c = createVector(.2, .50, 1.0);
    let d = createVector (.500, 0.5, 0.5);

    return color_transformation(t, a, b, c, d);
}

function palette8 (t) {
    let a = createVector(0.721, 0.28, 0.542);
    let b = createVector(0.659, 0.181, 0.396);
    let c = createVector(0.612, 0.140, 0.196);
    let d = createVector (0.538, 0.78, 0.7);

    return color_transformation(t, a, b, c, d);
}

function palette9 (t) {
    let a = createVector(0.412, 0.102, 0.491);
    let b = createVector(0.397, 0.130, 0.485);
    let c = createVector(0.612, 0.140, 0.196);
    let d = createVector (0.538, 0.978, 0.7);

    return color_transformation(t, a, b, c, d);
}

function palette10 (t) {
    let a = createVector(0.7, .8, 0.5);
    let b = createVector(0.3, 0.30, 0.8);
    let c = createVector(.147, .557, .197);
    let d = createVector (.956, .39, 1.541);

    return color_transformation(t, a, b, c, d);
}

/**
 * 
 * @param {string} str - given a string matrix such as `'[[1 2 3] [4 5 6]]'` the function will return `[[1, 2, 3], [4, 5, 6]]`
 * @returns {Array}
 */
function convertStringToList(str) {
    // Remove the outer brackets and split the string into sub-strings
    let subStrings = str.substring(2, str.length - 2).split('] [');

    // Map each sub-string to an array of numbers
    let nestedList = subStrings.map(subStr => 
        subStr.split(' ').map(Number)
    );

    return nestedList;
}

/**
 * 
 * @param {string} str - a matrix of coefficients with a pattern like `[[1 2 3] [4 5 6]]`. Get palettes from http://dev.thi.ng/gradients/
 * @returns 
 */
function isCoefficientLike(str) {
    // Regular expression to match the pattern
    // It checks for an opening bracket, followed by one or more groups of digits separated by spaces, and then a closing bracket.
    // The pattern can repeat one or more times.
    const pattern = /^\[\[(-?\d+(\.\d+)?(\s+-?\d+(\.\d+)?)*)\](\s+\[(-?\d+(\.\d+)?(\s+-?\d+(\.\d+)?)*)\])*\]$/;

    return pattern.test(str);
}

/**
 * 
 * @param {string} coefficients 
 * @param {number} t
 * @returns {p5.Vector}
 * 
 * this function will take in some angle t and a nested list of coefficients
 * and will return a color from that palette based on the value of t
 */
function color_from_coefficients(t, coefficients){

    // ensures the string is a valid list of coefficients
    if (!isCoefficientLike(coefficients)){
        throw new Error(`The string ${coefficients} does not match the pattern [[1 2 3] [4 5 6]]`)
    }

    coefficients = convertStringToList(coefficients);

    let vA = createVector(coefficients[0][0], coefficients[0][1], coefficients[0][2]);
    let vB = createVector(coefficients[1][0], coefficients[1][1], coefficients[1][2]);
    let vC = createVector(coefficients[2][0], coefficients[2][1], coefficients[2][2]);
    let vD = createVector(coefficients[3][0], coefficients[3][1], coefficients[3][2]);

    let color_selection = color_transformation(t, vA, vB, vC, vD);
    return color_selection;
}

/**
 * Turns an angle and a series of 4 vectors into a color palette using the formula `a + b*cos(6.28318*(c*t+d));`
 * @param {number} t - the angle
 * @param {p5.Vector} a - DC offset for each color channel
 * @param {p5.Vector} b - Amplitude for each color channel
 * @param {p5.Vector} c - Frequency of each color channel
 * @param {p5.Vector} d - Phase of each color channel
 * @returns {p5.Vector}
 */
function color_transformation(t, a, b, c, d){
    c.mult(t).add(d).mult(6.28318);
    return b.mult(vector_cosine(c)).add(a);
}

function vectorDimension(v) {
    if (v instanceof p5.Vector) {
      return v.z === undefined ? 2 : 3;
    } else {
      return ('The provided object is not a p5.Vector');
    }
  }

function vectorString(vector, rounding = 2, dim = 2) {
    if (dim == 2){
        return `(${round(vector.x, rounding)}, ${round(vector.y, rounding)})`;
    } else if (dim == 3){
        return `(${round(vector.x, rounding)}, ${round(vector.y, rounding)}, ${round(vector.z, rounding)})`;
    } else {
        return `Cannot print a vector with ${dim} dimensions`;
    }
  
  }

function out(variable, text = ''){

    if (variable instanceof p5.Vector){
        variable = vectorString(variable);
    }

    return `${text} ${variable}`;
}

function turn(vector, angle) {
    print('rotating');
    return createVector(
            vector.x * cos(angle) - vector.y * sin(angle),
            vector.x * sin(angle) + vector.y * cos(angle)
    );
}


function trigger(lower = 5, upper = 120){
    // chooses a random number between the upper and lower bounds.
    // if the number is a multiple of the current frame count, return true.
    return (frameCount % upper != 0);
  }