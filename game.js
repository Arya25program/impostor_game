const addBtn = document.getElementById('add-btn');
const playerInput = document.getElementById('player-input');
const playersList = document.getElementById('players-list');
const startBtn = document.getElementById('start-btn');

let playerCount = 0;

addBtn.addEventListener('click', () => {
    const playerName = playerInput.value.trim();

    if (playerName === "") {
        alert("Please enter a player name!");
        return;
    }

    playerCount++;

    const newPlayer = document.createElement('div');
    newPlayer.classList.add('player-box');
    newPlayer.textContent = `Player ${playerCount}: ${playerName}`;

    playersList.prepend(newPlayer); // adds new player on top
    playerInput.value = "";
    playerInput.focus();
});

startBtn.addEventListener('click', () => {
    const players = Array.from(playersList.children).map(p => p.textContent);

    if (players.length < 3) {
        alert("Add at least 3 players to start the game!");
        return;
    }

    // Save players to localStorage
    localStorage.setItem("players", JSON.stringify(players));

    // Go to logic page
    location.href = "logic.html";
});
