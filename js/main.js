class Player {
    constructor() {
        this.height = 15; 
        this.width = 10; 
        this.positionX = 50 - this.width / 2; // centered starting position
        this.positionY = 0;
        this.playerElement = null; 

        this.createPlayer();
    }
    
    createPlayer() {
        this.playerElement = document.createElement("div");
        console.log("player element created");

        this.playerElement.id = "player"; // add ID

        this.playerElement.style.height = this.height + "vh";
        this.playerElement.style.width = this.width + "vw";
        this.playerElement.style.left = this.positionX + "vw";
        this.playerElement.style.bottom = this.positionY + "vh";

        const board = document.getElementById("board"); 
        board.appendChild(this.playerElement); // append to board
    }
}

const newPlayer = new Player();
newPlayer.createPlayer;
