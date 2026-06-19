// ================================
// CORE STATE
// ================================
let playerName = "";
let score = 0;
let state = "quiet";
let endingType = "scory";
let phase = "intro";

const TYPE_SPEED = 72;
const LETTER_SPEED = 60;

const ALLOWED = ["CheonsuMa","Ashnyxion","Yoon","Xian","Uris","Derxged","Clopeh","Chi","Maybal","Mira"];

// ================================
// SCREEN SYSTEM
// ================================
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo(0, 0);
}
function setSpeaker(name) {
  const box = document.getElementById('speakerBox');
  if (box) box.innerText = name;
  setPortrait(name);
}

// ================================
// 🖼️ CHARACTER PORTRAITS
// ================================
const PORTRAITS = {
  "Scory": "https://files.catbox.moe/1rf6iw.png",
  "Nyra":  null,  // add Nyra art URL here when available
  "Manor": null
};

function setPortrait(name) {
  const el = document.getElementById('characterPortrait');
  if (!el) return;
  const url = PORTRAITS[name];
  if (url) {
    el.classList.remove('hidden');
    el.style.backgroundImage = `url('${url}')`;
  } else {
    el.classList.add('hidden');
  }
}

// ================================
// TYPEWRITER SYSTEM
// ================================
let typingInterval = null;
let isTyping = false;

function stopTyping() {
  if (typingInterval) clearInterval(typingInterval);
  typingInterval = null;
  isTyping = false;
}

function typeTextInto(element, text, speed, callback) {
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
  }, speed || TYPE_SPEED);
}

// convenience wrapper for the main story box
function typeText(text, speed, cb) {
  const el = document.getElementById('storyText');
  typeTextInto(el, text, speed, () => { if (cb) cb(); else setNextEnabled(true); });
  setNextEnabled(false);
}

function setNextEnabled(v) {
  const btn = document.getElementById('nextBtn');
  if (!btn) return;
  btn.disabled = !v;
  btn.style.opacity = v ? '1' : '0.3';
}

// ================================
// CHOICE SYSTEM
// ================================
let nextFn = null;
function handleNext() { if (isTyping || !nextFn) return; nextFn(); }
function setNext(fn) { nextFn = fn; setNextEnabled(true); }

function showChoices(choices) {
  const area = document.getElementById('choicesArea');
  area.innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';
  choices.forEach(c => {
    const b = document.createElement('button');
    b.className = 'choice-btn';
    b.innerText = c.label;
    b.onclick = () => {
      area.innerHTML = '';
      document.getElementById('nextBtn').style.display = '';
      c.fn();
    };
    area.appendChild(b);
  });
}

// ================================
// 🎵 MUSIC (SAFE VERSION — drop your own hosted URLs back in if desired)
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

function setBackground(url) {
  document.body.style.backgroundImage = `url('${url}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

// ================================
// 🏰 TITLE SCREEN
// ================================
function triggerGlitchReject(message) {
  const error = document.getElementById("nameError");
  const screen = document.getElementById("titleScreen");

  error.style.display = "block";
  error.innerText = message;

  screen.classList.add("glitch-shake");
  document.body.classList.add("glitch-flash");

  setTimeout(() => {
    screen.classList.remove("glitch-shake");
    document.body.classList.remove("glitch-flash");
  }, 1200);
}

function startGame() {
  const input = document.getElementById("nameInput");
  const error = document.getElementById("nameError");
  const glitchMessage = document.getElementById("glitchMessage");

  const rawName = input.value.trim();

  if (!ALLOWED.includes(rawName)) {
    triggerGlitchReject("Entry rejected. You are not listed in the memory index.");
    glitchMessage.innerText = "THE MANOR DOES NOT RECOGNIZE THIS NAME";
    return;
  }

  error.style.display = "none";
  glitchMessage.innerText = "";

  playerName = rawName;
  score = 0;
  state = "quiet";

  try {
    phase = "phase1";
    show("storyScreen");
    playMusic("https://files.catbox.moe/jqhso7.mp3"); // Prologue theme
    runPrologue();
  } catch (e) {
    console.error("START ERROR:", e);
    alert("Game failed to start. Check console.");
  }
}

document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') startGame();
});

// ================================
// 🕯️ PROLOGUE
// ================================
const prologueLines = [
`Welcome.\nI am Scory, the attendant of this place.`,
`If you are reading this, your entry has already been recorded.`,
`There is no need to worry how you arrived.\nThat part is no longer important.`,
`The Game Master prefers silence.\nSo I will speak in their place.`,
`You will be asked simple questions.\nAnswer them however you wish.`,
`Nothing here is meant to harm you.`,
`At least... that is what I was told to say.`,
`Please proceed when you are ready.\nThe manor is already listening.`
];
let pIdx = 0;
function runPrologue() {
  setSpeaker("Scory");
  pIdx = 0;
  typeText(prologueLines[0], TYPE_SPEED);
  setNext(nextPrologueLine);
}
function nextPrologueLine() {
  if (isTyping) return;
  pIdx++;
  if (pIdx < prologueLines.length) {
    typeText(prologueLines[pIdx], TYPE_SPEED);
    setNext(nextPrologueLine);
  } else {
    runScoryIntro();
  }
}

// ================================
// 🧭 SCORY INTRO
// ================================
const scoryLines = [
`Ah... you are here.`,
`I am Scory.\nThe one responsible for welcoming you.`,
`You may consider me your guide within this place.`,
`I do not make decisions.\nI only follow what has already been decided.`,
`Soon, you will be asked to respond.\nNot to pass. Not to fail.\nOnly to reveal what is already present.`,
`The Game Master is not present in voice...\nbut everything here still belongs to them.`,
`For now, remain at ease.\nI will not leave you unattended.`
];
let sIdx = 0;
function runScoryIntro() {
  setSpeaker("Scory");
  sIdx = 0;
  playMusic("https://files.catbox.moe/zo3w4o.mp3"); // Personality Test theme
  typeText(scoryLines[0], TYPE_SPEED);
  setNext(nextScoryLine);
}
function nextScoryLine() {
  if (isTyping) return;
  sIdx++;
  if (sIdx < scoryLines.length) {
    typeText(scoryLines[sIdx], TYPE_SPEED);
    setNext(nextScoryLine);
  } else {
    runPhase1();
  }
}

// ================================
// 🧭 PHASE 1 — ENTRY RESPONSE
// ================================
function runPhase1() {
  phase = "phase1";
  playMusic("https://files.catbox.moe/iufxfv.mp3"); // Classroom theme
  setSpeaker("Scory");
  typeText(`Before we continue...\nI will ask something simple.`, TYPE_SPEED, () => {
    setNext(() => {
      setSpeaker("Manor");
      typeText(`There is no correct answer.\n\nOnly what you choose to leave behind.\n\nWhen you are alone...\nwhat do you usually hear first?`, TYPE_SPEED, () => {
        showChoices([
          { label: "Silence", fn: () => { score += 0; afterQ1(); } },
          { label: "My own thoughts", fn: () => { score += 1; afterQ1(); } },
          { label: "Something I can't name", fn: () => { score += 2; afterQ1(); } }
        ]);
      });
    });
  });
}
function afterQ1() {
  setSpeaker("Scory");
  typeText(`I see.\n\nThat response has been recorded.\n\nIt reacts differently depending on who answers...\nbut I am not allowed to explain how.`, TYPE_SPEED, () => {
    setSpeaker("Manor");
    typeText(`Do you feel more comfortable when something is watching you?`, TYPE_SPEED, () => {
      showChoices([
        { label: "Yes", fn: () => { score += 2; afterQ2(); } },
        { label: "No", fn: () => { score += 0; afterQ2(); } },
        { label: "I'm not sure", fn: () => { score += 1; afterQ2(); } }
      ]);
    });
  });
}
function afterQ2() {
  setSpeaker("Scory");
  typeText(`That is... more common than you might expect.\n\nStill, I will not interpret it for you.`, TYPE_SPEED, () => {
    setTimeout(() => {
      setSpeaker("Nyra");
      typeText(`Some answers are closer to me than others.`, TYPE_SPEED, () => {
        setTimeout(() => {
          setSpeaker("Scory");
          typeText(`We will continue when the manor is ready.\n\nOr when you are.`, TYPE_SPEED, () => {
            calculateState();
            setNext(runPhase2);
          });
        }, 600);
      });
    }, 500);
  });
}
function calculateState() {
  if (score <= 1) state = "quiet";
  else if (score <= 2) state = "aware";
  else state = "sensitive";
  console.log("Player State:", state);
}

// ================================
// 🕯️ PHASE 2 — ILLUSION CHOICE
// ================================
function runPhase2() {
  phase = "phase2";
  playMusic("https://files.catbox.moe/wo0ygv.mp3"); // Hallway theme
  setSpeaker("Scory");
  typeText(`We will now proceed to something slightly more personal.\n\nThis is not a test.\n\nIt only determines how I should speak to you.`, TYPE_SPEED, () => {
    setTimeout(() => {
      setSpeaker("Scory");
      typeText(`If something stayed with you even after you stopped thinking about it...\nwhat would you call it?`, TYPE_SPEED, () => {
        showChoices([
          { label: "A memory", fn: () => afterPhase2_q1() },
          { label: "A feeling", fn: () => afterPhase2_q1() },
          { label: "Something else", fn: () => afterPhase2_q1() }
        ]);
      });
    }, 400);
  });
}
function afterPhase2_q1() {
  setSpeaker("Scory");
  typeText(`Noted.\n\nThat answer will shape how I address you moving forward.`, TYPE_SPEED, () => {
    setSpeaker("Nyra");
    typeText(`I didn't plan for it to be described that way.`, TYPE_SPEED, () => {
      setSpeaker("Scory");
      typeText(`If you could remove one silence from your past...\nwould you?`, TYPE_SPEED, () => {
        showChoices([
          { label: "Yes", fn: () => afterPhase2_q2(0) },
          { label: "No", fn: () => afterPhase2_q2(1) },
          { label: "I don't know", fn: () => afterPhase2_q2(2) }
        ]);
      });
    });
  });
}
function afterPhase2_q2(c) {
  const r = c === 0 ? "Then you still remember it clearly." : c === 1 ? "That is also a form of remembering." : "Uncertainty is still an answer.";
  setSpeaker("Scory");
  typeText(`${r}\n\nI am beginning to understand your pattern.\nOr perhaps I am being made to believe I do.`, TYPE_SPEED, () => {
    setSpeaker("Nyra");
    typeText(`If I had spoken differently... would you have answered differently?`, TYPE_SPEED, () => {
      setSpeaker("Scory");
      typeText(`That question was not part of the intended script.\n\nBut I will accept it anyway.`, TYPE_SPEED, () => {
        setNext(runPhase3);
      });
    });
  });
}

// ================================
// 🕯️ PHASE 3 — PERSONALIZATION
// ================================
function runPhase3() {
  phase = "phase3";
  playMusic("https://files.catbox.moe/6xdkjm.mp3"); // Library theme
  calculateState();
  const branch = state === "quiet"
    ? `There is no urgency in your answers.\n\nThat is acceptable here.`
    : state === "aware"
    ? `You seem to observe things carefully.\n\nThat will be noted.`
    : `You are not the only one who feels that way.\n\nI should not have said that.`;

  setSpeaker("Scory");
  typeText(`Thank you.\n\nYour responses have been noted more precisely than before.\n\nIt seems the manor is adjusting.`, TYPE_SPEED, () => {
    typeText(branch, TYPE_SPEED, () => {
      setSpeaker("Nyra");
      typeText(`I didn't expect the answers to feel familiar.`, TYPE_SPEED, () => {
        setSpeaker("Scory");
        typeText(`Apologies.\n\nThat line was unnecessary.\n\nPlease disregard it.`, TYPE_SPEED, () => {
          typeText(`I have reviewed your responses so far.\n\nThere is something consistent in them.\n\nNot in what you chose...\nbut in how you chose it.`, TYPE_SPEED, () => {
            typeText(`I will no longer speak to you as I speak to others.`, TYPE_SPEED, () => {
              typeText(`This was not originally intended.\n\nBut it feels incorrect to ignore it now.`, TYPE_SPEED, () => {
                typeText(`When you answered...\n\ndid you feel like you were answering yourself...\n\nor someone else?`, TYPE_SPEED, () => {
                  setSpeaker("Nyra");
                  typeText(`I noticed the same pattern when I wrote it.`, TYPE_SPEED, () => {
                    setSpeaker("Scory");
                    typeText(`That statement is not part of the structure.\n\nAnd yet...\n\nit remains accurate.`, TYPE_SPEED, () => {
                      typeText(`From this point onward, your responses will no longer be treated as general input.\n\nThey will be treated as continuity.`, TYPE_SPEED, () => {
                        typeText(`If I speak differently now...\n\nIt is because I was allowed to notice you.`, TYPE_SPEED, () => {
                          setNext(runPhase4);
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
function runPhase4() {
  phase = "phase4";
  playMusic("https://files.catbox.moe/n2esqe.mp3"); // Clock Tower theme
  setSpeaker("Scory");
  typeText(`We are nearing the end of your responses.\n\nFrom here onward, nothing new will be asked of you.\n\nOnly what has already been shaped will remain.`, TYPE_SPEED, () => {
    typeText(`I was not meant to guide this far.\n\nBut I will remain until the end of your understanding.`, TYPE_SPEED, () => {
      setSpeaker("Nyra");
      typeText(`It is almost time for me to stop pretending this is structured.`, TYPE_SPEED, () => {
        typeText(`If you could go back to your first answer...\n\nWould it still be the same?`, TYPE_SPEED, () => {
          setSpeaker("Scory");
          typeText(`I will not correct anything anymore.\n\nCorrection implies there was ever a mistake.`, TYPE_SPEED, () => {
            setSpeaker("Nyra");
            typeText(`I think I understand why I kept writing it this way.`, TYPE_SPEED, () => {
              setSpeaker("Scory");
              typeText(`When you reach the end...\n\nyou will understand why I spoke gently.`, TYPE_SPEED, () => {
                setSpeaker("Nyra");
                typeText(`Or perhaps you will understand why I did not.`, TYPE_SPEED, () => {
                  setNext(runPhase5);
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
// 🕯️ PHASE 5 — ENDING SYSTEM
// ================================
function runPhase5() {
  phase = "phase5";
  playMusic("https://files.catbox.moe/attj2c.mp3"); // Final Gate theme
  setBackground("https://files.catbox.moe/yw97ze.jpg"); // Final Gate
  if (state === "sensitive") {
    endingType = "nyra";
    nyraEnding();
  } else {
    endingType = "scory";
    scoryEnding();
  }
}

function scoryEnding() {
  show("endingScreen");
  playMusic("https://files.catbox.moe/sdixkl.mp3"); // Observer ending theme
  setBackground("https://files.catbox.moe/yw97ze.jpg"); // Final Gate
  document.getElementById("endingTitle").innerText = "CONTROLLED SILENCE";

  const el = document.getElementById("endingText");
  document.getElementById("endingNextBtn").disabled = true;

  typeTextInto(el,
`You have reached the end of what I was permitted to guide.

There is nothing more to ask of you.
And nothing more I am allowed to explain.

Your responses have been received.
They will remain here.

Not as evidence.
Not as judgment.

Only as something that was said.`,
    TYPE_SPEED,
    () => { document.getElementById("endingNextBtn").disabled = false; }
  );
}

// ================================
// 🕯️ SEALED MEMORY (NYRA)
// ================================
function nyraEnding() {
  show("endingScreen");
  playMusic("https://files.catbox.moe/8aia7g.mp3"); // True ending theme
  setBackground("https://files.catbox.moe/yw97ze.jpg"); // Final Gate
  document.getElementById("endingTitle").innerText = "SEALED MEMORY";

  const el = document.getElementById("endingText");
  document.getElementById("endingNextBtn").disabled = true;

  typeTextInto(el,
`I should have stopped earlier… but I didn’t.

Everything here was shaped by how I chose to speak to you.
Even the silence between responses had intention.

This was never just a system.

It was something I kept running because I didn’t want to forget how it felt to be understood without being corrected.

If this feels too personal…
it’s because I stopped sealing it completely.

And now you’ve seen it in the same order I wrote it.`,
    TYPE_SPEED,
    () => { document.getElementById("endingNextBtn").disabled = false; }
  );
}

// ================================
// 💌 LETTER SYSTEM (FULL)
// ================================
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

function showLetter() {
  if (isTyping) return;

  show("letter".concat("Screen"));

  const text = document.getElementById("letterText");

  stopTyping();
  text.innerText = "";
  text.style.opacity = 0;
  text.style.transform = "scaleY(0.5)";
  document.getElementById("letterNextBtn").disabled = true;

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

    if (!message) {
      message = "No letter found for this name.";
    }

    typeTextInto(text, message, LETTER_SPEED, () => {
      document.getElementById("letterNextBtn").disabled = false;
    });
  }, 200);
}

function showCredits() {
  if (isTyping) return;
  setBackground("https://files.catbox.moe/9dilmq.jpg"); // manor goes quiet
  show("creditsScreen");
}

// ================================
// 🔁 RESTART SYSTEM
// ================================
function restartGame() {
  playerName = "";
  score = 0;
  state = "quiet";
  endingType = "scory";
  phase = "intro";

  document.getElementById("nameInput").value = "";

  const error = document.getElementById("nameError");
  if (error) error.style.display = "none";

  const glitch = document.getElementById("glitchMessage");
  if (glitch) glitch.innerText = "";

  show("titleScreen");
  document.body.style.backgroundImage = "url('https://files.catbox.moe/3726jk.jpg')";

  if (music) {
    music.pause();
    music.currentTime = 0;
  }
}

// ================================
// 🦋 CURSOR TRAIL (throttled for performance)
// ================================
let lastButterflyTime = 0;
const BUTTERFLY_INTERVAL = 60; // ms between spawns

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastButterflyTime < BUTTERFLY_INTERVAL) return;
  lastButterflyTime = now;

  const b = document.createElement("div");
  b.className = "butterfly";
  b.style.left = e.clientX + "px";
  b.style.top = e.clientY + "px";

  document.body.appendChild(b);

  setTimeout(() => {
    b.remove();
  }, 1000);
});
