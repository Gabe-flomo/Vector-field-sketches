function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(1);

  // Set the noise level and scale.
  let noiseLevel = 200;
  let noiseScale = 0.002;

  // Iterate from left to right.
  for (let x = 0; x < 400; x += 1) {
    // Scale the input coordinates.
    let nx = noiseScale * x;
    let nt = noiseScale * frameCount;

    // Compute the noise value.
    let y = noiseLevel * noise(nx, nt);

    // Draw the line.
    stroke(100, 0, 50 + (abs(sin(millis() / 1000) ) * 50000 / x));
    // strokeWeight(3);
    noFill();
    line(x, 0, x , y + 250);
    
    // circle(x, y, 10);
  }
}
