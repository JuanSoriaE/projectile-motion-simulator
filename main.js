const ground = document.getElementById('ground');
const projectile = document.getElementById('projectile');
const angle_input = document.getElementById('initial-angle');
const velocity_input = document.getElementById('initial-vel');
const g_input = document.getElementById('initial-g');
const angle_span = document.getElementById('span-initial-angle');
const x_velocity_span = document.getElementById('x_vel');
const y_velocity_span = document.getElementById('y_vel');
const air_resistance_check = document.getElementById('air-resistance');
const mass_input = document.getElementById('mass');
const diameter_input = document.getElementById('diameter');
const drag_coefficient_input = document.getElementById('drag-coefficient');


// Default values
let play = false;
let initial_angle = 45;
let initial_vel = 30;
let x_component = 0.7;
let y_component = 0.7;
let g = -9.81;
const time_step = 0.03; // Have to be in seconds

// Values for air drag force
let radius = 0.5;
let drag_coefficient = 0.47;
let k = 0.18;

let mass = 10;

let vel_x = initial_vel * x_component;
let vel_y = initial_vel * y_component;
let x = 0, y = 0;

// Sum of forces
let x_sum = 0;
let y_sum = 0;
let sum_air_helper;

function update() {
  x = x + vel_x*time_step;
  y = y + vel_y*time_step;

  // Sum of forces
  x_sum = sum_air_helper * vel_x**2;
  y_sum = g + (sum_air_helper * vel_y**2);

  vel_x = vel_x + x_sum*time_step;
  vel_y = vel_y + y_sum*time_step;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePosition() {
  projectile.style.left = `${x}px`;
  projectile.style.bottom = `${y}px`;
}

function displayData() {
  angle_span.innerText = initial_angle;
  x_velocity_span.innerHTML = vel_x.toFixed(2);
  y_velocity_span.innerText = vel_y.toFixed(2);
}

function setData() {
  // Get input data
  initial_angle = Number(angle_input.value) || 45;
  initial_vel = Number(velocity_input.value) || 30;
  g = Number(g_input.value) || -9.8;
  mass = Number(mass_input.value) || 10;
  radius = Number(diameter_input.value) / 2 || 0.5;
  drag_coefficient = Number(drag_coefficient_input.value) || 0.47;

  // Set data in inputs
  angle_input.value = initial_angle;
  velocity_input.value = initial_vel;
  g_input.value = g;
  mass_input.value = mass;
  diameter_input.value = radius * 2;
  drag_coefficient_input.value = drag_coefficient;
  
  x_component = Math.cos(initial_angle * Math.PI / 180).toFixed(2) || 0.7;
  y_component = Math.sin(initial_angle * Math.PI / 180).toFixed(2) || 0.7;
  vel_x = initial_vel * x_component;
  vel_y = initial_vel * y_component;
  x = 0;
  y = 0;

  // Air resistance
  if (air_resistance_check.checked) {
    k = (drag_coefficient * Math.PI.toFixed(2) * (radius**2)) / 2;
    sum_air_helper = -k/mass;
  } else sum_air_helper = 0;
  
  displayData();
}

function stop() {
  play = false;
  setData();
  updatePosition();
}

async function run() {
  let i = 0;
  play = true;
  let width = ground.clientWidth - 15;

  setData();
  updatePosition();

  while (y >= 0 && x <= width && i < 1000 && play) {
    await sleep(time_step*1000);
    update();
    updatePosition();
    displayData();
    i++;
  }
  play = false;
}

// Ground Markers
let markers_counter = 0;

const deleteMarker = e => {
  e.preventDefault();
  const marker = document.getElementById(e.target.id);
  marker.remove();
};

ground.addEventListener('click', e => {
  const ground_rect = ground.getBoundingClientRect();
  const i = document.createElement('i');
  i.onauxclick = e => deleteMarker(e);
  i.classList.add('marker');
  i.style.left = `${e.clientX - ground_rect.x - 8}px`;
  i.style.top = `${e.clientY - ground_rect.y - 18}px`;
  
  markers_counter++;
  i.id = `marker-${markers_counter}`;
  
  ground.appendChild(i);
});

const clearMarkers = () => {
  let marker;
  for (let i = 1; i <= markers_counter; i++) {
    marker = document.getElementById(`marker-${i}`);
    if (!marker) continue;
    marker.remove();
  }
};

// Key commands
window.addEventListener('keydown', e => {
  switch (e.key.toLowerCase()) {
    case ' ':
      if (play) stop();
      else run();
      break;

    case 'a':
      air_resistance_check.checked = !air_resistance_check.checked;8
      break;

    case 'c':
      clearMarkers();

    default:
      break;
  }
});

// MAIN
function main() {
  setData();
}

main();
