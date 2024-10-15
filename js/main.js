let score = 0;

/***************************************************/
/******************** GAME *************************/
/***************************************************/

class Game {
    constructor() {
        this.isGameOver = false;
    }

    gameOver() {
        this.isGameOver = true; // Set game over state
        clearInterval(newPlayer.fallId); // Stop player fall
        // Stop platform movement
        console.log("Game over! Score: " + score);
        // restart logic
    }
}

const newGame = new Game(); 

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
        this.platformElement.className = "platform"; // add class
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
                this.positionY = 100;
                this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
                this.platformElement.style.left = this.positionX + "vw";
                score++; // increase score
            } else if (newGame.isGameOver) {
                clearInterval(fallInterval)
            }
        }, 10);
    }
}

// Create platforms
const platformsArr = [];
function createPlatforms(count) {
    for (let i = 0; i < count; i++) {
        let positionY = 10 + i * (100 / count); // distribute platforms
        const newPlatform = new Platform(positionY);
        platformsArr.push(newPlatform);
    }
}

let platformCount = 5;
createPlatforms(platformCount);

/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor() {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2; // Centered starting position
        this.startPoint = 100; // let player fall from the top in the beginning
        this.jumpHeight = 40;
        this.positionY = this.startPoint; // Starting position
        this.jumpSpeed = 0.6;
        this.fallSpeed = 0.3;
        this.jumping = false;
        this.falling = false;

        this.createPlayer();
        this.jump(); // Start with a jump
    }

    createPlayer() {
        this.playerElement = document.createElement("div");
        this.playerElement.id = "player"; // Add ID
        this.playerElement.style.height = this.height + "vh";
        this.playerElement.style.width = this.width + "vw";
        this.playerElement.style.left = this.positionX + "vw";
        this.playerElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");
        board.appendChild(this.playerElement); // append to board
    }

    jump() {
        clearInterval(this.fallId); // Stop falling
        this.jumping = true;
        this.falling = false;
        this.jumpSpeed = 0.6; // reset

        this.jumpId = setInterval(() => {
            this.jumpSpeed -= 0.01; // decrease speed upwards
            this.positionY += this.jumpSpeed; // move up
            this.playerElement.style.bottom = this.positionY + "vh";

            if (this.positionY >= this.startPoint + this.jumpHeight || this.jumpSpeed <= 0) {
                this.fall(); // Start falling when peak is reached
            }
        }, 20);
    }

    fall() {
        clearInterval(this.jumpId); // Stop jumping
        this.falling = true;
        this.jumping = false;
        this.fallSpeed = 0.3; // reset

        this.fallId = setInterval(() => {
            this.fallSpeed += 0.01; // accelerate down
            this.positionY -= this.fallSpeed;
            this.playerElement.style.bottom = this.positionY + "vh";

            if (this.positionY < -this.height) {
                newGame.gameOver();
            }

            this.checkCollision(); // Continuously check for collisions

        }, 20);
    }

    checkCollision() {
        platformsArr.forEach((platformInstance) => {
            if (
                this.positionX < platformInstance.positionX + platformInstance.width && // Player's left side is left of platform's right side
                this.positionX + this.width > platformInstance.positionX && // Player's right side is right of platform's left side
                this.positionY >= platformInstance.positionY && // Player is at or slightly above the platform
                this.positionY <= platformInstance.positionY + platformInstance.height // Player is within the platform's height range
            ) {
                this.startPoint = this.positionY; // Set the new start point
                this.jump(); // Trigger jump again
            }
        });
    }

    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX += 1;
            this.playerElement.style.left = this.positionX + "vw";
        }
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 1;
            this.playerElement.style.left = this.positionX + "vw";
        }
    }
}

const newPlayer = new Player();

// Adding event listeners for left and right movement
let moveRightInterval;
let moveLeftInterval;

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight" && !moveRightInterval) {
        moveRightInterval = setInterval(() => {
            newPlayer.moveRight();
        }, 10);
    } else if (event.code === "ArrowLeft" && !moveLeftInterval) {
        moveLeftInterval = setInterval(() => {
            newPlayer.moveLeft();
        }, 10);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") {
        clearInterval(moveRightInterval);
        moveRightInterval = null;
    } else if (event.code === "ArrowLeft") {
        clearInterval(moveLeftInterval);
        moveLeftInterval = null;
    }
});
