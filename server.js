import express from 'express'
import {createServer} from 'node:http'
import dotenv from 'dotenv'

import { fileURLToPath } from 'node:url';
import { dirname,join } from 'node:path';

import { Server } from 'socket.io';
const app = express();

const server = createServer(app);
const io = new Server(server);
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url))

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
})

// from frontend to server we can console.log message 
// frontend= socket.emit value 
// backend = socket.on value (to get the emitted the value) 
// and vice versa
// frontend= socket.on value (to get the emitted the value) 
// backend = socket.emit value 
// emit("calling-name",value)
// on("calling-name",(value)={log(value)})

// this one is to peer-to-peer
// io.on("connection",(socket)=>{
//     let text;
//     socket.on('chat message',(msg)=>{
//         console.log("message:", msg);
//         io.emit("msg-frontend",msg);
//     })
// })

//broadCasting
// io.emit("hello","world")
io.on('connection', (socket) => {
    socket.join('room');

    socket.on('chat message', (msg) => {
      io.to('room').emit('chat message', msg);
    });
  });

const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
})