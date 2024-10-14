/***************************************************/
/******************* PLATFORM **********************/
/***************************************************/

class Platform {
    constructor(positionY) {
        this.height = 3;
        this.width = 15;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.positionY = positionY;
        this.platformElement = null;

        this.createPlatformElement();
        this.movePlatformDown();
    }

    createPlatformElement() {
        this.platformElement = document.createElement("div");

        this.platformElement.className = "platform"; // add class because there are several

        this.platformElement.style.height = this.height + "vh";
        this.platformElement.style.width = this.width + "vw";
        this.platformElement.style.left = this.positionX + "vw";
        this.platformElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");
        board.appendChild(this.platformElement); // append to board
    }

    movePlatformDown() {
        let fallInterval = setInterval(() => {
            this.positionY -= 0.1;
            this.platformElement.style.bottom = this.positionY + "vh";

            // Check if platform has moved out of view
            if (this.positionY <= -this.height) {
                // Reposition the platform to the top with a random X position
                this.positionY = 100; // Move it back to the top
                this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
                this.platformElement.style.left = this.positionX + "vw";
            }
        }, 10);
    }
}

// create new platforms and add them to the array 
const platformsArr = []; // to store instances of the class object

function createPlatforms(count) {
    for (let i = 0; i < count; i++) {
        this.positionY = 10 + i * (100 / count); // platforms should be equally distributed, but now below 10vh
        const newPlatform = new Platform(positionY); // passing the vertical position as an argument
        platformsArr.push(newPlatform); // pushing the platform instance to the platformsArr
    }
}

let platformCount = 5; // define how many platforms should be shown
createPlatforms(platformCount);

/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor() {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2; // Centered starting position
        this.positionY = 0; // Starting position at the bottom
        this.speedY = 7; // Initial jump speed
        this.gravity = -0.5; // Simulating gravity
        this.playerElement = null;

        this.createPlayer();
        this.jump(); // Correctly call jump() in the constructor
        this.jumpOnPlatform();
    }

    createPlayer() {
        this.playerElement = document.createElement("div");

        this.playerElement.id = "player"; // Add ID

        this.playerElement.style.height = this.height + "vh";
        this.playerElement.style.width = this.width + "vw";
        this.playerElement.style.left = this.positionX + "vw";
        this.playerElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");
        board.appendChild(this.playerElement); // Append to board
    }

    jump() {
        this.speedY += this.gravity; // Apply gravity to speed
        this.positionY += this.speedY; // Update the player's position

        // Update the player's position in the DOM
        this.playerElement.style.bottom = this.positionY + "vh";

        // checking if there's a platform to jump on
        this.jumpOnPlatform()

        // Behavior before the game starts: Player bounces back when hitting the bottom
        if (this.positionY <= 0) {
            this.positionY = 0; // Reset to ground level
            this.speedY = 8; // Reset jump speed
            setTimeout(() => this.jump(), 200); // Slight delay before jumping again
        } else {
            // Continue jumping while the player is above ground
            setTimeout(() => this.jump(), 20);
        }
    }

    jumpOnPlatform() { // detect collision
        platformsArr.forEach((platformInstance) => {
            if (
                this.positionX < platformInstance.positionX + platformInstance.width && // Player's left side is left of platform's right side
                this.positionX + this.width > platformInstance.positionX && // Player's right side is right of platform's left side
                this.positionY >= platformInstance.positionY && // Player is at or slightly above the platform
                this.positionY <= platformInstance.positionY + platformInstance.height // Player is within the platform's height range
            ) {
                console.log("should jump again");
                this.speedY = 8; // reset jump speed
            }
        });
    }
    
    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX += 2;
            this.playerElement.style.left = this.positionX + "vw";
        }
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 2;
            this.playerElement.style.left = this.positionX + "vw";
        }
    }
}

const newPlayer = new Player();

// ADDING EVENT LISTENERS: Let player move/jump left and right

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {

        // move right on keydown
        moveInterval = setInterval(() => {
            newPlayer.moveRight();
        }, 10);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {

        // move left on keydown
        moveInterval = setInterval(() => {
            newPlayer.moveLeft();
        }, 10);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") {

        // stop moving right when releasing the key
        clearInterval(moveInterval)
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {

        // stop moving left when releasing the key
        clearInterval(moveInterval)
    }
});


