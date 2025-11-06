const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/auth');
const leaderboardRoutes = require('./routes/leaderboard');
const battleRoutes = require('./routes/battles');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

app.use(cors());
app.use(express.json());

// ---- Serve Frontend ----
// Make sure your frontend folder is at the root: /frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for SPA routing
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/battle', battleRoutes);

// ---- Socket.io for real-time battles ----
io.on('connection', socket => {
    console.log('Player connected:', socket.id);

    socket.on('battleMove', data => {
        // Simple dummy battle logic
        const result = {
            win: Math.random() > 0.5,
            damage: Math.floor(Math.random() * 20) + 1
        };
        socket.emit('battleResult', result);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

// ---- Start Server ----
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Ultra Battle Clash backend running on port ${PORT}`);
});
