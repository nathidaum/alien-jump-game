/***************************************************/
/***************** REDIRECTION *********************/
/***************************************************/

// Handle redirection from the welcome screen to the game screen
window.onload = function () {
    const startButton = document.getElementById('start');
    const restartButton = document.getElementById('restart');
    const scoreCount = document.getElementById('scoreCount');

    // Start game
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'play.html';
        });
    }

    // Restart game
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            window.location.href = 'play.html';
        });
    }

    // Display score on gameover screen
    if (scoreCount) {
        const score = localStorage.getItem('score') || 0;
        scoreCount.innerText = score;
    }
};

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
        this.platformElement.className = "platform";
        this.platformElement.style.height = this.height + "%";
        this.platformElement.style.width = this.width + "%";
        this.platformElement.style.left = this.positionX + "%";
        this.platformElement.style.bottom = this.positionY + "%";

        const board = document.getElementById("board");
        board.appendChild(this.platformElement);
    }

    movePlatformDown() {
        this.fallInterval = setInterval(() => {
            this.positionY -= 0.1;
            this.platformElement.style.bottom = this.positionY + "%";

            if (this.positionY <= -this.height) {
                this.positionY = 100;
                this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
                this.platformElement.style.left = this.positionX + "%";
                this.game.score++;
                this.game.scoreCount.innerText = this.game.score;

            } else if (this.game.isGameOver) {
                clearInterval(this.fallInterval);
            }
        }, 10);
    }
}

/***************************************************/
/******************* ITEM CLASS ********************/
/***************************************************/

class Item {
    constructor(positionY, gameInstance, itemType) {
        this.height = 6;
        this.width = 8;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.positionY = positionY;
        this.itemElement = null;
        this.fallInterval = null;
        this.game = gameInstance;
        this.itemType = itemType;
        this.collectCoinSound = new Audio('./sounds/collectcoin.wav');

        this.createItemElement();
        this.moveItemDown();
    }

    createItemElement() {
        this.itemElement = document.createElement("div");
        this.itemElement.className = "item";
        this.itemElement.style.height = this.height + "%";
        this.itemElement.style.width = this.width + "%";
        this.itemElement.style.left = this.positionX + "%";
        this.itemElement.style.bottom = this.positionY + "%";

        if (this.itemType === "rocket") {
            this.itemElement.className = "rocket";
        } else if (this.itemType === "asteroid") {
            this.itemElement.className = "asteroid";
        }

        const board = document.getElementById("board");
        board.appendChild(this.itemElement);
    }

    moveItemDown() {
        this.fallInterval = setInterval(() => {
            this.positionY -= 0.12;
            this.itemElement.style.bottom = this.positionY + "%";

            if (this.positionY <= -this.height || this.checkPlayerCollision()) {
                if (this.checkPlayerCollision() && this.itemType === "rocket") {
                    this.game.score += 5;
                    this.game.scoreCount.innerText = this.game.score;
                    console.log("collected rocket")

                    this.collectCoinSound.play(); // Play collect rocket sound
                    this.collectCoinSound.volume = 0.6;  // Adjust volume

                } else if (this.checkPlayerCollision() && this.itemType === "asteroid") {
                    console.log("touched asteroid")
                    this.game.gameOver();
                }
                this.resetItemPosition()
            };

            if (this.game.isGameOver) {
                clearInterval(this.fallInterval);
            }
        }, 10);
    }

    checkPlayerCollision() {
        return (
            this.game.player.positionX < this.positionX + this.width &&
            this.game.player.positionX + this.game.player.width > this.positionX &&
            this.game.player.positionY < this.positionY + this.height &&
            this.game.player.positionY + this.game.player.height > this.positionY
        );
    }

    resetItemPosition() {
        this.positionY = 100;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
        this.itemElement.style.left = this.positionX + "%";
    }
}

/***************************************************/
/******************** BULLET ***********************/
/***************************************************/
class Bullet {
    constructor(positionX, positionY, gameInstance) {
        this.width = 1;
        this.height = 1;
        this.positionX = positionX;
        this.positionY = positionY;
        this.bulletElement = null;
        this.game = gameInstance;
        this.board = document.getElementById("board");
        this.shootSound = new Audio('./sounds/shoot.wav');
        this.killAsteroidSound = new Audio('./sounds/killasteroid.wav');

        this.createBulletElement();
    }

    createBulletElement() {
        this.bulletElement = document.createElement("div");
        this.bulletElement.className = "bullet";
        this.bulletElement.style.width = this.width + "%";
        this.bulletElement.style.height = this.height + "%";
        this.bulletElement.style.left = this.positionX + "%";
        this.bulletElement.style.bottom = this.positionY + "%";

        this.board.appendChild(this.bulletElement);
        this.moveBulletUp();

        this.shootSound.play(); // Play the shoot sound
        this.shootSound.volume = 0.3;  // Adjust volume
    }

    moveBulletUp() {
        this.interval = setInterval(() => {
            this.positionY += 1;
            this.bulletElement.style.bottom = this.positionY + "%";

            this.shootSound = new Audio('./sounds/shoot.wav');

            // Check for collision with items
            this.game.itemsArr.forEach(item => {
                if (item.itemType === "asteroid" && this.checkBulletCollision(item)) {
                    item.itemElement.remove();  // Remove asteroid
                    this.clearBullet();  // Remove bullet

                    this.killAsteroidSound.play(); // Play the kill asteroid sound
                    this.killAsteroidSound.volume = 0.4;  // Adjust volume
                }
            });

            if (this.positionY > 100) {
                clearInterval(this.interval);
                this.bulletElement.remove();
            }

            if (this.game.isGameOver) {
                clearInterval(this.interval);
                this.bulletElement.remove();
            }
        }, 20);
    }
    
    checkBulletCollision(item) { // Check for collision between bullet and item
    return (
        this.positionX < item.positionX + item.width &&
        this.positionX + this.width > item.positionX &&
        this.positionY < item.positionY + item.height &&
        this.positionY + this.height > item.positionY
    );
}



    clearBullet() {
        clearInterval(this.interval);
        this.bulletElement.remove();
    }
}

/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor(gameInstance) {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2;
        this.startPoint = 100;
        this.jumpHeight = 40;
        this.positionY = this.startPoint;
        this.jumpSpeed = 0.6;
        this.fallSpeed = 0.3;
        this.jumping = false;
        this.falling = false;
        this.jumpId = null;
        this.fallId = null;
        this.moveLeftInterval = null;
        this.moveRightInterval = null;
        this.game = gameInstance;
        this.shootListener = null;
        this.jumpSound = new Audio('./sounds/jump.wav');
        this.shootSound = new Audio('./sounds/shoot.wav');

        this.createPlayer();
        this.jump();
        this.setupMovement();
        this.shoot();
    }

    createPlayer() {
        this.playerElement = document.createElement("div");
        this.playerElement.id = "player";
        this.playerElement.style.height = this.height + "%";
        this.playerElement.style.width = this.width + "%";
        this.playerElement.style.left = this.positionX + "%";
        this.playerElement.style.bottom = this.positionY + "%";

        const board = document.getElementById("board");
        board.appendChild(this.playerElement);
    }

    jump() {
        // Clear previous intervals to avoid stacking
        clearInterval(this.fallId);
        clearInterval(this.jumpId);
    
        // Set up initial state for the jump
        this.jumping = true;
        this.falling = false;
        this.jumpSpeed = 0.6; // Reset the jump speed
    
        // Squat before the jump
        this.playerElement.style.height = (this.height * 0.9) + "%"; // Squat to 90% height
    
        // Start the actual jump after a brief delay
        setTimeout(() => {
            this.jumpId = setInterval(() => {
                this.jumpSpeed -= 0.01;
                this.positionY += this.jumpSpeed;
                this.playerElement.style.bottom = this.positionY + "%";
    
                // Stretch while going up
                if (this.jumpSpeed > 0.3) {
                    this.playerElement.style.height = (this.height * 1.1) + "%"; // Stretch to 110% height
                }
    
                // When the jump reaches the peak, initiate the fall
                if (this.jumpSpeed <= 0) {
                    this.fall();
                }
    
                // Check if the player reached the max height
                if (this.positionY >= this.startPoint + this.jumpHeight) {
                    this.fall();
                }
            }, 20);
        }, 100); // Brief delay to mimic a jump preparation
    
    }
    
    fall() {
        // Clear jump interval to avoid stacking
        clearInterval(this.jumpId);
    
        this.falling = true;
        this.jumping = false;
        this.fallSpeed = 0.3; // Reset fall speed
    
        // Return the player's height to normal
        this.playerElement.style.height = this.height + "%"; // Reset to normal height
    
        // Start falling
        this.fallId = setInterval(() => {
            this.fallSpeed += 0.01; // Gradually increase the fall speed
            this.positionY -= this.fallSpeed;
            this.playerElement.style.bottom = this.positionY + "%";
    
            // Check for collision with the ground or platform
            this.checkCollision();
    
            // End game if the player falls below the screen
            if (this.positionY < -this.height) {
                this.game.gameOver();
            }
        }, 20);
    }    

    checkCollision() {
        let hasCollided = false;

        this.game.platformsArr.forEach((platformInstance) => {
            if (
                this.positionX < platformInstance.positionX + platformInstance.width &&
                this.positionX + this.width > platformInstance.positionX &&
                this.positionY >= platformInstance.positionY &&
                this.positionY <= platformInstance.positionY + platformInstance.height
            ) {
                this.jump();
                this.startPoint = this.positionY;
                return;
            }
        });
    }

    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX += 1;
            this.playerElement.style.left = this.positionX + "%";
        }
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 1;
            this.playerElement.style.left = this.positionX + "%";
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

    shoot() {
        if (this.shootListener) {
            document.removeEventListener("keydown", this.shootListener);
        }

        this.shootListener = (event) => {
            if (event.code === "ArrowUp") {
                const bullet = new Bullet(this.positionX + this.width / 2, this.positionY + this.height / 2, this.game);
                this.game.bulletsArr.push(bullet);
            }
        };

        document.addEventListener("keydown", this.shootListener);
    }

    removePlayer() {
        clearInterval(this.jumpId);
        clearInterval(this.fallId);
        clearInterval(this.moveLeftInterval);
        clearInterval(this.moveRightInterval);

        if (this.playerElement) {
            this.playerElement.remove();
        }

        if (this.shootListener) {
            document.removeEventListener("keydown", this.shootListener);
            this.shootListener = null;
        }
    }
}

/***************************************************/
/******************** GAME *************************/
/***************************************************/

class Game {
    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.platformsArr = [];
        this.platformCount = 5;
        this.itemCount = 1;
        this.player = null;
        this.board = document.getElementById("board");
        this.bulletsArr = [];
        this.lostSound = new Audio('./sounds/lost.wav');
        this.musicSound = new Audio('./sounds/music.wav')
    }

    startPlay() {
        this.isGameOver = false;
        this.score = 0;
        this.platformsArr = [];
        this.itemsArr = [];
        this.bulletsArr = [];

        this.board.style.backgroundColor = "#bad5ed";

        this.showScore();
        this.createPlatforms(this.platformCount);
        this.player = new Player(this);
        this.createItems(this.itemCount);

        this.musicSound.loop = true;  // Set the music to loop
        this.musicSound.play(); // Play the music
        this.musicSound.volume = 0.1;  // Adjust volume
    }

    showScore() {
        this.scoreCount = document.createElement("div");
        this.scoreCount.id = "score";
        this.board.appendChild(this.scoreCount);
    }

    createPlatforms(count) {
        for (let i = 0; i < count; i++) {
            let positionY = 10 + i * (100 / count);
            const newPlatform = new Platform(positionY, this);
            this.platformsArr.push(newPlatform);
        }
    }

    createItems(count) {
        let positionY = Math.random() * 100;
        const newRocket = new Item(positionY, this, "rocket"); // create rocket item and pass item type to item creation method
        const newAsteroid = new Item(positionY, this, "asteroid"); // create asteroid item and pass item type to item creation method
        this.itemsArr.push(newRocket);
        this.itemsArr.push(newAsteroid); // push both to items array
    }

    gameOver() {
        this.isGameOver = true;

        this.lostSound.play(); // Play the gameover sound
        this.lostSound.volume = 0.4;  // Adjust volume

        this.bulletsArr.forEach(bullet => {
            bullet.clearBullet();
        });
        this.bulletsArr = [];

        localStorage.setItem('score', this.score);

        // Delay the redirection to allow the sound to play
        setTimeout(() => {
            window.location.href = 'gameover.html';
        }, 2000);
    }
}

if (window.location.pathname.includes('play.html')) {
    const game = new Game();
    game.startPlay();
}