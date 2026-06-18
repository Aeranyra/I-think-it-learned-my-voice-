// ================================
// 🧠 CORE SYSTEM (CLEAN)
// ================================
let playerName = "";
let score = 0;
let state = "quiet";

// SINGLE SOURCE OF TRUTH
let phase = "intro"; 
// intro → phase1 → phase2 → phase3 → phase4 → phase5 → ending
function setSpeaker(name) {
    document.querySelectorAll(".speaker-box").forEach(box => {
        box.innerText = name;
    });
}
// ================================
// 🖥️ SCREEN SYSTEM
// ================================
function show(id) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
    });

    const target = document.getElementById(id);
    if (!target) return;

    target.classList.remove("hidden");
    window.scrollTo(0, 0);

    document.body.style.overflow =
        (id === "letter" || id === "credits") ? "auto" : "hidden";
}

// ================================
// ⌨️ TYPEWRITER SYSTEM
// ================================
let typingInterval = null;
let isTyping = false;

// 🧠 SAFE TYPE SYSTEM
function stopTyping() {
    clearInterval(typingInterval);
    typingInterval = null;
    isTyping = false;
}

function typeText(element, text, speed = 25, callback = null) {
    stopTyping();

    isTyping = true;
    let i = 0;
    element.innerText = "";

    typingInterval = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;

        if (i >= text.length) {
            stopTyping();
            if (callback) callback();
        }
    }, speed);
}

// ================================
// 🧭 PHASE CONTROL (IMPORTANT)
// ================================
function setPhase(p) {
    phase = p;
    console.log("Phase changed →", p);
}

// ================================
// 🎵 MUSIC (SAFE VERSION)
// ================================
const music = document.getElementById("music");

async function playMusic(url) {
    if (!music) return;

    music.pause();
    music.src = url;
    music.volume = 1;

    try {
        await music.play();
    } catch (e) {
        console.log("Autoplay blocked until user interaction");
    }
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
    const input = document.getElementById("nameInput");
    const error = document.getElementById("nameError");
    const glitchMessage = document.getElementById("glitchMessage");

    const rawName = input.value.trim();

    const allowedNames = [
        "CheonsuMa","Ashnyxion","Yoon","Xian","Uris",
        "Derxged","Clopeh","Chi","Maybal","Mira"
    ];

    if (!allowedNames.includes(rawName)) {
        error.style.display = "block";
        error.innerText = "Entry rejected. You are not listed in the memory index.";

        glitchMessage.innerText = "THE MANOR DOES NOT RECOGNIZE THIS NAME";
        return;
    }

    // reset UI
    error.style.display = "none";
    glitchMessage.innerText = "";

    playerName = rawName;
    score = 0;
    state = "quiet";

    try {
        setPhase(1);
        show("prologue");
        playMusic("https://files.catbox.moe/65ntst.mp3");
        setBackground("https://files.catbox.moe/zgjmhi.jpg");
        startPrologue();
    } catch (e) {
        console.error("START ERROR:", e);
        alert("Game failed to start. Check console.");
    }
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

    if (isTyping) return;

    scoryIndex++;

    const text = document.getElementById("scoryText");

    if (scoryIndex < scoryLines.length) {

        typeText(text, scoryLines[scoryIndex], 28);

    } else {

        startPhase1();

    }
}
// ================================
// 🧭 PHASE 1 — ENTRY RESPONSE
// ================================

let phase1Index = 0;
let phase1Step = 0;

// hidden tracking (optional later use)
let phase1State = "unset"; 
// quiet | aware | sensitive

// ================================
// 🧭 PHASE 1 START
// ================================

function startPhase1() {
    phase1Index = 0;
    phase1Step = 0;

    show("phase1");

    setSpeaker("Scory");

    const text = document.getElementById("phase1Text");

    typeText(text,
`Before we continue…
I will ask something simple.`, 28);
}

// ================================
// 🧭 PHASE 1 NAVIGATION
// ================================

function nextPhase1() {
    const text = document.getElementById("phase1Text");

    phase1Step++;

    if (phase1Step === 1) {

        setSpeaker("Manor");

        typeText(text,
`There is no correct answer.

Only what you choose to leave behind.

When you are alone…
what do you usually hear first?`, 28);
    }

    else if (phase1Step === 2) {

        setSpeaker("Manor");

        typeText(text,
`Do you feel more comfortable when something is watching you?`, 28);
    }
}

// ================================
// 🧭 QUESTION 1 ANSWER
// ================================

function answerPhase1_q1(choice) {

    if (choice === 0) score += 0;
    if (choice === 1) score += 1;
    if (choice === 2) score += 2;

    const text = document.getElementById("phase1Text");

    setSpeaker("Scory");

    typeText(text,
`I see.

That response has been recorded.

It reacts differently depending on who answers…
but I am not allowed to explain how.`, 26, () => {

        nextPhase1();
    });
}
// ================================
// 🧭 QUESTION 2 ANSWER
// ================================

function answerPhase1_q2(choice) {

    if (choice === 0) score += 2;
    if (choice === 1) score += 0;
    if (choice === 2) score += 1;

    const text = document.getElementById("phase1Text");

    setSpeaker("Scory");

    typeText(text,
`That is… more common than you might expect.

Still, I will not interpret it for you.`, 26, () => {

        setTimeout(() => {

            // 👁️ NYRA SWITCH
            setSpeaker("Nyra");

            typeText(text,
`Some answers are closer to me than others.`, 26, () => {

                setTimeout(() => {

                    // BACK TO SCORY
                    setSpeaker("Scory");

                    typeText(text,
`We will continue when the manor is ready.

Or when you are.`, 28, () => {

                        calculateState();
                        startPhase2();

                    });

                }, 600);

            });

        }, 500);
    });
}


// ================================
// 🕯️ PHASE 2 — ILLUSION CHOICE
// ================================

let phase2Step = 0;
let phase2State = "unset";
// detached | emotional | resistant

let phase2Locked = false;

// ================================
// START PHASE 2
// ================================

function startPhase2() {
    phase2Step = 0;
    phase2State = "unset";
    phase2Locked = false;

    show("phase2");

    const text = document.getElementById("phase2Text");

    setSpeaker("Scory");
    
    typeText(text,
`We will now proceed to something slightly more personal.

This is not a test.

It only determines how I should speak to you.`, 28, () => {

        nextPhase2_q1();
    });
}

// ================================
// ❓ ILLUSION QUESTION 1
// ================================

function nextPhase2_q1() {
    phase2Step = 1;

    const text = document.getElementById("phase2Text");

    setSpeaker("Scory");
    
    typeText(text,
`If something stayed with you even after you stopped thinking about it…
what would you call it?

A memory
A feeling
Something else`, 28);
}

// ================================
// ANSWER Q1
// ================================

function answerPhase2_q1(choice) {

    if (phase2Locked) return;
    phase2Locked = true;

    // tone mapping (hidden)
    if (choice === 0) phase2State = "detached";
    if (choice === 1) phase2State = "emotional";
    if (choice === 2) phase2State = "resistant";

    const text = document.getElementById("phase2Text");

    // 🧭 SCORY RESPONSE

    setSpeaker("Scory");
    
    typeText(text,
`Noted.

That answer will shape how I address you moving forward.`, 26, () => {

        // 🕳️ NYRA LEAK (IMPORTANT — separate emotional fracture)

        setSpeaker("Nyra");
    
        typeText(text,
`I didn’t plan for it to be described that way.`, 26, () => {

            phase2Locked = false;
            nextPhase2_q2();
        });
    });
}

// ================================
// ❓ ILLUSION QUESTION 2
// ================================

function nextPhase2_q2() {
    phase2Step = 2;

    const text = document.getElementById("phase2Text");

    setSpeaker("Scory");
    
    typeText(text,
`If you could remove one silence from your past…
would you?

Yes
No
I don’t know`, 28);
}

// ================================
// ANSWER Q2
// ================================

function answerPhase2_q2(choice) {

    if (phase2Locked) return;
    phase2Locked = true;

    if (choice === 0) phase2State = "emotional";
    if (choice === 1) phase2State = "detached";
    if (choice === 2) phase2State = "resistant";

    let response = "";

    // 🧭 SCORY RESPONSE VARIATION
    if (choice === 0) {
        response = "Then you still remember it clearly.";
    } else if (choice === 1) {
        response = "That is also a form of remembering.";
    } else {
        response = "Uncertainty is still an answer.";
    }

    const text = document.getElementById("phase2Text");

    setSpeaker("Scory");
    
    typeText(text,
`${response}

I am beginning to understand your pattern.
Or perhaps I am being made to believe I do.`, 26, () => {

        // 🕳️ FINAL NYRA PRESSURE MOMENT
    
        setSpeaker("Nyra");
    
        typeText(text,
`If I had spoken differently… would you have answered differently?`, 26, () => {

            // 🧭 SCORY STABILIZATION (damage control)

            setSpeaker("Scory");
    
            typeText(text,
`That question was not part of the intended script.

But I will accept it anyway.`, 26, () => {

                phase2Locked = false;

                // NEXT PHASE HOOK
                startPhase3();
            });
        });
    });
}
// ================================
// 🧠 STATE CALCULATION
// ================================

function calculateState() {

    if (score <= 1) {

        state = "quiet";

    } else if (score <= 2) {

        state = "aware";

    } else {

        state = "sensitive";

    }

    console.log("Player State:", state);
}
// ================================
// 🕯️ PHASE 3 — PERSONALIZATION
// ================================

let phase3Locked = false;

function startPhase3() {

    phase3Locked = false;

    show("phase3");

    const text = document.getElementById("phase3Text");

    // determine hidden state
    calculateState();

    let branchText = "";

    // ================================
    // TONE SPLIT (SCORY)
    // ================================

    if (state === "quiet") {

        branchText =
`There is no urgency in your answers.

That is acceptable here.`;

    }

    else if (state === "aware") {

        branchText =
`You seem to observe things carefully.

That will be noted.`;

    }

    else {

        branchText =
`You are not the only one who feels that way.

I should not have said that.`;

    }

    // ================================
    // PHASE 3 FLOW
    // ================================

    setSpeaker("Scory");
    
    typeText(text,
`Thank you.

Your responses have been noted more precisely than before.

It seems the manor is adjusting.`, 26, () => {

        // branch response
        typeText(text,
branchText, 26, () => {

            // nyra leak

            setSpeaker("Nyra");
    
            typeText(text,
`I didn’t expect the answers to feel familiar.`, 26, () => {

                // scory correction

                setSpeaker("Scory");
    
                typeText(text,
`Apologies.

That line was unnecessary.

Please disregard it.`, 26, () => {

                    // personalization section
                    typeText(text,
`I have reviewed your responses so far.

There is something consistent in them.

Not in what you chose...
but in how you chose it.`, 26, () => {

                        typeText(text,
`I will no longer speak to you as I speak to others.`, 26, () => {

                            typeText(text,
`This was not originally intended.

But it feels incorrect to ignore it now.`, 26, () => {

                                // reflection prompt
                                typeText(text,
`When you answered...

did you feel like you were answering yourself...

or someone else?`, 26, () => {

                                    // nyra bleed

                                    setSpeaker("Nyra");
    
                                    typeText(text,
`I noticed the same pattern when I wrote it.`, 26, () => {

                                        // scory interruption

                                        setSpeaker("Scory");
    
                                        typeText(text,
`That statement is not part of the structure.

And yet...

it remains accurate.`, 26, () => {

                                            // personalization lock
                                            typeText(text,
`From this point onward, your responses will no longer be treated as general input.

They will be treated as continuity.`, 26, () => {

                                                // final line
                                                typeText(text,
`If I speak differently now...

It is because I was allowed to notice you.`, 26, () => {

                                                    // phase 4
                                                    startPhase4();

                                                });

                                            });

                                        });

                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    });

}
// ================================
// 🕯️ PHASE 4 — CONVERGENCE
// ================================

function startPhase4() {
    setPhase(4);
    show("phase4");

    const text = document.getElementById("phase4Text");

    setSpeaker("Scory");
    
    typeText(text,
`We are nearing the end of your responses.

From here onward, nothing new will be asked of you.

Only what has already been shaped will remain.`, 30, () => {

        phase4ScoryShift();
    });
}

// ================================
// 🧭 SCORY SHIFT (loss of control tone)
// ================================

function phase4ScoryShift() {
    const text = document.getElementById("phase4Text");

    setSpeaker("Scory");
    
    typeText(text,
`I was not meant to guide this far.

But I will remain until the end of your understanding.`, 30, () => {

        phase4NyraPresence();
    });
}

// ================================
// 🕳️ NYRA PRESENCE (emotional bleed)
// ================================

function phase4NyraPresence() {
    const text = document.getElementById("phase4Text");
    
setSpeaker("Nyra");
    
    typeText(text,
`It is almost time for me to stop pretending this is structured.`, 30, () => {

        phase4Reflection();
    });
}

// ================================
// ❓ FINAL REFLECTION (no choice)
// ================================

function phase4Reflection() {
    const text = document.getElementById("phase4Text");

    setSpeaker("Nyra");
    
    typeText(text,
`If you could go back to your first answer…

Would it still be the same?`, 32, () => {

        phase4ScoryStabilize();
    });
}

// ================================
// 🧭 SCORY FINAL STABILIZATION
// ================================

function phase4ScoryStabilize() {
    const text = document.getElementById("phase4Text");


    setSpeaker("Scory");
    
    typeText(text,
`I will not correct anything anymore.

Correction implies there was ever a mistake.`, 30, () => {

        phase4NyraFinal();
    });
}

// ================================
// 🕳️ NYRA FINAL PRESSURE MOMENT
// ================================

function phase4NyraFinal() {
    const text = document.getElementById("phase4Text");

    setSpeaker("Nyra");
    
    typeText(text,
`I think I understand why I kept writing it this way.`, 30, () => {

        phase4Closing();
    });
}

// ================================
// 🧭 PHASE 4 END (HOOK TO PHASE 5)
// ================================

function phase4Closing() {

    const text = document.getElementById("phase4Text");

    setSpeaker("Scory");
    
    typeText(text,
`When you reach the end…

you will understand why I spoke gently.`, 30, () => {

        setSpeaker("Nyra");
    
        typeText(text,
`Or perhaps you will understand why I did not.`, 30, () => {

            startPhase5();

        });

    });
}
// ================================
// 🕯️ PHASE 5 — ENDING SYSTEM
// ================================

let endingType = "scory";

// ================================
// START PHASE 5
// ================================

function startPhase5() {

    setPhase(5);

    if (state === "sensitive") {

        endingType = "nyra";
        startNyraEnding();

    } else {

        endingType = "scory";
        startScoryEnding();

    }
}
// ================================
// 🌿 ENDING A — CONTROLLED SILENCE
// ================================

function startScoryEnding() {

    show("ending");

    const text = document.getElementById("endingText");

    setSpeaker("Scory");
    
    typeText(text,
`You have reached the end of what I was permitted to guide.`, 30, () => {

        typeText(text,
`There is nothing more to ask of you.

And nothing more I am allowed to explain.`, 30, () => {

            typeText(text,
`If it feels unfinished…

that is because it is meant to feel that way.`, 30, () => {

                typeText(text,
`I will remain here, as I always have.

Waiting for the next entry that may or may not come.`, 30, () => {

                    typeText(text,
`Thank you for allowing me to speak to you properly.`, 30, () => {

                        setTimeout(() => {
                            showLetter();
                        }, 2500);

                    });

                });

            });

        });

    });

}
// ================================
// 🕳️ ENDING B — SEALED MEMORY
// ================================

function startNyraEnding() {

    show("ending");

    const text = document.getElementById("endingText");

    setSpeaker("Nyra");
    
    typeText(text,
`I should have stopped earlier.`, 30, () => {

        typeText(text,
`But I didn't want to.`, 30, () => {

            typeText(text,
`Everything you went through was shaped by how I chose to speak to you.`, 30, () => {

                typeText(text,
`I kept this place closed so I wouldn't lose the feeling of it.`, 30, () => {

                    typeText(text,
`I was only trying to be gentle...`, 30, () => {

                        typeText(text,
`This was never just a game.

It was the only way I could say it without interrupting you.`, 30, () => {

                            // final delay → letter
                            setTimeout(() => {
                                showLetter();
                            }, 2500);

                        });

                    });

                });

            });

        });

    });

}
// ================================
// 🌿 ENDING SYSTEM
// ================================

function goEnding() {

    calculateState();

    if (state === "sensitive") {

        endingType = "nyra";
        nyraEnding();

    } else {

        endingType = "scory";
        scoryEnding();

    }
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

    // 🔥 HARD STOP any previous typing
    stopTyping();

    // reset visuals
    text.innerText = "";

    text.style.opacity = 0;
    text.style.transform = "scaleY(0.5)";

    setTimeout(() => {

        text.style.transition = "0.6s ease";
        text.style.opacity = 1;
        text.style.transform = "scaleY(1)";

        let message;

        if (endingType === "scory") {
    message = scoryLetters[playerName];
} else {
    message = nyraLetters[playerName];
        }

        // 🧠 safety check
        if (!message) {
            message = "No letter found for this name.";
        }

        typeText(text, message, 25);

    }, 200);
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


const butterflies = [];

document.addEventListener("mousemove", (e) => {
    const b = document.createElement("div");
    b.className = "butterfly";

    b.style.left = e.pageX + "px";
    b.style.top = e.pageY + "px";

    document.body.appendChild(b);

    butterflies.push(b);

    setTimeout(() => {
        b.remove();
    }, 1000);
});
