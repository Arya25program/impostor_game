const playerContainer = document.getElementById("player-buttons");
const roundInfo = document.getElementById("round-info");

let players = JSON.parse(localStorage.getItem("players")) || [];
let wordData = null;
let impostorIndex = null;

// Force fresh random on every page load
const randomSeed = Math.floor(Math.random() * 10000);
const wordsUrl = `words.json?v=${randomSeed}`; // cache-buster

fetch(wordsUrl)
    .then(res => res.json())
    .then(data => {
        setupGame(data);
    })
    .catch(err => {
        console.warn("⚠️ Could not load words.json. Using fallback data.");
        const fallback = [
            { word: "book", clue: "paper" },
            { word: "apple", clue: "fruit" },
            { word: "water", clue: "fluid" },
            { word: "sun", clue: "bright" },
            { word: "rain", clue: "wet" },
            { word: "coffee", clue: "drink" },
            { word: "mountain", clue: "tall" },
            { word: "car", clue: "drive" },
            { word: "music", clue: "sound" },
            { word: "computer", clue: "machine" }
        ];
        setupGame(fallback);
    });

function setupGame(words) {
    if (players.length === 0) {
        roundInfo.textContent = "No players found. Go back and add players first.";
        return;
    }

    // Pick a truly random word from dictionary
    const randomIndex = Math.floor(Math.random() * words.length);
    wordData = words[randomIndex];

    // Random impostor from players
    impostorIndex = Math.floor(Math.random() * players.length);

    console.log(`🎲 Selected Word: ${wordData.word}, Clue: ${wordData.clue}, Impostor: ${players[impostorIndex]}`);

    roundInfo.innerHTML = `
        Word and clue selected.<br>
        One random player is the <b>IMPOSTOR</b>!<br>
        Pass the device and press & hold your name.
    `;

    generatePlayerButtons();
}

function generatePlayerButtons() {
    playerContainer.innerHTML = ""; // clear previous
    players.forEach((name, index) => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.textContent = name;
        btn.style.width = "300px";

        let holdTimeout;
        btn.addEventListener("mousedown", () => {
            holdTimeout = setTimeout(() => revealWord(index, btn), 400);
        });
        btn.addEventListener("mouseup", () => clearTimeout(holdTimeout));
        btn.addEventListener("mouseleave", () => clearTimeout(holdTimeout));

        playerContainer.appendChild(btn);
    });
}

function revealWord(index, btn) {
    if (index === impostorIndex) {
        btn.textContent = `You are IMPOSTOR!\nClue: ${wordData.clue}`;
        btn.style.backgroundColor = "#ff6666";
    } else {
        btn.textContent = `Word: ${wordData.word}`;
        btn.style.backgroundColor = "#8ef57d";
    }

    setTimeout(() => {
        btn.textContent = players[index];
        btn.style.backgroundColor = "";
    }, 2000);
}

// --- Check Clue Button ---
const checkClueBtn = document.getElementById("check-clue-btn");
checkClueBtn.addEventListener("click", () => {
    if (!wordData || impostorIndex === null) {
        alert("Round not ready yet!");
        return;
    }

    const impostorInfo = {
        name: players[impostorIndex],
        clue: wordData.clue,
        word: wordData.word
    };
    localStorage.setItem("impostorInfo", JSON.stringify(impostorInfo));
    location.href = "impostor.html";
});
