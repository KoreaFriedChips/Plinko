import {
  Engine,
  Render,
  Mouse,
  MouseConstraint,
  World,
  Bodies,
  Body,
  Events,
} from "matter-js";
import { multiplyBlocks16Rows } from "./constants/util";

// Dimensions and variables
const width = window.innerWidth;
const height = window.innerHeight * 0.8;

const xStart = width / 2;
const yStart = 100;

let rows = 16;

const ballRadius = 10;
const pegGap = 4 * ballRadius;
const pegRadius = 0.2 * ballRadius;
let xGap = pegGap;
let yGap = 0.5 * xGap;

const maxBalls = 10; // starting animation of 10 balls

// Physics Constants
const restitution = 0.6;
const friction = 0.05;
const frictionAir = 0.06;
// const frictionStatic = 0;
const slop = 0;
// const gravity = 1;
const gravitySF = 0.0018;
const timeScale = 1;

// Setup MatterJS
// 1. Create engine
let engine = Engine.create();
engine.timing.timeScale = timeScale;
Engine.run(engine);

// 2. Setup render function
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    showAngleIndicator: false,
    background: "#fff",
  },
});
Render.run(render);

// 3. Create world
let world = engine.world;
world.gravity.scale = gravitySF;

// Render Pegs
const startToPegsGap = 10;
const rowOffset = 1;
let createPegs = () => {
  for (let row = 0 + rowOffset; row < rows + rowOffset; row++) {
    let yOffset = yGap * (row - rowOffset) + startToPegsGap;
    let xRowOffset = (xGap * row - xGap) / 2;
    //each peg
    for (let j = 0; j < row; j++) {
      let xOffset = xGap * j;
      let peg = Bodies.circle(
        xStart - xRowOffset + xOffset,
        yStart + yOffset,
        pegRadius,
        {
          restitution,
          friction,
          isStatic: true,
        }
      );
      World.add(world, peg);
    }
  }
};
createPegs();

// Render Multipliers
const pegsToBaseGap = yGap;
const floorHeight = 10;
let wallHeight =
  height - (yStart + startToPegsGap + rows * yGap + pegsToBaseGap);
const multipliers = multiplyBlocks16Rows;
const createMultipliers = () => {
  for (let i = 0; i < rows + rowOffset; i++) {
    let multiplier = Bodies.rectangle(
      xStart - ((rows + rowOffset - 1) * pegGap) / 2 + (i - 0.5) * pegGap + 20,
      height - (floorHeight + wallHeight - 10),
      35,
      35,
      {
        isStatic: true,
        label: multipliers[i].label,
        render: {
          sprite: {
            xScale: 1,
            yScale: 1,
            texture: multipliers[i].img,
          },
        },
      }
    );
    World.add(world, multiplier);
  }
};
createMultipliers();

// Collision with Multipliers
window.ballActive = 0; // to prevent changing bet value while balls are falling
let score = 100; // starting score
window.bet = 50; // initial bet amount
function updateScore() {
  console.log(score);
  document.getElementById("score").innerHTML =
    "$" + parseFloat(score).toFixed(2);
}

async function onBodyCollision(event) {
  // collision detection
  const pairs = event.pairs;
  for (const pair of pairs) {
    const { bodyA, bodyB } = pair;
    // check if ball collides with other balls, pegs, or multiplier
    if (
      !bodyA.label.includes("Circle Body") &&
      !bodyA.label.includes("ball") &&
      bodyB.label.includes("ball")
    ) {
      // if ball collides with multiplier
      World.remove(world, bodyB);
      score += window.bet * bodyA.label;
      updateScore();
      window.ballActive--;
      console.log(bodyA.label);
    }
  }
}
Events.on(engine, "collisionStart", onBodyCollision);

// Render Balls
let randomPosNeg = () => {
  let random = Math.sin(2 * Math.PI * Math.random());
  // Generate random position so that balls are not all in the same place
  return Math.pow(random, 3);
};
let vx = () => {
  return 0.3 * randomPosNeg();
};

// Define Balls
let addBall = (x, y) => {
  window.ballActive++;
  let ball = Bodies.circle(x, y, ballRadius, {
    restitution,
    friction,
    frictionAir,
    slop,
    isStatic: false,
    label: "ball",
  });
  Body.setVelocity(ball, { x: vx(), y: 0 });
  Body.setAngularVelocity(ball, randomPosNeg() / 8);
  World.add(world, ball);
};
let createBalls = (numberBalls) => {
  for (let i = 0; i < numberBalls; i++) {
    addBall(
      xStart + randomPosNeg() * numberBalls,
      yStart - 300 - i * ballRadius
    );
  }
};
createBalls(maxBalls);

//Mouse Control
var mouse = Mouse.create(render.canvas);
var mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  render: { visible: false },
});
World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// when mouse is clicked, add a new ball
Events.on(mouseConstraint, "mousedown", (event) => {
  if (score - window.bet < 0) return;
  addBall(width / 2, yStart - 50);
  score -= window.bet;
  updateScore();
});
