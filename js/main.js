class Player {
    constructor() {
        this.height = 15; 
        this.width = 10; 
        this.positionX = 50 - this.width / 2; // centered starting position
        this.positionY = 0;
        this.platformElement = null; 

        this.createPlayer();
    }
    
    createPlayer() {
        this.platformElement = document.createElement("div");
        console.log("player element created");

        this.platformElement.id = "player"; // add ID

        this.platformElement.style.height = this.height + "vh";
        this.platformElement.style.width = this.width + "vw";
        this.platformElement.style.left = this.positionX + "vw";
        this.platformElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board"); 
        board.appendChild(this.platformElement); // append to board
    }
}

const newPlayer = new Player();
newPlayer.createPlayer;

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
        console.log("player element created");

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
