const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors');

const corsOptions = {
    credentials: false,
    origin: [
      'https://portal.axiancepartnerseu.com',
      'https://portal.axiancepartners.com',
      'https://dev-portal.axiancepartners.com',
      'https://dev-portal.axiancepartnerseu.com',
      'https://axiance-qa-portal.netlify.app',
      'https://ib-portal-dev.netlify.app',
      'https://everfx2.lightning.force.com',
      'https://everfx2--uat.lightning.force.com',
      'https://everfx2--dev.lightning.force.com',
      'http://localhost:3002',
    ],
};


const port = process.env.PORT || 4001
const index = require('./routes/index')

const app = express()
app.use(cors(corsOptions))
app.use(index)

const server = http.createServer(app)

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3002",
        credentials: true
    }
})

let interval

io.on('connection', (socket) => {
    console.log("New client connnected")
    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => getApiAndEmit(socket), 10000)
    socket.on('disconnect', () => {
        console.log("Client disconnected")
        clearInterval(interval)
    })
})

const getApiAndEmit = socket => {
    const response = new Date()
    socket.emit("FromAPI", response)
}

const getApiEmit = "TODO"

server.listen(port, () => console.log(`Listening on port ${port}`))