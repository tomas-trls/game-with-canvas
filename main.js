const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const enemyHealth = document.querySelector("#enemyHealth");
const playerHealth = document.querySelector("#playerHealth");
const timer = document.querySelector(".game__timer");
const gameResult = document.querySelector(".game__result");
// canvas.width = 1024;
// canvas.height = 576;

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.color = color;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };

    this.health = 100;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 700,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
};

const rectangularCollision = (rectangle1, rectangle2) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const determineWinner = (player, enemy, timerId) => {
  clearTimeout(timerId);
  if (player.health == enemy.health) {
    gameResult.innerText = "Tie";
  } else if (player.health > enemy.health) {
    gameResult.innerText = "Player 1 Won!";
  } else if (player.health < enemy.health) {
    gameResult.innerText = "Player 2 Won";
  }
};

let timerId;
const decreaseTimer = () => {
  timerId = setTimeout(decreaseTimer, 1000);
  if (Number.parseInt(timer.innerText) > 0) {
    timer.innerText--;
  }

  if (timer.innerText === "0") {
    determineWinner(player, enemy);
  }
};

decreaseTimer();

const animate = () => {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  //Player
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //Enemy
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //Collision from player to Enemy
  if (rectangularCollision(player, enemy) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 10;
    enemyHealth.style.width = `${enemy.health}%`;
    console.log("touched");
  }

  //Collision from enemy to player

  if (rectangularCollision(enemy, player) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 10;
    playerHealth.style.width = `${player.health}%`;
    console.log("enemy attack");
  }

  //end game based on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner(player, enemy, timerId);
  }
};

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;

    case "ArrowUp":
      enemy.velocity.y = -20;
      break;

    case "ArrowDown":
      enemy.attack();
      break;

    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "w":
      player.velocity.y = -20;
      break;

    case " ":
      player.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
