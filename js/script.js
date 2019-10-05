let canvas, ctx;
let bgImage,treeImage,giraImage;
let bgReady,treeReady,giraReady;
let elapsedTime=0;
const SECONDS_PER_ROUND =20;
let startTime = Date.now();
canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 480;
let score =0;
ctx = canvas.getContext('2d');
document.getElementById('game').appendChild(canvas);
let giraX = canvas.width / 2;
let giraY = canvas.height / 2;
let treeX = 100;
let treeY = 100;
let username = document.getElementById('input-name').value

function getAppState()
{
  return JSON.parse(localStorage.getItem('appState')) || {
    gameHistory:[],
    currenHighScore:0,
    bestUser: document.getElementById('input-name').value
    
  }

}

function save(appState)
{
  appState.bestUser = document.getElementById("input-name").value
  localStorage.setItem('appState',JSON.stringify(appState))
}

function loadImage()
{   
    bgImage = new Image()
    bgImage.onload = function()
    {
        bgReady = true
    }
    bgImage.src = "image/yard.jpg";
    giraImage = new Image()
    giraImage.onload = function()
    {
        giraReady = true
    }
    giraImage.src = "image/men.png";
    treeImage = new Image();
    treeImage.onload = function()
    {
        treeReady = true
    }
    treeImage.src = "image/diamon_3.png"
}


let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

function move()
{
    
  if (38 in keysDown) { // Player is holding up key
    giraY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    giraY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    giraX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    giraX += 5;
  }

}

function wrapArround()
{
  if (giraX <= 0) {
    giraX = 0
  }

  // Hero going right off screen
  if (giraX >= canvas.width) {
    giraX = canvas.width-10
  }

  // Hero going up off screen
  if (giraY <= 0) {
    giraY = 0
  }

  // Hero going down off screen
  if (giraY >= canvas.height) {
    giraY = canvas.height - 10
  }
}

function checkWhenGotDiamond()
{
  const heroHasCaughtMonster = giraX <= (treeX + 32)
  && treeX <= (giraX + 32)
  && giraY <= (treeY + 32)
  && treeY <= (giraY + 32)
  if (heroHasCaughtMonster) {
    
    treeX = Math.floor(Math.random() * canvas.width - 10)
    treeY = Math.floor(Math.random() * canvas.height - 10)
    score += 1
    document.getElementById('currentScore').innerHTML = score;
    const appState = getAppState()
    //appState.currentUser = document.getElementById("input-name").value
    if(appState.currenHighScore < score)
    {
      appState.currenHighScore = score
      save(appState)
    }
   
  }
}




function update() {
    // Update the time.
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if(elapsedTime>=SECONDS_PER_ROUND) return
 
  move()
  wrapArround()
  checkWhenGotDiamond()
}



let render = function()
{
    if(bgReady)
    {
        ctx.drawImage(bgImage,0,0);
    }
   if(giraReady)
    {
        ctx.drawImage(giraImage,giraX,giraY)
    }
    if(treeReady)
    {
        ctx.drawImage(treeImage,treeX,treeY)
    }
    const stillHasTimeOnClock = elapsedTime<=10
    if(stillHasTimeOnClock)
    {
      document.getElementById('timer').innerHTML = `Second Remaining: ${SECONDS_PER_ROUND - elapsedTime}`
    }else{
      document.getElementById('timer').innerHTML = `Game Over`
      document.getElementById('highScore').innerHTML = getAppState().currenHighScore
      let currentCore = document.getElementById('currentScore').innerHTML;
      let scoreInState = getAppState().currenHighScore
      if(currentCore<scoreInState)
      {
        document.getElementById('current-text').innerHTML = `<h2 style="color:yelow">Please try your best</h2>`
      }
      else{
        document.getElementById('current-text').innerHTML = `<h2 style="color:red">You got best score</h2>`

      }
    }
}




let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function reset()
{
  window.location.reload()
}

function main(){
  let username = document.getElementById('input-name').value
  document.getElementById('tell-name').innerHTML = `<h1 style="color:red">Welcome ${username}! Let grab your diamond</h1>`;
     update()
    render()
    requestAnimationFrame(main)
}




loadImage()
setupKeyboardListeners();

