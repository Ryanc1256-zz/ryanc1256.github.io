var canvas = null;
var context = null;
var posX = 20;
var posY = 0;


// No longer setting velocites as they will be random
// Set up object to contain particles and set some default values
var particles = {};
var particleIndex = 0;
var settings = {
    density: 0.2,
    particleSize: 5,
    startingX: null,
    startingY: null,
    gravity: 0.1,
    maxLife: 120,
    groundLevel: null,
    leftWall: null,
    rightWall: null
};

// To optimise the previous script, generate some pseudo-random angles
var seedsX = [];
var seedsY = [];
var maxAngles = 100;
var currentAngle = 0;

function particlesInit(){
    // Initialise an empty canvas and place it on the page
    canvas = document.getElementById("stage");
    context = canvas.getContext("2d");
    
    posY = canvas.height / 2;
    
    
    settings.groundLevel = canvas.height;
    settings.leftWall = 0;
    settings.rightWall = canvas.width;
    settings.startingX = ( canvas.width / 2 );
    settings.startingY = ( canvas.height / 4 );
    
    seedAngles();
    
    
    setInterval(function() {
        
        context.clearRect(0,0, canvas.width, canvas.height);
        // Draw the particles
        for (var i = 0; i < settings.density; i++) {
            new Particle();
        }
        
        for (var i in particles) {
            particles[i].draw();
        }
    }, 60);
    
}




     

function seedAngles() {
    seedsX = [];
    seedsY = [];
    for (var i = 0; i < maxAngles; i++) {
        seedsX.push(Math.random() * 20 - 10);
        seedsY.push(Math.random() * 30 - 10);
    }
}


// Set up a function to create multiple particles
function Particle() {
    if (currentAngle !== maxAngles) {
        // Establish starting positions and velocities
        this.x = settings.startingX;
        this.y = settings.startingY;
        
        this.vx = seedsX[currentAngle];
        this.vy = seedsY[currentAngle];
        
        currentAngle++;
        
        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        particleIndex ++;
        particles[particleIndex] = this;
        this.id = particleIndex;
        this.life = 0;
        this.maxLife = settings.maxLife;
    } else {
        console.log('Generating more seed angles');
        currentAngle = 0;
    }
}
 
// Some prototype methods for the particle's "draw" function
Particle.prototype.draw = function() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Give the particle some bounce
    if ((this.y + settings.particleSize) > settings.groundLevel) {
        this.vy *= -0.6;
        this.vx *= 0.75;
        this.y = settings.groundLevel - settings.particleSize;
    }
    
    // Determine whether to bounce the particle off a wall
    if (this.x - (settings.particleSize) <= settings.leftWall) {
        this.vx *= -1;
        this.x = settings.leftWall + (settings.particleSize);
    }
    
        if (this.x + (settings.particleSize) >= settings.rightWall) {
        this.vx *= -1;
        this.x = settings.rightWall - settings.particleSize;
    }
    
    // Adjust for gravity
    this.vy += settings.gravity;
    
    // Age the particle
    this.life++;
    
    // If Particle is old, it goes in the chamber for renewal
    if (this.life >= this.maxLife) {
        delete particles[this.id];
    }
  
    context.beginPath();
    context.fillStyle="#fff";
    // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
    context.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
}
      

      

