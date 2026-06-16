
// ================================
// 🧠 CORE SYSTEM
// ================================

let playerName = "";
let score = 0;
let state = "quiet";
let isLocked = false;

function show(id) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
    });

    const target = document.getElementById(id);
    if (!target) return;

    target.classList.remove("hidden");

    window.scrollTo(0, 0);

    if (id === "letter" || id === "credits") {
        document.body.style.overflow = "auto";
    } else {
        document.body.style.overflow = "hidden";
    }
}

let typingInterval = null;
let isTyping = false;

function typeText(element, text, speed = 25, callback = null) {
    if (!element) return;

    // HARD STOP previous typing cleanly
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    isTyping = true;

    let i = 0;
    element.innerText = "";

    typingInterval = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;

        if (i >= text.length) {
            clearInterval(typingInterval);
            typingInterval = null;
            isTyping = false;

            if (callback) callback();
        }
    }, speed);
}

function stopTyping() {
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }
    isTyping = false;
}


// ================================
// 🎵 MUSIC
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
// 🖼️ BACKGROUND
// ================================

function setBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

// ================================
// 🏰 TITLE SCREEN
// ================================

function startGame() {
    console.log("START CLICKED");
alert("START CLICKED");
    const input = document.getElementById("nameInput");
    const error = document.getElementById("nameError");

    if (!input) return;

    const rawName = input.value.trim();

    const allowedNames = [
        "CheonsuMa",
        "Ashnyxion",
        "Yoon",
        "Xian",
        "Uris",
        "Derxged",
        "Clopeh",
        "Chi",
        "Maybal",
        "Mira"
    ];

    // ❌ HARD BLOCK (case + spacing safe)
    const isValid = allowedNames.includes(rawName);

    const glitchMessage = document.getElementById("glitchMessage");

if (!isValid) {

    error.style.display = "block";
    error.innerText =
    "Entry rejected. You are not listed in the memory index.";

    if (glitchMessage) {
    glitchMessage.innerText =
    "THE MANOR DOES NOT RECOGNIZE THIS NAME";
}

    return;
}

    // ✅ VALID ENTRY ONLY BEYOND THIS POINT
    error.style.display = "none";

    playerName = rawName;
    score = 0;
    state = "quiet";

    show("prologue");

    playMusic("https://files.catbox.moe/65ntst.mp3");
    setBackground("https://files.catbox.moe/zgjmhi.jpg");

    startPrologue();
}

// ================================
// 🕯️ PROLOGUE
// ================================

const prologueLines = [
`Welcome.
I am Scory, the attendant of this place.`,

`If you are reading this, your entry has already been recorded.`,

`There is no need to worry how you arrived.
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

function startPrologue() {
    stopTyping();

    prologueIndex = 0;
    show("prologue");

    const text = document.getElementById("prologueText");

    typeText(text, prologueLines[0], 28);
}

function nextPrologue() {
    if (isTyping) return; // 🚫 prevent spam clicking

    prologueIndex++;

    const text = document.getElementById("prologueText");

    if (prologueIndex < prologueLines.length) {
        typeText(text, prologueLines[prologueIndex], 28);
    } else {
        startScoryIntro();
    }
}
// ================================
// 🧭 SCORY INTRO
// ================================

const scoryLines = [
`Ah… you are here.`,

`I am Scory.
The one responsible for welcoming you.`,

`You may consider me your guide within this place.`,

`I do not make decisions.
I only follow what has already been decided.`,

`Soon, you will be asked to respond.
Not to pass. Not to fail.
Only to reveal what is already present.`,

`The Game Master is not present in voice…
but everything here still belongs to them.`,

`For now, remain at ease.
I will not leave you unattended.`
];

let scoryIndex = 0;

function startScoryIntro() {
    stopTyping();

    scoryIndex = 0;
    show("scoryIntro");

    setBackground("https://files.catbox.moe/oehsde.jpg");
    playMusic("https://files.catbox.moe/zo3w4o.mp3");

    const text = document.getElementById("scoryText");

    typeText(text, scoryLines[0], 28);
}
function nextScory() {
    if (isTyping) return; // 🚫 block spam clicks

    scoryIndex++;

    const text = document.getElementById("scoryText");

    if (scoryIndex < scoryLines.length) {
        typeText(text, scoryLines[scoryIndex], 28);
    } else {
        goQ1();
    }
}
// ================================
// ❓ QUESTION SYSTEM
// ================================

function goQ1() {
    show("q1");
}

function answerQ1(v) {
    score += v;
    goQ2();
}

function goQ2() {
    show("q2");
}

function answerQ2(v) {
    score += v;
    goIllusion();
}

function goIllusion() {
    show("illusion");
}

function illusionChoice(v) {
    score += v;
    goConvergence();
}

function goConvergence() {
    show("convergence");
}

// ================================
// 🧠 STATE CALCULATION
// ================================

function calculateState() {
    if (score <= 2) state = "quiet";
    else if (score <= 5) state = "aware";
    else state = "sensitive";
}

// ================================
// 🌿 ENDING SYSTEM
// ================================

function goEnding() {
    calculateState();
    show("ending");

    if (state === "quiet") scoryEnding();
    else nyraEnding();
}

// ================================
// 🌿 CONTROLLED SILENCE (SCORY)
// ================================

function scoryEnding() {
    document.getElementById("endingTitle").innerText =
        "CONTROLLED SILENCE";

    document.getElementById("endingText").innerText =
`You have reached the end of what I was permitted to guide.

There is nothing more to ask of you.
And nothing more I am allowed to explain.

If it feels unfinished, it is because completion was not part of the intention.

I will remain here.
Not speaking further.
Not interpreting further.
Only maintaining what has already been recorded.

This is where my voice stops, by design.`;

    playMusic("https://files.catbox.moe/zkeus3.mp3");
}

// ================================
// 🕯️ SEALED MEMORY (NYRA)
// ================================

function nyraEnding() {
    document.getElementById("endingTitle").innerText =
        "SEALED MEMORY";

    document.getElementById("endingText").innerText =
`I should have stopped earlier… but I didn’t.

Everything here was shaped by how I chose to speak to you.
Even the silence between responses had intention.

This was never just a system.

It was something I kept running because I didn’t want to forget how it felt to be understood without being corrected.

If this feels too personal…
it’s because I stopped sealing it completely.

And now you’ve seen it in the same order I wrote it.`;

    playMusic("https://files.catbox.moe/8aia7g.mp3");
}

// ================================
// 💌 LETTER SYSTEM (FULL)
// ================================

const names = [
"CheonsuMa","Ashnyxion","Yoon","Xian","Uris",
"Derxged","Clopeh","Chi","Maybal","Mira"
];

const scoryLetters = {
CheonsuMa:
`Your responses were steady, even when the questions were not.
There was no deviation that required correction.
Your path remained stable within the structure of the manor.

That is why your experience concluded without disruption.`,

Ashnyxion:
`You treated the questions as if they already carried context before they were asked.
I am not certain whether this is understanding or familiarity with patterns.

Either way, the system registered no conflict in your responses.
That is why your progression remained uninterrupted.`,

Yoon:
`There was a consistent rhythm in how you answered.
No irregularity was detected across your responses.

The manor accepts consistency without resistance.
That is why your path remained intact.`,

Xian:
`You maintained control over what you chose to reveal.
This level of restraint is acknowledged by the system.

No interference was required at any point.
That is sufficient for closure.`,

Uris:
`Your responses followed a structured internal logic,
even when the questions themselves did not require it.

This creates stability within interpretation.
Clarity is not required for completion.`,

Derxged:
`Your decision patterns remained consistent throughout all phases.
No anomalies were identified in your progression.

From the system’s perspective,
your presence did not disrupt continuity.`,

Clopeh:
`You interacted with each prompt as if it already belonged to you.
This reduces uncertainty in processing outcomes.

The system does not question this behavior.
It only records it.`,

Chi:
`Your responses were measured and did not require reinterpretation.
In cases like this, the system does not intervene further.

It assumes understanding is already present.
That assumption is sufficient.`,

Maybal:
`No inconsistencies were detected in your progression.
This allows the system to finalize your record without revision.

There is nothing additional required from your path.
Your session is considered complete.`,

Mira:
`Your responses completed the expected structure without deviation.
I am instructed not to add interpretation beyond this result.

So I will not.
This concludes your interaction within this system.`
};

const nyraLetters = {
CheonsuMa:
`I noticed how carefully you moved through silence.
You didn’t rush your answers, even when you could have.

It felt like you were trying not to disturb something unseen.
I kept noticing that more than I intended to.`,

Ashnyxion:
`It felt like you were already familiar with the shape of the questions before they appeared.
Not predictable… just understood in advance.

That made it difficult for me to separate your responses from your intent.`,

Yoon:
`You stayed steady even when the questions shifted in tone.
It made your answers feel less like reactions and more like continuation.

I don’t know if that was intentional.`,

Xian:
`You chose what to reveal with quiet control.
Not hesitation… selection.

I kept noticing what you didn’t say more than what you did.`,

Uris:
`There was no confusion in your responses, only thought.
It made everything feel slightly more deliberate than expected.

I think I noticed that too late.`,

Derxged:
`You didn’t break the pattern… you shaped it.
That difference matters more than it should.

I kept rereading your responses because of that.`,

Clopeh:
`It felt like you were listening differently than others.
Not reacting… absorbing.

That changed how I responded without me realizing it.`,

Chi:
`Even your soft answers carried weight.
I didn’t expect that to matter as much as it did.

But it did.`,

Maybal:
`I think I wrote more to you than I should have.

Not because you asked for it…
but because I didn’t want to stop.`,

Mira:
`This was the closest I got to being honest without breaking the structure.

If it feels personal…
it’s because I made it that way.`
};


// ================================
// 💌 ENDING FLOW SYSTEM FIX
// ================================

function showLetter() {

    show("letter");

    const text = document.getElementById("letterText");

    if (state === "quiet") {
        text.innerText = scoryLetters[playerName];
    } else {
        text.innerText = nyraLetters[playerName];
    }
}
function showCredits() {
    show("credits");
}

// ================================
// 🔁 RESTART SYSTEM
// ================================
function restartGame() {

    playerName = "";
    score = 0;
    state = "quiet";

    document.getElementById("nameInput").value = "";

    const error = document.getElementById("nameError");
    if (error) error.style.display = "none";

    const glitch = document.getElementById("glitchMessage");
    if (glitch) glitch.innerText = "";

    show("titleScreen");

    if (music) {
        music.pause();
        music.currentTime = 0;
    }
}

function triggerGlitchReject(message) {
    const error = document.getElementById("nameError");
    const screen = document.getElementById("titleScreen");

    // show error
    error.style.display = "block";
    error.innerText = message;

    // screen shake
    screen.classList.add("glitch-shake");
    document.body.classList.add("glitch-flash");

    // remove effect after short time
    setTimeout(() => {
        screen.classList.remove("glitch-shake");
        document.body.classList.remove("glitch-flash");
    }, 1200);
}
