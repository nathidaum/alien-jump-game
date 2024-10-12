/***************************************************/
/******************** PLAYER ***********************/
/***************************************************/

class Player {
    constructor() {
        this.height = 15;
        this.width = 10;
        this.positionX = 50 - this.width / 2; // Centered starting position
        this.positionY = 0;
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

    jumping() {
        console.log("jumping");
        this.positionY++;
        this.playerElement.style.bottom = this.positionY + "vh";
    }
}
const newPlayer = new Player();
newPlayer.createPlayer;


// ADDING EVENT LISTENERS: Let player jump when user clicks on the spacebar
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        newPlayer.jumping()
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