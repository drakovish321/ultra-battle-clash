const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const leaderboardRoutes = require('./routes/leaderboard');
const battleRoutes = require('./routes/battles');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/battle', battleRoutes);

// Socket.io for real-time battles
io.on('connection', socket=>{
    console.log('Player connected:', socket.id);
    socket.on('battleMove', data=>{
        const result = {win: Math.random()>0.5}; // dummy battle logic
        socket.emit('battleResult', result);
    });
    socket.on('disconnect', ()=>console.log('Player disconnected'));
});

server.listen(process.env.PORT||3000, ()=>console.log('Server running'));
