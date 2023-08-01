const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
let rope, rope2;
let fruit, ground;
let fruit_con, fruit_con_2;
let bg_img, food, rabbit;
let button, button2;
let bunny;
let blink, eat, sad;
let mute_btn;
let bk_song, cut_sound, sad_sound, eating_sound;

let stars = [];
let filledStars = 0;
const starSize = 0.5;
let singleStar;
let multipleStars;

function preload() {
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');

  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  singleStar = loadImage('star.png');
  multipleStars = loadImage('stars.png');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  // Btn 1
  button = createImg('cut_btn.png');
  button.position(windowWidth * 0.2, windowHeight * 0.12);
  button.size(60, 60);
  button.mouseClicked(drop);

  // Btn 2
  button2 = createImg('cut_btn.png');
  button2.position(windowWidth * 0.65, windowHeight * 0.12);
  button2.size(60, 60);
  button2.mouseClicked(drop2);

  rope = new Rope(7, { x: windowWidth * 0.133, y: windowHeight * 0.12 });
  rope2 = new Rope(7, { x: windowWidth * 0.867, y: windowHeight * 0.12 });

  mute_btn = createImg('mute.png');
  mute_btn.position(windowWidth - 70, 20);
  mute_btn.size(60, 60);
  mute_btn.mouseClicked(mute);

  ground = new Ground(windowWidth * 0.5, windowHeight, windowWidth, 20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(windowWidth * 0.42, windowHeight * 0.886, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(windowWidth * 0.5, windowHeight * 0.5, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con_2 = new Link(rope2, fruit);

  // Create stars
  for (let i = 0; i < 5; i++) {
    let starX = random(100, windowWidth - 100);
    let starY = random(200, windowHeight - 100);
    let star = createSprite(starX, starY, starSize, starSize); 
    star.addImage(singleStar);
    stars.push(star);
  }

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() {
  background(51);
  image(bg_img, 0, 0, width, height);

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  drawSprites();

  // Check for touching stars
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].visible && stars[i].overlap(bunny)) {
      if (stars[i].getAnimationLabel() !== 'filled') {
        stars[i].addImage(multipleStars); 
        stars[i].changeAnimation('filled');
        filledStars++;
        if (filledStars >= 5) {
          
        }
      }
    }
  }

  if (collide(fruit, bunny)) {
    World.remove(engine.world, fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y >= windowHeight * 0.928) {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit = null;
  }
}

function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      return true;
    } else {
      return false;
    }
  }
}

function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  } else {
    bk_song.play();
  }
}
