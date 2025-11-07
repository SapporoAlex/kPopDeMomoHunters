// === Background music (unchanged) ===
const bgMusicBtn = document.getElementById('bgMusicBtn');
const bgMusic = new Audio('sounds/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;
let bgPlaying = false;
bgMusicBtn.addEventListener('click', () => {
  if (!bgPlaying) {
    bgMusic.play();
    bgPlaying = true;
    bgMusicBtn.textContent = 'Pause Music';
  } else {
    bgMusic.pause();
    bgPlaying = false;
    bgMusicBtn.textContent = 'Play Music';
  }
});

// === Dice roll + asset data ===
const rollBtn = document.getElementById('deal');
const textBox = document.getElementById('textBox');
const diceRoll = document.getElementById('diceRoll');

// two variants per number
const diceData = {
  1: [{ sound: 'sounds/voice1a.mp3', image: 'images/face1a.png' },
      { sound: 'sounds/voice1b.mp3', image: 'images/face1b.png' }],
  2: [{ sound: 'sounds/voice2a.mp3', image: 'images/face2a.png' },
      { sound: 'sounds/voice2b.mp3', image: 'images/face2b.png' }],
  3: [{ sound: 'sounds/voice3a.mp3', image: 'images/face3a.png' },
      { sound: 'sounds/voice3b.mp3', image: 'images/face3b.png' }],
  4: [{ sound: 'sounds/voice4a.mp3', image: 'images/face4a.png' },
      { sound: 'sounds/voice4b.mp3', image: 'images/face4b.png' }],
  5: [{ sound: 'sounds/voice5a.mp3', image: 'images/face5a.png' },
      { sound: 'sounds/voice5b.mp3', image: 'images/face5b.png' }],
  6: [{ sound: 'sounds/voice6a.mp3', image: 'images/face6a.png' },
      { sound: 'sounds/voice6b.mp3', image: 'images/face6b.png' }]
};

// Keep a reference to the currently-playing dice sound
let currentDiceAudio = null;

rollBtn.addEventListener('click', async () => {
  const diceElem = document.getElementById('dice');
  diceRoll.textContent = '';
  diceElem.textContent = '🎲';
  diceElem.classList.add('rolling');

  // stop any previous dice voice immediately (so it won't overlap)
  if (currentDiceAudio) {
    try {
      currentDiceAudio.pause();
      currentDiceAudio.currentTime = 0;
    } catch (e) {
      // ignore if already stopped or browser forbids seeking
    }
    currentDiceAudio = null;
  }

  // 1 second roll animation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // show roll result
  diceElem.classList.remove('rolling');
  const roll = Math.floor(Math.random() * 6) + 1;
  diceElem.textContent = roll;
  diceRoll.textContent = `You rolled a ${roll}`;

  // pick one of two variants
  const variants = diceData[roll];
  const chosen = variants[Math.floor(Math.random() * variants.length)];

  // show image (slide-in / slide-out handled by your CSS)
  const img = document.createElement('img');
  img.src = chosen.image;
  img.className = 'slide-in';
  // ensure textBox exists and append
  textBox.appendChild(img);

  // create new audio for this roll and store it
  currentDiceAudio = new Audio(chosen.sound);
  // when it ends naturally, clear reference
  currentDiceAudio.addEventListener('ended', () => { currentDiceAudio = null; });

  // play (user initiated by click, should be allowed)
  currentDiceAudio.play().catch(err => {
    // optional: handle autoplay restrictions if they appear
    console.warn('dice audio play failed:', err);
    currentDiceAudio = null;
  });

  // remove image after 2s (slide out then remove after animation)
  setTimeout(() => {
    img.classList.add('slide-out');
    setTimeout(() => {
      if (img.parentNode) img.parentNode.removeChild(img);
    }, 800); // matches .slide-out duration
  }, 2000);
});
