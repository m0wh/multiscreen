let selfIndex, selfID, allDevices, selfTranslate = 0, fullWidth, minHeight
const socket = io()

let ball = {
  pos: {x: 0, y: 0},
  vel: {x: 0, y: 0}
}, old = ball

socket.emit('size', {wWidth: window.innerWidth, wHeight: window.innerHeight})

socket.on('index', ({devices, id, newBall}) => {
  ball = newBall
  selfID = id
  allDevices = devices
  selfIndex = allDevices.map(d => d.id).indexOf(selfID)
  selfTranslate = allDevices.slice(0, selfIndex).reduce((acc, val) => acc - val.width, 0)
  fullWidth = allDevices.reduce((acc, val) => acc + val.width, 0)
  minHeight = Math.min(...allDevices.map(d => d.height))
  document.querySelector('section#loading').style.display = 'none'
  document.querySelector('p#selfIndex').innerHTML = selfIndex + 1
  document.querySelector('section#app').style.display = 'inherit'
  document.querySelector('canvas').style.display = 'inherit'
})

socket.on('devicesChanged', devices => {
  allDevices = devices
  selfIndex = allDevices.map(d => d.id).indexOf(selfID)
  selfTranslate = allDevices.slice(0, selfIndex).reduce((acc, val) => acc - val.width, 0)
  fullWidth = allDevices.reduce((acc, val) => acc + val.width, 0)
  minHeight = Math.min(...allDevices.map(d => d.height))
  document.querySelector('p#selfIndex').innerHTML = selfIndex + 1
})

socket.on('ballMove', newBall => ball = newBall)

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(0)
  frameRate(30)
}

function draw() {
  translate(selfTranslate, 0)
  background(0, 30)

  strokeWeight(10)
  stroke('#f00')
  noFill()

  if (ball.pos.x <= 0 && ball.vel.x < 0 || ball.pos.x >= fullWidth && ball.vel.x > 0) { ball.vel.x *= -1 }
  if (ball.pos.y <= 0 && ball.vel.y < 0 || ball.pos.y >= minHeight && ball.vel.y > 0) { ball.vel.y *= -1 }

  ball.pos.x += ball.vel.x
  ball.pos.y += ball.vel.y

  line(old.pos.x, old.pos.y, ball.pos.x, ball.pos.y)
  old = ball
}