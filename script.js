let playButton = document.getElementById('play')
playButton.addEventListener('mousedown', startGame)

let song = new Audio('audio/song.mp3'); 
song.volume = 0.2;
let repairSound = new Audio('audio/repairSound.mp3'); 
repairSound.volume = 0.2;
let starSound = new Audio('audio/starSound.mp3');       // Audio Files
starSound.volume = 0.2;
let nukeSound = new Audio('audio/nukeSound.mp3');
nukeSound.volume = 0.2;

let playerimg = new Image();
playerimg.src = 'images/player.png';   
let asteroidimg = new Image();
asteroidimg.src = 'images/asteroid.png';
let repairimg = new Image();                     // Image files
repairimg.src = 'images/repair.png';
let starimg = new Image();
starimg.src = 'images/star.png';
let nukeimg = new Image();            
nukeimg.src = 'images/nuke.png';
console.log("abc")
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let health = 100;   // Health
let score = -30;    // Scoure count
let scoreMultiplier = 1;  // Star Powerup
let reset = setTimeout(resetMultiplier, 5000);  // Reset score multiplier 5 seconds after picking up a star
let playerPositionX = 250; // Player X position
let asteroids = new Array(6);   // Asteroids X/Y positions and Y speed 
let repair = {x: 0, y: -500}; // repair X/Y positions
let star = {x: 0, y: -500}; // star X/Y positions
let nuke = {x: 0, y: -500}; // nuke X/Y positions
let spawnPowerupCheck = 0;  // Randomly spawns powerups
let powerupSpeed = 3;       // powerups Y speed

function asteroid(x, y, yspeed){
    this.x = x;
    this.y = y;                     // Asteroid Constructor
    this.yspeed = yspeed
}

function startGame(){
    playButton.parentNode.removeChild(playButton);  // Remove the play button
    const warning = document.getElementById("warning");
    warning.parentNode.removeChild(warning);
    canvas.width = 600; // Re-sizing the canvas
    canvas.height = 400;
    song.play();    // Start playing background song

    setInterval(updateScore, 500); // Start updating score
    setInterval(draw, 15);
    setInterval(checkHit, 50);
    setInterval(updatePosition, 1000);
    for (let i = 0; i < 6; i++){     // Starting the asteroids positions
        asteroids[i] = new asteroid(Math.floor(Math.random() * 11) * 50, -1000, Math.floor(Math.random() * 6 + 3)) // Start Asteroid Position and Speed
    }
}

document.onkeydown = function(e){
    switch (e.keyCode){
        case 37:
            if (playerPositionX >= 0) {   
                ctx.fillRect(playerPositionX + 24, canvas.height - 100, 100 - 48, 75);    // Move left
                playerPositionX -= 25
            }
            break;
        case 39:
            if (playerPositionX < canvas.width - 75) { 
                ctx.fillRect(playerPositionX + 24, canvas.height - 100, 100 - 48, 75);    // Move right
                playerPositionX += 25
            }
            break;
    }
};

function draw(){
    ctx.fillStyle = "black";        // Draw Background
    ctx.fillRect(0, 0, canvas.width, canvas.height);            

    ctx.drawImage(playerimg, playerPositionX, canvas.height - 100);      // Draw Player

    for (let i = 0; i < 6; i++){
        ctx.fillRect(asteroids[i].x + 2, asteroids[i].y, 50 - 5, 50);
        ctx.drawImage(asteroidimg, asteroids[i].x, asteroids[i].y);  // Draw Asteroid
        asteroids[i].y += asteroids[i].yspeed;
    }

    switch (spawnPowerupCheck){
        case 1:
            ctx.fillRect(repair.x, repair.y, 50, 50);                     // Draw repair powerup
            ctx.drawImage(repairimg, repair.x, repair.y);
            repair.y += powerupSpeed;
            break;

        case 2:
            ctx.fillRect(star.x, star.y, 50, 50);                         // Draw star powerup
            ctx.drawImage(starimg, star.x, star.y);
            star.y += powerupSpeed;
            break;

        case 3:
            ctx.fillRect(nuke.x, nuke.y, 50, 50);                         // Draw star powerup
            ctx.drawImage(nukeimg, nuke.x, nuke.y);
            nuke.y += powerupSpeed;                
            break;

        default:
            spawnPowerupCheck = Math.round(Math.random() * 500);        // Generates powerups
            repair.x = Math.floor(Math.random() * 11) * 50;
            star.x = Math.floor(Math.random() * 11) * 50;
            nuke.x = Math.floor(Math.random() * 11) * 50;
            break;
    }
}

function updatePosition(){
    for (let i = 0; i < 6; i++){
        if (asteroids[i].y > 400){
            asteroids[i].y = -500;
            asteroids[i].x = Math.floor(Math.random() * 11) * 50;   // Update Asteroid Position and Speed when it gets out of the screen
            asteroids[i].yspeed = Math.floor(Math.random() * 5 + 3);
        }                                     
    }

    if (repair.y > 400 || star.y > 400 || nuke.y > 400){
        spawnPowerupCheck = Math.round(Math.random() * 10);         // resets powerup Y position when it gets out of the screen
        repair.y = -500;
        star.y = -500;
        nuke.y = -500;
    }
}

function checkHit(){                                             // Check if player is alive and hits an asteroid or collects a powerup

    document.getElementById("health").innerHTML = health;     // Updates health
    if (health <= 0) {                                         // Game over when health is 0
        song.pause();
        repairSound.pause();
        starSound.pause();
        location.reload();
        alert('Game over');                                 
    }
        
    for (let i = 0; i < asteroids.length; i++){
        if (asteroids[i].x + 25 > playerPositionX && asteroids[i].x + 25 < playerPositionX + 100 && asteroids[i].y > 255 && asteroids[i].y < 350){      // Check if player hits asteroid
            flashRed();
            ctx.fillRect(asteroids[i].x + 2, asteroids[i].y, 50 - 5, 50);
            asteroids[i].y = -50;
            asteroids[i].x = Math.floor(Math.random() * 11) * 50;
            health -= 50;
        }
    }

    if (repair.x + 25 > playerPositionX && repair.x + 25 < playerPositionX + 100 && repair.y > 255 && repair.y < 350){
        repairSound.play();
        health = 100;
        ctx.fillRect(repair.x, repair.y, 50, 50);
        repair.y = 401;
    }
    if (star.x + 25 > playerPositionX && star.x + 25 < playerPositionX + 100 && star.y > 255 && star.y < 350){
        starSound.play();
        clearTimeout(reset);
        scoreMultiplier *= 3;
        ctx.fillRect(star.x, star.y, 50, 50);
        star.y = 401;
        reset = setTimeout(resetMultiplier, 5000);
    }
    if (nuke.x + 25 > playerPositionX && nuke.x + 25 < playerPositionX + 100 && nuke.y > 255 && nuke.y < 350){
        nukeSound.play();
        for (let i = 0; i < 6; i++){
            asteroids[i].y = 401;
        }
        ctx.fillRect(nuke.x, nuke.y, 50, 50);
        nuke.y = 401;
        }
    }

function flashRed(){
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height)     // Flash screen when get hit
}

function updateScore(){
    if (health > 0) {
        score += 10 * scoreMultiplier;
        if (score > 0){
            document.getElementById("score").innerHTML = score;        // Updates score
        }
    }
}

function resetMultiplier(){        // Resets score multiplier to 1 after 5 seconds after picking up the star
    scoreMultiplier = 1;
}
