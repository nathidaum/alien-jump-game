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
                this.game.scoreCount.innerText = this.game.score;

            } else if (this.game.isGameOver) {
                clearInterval(this.fallInterval);
            }
        }, 10);
    }
}

/***************************************************/
/******************* COIN CLASS ********************/
/***************************************************/

class Coin {
    constructor(positionY, gameInstance) {
        this.height = 3;
        this.width = 3;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.positionY = positionY;
        this.coinElement = null;
        this.fallInterval = null;
        this.game = gameInstance;

        this.createCoinElement();
        this.moveCoinDown();
    }

    createCoinElement() {
        this.coinElement = document.createElement("div");  // Create coinElement instead of using platformElement
        this.coinElement.className = "coin";  // Apply a different class for coin styling
        this.coinElement.style.height = this.height + "vh";
        this.coinElement.style.width = this.width + "vw";
        this.coinElement.style.left = this.positionX + "vw";
        this.coinElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");  // Append to board
        board.appendChild(this.coinElement);
    }

    moveCoinDown() {
        this.fallInterval = setInterval(() => {
            this.positionY -= 0.1;
            this.coinElement.style.bottom = this.positionY + "vh"; // Move coinElement

            // Check if the coin is out of view or collected by the player
            if (this.positionY <= -this.height || this.checkPlayerCollision()) {
                if (this.checkPlayerCollision()) {
                    this.game.score += 5; // Add extra points for collecting a coin
                    this.game.scoreCount.innerText = this.game.score;
                }
                this.resetCoinPosition(); // Reset coin in both cases
            }

            if (this.game.isGameOver) {
                clearInterval(this.fallInterval);
            }
        }, 10);
    }

    // Check for collision between player and coin
    checkPlayerCollision() {
        return (
            this.game.player.positionX < this.positionX + this.width &&
            this.game.player.positionX + this.game.player.width > this.positionX &&
            this.game.player.positionY < this.positionY + this.height &&
            this.game.player.positionY + this.game.player.height > this.positionY
        );
    }

    // Reset coin position after a collision or when it goes out of view
    resetCoinPosition() {
        this.positionY = 100;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.coinElement.style.left = this.positionX + "vw";
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
        this.moveLeftInterval = null;
        this.moveRightInterval = null;
        this.game = gameInstance;

        this.createPlayer();
        this.jump();
        this.setupMovement();
    }

    createPlayer() {
        this.playerElement = document.createElement("div");
        this.playerElement.id = "player";                            // Add ID
        this.playerElement.style.height = this.height + "vh";
        this.playerElement.style.width = this.width + "vw";
        this.playerElement.style.left = this.positionX + "vw";
        this.playerElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board");
        board.appendChild(this.playerElement);                       // Append to board
    }

    jump() {
        clearInterval(this.fallId);                                  // Stop falling
        this.jumping = true;
        this.falling = false;
        this.jumpSpeed = 0.6;                                        // Reset

        this.jumpId = setInterval(() => {
            this.jumpSpeed -= 0.01;                                  // Decrease speed upwards
            this.positionY += this.jumpSpeed;                        // Move up
            this.playerElement.style.bottom = this.positionY + "vh";

            if (this.positionY >= this.startPoint + this.jumpHeight || this.jumpSpeed <= 0) {
                this.fall();                                         // Start falling when peak is reached
            } else if (this.positionY >= 100 - this.height) {
                this.fall();
            }

        }, 20);
    }

    fall() {
        clearInterval(this.jumpId);                                  // Stop jumping

        this.falling = true;
        this.jumping = false;
        this.fallSpeed = 0.3;                                        // Reset

        this.fallId = setInterval(() => {
            this.fallSpeed += 0.01;                                  // Accelerate down
            this.positionY -= this.fallSpeed;
            this.playerElement.style.bottom = this.positionY + "vh";

            this.checkCollision();                                   // Continuously check for collisions

            if (this.positionY < -this.height) {
                this.game.gameOver();                                // Game over once the player falls below the board
            }

        }, 20);
    }

    checkCollision() {
        let hasCollided = false;                                     // Variable to track if the player is standing on a platform

        this.game.platformsArr.forEach((platformInstance) => {
            if (
                this.positionX < platformInstance.positionX + platformInstance.width && // Player's left side is left of platform's right side
                this.positionX + this.width > platformInstance.positionX &&             // Player's right side is right of platform's left side
                this.positionY >= platformInstance.positionY &&                         // Player is at or slightly above the platform
                this.positionY <= platformInstance.positionY + platformInstance.height  // Player is within the platform's height range
            ) {
                hasCollided = true;                                  // Player has landed on a platform
                this.startPoint = this.positionY;                    // Set the new start point
            }
        });

        if (hasCollided) {
            this.jump();                                             // Only jump if the player is standing on a platform
        }
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

    setupMovement() {
        document.addEventListener("keydown", (event) => {
            if (event.code === "ArrowRight" && !this.moveRightInterval) {
                this.moveRightInterval = setInterval(() => {
                    this.moveRight();
                }, 10);
            } else if (event.code === "ArrowLeft" && !this.moveLeftInterval) {
                this.moveLeftInterval = setInterval(() => {
                    this.moveLeft();
                }, 10);
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.code === "ArrowRight") {
                clearInterval(this.moveRightInterval);
                this.moveRightInterval = null;
            } else if (event.code === "ArrowLeft") {
                clearInterval(this.moveLeftInterval);
                this.moveLeftInterval = null;
            }
        });
    }
};

/***************************************************/
/******************** GAME *************************/
/***************************************************/

class Game {
    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.platformsArr = [];
        this.platformCount = 5;
        this.coinCount = 1;
        this.player = null;
        this.board = document.getElementById("board");
    }

    welcome() {
        this.isGameOver = false;
        this.welcome = document.createElement("div");
        this.welcome.id = "welcome";
        this.welcome.innerText = "Welcome!";
        this.board.appendChild(this.welcome);
        this.board.style.backgroundColor = "#6F73C6";

        // Start button
        this.startButton = document.createElement("button");
        this.startButton.id = "start";
        this.startButton.innerText = "Start play";
        this.startButton.style.backgroundColor = "#E2EB67";
        this.board.appendChild(this.startButton);

        this.startButton.addEventListener("mouseover", () => {
            this.startButton.style.backgroundColor = "white";
            this.startButton.style.fontWeight = 900;
        });

        this.startButton.addEventListener("mouseout", () => {
            this.startButton.style.backgroundColor = "#E2EB67";
            this.startButton.style.fontWeight = 400;
        });

        this.startButton.addEventListener("click", () => {
            this.board.removeChild(this.welcome);
            this.board.removeChild(this.startButton);
            this.startPlay();
        })
    }

    startPlay() {
        this.isGameOver = false;
        this.score = 0;
        this.platformsArr = [];
        this.coinsArr = [];

        this.board.style.backgroundColor = "#bad5ed";

        this.showScore()                                             // Show score 
        this.createPlatforms(this.platformCount);                    // Create platforms
        this.player = new Player(this);                              // Create player
        this.createCoins(this.coinCount);                            // Create coins
        this.board.style.backgroundColor = "#bad5ed";
    }

    showScore() {
        this.scoreCount = document.createElement("div");
        this.scoreCount.id = "score";
        this.board.appendChild(this.scoreCount);
    }

    createPlatforms(count) {
        for (let i = 0; i < count; i++) {
            let positionY = 10 + i * (100 / count);                  // Distribute platforms
            const newPlatform = new Platform(positionY, this);       // Pass game instance to each platform
            this.platformsArr.push(newPlatform);
        }
    }

    createCoins(count) {
        let positionY = Math.random() * 100;                         // Random vertical position
        const newCoin = new Coin(positionY, this);
        this.coinsArr.push(newCoin);
    }

    gameOver() {
        this.isGameOver = true;

        this.board.style.backgroundColor = "#6F73C6";                // Change board background 
        this.board.removeChild(this.scoreCount);                     // Remove score count
        this.board.removeChild(this.player.playerElement);           // Remove player

        clearInterval(this.player.fallId);                           // Clear falling interval

        this.coinsArr.forEach(coin => {
            clearInterval(coin.fallInterval);                        // Stop coin's falling interval
            this.board.removeChild(coin.coinElement);                // Remove the actual coin element
        });

        this.platformsArr.forEach(platform => {
            clearInterval(platform.fallInterval);
            this.board.removeChild(platform.platformElement);
        });                                                          // Stop platforms from falling


        // Show a game over message
        this.gameOverMessage = document.createElement("div");
        this.gameOverMessage.id = "gameover";
        this.gameOverMessage.innerText = `Game Over! 
        Your score: ${this.score}`;
        this.board.appendChild(this.gameOverMessage);

        // Restart
        this.restartButton = document.createElement("button");
        this.restartButton.id = "restart";
        this.restartButton.innerText = "Play again";
        this.board.appendChild(this.restartButton);

        this.restartButton.addEventListener("mouseover", () => {
            this.restartButton.style.backgroundColor = "white";
            this.restartButton.style.fontWeight = 900;
        });

        this.restartButton.addEventListener("mouseout", () => {
            this.restartButton.style.backgroundColor = "#E2EB67";
            this.restartButton.style.fontWeight = 400;
        });

        this.restartButton.addEventListener("click", () => {
            this.board.style.backgroundColor = "#DCEEFE";
            this.board.removeChild(this.gameOverMessage);
            this.board.removeChild(this.restartButton);

            this.startPlay();                                        // Start new game
        });
    }
}

const newGame = new Game();

newGame.welcome()
