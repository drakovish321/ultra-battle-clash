// -------------------------------
// CONFIG
// -------------------------------
const BACKEND_URL = 'https://your-backend-url.onrender.com'; // Replace with your Render backend URL

// Phaser game config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: {
        preload,
        create,
        update
    }
};

// -------------------------------
// GLOBALS
// -------------------------------
let game;
let socket;
let playerData = JSON.parse(localStorage.getItem('playerData')) || { coins:0, level:1, wins:0 };

// -------------------------------
// LOGIN / REGISTER
// -------------------------------
document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!username || !password){
        alert('Please enter username and password.');
        return;
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        if(data.success){
            document.getElementById('login').style.display = 'none';
            document.getElementById('game').style.display = 'block';
            startGame();
        } else {
            alert(data.message);
        }
    } catch(err){
        alert('Error connecting to backend.');
        console.error(err);
    }
});

// -------------------------------
// START GAME
// -------------------------------
function startGame(){
    // Start Phaser game
    game = new Phaser.Game(config);

    // Connect Socket.io
    socket = io(BACKEND_URL);

    socket.on('connect', () => {
        console.log('Connected to backend with Socket.io');
    });

    socket.on('battleResult', result => {
        console.log('Battle result:', result);
        if(result.win) playerData.wins += 1;
        updateLeaderboard();
        saveProgress();
    });

    // Update leaderboard periodically
    updateLeaderboard();

    // Save progress on page close
    window.addEventListener('beforeunload', saveProgress);
}

// -------------------------------
// LEADERBOARD
// -------------------------------
async function updateLeaderboard(){
    try {
        const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
        const data = await res.json();
        const lbList = document.getElementById('lbList');
        lbList.innerHTML = '';
        data.forEach(user => {
            lbList.innerHTML += `${user.username}: ${user.wins} wins<br>`;
        });
    } catch(err){
        console.error('Error fetching leaderboard', err);
    }
}

// -------------------------------
// PHASER SCENE
// -------------------------------
function preload(){
    this.load.image('player','assets/player.png');
}

function create(){
    this.add.text(20,20,"Ultra Battle Clash Game");
}

function update(){}

// -------------------------------
// OFFLINE PROGRESS
// -------------------------------
function saveProgress(){
    localStorage.setItem('playerData', JSON.stringify(playerData));
}
