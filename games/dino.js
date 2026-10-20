class Keyboard {
  constructor() {
    this.keys = new Set();
    this.last = new Set();
    this._down = (e) => this.keys.add(e.code);
    this._up   = (e) => this.keys.delete(e.code);
    document.addEventListener('keydown', this._down);
    document.addEventListener('keyup', this._up);
  }
  isDown(code) { return this.keys.has(code); }
  destroy() {
    document.removeEventListener('keydown', this._down);
    document.removeEventListener('keyup', this._up);
  }
  isClicked(code){
    if(this.isDown(code)){
        return !this.last.has(code);
    }return false;
  }
  Update(){
    this.last = new Set(this.keys);
  }
}

const cactus1 = document.getElementById('cactus1');
const cactus2 = document.getElementById('cactus2');
const cactus3 = document.getElementById('cactus3');

class Cactus {
  constructor(reference){
    this._obj = reference.cloneNode(true);
    this._obj.style.display = "block";
    this._obj.style.position = "fixed";
    document.body.appendChild(this._obj); 
    this.x = 250;
    this.y = 55;
  }
  Update(deltaTime){
    this.x -= referenceSpeed*deltaTime;
    setCoordinate(this._obj, this.x, this.y);
    this.CheckCollision();
    if(this.x < -50){
      this._obj.remove();
      return true;
    }return false;
  }

  CheckCollision(){
    let lt = parseFloat(this._obj.style.left);
    let rt = parseFloat(this._obj.style.left) + parseFloat(this._obj.style.width);
    
    let plt = parseFloat(dino.style.left);
    let prt = parseFloat(dino.style.left + this._obj.style.width);

    if((lt < plt & plt < rt) | (lt < prt & prt < rt)){
      let pd = parseFloat(dino.style.top) + parseFloat(dino.style.height) * 1.5;
      if(pd > parseFloat(this._obj.style.top)){
        game_over();
      }
    }
  }
}

const gravity   = 1000;
const shpower   = 20;
const shakeFreq = 1500;
const shakeDamp = 8;
const referenceSpeed = 50;

const kb = new Keyboard();

const dino = document.getElementById('dino');
const scHeight = window.innerHeight;
const leg1 = document.getElementById('leg1');
const leg2 = document.getElementById('leg2');
const head = document.getElementById('head');
const menu = document.getElementById('menu');
const ground = document.getElementById('ground');
const gameover = document.getElementById('gameover');

dino.style.width  = `${scHeight/20}px`;
dino.style.height = `${scHeight/15}px`;
leg1.style.width = `${scHeight/50}px`;
leg1.style.height = `${scHeight/30}px`;
leg2.style.width = `${scHeight/50}px`;
leg2.style.height = `${scHeight/30}px`;
head.style.width = `${scHeight/22}px`;
head.style.height = `${scHeight/22}px`;


function setCoordinate(obj, x, y){
    obj.style.left  = `${(x + screenx + shx) / 100 * scHeight}px`;
    obj.style.top = `${(y + screeny + shy) / 100 * scHeight}px`;
}

let jumper = 0;
let velocity = 0;
let shift = 0;
let nshift = 0;
let velocityx = 0;
let nvelocityx = 0;
let screenx = 0;
let screeny = 0;
let screenx_goal = 0;

let shvx = 0;
let shvy = 0;
let shx = 0;
let shy = 0;

let leg_time = 0;
let headx = 0;

let cactuses = [];
let nextCactus = 2;

function CactusUpdate(deltaTime){
  nextCactus -= deltaTime;
  if(nextCactus < 0){
    nextCactus += 0.5 + Math.random() * 3;
    let ref;
    if(Math.random() > 0.5){
      ref = cactus1;
    }else if(Math.random() > 0.5){
      ref = cactus2
    }else if(true){
      ref = cactus3
    }
    cactuses.push(new Cactus(ref));
  }
  let forDelete = -1;
  let i = 0;
  cactuses.forEach((cactus) => {
    if(cactus.Update(deltaTime)){
      forDelete = i;
    }
    i++;
  });
  if(forDelete != -1) cactuses.splice(forDelete, 1);
}

async function Update(deltaTime){
    setCoordinate(dino, 10 + shift + nshift, 52 - jumper);
    setCoordinate(head, 12 + shift + nshift + headx, 49 - jumper + velocity / 200);
    setCoordinate(leg1, 10.5 + shift + nshift, 58 - jumper + Math.sin(leg_time) / 2);
    setCoordinate(leg2, 12.5 + shift + nshift, 58 - jumper + Math.cos(leg_time) / 2);

    setCoordinate(ground, -50, 60);

    if(velocity != 0 || jumper != 0){
      jumper += velocity * deltaTime;
      velocity -= gravity * deltaTime;
    }
    if(velocityx != 0 || shift != 0){
      shift += (velocityx) * deltaTime;
      velocityx -= gravity * deltaTime / 3;
    }
    if(nvelocityx != 0 || nshift != 0){
      nshift += (nvelocityx) * deltaTime;
      nvelocityx += gravity * deltaTime / 3;
    }

    screeny = jumper / 3;
    shvx += -shakeFreq * shx * deltaTime;
    shvy += -shakeFreq * shy * deltaTime;
    shx += shvx * deltaTime;
    shy += shvy * deltaTime;
    const decay = Math.exp(-shakeDamp * deltaTime);
    shvx *= decay;
    shvy *= decay;
    if (Math.abs(shx) < 1e-4 && Math.abs(shvx) < 1e-4) { shx = 0; shvx = 0; }
    if (Math.abs(shy) < 1e-4 && Math.abs(shvy) < 1e-4) { shy = 0; shvy = 0; }

    if(jumper < 0 || (jumper === 0 && velocity != 0)){
      jumper = 0;
      velocity = 0;
      shvx = Math.sign(Math.random()) * (Math.abs(Math.random()) + 0.5) * shpower;
      shvy =  Math.sign(Math.random()) * (Math.abs(Math.random()) + 0.5) * shpower;
    }
    if(shift < 0 || (shift === 0 && velocityx != 0)){
      shift = 0;
      velocityx = 0;
    }
    if(nshift > 0 || (nshift === 0 && nvelocityx != 0)){
      nshift = 0;
      nvelocityx = 0;
    }

    if(jumper === 0){
      screenx_goal = 0 + shift * 2;
      leg_time += deltaTime * 30;
    }else{
      screenx_goal = 10;
      leg_time = Math.PI / 4;
    }
    screenx += (screenx_goal - screenx) * deltaTime;

    if(kb.isClicked("KeyW") && jumper === 0){
      velocity = 180;
    }
    if(kb.isClicked("KeyD") && shift === 0){
      velocityx = 100;
    }
    if(kb.isClicked("KeyA") && shift === 0){
      nvelocityx = -100;
    }

    CactusUpdate(deltaTime);
}

let lastTime = performance.now();
let active = false;
let time_active = 0;

function tick() {
  if(!active) return;
  const now = performance.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  time_active += deltaTime;

  Update(deltaTime);
  kb.Update();

  requestAnimationFrame(tick);
}

function hideall(){
  dino.style.display = "none";
  head.style.display = "none";
  leg1.style.display = "none";
  leg2.style.display = "none";
  ground.style.display = "none";

  cactuses.forEach(cactus =>{
    cactus._obj.style.display = "none";
  })
}

function showall(){
  dino.style.display = "block";
  head.style.display = "block";
  leg1.style.display = "block";
  leg2.style.display = "block";
  ground.style.display = "block";

  cactuses.forEach(cactus =>{
    cactus._obj.style.display = "block";
  })
}

hideall();

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && active) {
    active = false;
    hideall();
    menu.style.top="20%";
  }
});

let menuactive = true;

async function game_over(){
  menuactive = false;
  active = false;
  gameover.style.color = "rgb(255, 80, 80)";
  setTimeout(function(){
    gameover.style.color = "rgb(255, 80, 80, 0)";
    hideall();
    menu.style.top="20%";
    menuactive = true;
  }, 1000);
  restart(false);
}


function restart(start=true){
  cactuses.forEach(cactus =>{
    cactus._obj.remove();
  })

  jumper = 0;
  velocity = 0;
  shift = 0;
  nshift = 0;
  velocityx = 0;
  nvelocityx = 0;
  screenx = 50;
  screeny = 150;
  screenx_goal = 0;
  shvx = 0;
  shvy = 0;
  shx = 0;
  shy = 0;
  leg_time = 0;
  headx = 0;
  cactuses = [];
  nextCactus = 2;

  if(!start | !menuactive)return
  active = true;
  showall();
  menu.style.top="-100%";
  lastTime = performance.now();
  tick();
}

function play(){
  if(!active & menuactive){
    if(time_active == 0){
      restart();
      return;
    }
    active = true;
    showall();
    menu.style.top="-100%";
    lastTime = performance.now();
    tick();
  }
}