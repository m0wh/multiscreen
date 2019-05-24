const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, () => console.log('Server listening on port 3000'))

let devices = []
let ball = {
  pos: {x: 100, y: 100},
  vel: {x: (Math.random()-.5) * 20, y: (Math.random()-.5) * 20},
}
let fullWidth, minHeight

io.on('connection', socket => {
  socket.on('size', ({wWidth, wHeight}) => {
    devices.push({id: socket.id, width: wWidth, height: wHeight})
    socket.emit('index', {devices, id: socket.id, newBall: ball})
    io.emit('devicesChanged', devices)
    fullWidth = devices.reduce((acc, val) => acc + val.width, 0)
    minHeight = Math.min(...devices.map(d => d.height))
  })

  socket.on('disconnect', () => {
    devices = devices.filter(d => d.id !== socket.id)
    io.emit('devicesChanged', devices)
    fullWidth = devices.reduce((acc, val) => acc + val.width, 0)
    minHeight = Math.min(...devices.map(d => d.height))
  })
})

setInterval(() => {
  if (ball.pos.x <= 0 && ball.vel.x < 0 || ball.pos.x >= fullWidth && ball.vel.x > 0) { ball.vel.x *= -1 }
  if (ball.pos.y <= 0 && ball.vel.y < 0 || ball.pos.y >= minHeight && ball.vel.y > 0) { ball.vel.y *= -1 }
  ball.pos.x += ball.vel.x
  ball.pos.y += ball.vel.y
  io.emit('ballMove', ball)
}, 30)
