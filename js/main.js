/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor() {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2; // Centered starting position
        this.positionY = 0; // Starting position at the bottom
        this.speedY = 8; // Initial jump speed
        this.gravity = -0.5; // Simulating gravity
        this.playerElement = null;

        this.createPlayer();
        this.jump(); // Correctly call jump() in the constructor
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

        // Behavior before the game starts: Player bounces back when hitting the bottom
        if (this.positionY <= 0) {
            this.positionY = 0; // Reset to ground level
            this.speedY = 8; // Reset jump speed
            setTimeout(() => this.jump(), 200); // Slight delay before jumping again
        } else {
            // Continue jumping while the player is above ground
            setTimeout(() => this.jump(), 10); // Recursive call to keep animating the jump
        }
    }

    moveRight() {
        if(this.positionX < 100 - this.width) {
            this.positionX +=5; 
            this.playerElement.style.left = this.positionX + "vw";
            console.log("moving right");
        }
    }
    
    moveLeft() {
        if(this.positionX > this.width) {
            this.positionX -= 5; 
            this.playerElement.style.left = this.positionX + "vw";
            console.log("moving left");
        }
    }
}

const newPlayer = new Player();

// ADDING EVENT LISTENERS: Let player move/jump left and right

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        newPlayer.moveRight();
    }
    else if (event.code === "ArrowLeft") {
        newPlayer.moveLeft();
    }
});


/***************************************************/
/******************* PLATFORM **********************/
/***************************************************/

class Platform {
    constructor() {
        this.height = 3;
        this.width = 15;
        this.positionX = 0;
        this.positionY = 100 - this.height;
        this.platformElement = null;

        this.createPlatformElement();
    }
    
    createPlatformElement() {
        this.platformElement = document.createElement("div");

        this.platformElement.className = "platform"; // add class

        this.platformElement.style.height = this.height + "vh";
        this.platformElement.style.width = this.width + "vw";
        this.platformElement.style.left = this.positionX + "vw";
        this.platformElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");
        board.appendChild(this.platformElement); // append to board
    }
}

const platform1 = new Platform();
platform1.createPlatformElement();
