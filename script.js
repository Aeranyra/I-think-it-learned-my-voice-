
// ================================
// 🕯️ SYSTEM CORE (NYRA / SCORY GAME)
// ================================

// Player Data
let playerName = "";
let score = 0;

// ================================
// 🧭 SCENE CONTROLLER
// ================================
function show(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

// ================================
// 🎵 MUSIC SYSTEM
// ================================
const music = document.getElementById("music");

function playMusic(url) {
    if (!music) return;

    music.pause();
    music.src = url;
    music.volume = 1;
    music.play();
}

// ================================
// 🖼️ BACKGROUND SYSTEM
// ================================
function setBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

// ================================
// 🧠 SCORE SYSTEM
// ================================
function addScore(value) {
    score += value;
}

---

# 🏰 TITLE SCREEN SYSTEM
function startGame() {
    const input = document.getElementById("nameInput");

    if (!input || input.value.trim() === "") return;

    playerName = input.value.trim();
    score = 0;

    show("prologue");

    playMusic("https://files.catbox.moe/65ntst.mp3");
    setBackground("https://files.catbox.moe/zgjmhi.jpg");

    startPrologue();
}

// Enter key support
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const titleScreen = document.getElementById("titleScreen");

        if (titleScreen && !titleScreen.classList.contains("hidden")) {
            startGame();
        }
    }
});

---

# 🕯️ PROLOGUE SYSTEM (STEP BASED)

// Prologue Text
const prologueLines = [
`Welcome.
I am Scory, the attendant of this place.`,

`If you are reading this, then your entry has already been recorded.`,

`There is no need to worry about how you arrived.
That part is no longer important.`,

`The Game Master prefers silence.
So I will speak in their place.`,

`You will be asked simple questions.
Answer them however you wish.`,

`Nothing here is meant to harm you.`,

`At least… that is what I was told to say.`,

`Please proceed when you are ready.
The manor is already listening.`
];

let prologueIndex = 0;

// Start Prologue
function startPrologue() {
    prologueIndex = 0;
    show("prologue");

    document.getElementById("prologueText").innerText =
        prologueLines[0];
}

// Next Prologue Step
function nextPrologue() {
    prologueIndex++;

    if (prologueIndex < prologueLines.length) {
        document.getElementById("prologueText").innerText =
            prologueLines[prologueIndex];
    } else {
        startScoryIntro();
    }
}

---

# 🧭 SCORY INTRO SYSTEM (STEP BASED)

// Scory Lines
const scoryLines = [
`Ah… you are here.`,

`I am Scory.
The one responsible for welcoming you.`,

`You may consider me your guide within this place.`,

`There is no need to be cautious with me.
I do not make decisions.`,

`I only follow what has already been decided.`,

`Soon, you will be asked to respond.
Not to pass. Not to fail.
Only to reveal what is already present.`,

`The Game Master is not present in voice…
but everything here still belongs to them.`,

`For now, please remain at ease.
I will not leave you unattended.`
];

let scoryIndex = 0;

// Start Scory Intro
function startScoryIntro() {
    scoryIndex = 0;
    show("scoryIntro");

    playMusic("https://files.catbox.moe/zo3w4o.mp3");
    setBackground("https://files.catbox.moe/oehsde.jpg");

    document.getElementById("scoryText").innerText =
        scoryLines[0];
}

// Next Scory Step
function nextScory() {
    scoryIndex++;

    if (scoryIndex < scoryLines.length) {
        document.getElementById("scoryText").innerText =
            scoryLines[scoryIndex];
    } else {
        goQ1(); // next phase (you already have later)
    }
}
