/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor() {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2; // Centered starting position
        this.positionY = 0; // Starting position at the bottom
        this.speedY = 0; // Initial vertical speed (for jump/fall)
        this.gravity = -0.5; // Simulating gravity
        this.jumpPower = 8; // Initial jump speed
        this.playerElement = null;

        this.createPlayer();
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
        this.speedY = this.jumpPower; // Set the initial speed for the jump

        // Start the animation loop
        this.animate();
    }

    animate() {
        this.speedY += this.gravity; // Apply gravity to speed
        this.positionY += this.speedY; // Update the player's position

        // Update the player's position in the DOM
        this.playerElement.style.bottom = this.positionY + "vh";

        // Stop when player is not visible anymore
        if (this.positionY > -this.height) { 
            setTimeout(() => this.animate(), 20);
        }
    }
}

const newPlayer = new Player();

// ADDING EVENT LISTENERS: Let player jump when user clicks on the spacebar
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        newPlayer.jump();
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