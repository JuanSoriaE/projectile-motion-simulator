const ground = document.getElementById('ground');
const projectile = document.getElementById('projectile');
const angle_input = document.getElementById('initial-angle');
const velocity_input = document.getElementById('initial-vel');
const g_input = document.getElementById('initial-g');
const angle_span = document.getElementById('span-initial-angle');
const velocity_span = document.getElementById('span-initial-vel');
const g_span = document.getElementById('span-initial-g');

// Default values
let play = false;
let initial_angle = 45;
let initial_vel = 30;
let x_component = 0.7;
let y_component = 0.7;
let g = -9.81;
const time_step = 0.03; // Have to be in seconds

let vel_x = initial_vel * x_component;
let vel_y = initial_vel * y_component;
let x = 0, y = 0;

function update() {
  x = x + vel_x*time_step;
  y = y + vel_y*time_step;

  vel_x = vel_x;
  vel_y = vel_y + g*time_step;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePosition() {
  projectile.style.left = `${x}px`;
  projectile.style.bottom = `${y}px`;
}

function setData() {
  // Get input data
  initial_angle = Number(angle_input.value);
  initial_vel = Number(velocity_input.value);
  g = Number(g_input.value);

  angle_span.innerText = initial_angle;
  velocity_span.innerHTML = initial_vel;
  g_span.innerText = g;

  x_component = Math.cos(initial_angle * Math.PI / 180).toFixed(2);
  y_component = Math.sin(initial_angle * Math.PI / 180).toFixed(2);
  vel_x = initial_vel * x_component;
  vel_y = initial_vel * y_component;
}

function restoreValues() {
  initial_angle = 45;
  initial_vel = 30;
  x_component = Math.cos(initial_angle * Math.PI / 180).toFixed(2);
  y_component = Math.sin(initial_angle * Math.PI / 180).toFixed(2);

  vel_x = initial_vel * x_component;
  vel_y = initial_vel * y_component;
  x = 0, y = 0;
}

function stop() {
  play = false;
  restoreValues();
  setData();
  updatePosition();
}

async function run() {
  let i = 0;
  play = true;
  let width = ground.clientWidth - 15;
  restoreValues();
  setData();
  updatePosition();
  while (y >= 0 && x <= width && i < 1000 && play) {
    update();
    await sleep(time_step*1000);
    updatePosition();
    i++;
  }
  play = false;
}

function main() {
  setData();
}

main();
