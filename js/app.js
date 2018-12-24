// Sound Variables
const MENU_CLICK_SOUND = new Audio('audio/menuclick.mp3'); // Sound from https://opengameart.org/content/gui-sound-effects (misc_menu.wav)
const MOVE_SOUND = new Audio('audio/move.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (hop.wav)
const CAPTURE_SOUND = new Audio('audio/capture.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (tinywarble.wav)
const ERROR_SOUND = new Audio('audio/error.mp3'); // Sound from https://opengameart.org/content/gui-sound-effects (misc_menu.wav)
const COLLECTABLE_SOUND = new Audio('audio/collect.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (negative_2.wav)
const DAMAGE_SOUND = new Audio('audio/damage.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (ouch.wav)
const GAME_OVER_SOUND = new Audio('audio/gameover.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (whimper.wav)
const FREEZE_SOUND = new Audio('audio/freeze.mp3'); // Sound from https://opengameart.org/content/ice-spells (ice.wav)
const FIRE_SOUND = new Audio('audio/fire.mp3'); // Sound from https://opengameart.org/content/fire-whip-hit-yo-frankie
const ACID_SOUND = new Audio('audio/acid.mp3'); // Sound from https://opengameart.org/content/acid-burn-sounds
const GAME_WON_SOUND = new Audio('audio/gamewon.mp3'); // Sound from https://opengameart.org/content/completion-sound (completetask_0.mp3)
const APPEAR_SOUND = new Audio('audio/appear.mp3'); // Sound from https://opengameart.org/content/8-bit-sound-effect-pack (slap.wav)

/**** Start Menu ****/
// Variables
const START_MENU = document.getElementById('start-menu');
const WELCOME_SCREEN = document.querySelector('.welcome-screen');
const HELLO_SCREEN = document.querySelector('.hello-screen');
let insideOf = 'welcome-screen';
const MAIN_MENU = document.querySelector('.main-menu');
const PLAY_MENU = document.querySelector('.play-menu');
const SELECT_CHARACTER = PLAY_MENU.children[0];
let selectedCharacter;
const SELECT_ALT = PLAY_MENU.children[1];
let selectedAlt;
const SELECT_LEVEL = PLAY_MENU.children[2];
let selectedLevel;
const SELECT_SPEED = PLAY_MENU.children[3];
let selectedSpeed;
const SELECT_CHEAT = PLAY_MENU.children[4];
let selectedCheats = new Set();
const INSTRUCTIONS_MENU = document.querySelector('.instructions-menu');
const CREDITS_MENU = document.querySelector('.credits-menu');
const INGAME_MENU = document.querySelector('.ingame-menu');
const CHARACTER_IMAGE = document.querySelector('.character-image');
const CHARACTER_NAME = document.querySelector('.character-name');
let startedGame= false;

// Functions
/*
    this function is for updating environment based on the settings the player uses (character, level, speed)
*/
function updateSprites() {
    /*
        update character image on the UI based on the selected character
    */
    if (selectedCharacter === 'scorpion') {CHARACTER_IMAGE.className = 'character-image scorpion';}
    else if (selectedCharacter === 'subzero') {CHARACTER_IMAGE.className = 'character-image subzero';}
    else if (selectedCharacter === 'reptile') {CHARACTER_IMAGE.className = 'character-image reptile';}
    if (selectedAlt) {CHARACTER_IMAGE.classList.add('alt');}
    else {CHARACTER_IMAGE.classList.remove('alt');}
    /*
        update character name on the UI based on the selected character
    */
    CHARACTER_NAME.innerHTML = selectedCharacter === 'subzero' ? 'Sub-Zero' : selectedCharacter === 'scorpion' ? 'Scorpion' : 'Reptile';
    PLAYER.name = selectedCharacter;
    PLAYER.sprite = selectedAlt ? `images/${selectedCharacter}-alt-sheet.png` : `images/${selectedCharacter}-sheet.png`; // change character sprite
    PLAYER.speed = selectedSpeed === 'slow' ? 8 : selectedSpeed === 'normal' ? 4 : 2; // change character speed
    PLAYER.speed = selectedCheats.has('lightning') ? 1 : PLAYER.speed; // maximize speed if lightning cheat is used
    levelMap = selectedLevel === 'facility' ? facilityMap : dungeonMap; // change level map logic based on selected level
    SCORE.sprite = `images/${selectedLevel}/score-sheet.png`; // change score indicator based on level
    ALL_FINISHES.forEach(finish => finish.sprite = `images/${selectedLevel}/finish-sheet.png`); // change finish slots based on level
    ALL_ENEMIES.forEach(enemy => { // change enemy information (sprite, speed) according to selected level and speed
        if (enemy.name === 'enemy_1') {
            enemy.sprite = `images/${selectedLevel}/enemy_1-sheet.png`;
            enemy.speed = selectedSpeed === 'slow' ? 12 : selectedSpeed === 'normal' ? 6 : 3;
        }
        else if (enemy.name === 'enemy_2') {
            enemy.sprite = `images/${selectedLevel}/enemy_2-sheet.png`;
            enemy.speed = selectedSpeed === 'slow' ? 10 : selectedSpeed === 'normal' ? 5 : 2;
        }
        else if (enemy.name === 'enemy_3') {
            enemy.sprite = `images/${selectedLevel}/enemy_3-sheet.png`;
            enemy.speed = selectedSpeed === 'slow' ? 8 : selectedSpeed === 'normal' ? 4 : 2
        }
        else if (enemy.name === 'boss') {
            enemy.sprite = `images/${selectedLevel}/boss-sheet.png`;
            enemy.speed = selectedSpeed === 'slow' ? 4 : selectedSpeed === 'normal' ? 2 : 1;
        }
    });
    ALL_COLLECTABLES.forEach(collectable => collectable.speed = selectedSpeed === 'slow' ? 12 : selectedSpeed === 'normal' ? 6 : 3); // change collectables speed
    COLLECTABLE_2.x = selectedLevel === 'facility' ?  28 : 52;
    COLLECTABLE_5.x = selectedLevel === 'facility' ?  100 : 124;
}

/**** Timer ****/
// Variables
const TIMER = document.querySelector('.timer');
let timerOn = true;
let time = 0;
let timerId;

// Functions
function startTimer() {
    timerOn = true;
    timerId = setInterval(() => { // start timer using setInterval every 1 second
        time++;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        TIMER.innerHTML = seconds < 10 ? `0${minutes}:0${seconds}` : `0${minutes}:${seconds}`; // update time on the DOM
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerOn = false;
}

function resetTimer() {
    stopTimer();
    time = 0;
    TIMER.innerHTML = '00:00';
}

/*** Game Pause ****/
// Variables
const PAUSE = document.querySelector('.pause');
let paused = false;

// Functions
function pause() {
    MENU_CLICK_SOUND.play();
    paused = !paused;
    if (paused) {
        stopTimer();
        cancelAnimation();
        show(MODAL);
    } else {
        startTimer();
        startAnimation();
        hide(MODAL);
    }
}

/**** Game Restart ****/
// Variables
const RESTART = document.querySelector('.restart');

/**** Health ****/
// Variables
const HEALTH_BAR = document.querySelector('.health-bar');

// Functions
/*
    this function is for updating the players health on the UI
    and for displaying the gameover modal if player is dead
*/
function health(health) {
    /*
        moving accross the spritesheet on different screen sizes is not
        the same, therefore i had to use window.innerWidth
    */
    if (window.innerWidth < 600) {
        HEALTH_BAR.style.backgroundPositionY = `-${(5 - health) * 12}px`;
    } else {
        HEALTH_BAR.style.backgroundPositionY = `-${(5 - health) * 25}px`;
    }

    if (!health) { // if player is dead
        GAME_OVER_SOUND.play();
        stopTimer();
        cancelAnimation();
        fillModal('gameover');
        show(MODAL);
    }
}

/*
    this function is for showing the collectable hearts based on the player's need for health
*/
function hearts() {
    if (PLAYER.health < 4) {
        COLLECTABLE_1.inNeed = true;
    } else {
        COLLECTABLE_1.inNeed = false;
    }

    if (PLAYER.health < 3) {
        COLLECTABLE_2.inNeed = true;
    } else {
        COLLECTABLE_2.inNeed = false;}

    if (PLAYER.health < 2) {
        COLLECTABLE_3.inNeed = true;
    } else {
        COLLECTABLE_3.inNeed = false;
    }
}

/**** Power ****/
// Variables
const POWER_BAR = document.querySelector('.power-bar');

// Functions
/*
    this function is for updating the players powers on the UI
*/
function power(powers) {
    if (!selectedCheats.has('infinite-power')) { // update powers only if the infinite-power cheat is off
        /*
            moving accross the spritesheet on different screen sizes is not
            the same, therefore i had to use window.innerWidth
        */
        if (window.innerWidth < 600) {POWER_BAR.style.backgroundPositionY = `-${(9 - powers) * 12.2}px`;}
        else {POWER_BAR.style.backgroundPositionY = `-${(9 - powers) * 25}px`;}
    }
}

/**** Game Won ****/
// Functions
/*
    this function is for displaying the gamewon modal if player wins
*/
function gameWon() {
    if (PLAYER.win && SCORE.sx === 96) { // if player wins and if score indicator is full (game should not end before score is updated)
        GAME_WON_SOUND.play();
        stopTimer();
        fillModal('gamewon');
        show(MODAL);
        cancelAnimation(); // stop drawing on canvas if game is won
    } else {
        startAnimation(); // continue drawing on canvas since game is not won yet
    }
}

/**** Canvas ****/
// Variables
const CANVAS = document.getElementById('canvas');

/**** Modal ****/
// Variables
const MODAL = document.querySelector('.modal-overlay');
const MODAL_HEADER = document.querySelector('.modal-header');
const MODAL_STARS = document.querySelector('.modal-stars');
const MODAL_COINS = document.querySelector('.modal-coins');
const MODAL_HEALTH = document.querySelector('.modal-health');
const MODAL_POWERS = document.querySelector('.modal-powers');
const MODAL_TIME = document.querySelector('.modal-time');
const MODAL_EXIT = document.querySelector('.modal-exit');
const MODAL_PAUSE = document.querySelector('.modal-pause');
const MODAL_REPLAY = document.querySelector('.modal-replay');

// Functions
/*
    this function is for filling the game with data based on the action (pause, gameover, gamewon)
*/
function fillModal(reason) {
    if (reason === 'pause') {
        MODAL_HEADER.innerHTML = 'Paused';
        hide(MODAL_STARS);
        hide(MODAL_COINS);
        hide(MODAL_HEALTH);
        hide(MODAL_POWERS);
        hide(MODAL_TIME);
        show(MODAL_PAUSE);
    } else if (reason === 'gameover') {
        MODAL_HEADER.innerHTML = 'Game Over';
        MODAL_COINS.innerHTML = `Coins Collected <span>${PLAYER.coins}</span>`;
        MODAL_POWERS.innerHTML = `Powers Used <span>${3 - PLAYER.powers}</span>`;
        MODAL_TIME.innerHTML = `Your Time <span>${TIMER.innerHTML}</span>`
        hide(MODAL_STARS);
        show(MODAL_COINS);
        hide(MODAL_HEALTH);
        show(MODAL_POWERS);
        show(MODAL_TIME);
        hide(MODAL_PAUSE);
    } else if (reason === 'gamewon') { // if game is won then calculate how many stars the player should get
        let stars = 3;
        if (PLAYER.powers < 2) {stars--;}; // if player uses his power twice then reduce a star
        if (time > 59) {stars--;}; // if player reaches a minute then reduce a star
        if (PLAYER.coins > 2) {stars++;}; // if player collects 3 coins then add a star
        if (PLAYER.health < 4) {stars--;}; // if players health drops to 3 then reduce a star
        if (PLAYER.health < 2) {stars--;}; // if players health drops to 1 then reduce a star
        stars = stars > 3 ? 3 : stars < 1 ? 1 : stars; // make sure that the star count is only between 1 and 3, no more no less
        if (stars === 3) {
            MODAL_STARS.children[1].style.visibility = 'visible';
            MODAL_STARS.children[2].style.visibility = 'visible';
        } else if (stars === 2) {
            MODAL_STARS.children[1].style.visibility = 'visible';
            MODAL_STARS.children[2].style.visibility = 'hidden';
        } else if (stars === 1) {
            MODAL_STARS.children[1].style.visibility = 'hidden';
            MODAL_STARS.children[2].style.visibility = 'hidden';
        }
        MODAL_HEADER.innerHTML = selectedCheats.size ? 'You Won, Cheater!' : 'You Won'; // if player used cheats then show the word 'cheater'
        MODAL_COINS.innerHTML = `Coins Collected <span>${PLAYER.coins}</span>`;
        MODAL_HEALTH.innerHTML = `Health Left <span>${PLAYER.health}</span>`;
        MODAL_POWERS.innerHTML = `Powers Used <span>${3 - PLAYER.powers}</span>`;
        MODAL_TIME.innerHTML = `Your Time <span>${TIMER.innerHTML}</span>`
        show(MODAL_STARS);
        show(MODAL_COINS);
        show(MODAL_HEALTH);
        show(MODAL_POWERS);
        show(MODAL_TIME);
        hide(MODAL_PAUSE);
    }
}

/**** Map ****/
// Variables
let levelMap;
let facilityMap =  [
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0]
]

let dungeonMap =  [
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

/**** Keyboard controls ****/
// Variables
const KEYBOARD_CONTROLS = document.getElementById('keyboard-controls');
const AllowedKeys = {
    13: 'enter',
    32: 'spacebar',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    81: 'Q',
    82: 'R'
};

// Functions
/*
    this function is for handling what happens when player uses the keyboard
*/
function handleInput(input) {
    /*
    only pause/unpause the game if:
        * player presses spacebar
        * player is ingame (player is not in the start menu)
        * player is not dead (gameover modal is not showing)
        * player hasn't won yet (gamewon modal is not showing)
    */
    if (input === 'spacebar' && startedGame && !PLAYER.win && PLAYER.health) {
        fillModal('pause');
        pause();
    }

    if (input === 'R' && startedGame) { // if player press R and is ingame then restart the game
        MENU_CLICK_SOUND.play();
        if (!isHidden(MODAL)) {hide(MODAL);} // if modal is showing then hide it
        cancelAnimation();
        reset();
    }

    if (input === 'enter') { // if enter is pressed then skip the welcome screen
        if (insideOf === 'welcome-screen') {
            APPEAR_SOUND.play();
            hide(WELCOME_SCREEN);
            show(HELLO_SCREEN);
            insideOf = 'hello-screen';
        } else if (insideOf === 'hello-screen') {
            MENU_CLICK_SOUND.play();
            hide(HELLO_SCREEN);
            show(MAIN_MENU);
            insideOf = 'main-menu';
        }
    }
}

/**** Helper Functions ****/
function show(HTMLElement) { // show element
    HTMLElement.classList.remove('hidden');
}

function hide(HTMLElement) { // hide element
    HTMLElement.classList.add('hidden');
}

function isHidden(HTMLElement) { // returns true if element is hidden and return false if element is visible
    return HTMLElement.classList.contains('hidden');;
}

function isSelected(HTMLElement) { // returns true if element is selected and return false if element is not selected (used inside the play menu)
    return HTMLElement.classList.contains('selected');
}

/*
    this function is for selcting elements (adding the class 'selected' to them)
*/
function select(HTMLElement, clicked, selectedType) {
    for (let child of HTMLElement.children) { // loop through all the child elements
        if (child.classList.value === clicked) { // if the child is what we clicked
            MENU_CLICK_SOUND.play();
            child.classList.add('selected'); // update the UI by showing the selection to the user (could be one of the characters or other settings)
            if (selectedType === 'character') { // store the selectd character
                selectedCharacter = clicked;
            } else if (selectedType === 'level') { // store the selectd level
                selectedLevel = clicked;
            } else if (selectedType === 'speed') { // store the selectd speed
                selectedSpeed = clicked;
            }
        }  else {child.classList.remove('selected');} // update the UI by removing the selection from the not clicked elements
    }
}

/*
    this function is for deselcting elements (removing the class 'selected' from them)
*/
function deSelect(HTMLElements) {
    for (let HTMLElement of HTMLElements) { // loop through all the elements of the element collection
        for (let child of HTMLElement.children) { // loop through all the child elements
            child.classList.remove('selected'); // deselect HTML element (remove the class of 'selected')
        };
    }
    selectedCharacter = ''; // reset character
    selectedAlt = ''; // reset alternative costumes
    selectedLevel = ''; // reset level
    selectedSpeed = ''; // reset speed
    selectedCheats.clear(); // reset cheats
}

/*
    this function is for changing the characters image in the character selection screen
*/
function changeCostumes(num) {
    for (let character of SELECT_CHARACTER.children) { // loop throught all character elements
         /*
            moving accross the spritesheet on different screen sizes is not
            the same, therefore i had to use window.innerHeight
        */
        if (num) {
            if (window.innerHeight < 700) {
                character.style.backgroundPositionX = '-75px';
            } else {
                character.style.backgroundPositionX = '-112px';
            }
        } else {
            character.style.backgroundPositionX = '0';
        }
    }
}

/*
    this function is for displaying a notificatoin in game (coins +1 , Health -1, ...)
*/
function inGameMessage(text) {
    let message = document.createElement('span');
    message.classList.add('message');
    message.innerHTML = text;
    document.getElementById('time-panel').appendChild(message);
    setTimeout(() => {
        message.parentNode.removeChild(message); // show notification for 2 seconds then destroy it
    }, 2000);
}

// Creating Classes
class Character {
    constructor(xPos, yPos, name, speed) {
        this.name = name;
        this.xPos = xPos; //this is used to reset the player's position
        this.yPos = yPos; //this is used to reset the player's position
        this.col = xPos; //this is used for player's movement on the map
        this.row = yPos; //this is used for player's movement on the map
        this.x = (24 * xPos) + 4; // 24 is the size of each block and +4 to center the character
        this.y = (24 * yPos) - 8; // 24 is the size of each block and -8 to center the character
        this.sprite = `images/${this.name}-sheet.png`;
        this.sx = 0;
        this.sy = 0;
        this.speed = speed;
        this.moving = false;
        this.movingUp = false;
        this.movingRight = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.speedArrays = { // these arrays are used for character animations (idle, walking)
            'idleArray': [],
            'movingArray': []
        };
        this.coins = 0;
        this.health = 5;
        this.finishes = [0, 0, 0, 0];
        this.scoreCount = 0;
        this.powers = 3;
        this.win = false;
    }

    render() {
        // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
        ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy, 16, 26, this.x, this.y, 16, 26);
    }

    update(dt) {
        // For idle animation
        this.setSpeed(dt, 'idleArray', 3);
        if (!this.moving && this.sx === 0 && this.sy === 0 && !this.speedArrays['idleArray'].length) { //
            this.sx = 16;
        } else if (!this.moving && this.sx === 16 && this.sy === 0 && !this.speedArrays['idleArray'].length) {
            this.sx = 0;
        }

        // Update movements
        this.setSpeed(dt, 'movingArray', 1);
        // move by 6 each frame (6 is 24 / 4 since we have four frames)
        if (this.movingUp && !this.speedArrays['movingArray'].length) {
            // console.log('moving up');
            if ((this.sx === 0 || this.sx === 16) && this.sy === 0) {this.sx = 32;this.sy = 52;this.y -= 6;}
            else if (this.sx === 32 && this.sy === 52) {this.sx = 48;this.y -= 6;}
            else if (this.sx === 48 && this.sy === 52) {this.sx = 64;this.y -= 6;}
            else if (this.sx === 64 && this.sy === 52) {this.sx = 80;this.y -= 6;}
            else if (this.sx === 80 && this.sy === 52) {this.stopMoving();}

        } else if (this.movingRight && !this.speedArrays['movingArray'].length) {
            // console.log('moving right');
            if ((this.sx === 0 || this.sx === 16) && this.sy === 0) {this.sx = 32;this.x += 6;}
            else if (this.sx === 32 && this.sy === 0) {this.sx = 48;this.x += 6;}
            else if (this.sx === 48 && this.sy === 0) {this.sx = 64;this.x += 6;}
            else if (this.sx === 64 && this.sy === 0) {this.sx = 80;this.x += 6;}
            else if (this.sx === 80 && this.sy === 0) {this.stopMoving();}

        } else if (this.movingDown && !this.speedArrays['movingArray'].length) {
            // console.log('moving down');
            if ((this.sx === 0 || this.sx === 16) && this.sy === 0) {this.sx = 0;this.sy = 26;this.y += 6;}
            else if (this.sx === 0 && this.sy === 26) {this.sx = 16;this.y += 6;}
            else if (this.sx === 16 && this.sy === 26) {this.sy = 52;this.y += 6;}
            else if (this.sx === 16 && this.sy === 52) {this.sx = 0;this.y += 6;}
            else if (this.sx === 0 && this.sy === 52) {this.stopMoving();}

        } else if (this.movingLeft && !this.speedArrays['movingArray'].length) {
            // console.log('moving left');
            if ((this.sx === 0 || this.sx === 16) && this.sy === 0) {this.sy = 26;this.sx = 32;this.x -= 6;}
            else if (this.sx === 32 && this.sy === 26) {this.sx = 48;this.x -= 6;}
            else if (this.sx === 48 && this.sy === 26) {this.sx = 64;this.x -= 6;}
            else if (this.sx === 64 && this.sy === 26) {this.sx = 80;this.x -= 6;}
            else if (this.sx === 80 && this.sy === 26) {this.stopMoving();}
        }

        // if player reaches the finish then take it
        if (this.y === 16) {
            if (this.col === 0) {this.takeFinish(0)}
            else if (this.col === 2) {this.takeFinish(1)}
            else if (this.col === 4) {this.takeFinish(2)}
            else if (this.col === 6) {this.takeFinish(3)}
        }

        // Check win
        if (this.scoreCount === 4) {this.win = true;}
    }

    /*
        this function is for deciding when the animation should move to the next frame
        because if i use dt directly the animations would be too fast.

        how this works:
            every time the function 'update' recieves the value of 'dt' it gets added to the array
            then when the array if full after receiving a certian amount of 'dt' values, the array is emptied
            only when the array is empty you move to the next frame of animation

            rinse and repeat

            example: the animation frame should move once every 20 'dt's not every dt, if so to speak.
    */
    setSpeed(dt, speedArray, multiplier = 1) {
        if (this.speedArrays[speedArray].length !== this.speed * multiplier) { // keep pushing 'dt' values to the arayy only if the array is not full (when it is full is decided by the programmer)
            this.speedArrays[speedArray].push(dt);
        } else { // empty the array when it is full
            this.speedArrays[speedArray] = [];
        }
    }

    stopMoving() {
        this.moving = false;
        this.movingUp = false;
        this.movingRight = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.sx = 0;
        this.sy = 0;
    }

    takeFinish(num) {
        if (!this.finishes[num]) { // if finish is not taken then take it
            this.finishes[num] = 1;
            this.scoreCount++;
            this.resetPos();
            if (this.scoreCount !== 4) { // to avoid final finish capure sound mixing with gamewon sound
                CAPTURE_SOUND.play();
            }
        }
    }

    resetPos() {
        this.stopMoving();
        this.x = (24 * this.xPos) + 4;
        this.y = (24 * this.yPos) - 8;
        this.col = this.xPos;
        this.row = this.yPos;
    }

    handleInput(input) {
        if (!this.moving && !paused && startedGame && !this.win && this.health) {
            if ((input === 'up' || input === 'up-arrow') && levelMap[this.row - 1][this.col]) { // if where we want to move is not allowed then don't move
                if (this.row === 2) {
                    if ((this.col === 0 && this.finishes[0]) || (this.col === 2 && this.finishes[1]) || (this.col === 4 && this.finishes[2]) || (this.col === 6 && this.finishes[3])) {
                        // if finish slot is taken then player should not be able to get to it
                    } else {
                        this.row--;
                        this.movingUp = true;
                        this.moving = true;
                        MOVE_SOUND.play();
                    }
                } else {
                    this.row--;
                    this.movingUp = true;
                    this.moving = true;
                    MOVE_SOUND.play();
                }
            } else if ((input === 'right' || input === 'right-arrow') && levelMap[this.row][this.col + 1]) { // if where we want to move is not allowed then don't move
                this.col++;
                this.movingRight = true;
                this.moving = true;
                MOVE_SOUND.play();
            } else if ((input === 'down' || input === 'down-arrow') && levelMap[this.row + 1][this.col]) { // if where we want to move is not allowed then don't move
                this.row++;
                this.movingDown = true;
                this.moving = true;
                MOVE_SOUND.play();
            } else if ((input === 'left' || input === 'left-arrow') && levelMap[this.row][this.col - 1]) { // if where we want to move is not allowed then don't move
                this.col--;
                this.movingLeft = true;
                this.moving = true;
                MOVE_SOUND.play();
            }
        }

        if ((input === 'Q' || input === 'power') && startedGame && !paused && !this.win && this.health) {
            if (this.powers && !ENEMY_1_1.sy && !selectedCheats.has('infinite-power')) { // if there are powers left and if enemies are not currently being destroyed and player is not using the infinit-power cheat
                if (this.name === 'subzero') {FREEZE_SOUND.play();}
                else if (this.name === 'scorpion') {FIRE_SOUND.play();}
                else if (this.name === 'reptile') {ACID_SOUND.play();}
                ALL_ENEMIES.forEach(enemy => {
                    if (enemy.name !== 'boss') {enemy.powerUsed = true;}
                });
                this.powers--;
                inGameMessage('Powers -1');
            } else if (!ENEMY_1_1.sy && selectedCheats.has('infinite-power')) { // if enemies are not currently being destroyed and player is using the infinit-power
                if (this.name === 'subzero') {FREEZE_SOUND.play();}
                else if (this.name === 'scorpion') {FIRE_SOUND.play();}
                else if (this.name === 'reptile') {ACID_SOUND.play();}
                ALL_ENEMIES.forEach(enemy => {
                    if (enemy.name !== 'boss') {enemy.powerUsed = true;}
                });
            }
        }
    }

    reset() {
        this.resetPos();
        this.speedArrays = {
            'idleArray': [],
            'movingArray': []
        };
        this.finishes = [0, 0, 0, 0];
        this.scoreCount = 0;
        this.coins = 0;
        this.health = 5;
        this.powers = 3;
        this.win = false;
    }
}

class Enemy {
    constructor(xPos, yPos, name, speed, direction) {
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.x = (24 * xPos) + 4; // 24 is the size of each block and +4 to center the enemy
        this.y = (24 * yPos) - 8; // 24 is the size of each block and -8 to center the enemy
        this.sprite = `images/facility/${this.name}-sheet.png`;
        this.sx = 0;
        this.sy = 0;
        this.speed = speed;
        this.direction = direction;
        this.speedArrays = { // these arrays are used for enemy animations (walking, destroyed, switching direction)
            'movingArray': [],
            'powerArray': [],
            'switchArray': []
        },
        this.powerUsed = false;
    }

    render() {
        // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
        ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy * 1, 16, 26, this.x, this.y, 16, 26);
    }

    update(dt) {
        // move enemy across screen
        this.setSpeed(dt, 'movingArray', 2);
        // move by 6 each frame (6 is 24 / 4 since we have four frames)
        if (!this.speedArrays['movingArray'].length && !this.powerUsed && this.name !== 'boss') {
            if (this.direction === 'right') {
                if (this.sx === 0) {this.sx = 16;this.x += 6;}
                else if (this.sx === 16) {this.sx = 32;this.x += 6;}
                else if (this.sx === 32) {this.sx = 48;this.x += 6;}
                else if (this.sx === 48) {this.sx = 0;this.x += 6;}
            } else if (this.direction === 'left') {
                if (this.sx === 0) {this.sx = 16;this.x -= 6;}
                else if (this.sx === 16) {this.sx = 32;this.x -= 6;}
                else if (this.sx === 32) {this.sx = 48;this.x -= 6;}
                else if (this.sx === 48) {this.sx = 0;this.x -= 6;}
            }
        } else if (!this.speedArrays['movingArray'].length && this.name === 'boss') {
            if (this.direction === 'right') {
                if (this.sx === 0) {this.sx = 16;this.sy = 0;this.x += 6;}
                else if (this.sx === 16) {this.sx = 32;this.x += 6;}
                else if (this.sx === 32) {this.sx = 48;this.x += 6;}
                else if (this.sx === 48) {this.sx = 0;this.x += 6;}
            } else if (this.direction === 'left') {
                if (this.sx === 0) {this.sx = 16;this.sy = 26;this.x -= 6;}
                else if (this.sx === 16) {this.sx = 32;this.x -= 6;}
                else if (this.sx === 32) {this.sx = 48;this.x -= 6;}
                else if (this.sx === 48) {this.sx = 0;this.x -= 6;}
            }
        }

        // Change boss direction randomly
        this.setSpeed(dt, 'switchArray', 50);
        if (!this.speedArrays['switchArray'].length && this.name === 'boss') {
            let randomNumber = Math.floor(Math.random() * 2);
            if (randomNumber) {this.direction = 'left';} // if the random number is 1 then change direction to left
            else {this.direction = 'right';} // if the random number is 0 then change direction to right
        }

        // reset position after leaving screen
        if (this.x > 168 && this.direction === 'right') {
            this.x = -24 + 4;
        } else if (this.x < 0 && this.direction === 'left') {
            this.x = (168) -8;
        }

        // check for collision with player
        if (!this.powerUsed && !selectedCheats.has('invulnerable')) {
            /*
                only detect collision with player if:
                * the player is not using his power (enemies are not currently beeing destroyed)
                * the player is not using the invulnerable cheat
            */
            if (this.x < PLAYER.x + 10 && this.x + 10 > PLAYER.x && this.y < PLAYER.y + 5 && this.y + 5 > PLAYER.y) { // collision detection
                if (PLAYER.health !== 1) {DAMAGE_SOUND.play();}; // stop sound from playing over the gameover sound
                PLAYER.health--;
                inGameMessage('Health -1');
                PLAYER.resetPos();
            }
        }

        // check if power is used to destroy enemy
        this.setSpeed(dt, 'powerArray', 1);
            if (!this.speedArrays['powerArray'].length && this.powerUsed && this.name !== 'boss') {
                /*
                    only destory enemies if:
                    * the player uses his power
                    * the enemy is not the boss
                */
                if (PLAYER.name === 'subzero') {this.sx = this.sx;}
                else if (PLAYER.name === 'scorpion') {this.sx = 64;}
                else if (PLAYER.name === 'reptile') {this.sx = 80;}
                this.sy += 26;
                if (this.sy === 182) {this.reset()}
            }
    }

    /*
        this function is for deciding when the animation should move to the next frame
        because if i use dt directly the animations would be too fast.

        how this works:
            every time the function 'update' recieves the value of 'dt' it gets added to the array
            then when the array if full after receiving a certian amount of 'dt' values, the array is emptied
            only when the array is empty you move to the next frame of animation

            rinse and repeat

            example: the animation frame should move once every 20 'dt's not every dt, if so to speak.
    */
    setSpeed(dt, speedArray, multiplier = 1) {
        if (this.speedArrays[speedArray].length !== this.speed * multiplier) {
            this.speedArrays[speedArray].push(dt);
        } else {
            this.speedArrays[speedArray] = [];
        }
    }

    reset() {
        this.x = (24 * this.xPos) + 4; // 24 is the size of each block and +4 to center the character
        this.y = (24 * this.yPos) - 8; // 24 is the size of each block and -8 to center the character
        this.sx = 0;
        this.sy = 0;
        this.speedArrays = {
            'movingArray': [],
            'powerArray': [],
            'switchArray': []
        },
        this.powerUsed = false;
    }
}

class Score {
    constructor() {
        this.sx = 0;
        this.sy = 0;
        this.sprite = 'images/facility/scorebox-sheet.png';
    }

    render() {
        // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
        ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy, 24, 24, 72, 24, 24, 24);
    }

    update(dt) {
        // update the score indicator when finish slots are taken based on the character
        if (PLAYER.name === 'scorpion') {
            if (PLAYER.scoreCount === 1) {this.sx = 24; this.sy = 24;}
            else if (PLAYER.scoreCount === 2) {this.sx = 48;}
            else if (PLAYER.scoreCount === 3) {this.sx = 72;}
            else if (PLAYER.scoreCount === 4) {this.sx = 96;}
        } else if (PLAYER.name === 'subzero') {
            if (PLAYER.scoreCount === 1) {this.sx = 24; this.sy = 0;}
            else if (PLAYER.scoreCount === 2) {this.sx = 48;}
            else if (PLAYER.scoreCount === 3) {this.sx = 72;}
            else if (PLAYER.scoreCount === 4) {this.sx = 96;}
        } else if (PLAYER.name === 'reptile') {
            if (PLAYER.scoreCount === 1) {this.sx = 24; this.sy = 48;}
            else if (PLAYER.scoreCount === 2) {this.sx = 48;}
            else if (PLAYER.scoreCount === 3) {this.sx = 72;}
            else if (PLAYER.scoreCount === 4) {this.sx = 96;}
        }
    }

    reset() {
        this.sx = 0;
        this.sy = 0;
    }
}

class Finish {
    constructor(xPos) {
        this.xPos = 24 * xPos;
        this.sx = 0;
        this.sprite = 'images/facility/finish-sheet.png';
    }

    render() {
        // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
        ctx.drawImage(Resources.get(this.sprite), this.sx, 0, 24, 24, this.xPos, 24, 24, 24);
    }

    update(dt) {
        // update the finish slot to it's designated color when taken based on the character
        if (PLAYER.name === 'scorpion') {
            if (PLAYER.finishes[0] === 1) {FINISH_1.sx = 48;}
            if (PLAYER.finishes[1] === 1) {FINISH_2.sx = 48;}
            if (PLAYER.finishes[2] === 1) {FINISH_3.sx = 48;}
            if (PLAYER.finishes[3] === 1) {FINISH_4.sx = 48;}
        } else if (PLAYER.name === 'subzero') {
            if (PLAYER.finishes[0] === 1) {FINISH_1.sx = 24;}
            if (PLAYER.finishes[1] === 1) {FINISH_2.sx = 24;}
            if (PLAYER.finishes[2] === 1) {FINISH_3.sx = 24;}
            if (PLAYER.finishes[3] === 1) {FINISH_4.sx = 24;}
        } else if (PLAYER.name === 'reptile') {
            if (PLAYER.finishes[0] === 1) {FINISH_1.sx = 72;}
            if (PLAYER.finishes[1] === 1) {FINISH_2.sx = 72;}
            if (PLAYER.finishes[2] === 1) {FINISH_3.sx = 72;}
            if (PLAYER.finishes[3] === 1) {FINISH_4.sx = 72;}
        }
    }

    reset() {
        this.sx = 0;
    }
}

class Collectable {
    constructor(xPos, yPos, name, speed) {
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.x = (24 * xPos) + 4; // 24 is the size of each block and +4 to center the collectable
        this.y = (24 * yPos) - 8; // 24 is the size of each block and -8 to center the collectable
        this.sprite = `images/${this.name}-sheet.png`;
        this.sx = 0;
        this.sy = 0;
        this.speed = speed;
        this.movingArray = []; // this array is used for idle animation
        this.inNeed = false;
        this.collected = false;
    }

    render() {
        // ctx.drawImage(Resources.get(sprite), sx, sy, sw, sh, x, y, dw, dh);
        if (this.name === 'collectable_1' && !selectedCheats.has('invulnerable') && this.inNeed && !this.collected) {
            /*
                only render the hearts if:
                * the cellectable is the heart (not the coin)
                * the player is not using the invulnerable cheat
                * the player is in need of health
                * the heart hasn't been collected yet
            */
            ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy * 1, 16, 26, this.x, this.y, 16, 26);
        } else if (this.name === 'collectable_2' && !this.collected) {
            /*
                only render the coins if:
                * the cellectable is the coin (not the heart)
                * the coin hasn't been collected yet
            */
            ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy * 1, 16, 26, this.x, this.y, 16, 26);
        }
    }

    update(dt) {
        // animate collectable
        this.setSpeed(dt);
        if (!this.movingArray.length) { // only animate the next frame when the array is empty
            if (this.sx === 0) {this.sx = 16;}
            else if (this.sx === 16) {this.sx = 32;}
            else if (this.sx === 32) {this.sx = 48;}
            else if (this.sx === 48) {this.sx = 0;}
        }

        // check for collision with player
        if (this.name === 'collectable_1' && !selectedCheats.has('invulnerable') && this.inNeed && !this.collected) {
            /*
                only collect the hearts if:
                * the player is not using the invulnerable cheat
                * the player is need of health
                * the heart hasn't been collected yet
            */
            if (this.x < PLAYER.x + 10 && this.x + 10 > PLAYER.x && this.y < PLAYER.y + 5 && this.y + 5 > PLAYER.y) { // collision detection
                COLLECTABLE_SOUND.play();
                PLAYER.health++;
                this.collected = true;
                inGameMessage('Health +1');
            }
        } else if (this.name === 'collectable_2' && !this.collected) {
            /*
                only collect the coins if:
                * the coin hasn't been collected yet
            */
            if (this.x < PLAYER.x + 10 && this.x + 10 > PLAYER.x && this.y < PLAYER.y + 5 && this.y + 5 > PLAYER.y) { // collision detection
                COLLECTABLE_SOUND.play();
                PLAYER.coins++;
                this.collected = true;
                inGameMessage('Coins +1');
            }
        }
    }

    /*
        this function is for deciding when the animation should move to the next frame
        because if i use dt directly the animations would be too fast.

        how this works:
            every time the function 'update' recieves the value of 'dt' it gets added to the array
            then when the array if full after receiving a certian amount of 'dt' values, the array is emptied
            only when the array is empty you move to the next frame of animation

            rinse and repeat

            example: the animation frame should move once every 20 'dt's not every dt, if so to speak.
    */
    setSpeed(dt, speedArray, multiplier = 1) {
        if (this.movingArray.length !== this.speed * multiplier) {
            this.movingArray.push(dt);
        } else {
            this.movingArray = [];
        }
    }

    reset() {
        this.x = (24 * this.xPos) + 4; // 24 is the size of each block and +4 to center the character
        this.y = (24 * this.yPos) - 8; // 24 is the size of each block and -8 to center the character
        COLLECTABLE_2.x = selectedLevel === 'facility' ?  28 : 52;
        COLLECTABLE_5.x = selectedLevel === 'facility' ?  100 : 124;
        this.sx = 0;
        this.sy = 0;
        this.movingArray = [];
        this.inNeed = false;
        this.collected = false;
    }
}

/**** Start Logic ****/
// Instantiating  Classes
const PLAYER = new Character(3, 10, 'subzero', 4); // xPosition, yPosition, name, speed

const SCORE = new Score();

const ALL_FINISHES = [];
const FINISH_1 = new Finish(0); // xPosition
const FINISH_2 = new Finish(2);
const FINISH_3 = new Finish(4);
const FINISH_4 = new Finish(6);
ALL_FINISHES.push(FINISH_1, FINISH_2, FINISH_3, FINISH_4);

const ALL_ENEMIES = [];
const ENEMY_BOSS = new Enemy(-2, 3, 'boss', 2, 'left'); // xPosition, yPosition, name, speed, direction
const ENEMY_3_1 = new Enemy(7, 5, 'enemy_3', 4, 'left');
const ENEMY_3_2 = new Enemy(9, 5, 'enemy_3', 4, 'left');
const ENEMY_3_3 = new Enemy(11, 5, 'enemy_3', 4, 'left');
const ENEMY_2_1 = new Enemy(-1, 6, 'enemy_2', 5, 'right');
const ENEMY_2_2 = new Enemy(-3, 6, 'enemy_2', 5, 'right');
const ENEMY_2_3 = new Enemy(-5, 6, 'enemy_2', 5, 'right');
const ENEMY_2_4 = new Enemy(-7, 6, 'enemy_2', 5, 'right');
const ENEMY_1_1 = new Enemy(7, 8, 'enemy_1', 6, 'left');
const ENEMY_1_2 = new Enemy(8, 8, 'enemy_1', 6, 'left');
const ENEMY_1_3 = new Enemy(10, 8, 'enemy_1', 6, 'left');
const ENEMY_1_4 = new Enemy(11, 8, 'enemy_1', 6, 'left');
ALL_ENEMIES.push(ENEMY_BOSS, ENEMY_3_1, ENEMY_3_2, ENEMY_3_3, ENEMY_1_1, ENEMY_2_1, ENEMY_2_2, ENEMY_2_3, ENEMY_2_4, ENEMY_1_2, ENEMY_1_3, ENEMY_1_4);

const ALL_COLLECTABLES = [];
const COLLECTABLE_1 = new Collectable(5, 10, 'collectable_1',6); // xPosition, yPosition, name, speed
const COLLECTABLE_2 = new Collectable(1, 7, 'collectable_1', 6);
const COLLECTABLE_3 = new Collectable(4, 3, 'collectable_1', 6);
const COLLECTABLE_4 = new Collectable(3, 6, 'collectable_2', 6);
const COLLECTABLE_5 = new Collectable(4, 4, 'collectable_2', 6);
const COLLECTABLE_6 = new Collectable(1, 3, 'collectable_2', 6);
const COLLECTABLE_7 = new Collectable(1, 8, 'collectable_2', 6);
const COLLECTABLE_8 = new Collectable(6, 9, 'collectable_2', 6);
ALL_COLLECTABLES.push(COLLECTABLE_1, COLLECTABLE_2, COLLECTABLE_3, COLLECTABLE_4, COLLECTABLE_5, COLLECTABLE_6, COLLECTABLE_7, COLLECTABLE_8);

// Animate the welcome screen (show for 4 seconds then hide)
setTimeout(() => {
    if (insideOf === 'welcome-screen') {
        hide(WELCOME_SCREEN);
        show(HELLO_SCREEN);
        insideOf = 'hello-screen';
        APPEAR_SOUND.play();
    };
}, 4000);

START_MENU.addEventListener('click', e => {
    let clicked = e.target.classList.value; // store the classes of the element we clicked to a variable

    if (insideOf === 'welcome-screen') {
        APPEAR_SOUND.play();
        hide(WELCOME_SCREEN);
        show(HELLO_SCREEN);
        insideOf = 'hello-screen';
    } else if (insideOf === 'hello-screen') {
        MENU_CLICK_SOUND.play();
        hide(HELLO_SCREEN);
        show(MAIN_MENU);
        insideOf = 'main-menu';
    }

    if (clicked === 'start-menu-play') {
        MENU_CLICK_SOUND.play();
        hide(MAIN_MENU);
        show(PLAY_MENU);
        insideOf = clicked;
    } else if (clicked === 'start-menu-instructions') {
        MENU_CLICK_SOUND.play();
        hide(MAIN_MENU);
        show(INSTRUCTIONS_MENU);
        insideOf = clicked;
    } else if (clicked === 'start-menu-credits') {
        MENU_CLICK_SOUND.play();
        hide(MAIN_MENU);
        show(CREDITS_MENU);
        insideOf = clicked;
    }

    if (insideOf === 'start-menu-play') {

        if (clicked === 'scorpion' || clicked === 'subzero' || clicked === 'reptile') {select(SELECT_CHARACTER, clicked, 'character')} // select the character we clicked
        else if (clicked === 'facility' || clicked === 'dungeon') {select(SELECT_LEVEL, clicked, 'level')} // select the level we clicked
        else if (clicked === 'slow' || clicked === 'normal' || clicked === 'fast') {select(SELECT_SPEED, clicked, 'speed')} // select the speed we clicked
        else if (clicked === 'invulnerable' || clicked === 'lightning' || clicked === 'infinite-power') { // select the cheat we clicked
            MENU_CLICK_SOUND.play();
            document.querySelector(`.${clicked}`).classList.add('selected');
            selectedCheats.add(clicked);
        } else if (clicked === 'invulnerable selected' || clicked === 'lightning selected' || clicked === 'infinite-power selected') { // deselect the cheat we clicked
            MENU_CLICK_SOUND.play();
            document.querySelector(`.${clicked.replace(' selected', '')}`).classList.remove('selected');
            selectedCheats.delete(clicked.replace(' selected', ''));
        } else if (clicked === 'alternative') { // activate alternate costumes
            MENU_CLICK_SOUND.play();
            document.querySelector(`.${clicked}`).classList.add('selected');
            selectedAlt = true;
            changeCostumes(1);
        } else if (clicked === 'alternative selected') { // disactivate alternate costumes
            MENU_CLICK_SOUND.play();
            document.querySelector(`.${clicked.replace(' selected', '')}`).classList.remove('selected');
            selectedAlt = '';
            changeCostumes(0);
        }
        else if (clicked === 'play') {

            if (selectedCharacter && selectedSpeed) { // only start the game if player has selected a character and a level and a game speed
                MENU_CLICK_SOUND.play();
                updateSprites();
                hide(START_MENU);
                hide (PLAY_MENU);
                show(INGAME_MENU);
                startedGame = true;
                show(CANVAS);
                main();
                startTimer();
            } else {ERROR_SOUND.play();}

        } else if (clicked === 'back') {
            hide(PLAY_MENU);
            show(MAIN_MENU);
            MENU_CLICK_SOUND.play();
            deSelect([SELECT_CHARACTER, SELECT_ALT, SELECT_LEVEL, SELECT_SPEED, SELECT_CHEAT]); // deselect everytinh
            changeCostumes(0);
        }

    } else if (insideOf === 'start-menu-instructions' && clicked === 'back') {
        MENU_CLICK_SOUND.play();
        hide(INSTRUCTIONS_MENU);
        show(MAIN_MENU);
    }  else if (insideOf === 'start-menu-credits' && clicked === 'back') {
        MENU_CLICK_SOUND.play();
        hide(CREDITS_MENU);
        show(MAIN_MENU);
    }
});

PAUSE.addEventListener('click', () => {
    if (startedGame && !PLAYER.win && PLAYER.health) { // you can only pause if game is already running and if gamewon/gameover modal is not showing
        fillModal('pause');
        pause();
    }
});

RESTART.addEventListener('click', () => {
    MENU_CLICK_SOUND.play();
    cancelAnimation();
    reset();
});

MODAL.addEventListener('click', e => {
    let clicked = e.target.classList.value;
    if (clicked === 'modal-exit') {
        MENU_CLICK_SOUND.play();
        hide(MODAL);
        hide(INGAME_MENU);
        hide(CANVAS);
        show(START_MENU);
        show(PLAY_MENU);
        startedGame = false;
        reset();
    } else if (clicked === 'modal-pause') {pause();}
    else if (clicked === 'modal-replay') {
        MENU_CLICK_SOUND.play();
        hide(MODAL);
        reset();
    }
});

KEYBOARD_CONTROLS.addEventListener('click', e => {PLAYER.handleInput(e.target.classList.value)});

document.addEventListener('keyup', e => {
    PLAYER.handleInput(AllowedKeys[e.keyCode]);
    handleInput(AllowedKeys[e.keyCode]);
});
