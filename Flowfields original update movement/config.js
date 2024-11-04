
// RECTANGULAR BOUNDARIES
width = 800;
height = 500;

// Full screen boundary
const fullScreen = new SpawnBoundary('rect', {
    x: 0,
    y: 0,
    w: width,
    h: height
});

// Top half of screen
const topHalf = new SpawnBoundary('rect', {
    x: 0,
    y: 0,
    w: width,
    h: height/2
});

// Bottom half of screen
const bottomHalf = new SpawnBoundary('rect', {
    x: 0,
    y: height/2,
    w: width,
    h: height/2
});

// Left half of screen
const leftHalf = new SpawnBoundary('rect', {
    x: 0,
    y: 0,
    w: width/2,
    h: height
});

// Screen with margins
const marginScreen = new SpawnBoundary('rect', {
    x: 50,          // 50px margin from left
    y: 50,          // 50px margin from top
    w: width - 100, // 50px margin on each side
    h: height - 100 // 50px margin top and bottom
});

// Player movement area
const playerBounds = new SpawnBoundary('rect', {
    x: 100,
    y: 100,
    w: width - 200,
    h: height - 200
});

// Enemy spawn zone (top of screen)
const enemySpawnZone = new SpawnBoundary('rect', {
    x: 0,
    y: 0,
    w: width,
    h: 100
});

// Power-up spawn area (center of screen)
const powerupZone = new SpawnBoundary('rect', {
    x: width/4,
    y: height/4,
    w: width/2,
    h: height/2
});

// CIRCULAR BOUNDARIES

// Large center circle
const centerCircle = new SpawnBoundary('circle', {
    x: width/2,
    y: height/2,
    radius: 200
});

// Small gameplay area
const innerCircle = new SpawnBoundary('circle', {
    x: width/2,
    y: height/2,
    radius: 100
});

// Massive arena
const arenaCircle = new SpawnBoundary('circle', {
    x: width/2,
    y: height/2,
    radius: Math.min(width, height) / 2  // Fits screen
});

// Top-left corner spawn
const cornerSpawn = new SpawnBoundary('circle', {
    x: 0,
    y: 0,
    radius: 50
});

// Bottom-right power-up spawn
const powerupSpawn = new SpawnBoundary('circle', {
    x: width,
    y: height,
    radius: 75
});