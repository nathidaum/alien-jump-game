let score = 0;

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

                score++; // increase score by one every time one platform is passed (reaches the bottom)
            }
        }, 10);
    }
}

// Create new platforms and add them to the array 
const platformsArr = []; // to store instances of the class object

function createPlatforms(count) {
    for (let i = 0; i < count; i++) {
        let positionY = 10 + i * (100 / count); // platforms should be equally distributed, but now below 10vh
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
        this.startPoint = 10;
        this.jumpHeight = 35;
        this.positionY = this.startPoint; // Starting position at the bottom
        this.jumpSpeed = 0.6;
        this.fallSpeed = 0.3;

        this.createPlayer();
        this.jump();
    }

    createPlayer() {
        this.playerElement = document.createElement("div");
        // style player
        this.playerElement.id = "player";
        this.playerElement.style.height = this.height + "vh";
        this.playerElement.style.width = this.width + "vw";
        this.playerElement.style.left = this.positionX + "vw";
        this.playerElement.style.bottom = this.positionY + "vh";
        // append to the board
        const board = document.getElementById("board");
        board.appendChild(this.playerElement);
    }

    jump() {
        clearInterval(this.fallId); // Stop falling
        this.jumping = true;
        this.falling = false;

        this.jumpId = setInterval(() => {
            this.positionY += this.jumpSpeed;
            this.playerElement.style.bottom = this.positionY + "vh";

            if (this.positionY >= this.startPoint + this.jumpHeight) {
                this.fall();
            }
        }, 30);
    }

    fall() {
        clearInterval(this.jumpId); // Stop jumping
        this.falling = true;
        this.jumping = false;

        this.fallId = setInterval(() => {
            this.positionY -= this.fallSpeed;
            this.playerElement.style.bottom = this.positionY + "vh";

            // jump when there's a collision
            platformsArr.forEach((platformInstance) => {
                if (
                    this.positionX < platformInstance.positionX + platformInstance.width && // Player's left side is left of platform's right side
                    this.positionX + this.width > platformInstance.positionX && // Player's right side is right of platform's left side
                    this.positionY >= platformInstance.positionY && // Player is at or slightly above the platform
                    this.positionY <= platformInstance.positionY + platformInstance.height && // Player is within the platform's height range
                    this.jumping === false
                ) {
                    this.startPoint = this.positionY;
                    this.jump();
                }

                // stop falling when hitting the ground
                if (this.positionY < -this.height) {
                    clearInterval(this.fallId);
                    console.log("game over"); // will have to add a game over screen & restart option here
                }
            }, 30);
        })
    };

    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX += 1;
            this.playerElement.style.left = this.positionX + "vw";
        }
    };

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 1;
            this.playerElement.style.left = this.positionX + "vw";
        }
    }
}

const newPlayer = new Player();

// ADDING EVENT LISTENERS: Let player move/jump left and right

let moveRightInterval;
let moveLeftInterval;

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight" && !moveRightInterval) {
        // move right on keydown
        moveRightInterval = setInterval(() => {
            newPlayer.moveRight();
        }, 10);
    } else if (event.code === "ArrowLeft" && !moveLeftInterval) {
        // move left on keydown
        moveLeftInterval = setInterval(() => {
            newPlayer.moveLeft();
        }, 10);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") {
        // stop moving right when releasing the key
        clearInterval(moveRightInterval);
        moveRightInterval = null;
    } else if (event.code === "ArrowLeft") {
        // stop moving left when releasing the key
        clearInterval(moveLeftInterval);
        moveLeftInterval = null;
    }
});
