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

let game;
let playerData = JSON.parse(localStorage.getItem('playerData')) || { coins:0, level:1, wins:0 };
let socket;

document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    });
    const data = await res.json();
    if(data.success){
        document.getElementById('login').style.display='none';
        document.getElementById('game').style.display='block';
        startGame();
    } else {
        alert(data.message);
    }
});

function startGame(){
    game = new Phaser.Game(config);

    // connect socket
    socket = io();

    // send battle move example
    socket.on('battleResult', (result)=>{
        console.log('Battle result:', result);
        playerData.wins += result.win ? 1:0;
        updateLeaderboard();
    });

    window.addEventListener('beforeunload', ()=>{
        localStorage.setItem('playerData', JSON.stringify(playerData));
    });
}

function preload(){
    this.load.image('player','assets/player.png');
}

function create(){
    this.add.text(20,20,"Ultra Battle Clash Game");
}

function update(){}

function updateLeaderboard(){
    fetch('/api/leaderboard')
        .then(res=>res.json())
        .then(data=>{
            const lb = document.getElementById('leaderboard');
            lb.innerHTML = '<h3>Leaderboard</h3>';
            data.forEach(u=>{
                lb.innerHTML += `${u.username}: ${u.wins} wins<br>`;
            });
        });
}
