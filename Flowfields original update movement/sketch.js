
const noise_scale = 0.01;
let zaxis = 0;
function setup() {
  createCanvas(800, 500);
  colorMode(RGB, 1);

  // col = new Coloring();


  particleCount = 10000;
  particles = [];
  for (let i = 0; i < particleCount; i++){
    let random_width = random(width);
    let random_height = random(height);
    let initial_position = createVector(random_width, random_height);
    particles.push(new Particle(position = initial_position));
    // particles[i].radius = random(8);
    particles[i].collisions = false;
    // particles[i].velocity = createVector(20, 2);


  }


  // particle.velocity = createVector(-10, 1);
  // angleMode(DEGREES);

  // timeDisplay = createP('Waiting for time');
  output = createP('Waiting for output');
  velDisplay = createP('Waiting for velDisplay');

  // background(0);
}



function draw() {
  // background(0);
  background(0, .1);
  
  stroke(255);
  noStroke();
  fill(0);

  let time = millis() / 1000;
  
  let mouse = createVector(mouseX, mouseY);
  for (let i = 0; i < particleCount; i++){
    if (mouseIsPressed){
      
      // col.apply();
      // moves towards the center
      // particles[i].move_towards(createVector(width / 2,height / 2));
    
      // particles[i].move_towards(createVector(width / 2,height / 2));
      particles[i].gravitate(mouse);
      let dist_to_mouse = p5.Vector.dist(particles[i].position, mouse);
      let min_distance = 1;
      let at_mouse = dist_to_mouse < min_distance;
      // particles[i].radius =  log(10 / dist_to_mouse);

      if (at_mouse){
        
        // particles[i].position = new_position();
        particles[i].respawn_outside_circle(mouse, min_distance);
        // particles[i].radial_respawn(mouse);
        
        // particles[i].move_towards(createVector(mouseX, mouseY));

      }

      // creates a noise gradient in 3 dimensions
      let noiseX = particles[i].position.x;
      let noiseY = particles[i].position.y;
      let n = noise(noiseX * noise_scale, noiseY * noise_scale, zaxis);

      // converts noise values to an angle
      let a = TAU * n;
      // add a color and render to the screen
      particles[i].color(  a, 9);
      // particles[i].color(i, 9);
      fill(0);
      particles[i].display();

    } else{

    

    // draws a new particle if it leaves the screen
    if (!onScreen(particles[i].position)){
      particles[i].position = new_position();
      // particles[i].update();
      
    }

    

    // creates a noise gradient in 3 dimensions
    let noiseX = particles[i].position.x;
    let noiseY = particles[i].position.y;
    let n = noise(noiseX * noise_scale, noiseY * noise_scale, zaxis);

    // converts noise values to an angle
    let a = TAU * n;

    // move the particle based on the angle
    particles[i].position.x += cos(a) * 1;
    particles[i].position.y += sin(a) * 1;

    // add a color and render to the screen
    particles[i].color(  a, 9);
    // particles[i].color(i, 9);
    fill(0);
    particles[i].show();
    

  }
}
  zaxis += 0.005

  output.html(out(particleCount, 'number of particles'));
  velDisplay.html(floor(frameRate()));
}


function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function onScreen(vector){
  return vector.x >= 0 && vector.x <= width && vector.y >= 0 && vector.y <= height;
}

function new_position(){
    let random_width = random(width);
    let random_height = random(height);
    let position = createVector(random_width, random_height);
    return position;
}