import platform from './assets/platform.png';
import hills from './assets/hills.png';
import background from './assets/background.png';

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
console.log(ctx);
const gravity = 0.5;

class Player {
  constructor() {
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 0 };
    this.height = 50;
    this.width = 50;
    this.speed = 10;
  }

  draw() {
    ctx.fillStyle = 'red';

    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = { x, y };
    this.image = image;

    this.height = image.height;
    this.width = image.width;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = { x, y };
    this.image = image;

    this.height = image.height;
    this.width = image.width;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
const platformImage = createImage(platform);

let player = new Player();
let platforms = [];

let genericObjects = [];
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  keys.left.pressed = false;
  keys.right.pressed = false;

  player = new Player();
  platforms = [
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createImage(background) }),
    new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
  ];

  scrollOffset = 0;
}
async function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'white';

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;

      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= player.speed;

      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }
  //platforms detection

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    )
      player.velocity.y = 0;
  });

  //win condition

  if (scrollOffset > 2000) {
    alert('You win!');
    init();
  }
  //lose condition

  if (player.position.y + player.height > canvas.height) {
    init();

    alert('You lose!');
  }
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();
}
init();
animate();

addEventListener('keydown', ({ key }) => {
  console.log(key);
  switch (key) {
    case 'ArrowLeft':
      console.log('l');
      keys.left.pressed = true;
      break;
    case 'ArrowRight':
      console.log('r');
      keys.right.pressed = true;
      break;
    case 'ArrowDown':
      console.log('D');
      break;
    case 'ArrowUp':
      console.log('u');
      player.velocity.y -= 10;
      break;
    case ' ':
      console.log('u');
      player.velocity.y -= 10;
      break;
  }
});
addEventListener('keyup', ({ key }) => {
  console.log(key);
  switch (key) {
    case 'ArrowLeft':
      console.log('l');
      keys.left.pressed = false;

      break;
    case 'ArrowRight':
      console.log('r');
      keys.right.pressed = false;

      break;
    case 'ArrowDown':
      break;
  }
});

// Path: index.html
