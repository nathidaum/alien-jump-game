/***************************************************/
/******************* PLATFORM **********************/
/***************************************************/

class Platform {
    constructor(positionY, gameInstance) {
        this.height = 3;
        this.width = 15;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.positionY = positionY;
        this.platformElement = null;
        this.fallInterval = null;
        this.game = gameInstance;

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

        const board = document.getElementById("board"); // append to board
        board.appendChild(this.platformElement);
    }

    movePlatformDown() {
        this.fallInterval = setInterval(() => {
            this.positionY -= 0.1;
            this.platformElement.style.bottom = this.positionY + "vh";

            // Check if platform has moved out of view
            if (this.positionY <= -this.height) {
                // Reposition the platform to the top with a random X position
                this.positionY = 100;
                this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
                this.platformElement.style.left = this.positionX + "vw";
                this.game.score++; // Increase score
            } else if (this.game.isGameOver) {
                clearInterval(this.fallInterval);
            }
        }, 10);
    }
}

/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor(gameInstance) {
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
        this.jumpId = null;
        this.fallId = null;
        this.game = gameInstance;

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
                this.game.gameOver(); // Game over logic
            }

            this.checkCollision(); // Continuously check for collisions

        }, 20);
    }

    checkCollision() {
        this.game.platformsArr.forEach((platformInstance) => {
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

// Adding event listeners for left and right movement
let moveRightInterval;
let moveLeftInterval;

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight" && !moveRightInterval) {
        moveRightInterval = setInterval(() => {
            newGame.player.moveRight();
        }, 10);
    } else if (event.code === "ArrowLeft" && !moveLeftInterval) {
        moveLeftInterval = setInterval(() => {
            newGame.player.moveLeft();
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

/***************************************************/
/******************** GAME *************************/
/***************************************************/

class Game {
    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.platformsArr = [];
        this.platformCount = 5;
        this.player = null;
    }

    startPlay() {
        // Create platforms
        this.createPlatforms(this.platformCount);

        // Create player
        this.player = new Player(this); // Pass the game instance to the player so that it can access methods and properties from the game class
    }

    createPlatforms(count) {
        for (let i = 0; i < count; i++) {
            let positionY = 10 + i * (100 / count); // Distribute platforms
            const newPlatform = new Platform(positionY, this); // Pass the game instance to each platform
            this.platformsArr.push(newPlatform);
        }
    }

    gameOver() {
        this.isGameOver = true; // Set game over state
        clearInterval(this.player.fallId); // Stop player fall
        console.log("Game over! Score: " + this.score);

        // Stop platform movement
        this.platformsArr.forEach(platform => {
            clearInterval(platform.fallInterval);
        });
    }
}

const newGame = new Game();
newGame.startPlay(); // Start the game
