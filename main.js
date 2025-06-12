//  Variable
var player = "";
var playing = false;
var turn = "X";
var cells = ["", "", "", "", "", "", "", "", ""];
var game_state = "Playing...";
var X_wins = 0;
var O_wins = 0;
var total_games = 0;
var autosave = true;
var encoded_str = "";
var decoded_arr = [];

const CHARS = {
    "0": "0000000",
    "1": "0000001",
    "2": "0000010",
    "3": "0000011",
    "4": "0000100",
    "5": "0000101",
    "6": "0000110",
    "7": "0000111",
    "8": "0001000",
    "9": "0001001",
    "a": "0001010",
    "b": "0001011",
    "c": "0001100",
    "d": "0001101",
    "e": "0001110",
    "f": "0001111",
    "g": "0010000",
    "h": "0010001",
    "i": "0010010",
    "j": "0010011",
    "k": "0010100",
    "l": "0010101",
    "m": "0010110",
    "n": "0010111",
    "o": "0011000",
    "p": "0011001",
    "q": "0011010",
    "r": "0011011",
    "s": "0011100",
    "t": "0011101",
    "u": "0011110",
    "v": "0011111",
    "w": "0100000",
    "x": "0100001",
    "y": "0100010",
    "z": "0100011",
    "A": "0100100",
    "B": "0100101",
    "C": "0100110",
    "D": "0100111",
    "E": "0101000",
    "F": "0101001",
    "G": "0101010",
    "H": "0101011",
    "I": "0101100",
    "J": "0101101",
    "K": "0101110",
    "L": "0101111",
    "M": "0110000",
    "N": "0110001",
    "O": "0110010",
    "P": "0110011",
    "Q": "0110100",
    "R": "0110101",
    "S": "0110110",
    "T": "0110111",
    "U": "0111000",
    "V": "0111001",
    "W": "0111010",
    "X": "0111011",
    "Y": "0111100",
    "Z": "0111101",
    " ": "0111110",
    ".": "0111111",
    ",": "1000000",
    ":": "1000001"
};
const about = {
    series: "o", // Old Series
    game: "g3", // Game 3, Tic Tac Toe
    version: "v.1.0" // Version
};

//  Functions
//  Setup
document.addEventListener("DOMContentLoaded", () => {
    const star_container = document.getElementById("stars-container");

    function createShootingStar() {
        const star = document.createElement("div");
        star.classList.add("shooting-stars");

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.5;
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;

        star.style.animation = `shootingStar ${Math.random() * 2 + 1}s linear infinite`;

        star_container.appendChild(star);

        setTimeout(() => star.remove(), 3000);

        document.addEventListener('scroll', () => {
            let scroll_pos = window.scrollY;
            if (star) {
                var new_pos = (((scroll_pos * 0.9) - scroll_pos) + 185);
                star.style.top = `${new_pos}px`
            }
        });
    }

    setInterval(createShootingStar, 500);

    const starCount = 100;
    const stillStarContainer = document.getElementById("still-stars-container");
    let stars = [];

    for (let i = 0; i < starCount; i++) {
        let star = document.createElement("div");
        star.classList.add("still-star");

        let xPos = Math.random() * window.innerWidth;
        let yPos = Math.random() * window.innerHeight;

        star.style.left = `${xPos}px`;
        star.style.top = `${yPos}px`;

        let size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.opacity = Math.random() * 0.5 + 0.5;

        let delay = Math.random() * 2;
        star.style.animationDelay = `${delay}s`;

        let speed = Math.random() * 0.5 + 0.2;
        speed *= (size / 2);
        speed = (speed * 0.9) - speed;
        star.dataset.speed = speed;

        stars.push(star);
        stillStarContainer.appendChild(star);
    }

    const moon = document.querySelector("#moon");
    let latestScrollY = 0;
    let ticking = false;

    function updateMoonPosition() {
        const moonOffset = (-0.1 * latestScrollY) + 185;
        moon.style.transform = `translateY(${moonOffset}px)`;
        ticking = false;
    }

    updateMoonPosition();

    window.addEventListener("scroll", () => {
        latestScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateMoonPosition);
            ticking = true;
        }

        let scrollY = window.scrollY;
        stars.forEach(star => {
            let speed = parseFloat(star.dataset.speed);
            star.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    const music = document.getElementById("background-music");
    music.volume = 0.1;

    document.getElementById("game-grid").addEventListener("click", (e) => {
        let cell = e.target;
        if (!cell.classList.contains("cell") || game_state !== "Playing...") {
            return;
        }
        if (!cell.classList.contains("X") && !cell.classList.contains("O")) {
            cells[parseInt(cell.getAttribute("data-idx"))] = turn;
            updateGrid();
            checkWin(turn);
        }
    });

    document.getElementById("encoded-string").addEventListener("click", function () {
        window.navigator.clipboard.writeText(this.textContent);
        window.alert("Encoded string copied to clipboard!");
    });

    //  Function call
    randomQuote();
    updatePlayer();
    if (!player) {
        window.alert("Enter your name");
    }
    setTimeout(() => {
        music.play();
        playing = true;
    }, 5000);
    setVolume(document.querySelector("input[type='range']").value);

    update();
    load();
});

//  Additional features
function randomQuote() {
    const quotes = [
        "Keep Gaming!", //0
        "Play. Complete. Conquer!", //1
        "Gaming Improved!", //2
        "Unleash the Gamer Within!", //3
        "Where Fun Never Ends!", //4
        "Victory on the Door!", //5
        "Play beyond limits!", //6
        "-By Vidit Keshari from VGames" //7
    ];
    const element = document.getElementById("quote");
    var idx = Math.floor(Math.random() * quotes.length);
    element.innerText = quotes[idx];
}

function rename() {
    if (player && /^[a-zA-Z0-9 ]+$/.test(player)) {
        player = document.getElementById("player-name").value;
        window.localStorage.setItem("player", player);
    }
}

function updatePlayer() {
    player = window.localStorage.getItem("player");
    document.getElementById("player-name").value = player;

}

function toggleMusic() {
    const music = document.getElementById("background-music");
    const musicDisplay = document.getElementById("playing");
    if (playing) {
        music.pause();
        playing = false;
        musicDisplay.innerHTML = "Mute";
    } else if (!playing) {
        music.play();
        playing = true;
        musicDisplay.innerHTML = "Playing: Indian walk - Nico Staf";
    }
    music.volume = 0.1;
}

function setVolume(vol) {
    vol = parseFloat(vol);
    const music = document.getElementById("background-music");
    if (vol >= 0 && vol <= 1) {
        music.volume = vol;
        document.getElementById("vol").textContent = `Volume: ${Math.round(vol * 100)}%`;
        document.querySelector("input[type='range']").style.setProperty('--glow-size', `${Math.round(vol * 10, 2)}px`);
    } else {
        console.error("Volume must be between 0 and 1.");
    }
}

//  Mechanics
function checkWin(for_player) {
    const wins = ["012", "345", "678", "036", "147", "258", "048", "246"];
    for (let i = 0; i < wins.length; i++) {
        const win = wins[i];
        if (cells[win[0]] === for_player) {
            if (cells[win[1]] === for_player) {
                if (cells[win[2]] === for_player) {
                    game_state = for_player + " wins!";
                    if (for_player === "X") {
                        X_wins++;
                    } else {
                        O_wins++;
                    }
                    total_games++;
                    update();
                    setTimeout(() => {
                        newGame();
                        if (autosave) save();
                    }, 2000);
                    return;
                }
            }
        }
    }
    checkDraw();
}

function checkDraw() {
    game_state = "Playing...";
    if (!cells.includes("")) {
        game_state = "Draw";
        total_games++;
        setTimeout(() => {
            newGame();
            if (autosave) save();
            changeTurn();
            return;
        }, 2000);
    }
    changeTurn();
    update();
}

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
}

// Game controls mechanincs
function newGame() {
    cells = ["", "", "", "", "", "", "", "", ""];
    game_state = "Playing...";
    updateGrid();
    update();
}
function resetScore() {
    X_wins = 0;
    O_wins = 0;
    total_games = 0;
    update();
    updateGrid();
}

function reset() {
    resetScore();
    turn = "X";
    newGame();
    setVolume(0.2);
    document.getElementById("encoded").value = "";
    clearSavedData();
}

function clearSavedData() {
    window.localStorage.setItem("o.g3.encoded_str", "");
}

// Update in front end
function update() {
    document.getElementById("game-state").textContent = "Game state: " + game_state;
    document.getElementById("turn").textContent = "Player turn: " + turn;
    document.getElementById("total-games").textContent = "Total games played: " + total_games;
    document.getElementById("X-wins").textContent = "X wins: " + X_wins;
    document.getElementById("O-wins").textContent = "O wins: " + O_wins;
    document.getElementById("draws").textContent = `Draws: ${total_games - (X_wins + O_wins)}`;
    document.getElementById("autosave").textContent = autosave ? "Autosave: Saving" : "Autosave: Not Saving";
    encode();
}

function updateGrid() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.classList.remove("X", "O");
        if (cells[i] !== "") cell.classList.add(cells[i]);
        cell.textContent = cells[i];
    });
}

// Game saveing controls mechanics
function save() {
    encode();
    window.localStorage.setItem("o.g3.encoded_str", encoded_str);
}

function load() {
    encoded_str = window.localStorage.getItem("o.g3.encoded_str");
    if (!encoded_str) {
        window.alert("No saved game found.");
        return;
    }
    document.getElementById("encoded").value = encoded_str;
    decode();
}

function toggleAutosave() {
    autosave = !autosave;
    if (autosave) {
        document.getElementById("autosave").textContent = "Autosave: Saving";
    } else {
        document.getElementById("autosave").textContent = "Autosave: Not Saving";
    }
    save();
}

function encode() {
    function encodePlayer() {
        let encoded;
        if (!player) {
            window.alert("Enter your name");
            player = "Guest";
        }
        encoded = player.split("").map(char => CHARS[char]).join(",");
        return encoded;
    }

    function encodeWins() {
        let encoded = "";
        encoded =
            (X_wins.toString()
                .split("")
                .map(char => CHARS[char])
                .join(","))
            + " " +
            (O_wins.toString()
                .split("")
                .map(char => CHARS[char])
                .join(","))
            + " " +
            (total_games.toString()
                .split("")
                .map(char => CHARS[char])
                .join(","));
        return encoded;
    }

    function encodeTurn() {
        let encoded = Array(turn).map(char => CHARS[char]).join("");
        return encoded;
    }

    function encodeMusicVol() {
        const music = document.getElementById("background-music");
        let encoded = String(Math.floor(music.volume * 100)).split("").map(char => CHARS[char]).join(",");
        return encoded;
    }

    function encodeAutosave() {
        let encoded = +autosave;
        encoded = String(encoded).split("").map(char => CHARS[char]).join("");
        return encoded;
    }

    encoded_str = about.series + "," + about.game + "," + about.version + " " + encodePlayer() + " " + encodeWins() + " " + encodeTurn() + " " + encodeMusicVol() + " " + encodeAutosave();
    updateEncoded();
}

function updateEncoded() {
    document.getElementById("encoded-string").textContent = encoded_str;
}

function decodeFromInput() {
    encoded_str = document.getElementById("encoded").value;
    if (!encoded_str) {
        window.alert("Please enter an encoded string.");
        return;
    }
    decode();
}

function decode() {
    decoded_arr = [];
    let parts = encoded_str.split(" ");
    if (parts.length != 8) {
        window.alert("Invalid encoded string");
        return;
    }

    let about_game = parts[0].split(",");
    if (about_game[0] !== about.series) {
        window.alert("Sorry, the encoded string given does not belong to this series. (Old Series)");
        return;
    }
    if (about_game[1] !== about.game) {
        window.alert("Sorry, the encoded string given does not belong to this game.");
        return;
    }
    if (about_game[2] !== about.version) {
        window.alert("Sorry, the encoded string given does not belong to this version of the game. We are upgrading it to the lastest version of the game.");
        about_game[2] = about.version;
    }

    let decoded_player;
    decoded_player = parts[1].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    if (!decoded_player) {
        window.alert("Sorry, we find that the the encoded string contains currupted player name. Please try again. You can rename yourself manually above. We will ignore the curropted player tag.");
        player = "Guest";
    }

    let decoded_X_wins;
    decoded_X_wins = parts[2].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    decoded_X_wins = parseInt(decoded_X_wins);

    let decoded_O_wins;
    decoded_O_wins = parts[3].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    decoded_O_wins = parseInt(decoded_O_wins);

    let decoded_total_games;
    decoded_total_games = parts[4].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    decoded_total_games = parseInt(decoded_total_games);

    if (!/^[0-9]+$/.test(decoded_X_wins)) {
        window.alert("Sorry, we find that the the encoded string contains currupted X wins. Please try again.");
        return;
    }
    if (!/^[0-9]+$/.test(decoded_O_wins)) {
        window.alert("Sorry, we find that the the encoded string contains currupted O wins. Please try again.");
        return;
    }
    if (!/^[0-9]+$/.test(decoded_total_games)) {
        window.alert("Sorry, we find that the the encoded string contains currupted total games. Please try again.");
        return;
    }

    let decoded_turn;
    decoded_turn = parts[5].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");

    if (decoded_turn !== "X" && decoded_turn !== "O") {
        window.alert("Sorry, we find that the the encoded string contains currupted player turn. Please try again.");
        return;
    }

    let decoded_music_vol;
    decoded_music_vol = parts[6].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    if (!/^[0-9]+$/.test(decoded_music_vol)) {
        decoded_music_vol = "20";
    }
    decoded_music_vol = parseInt(decoded_music_vol) / 100;

    let decoded_autosave = parts[7].split(",").map(code => Object.keys(CHARS).find(key => CHARS[key] === code)).join("");
    decoded_autosave = parseInt(decoded_autosave);

    if ((decoded_autosave > 1) || (decoded_autosave < 0)) {
        window.alert("Sorry, we find that the string contains currupted autosave data. We have set autosave to default (i.e. on)");
        console.log(autosave);
        decoded_autosave = 1;
    }

    decoded_arr.push(decoded_player, decoded_X_wins, decoded_O_wins, decoded_total_games, decoded_turn, decoded_music_vol, decoded_autosave);
    updateDecoded();
}

function updateDecoded() {
    player = decoded_arr[0];
    X_wins = decoded_arr[1];
    O_wins = decoded_arr[2];
    total_games = decoded_arr[3];
    turn = decoded_arr[4];
    setVolume(decoded_arr[5]);
    autosave = Boolean(decoded_arr[6]);
    console.log(autosave);
    window.localStorage.setItem("player", player);
    updatePlayer();
    update();
    encode();
}
