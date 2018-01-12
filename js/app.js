/**
 * @description Represents an enemy that player must avoid
 * @constructor
 * @param {object} props - Position and speed of the enemy
 */
var Enemy = function (props) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Attributes for the enemy.
    this.x = props.x;
    this.y = props.y;
    this.speed = props.speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
 * @description Update the enemy object with a time dt
 * and check for collision
 * @param {number} dt - time frame difference
 */
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var nextPosition = this.x + this.speed * dt;  // s1 = s0 + vt

    this.x = nextPosition >= document.getElementsByTagName('canvas')[0].clientWidth ?
        -100 : nextPosition;

    // See if there is a collision now
    checkCollision(this);
};

/**
 * @description Draw the enemy on canvas
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @description Represents the player
 * @constructor
 * @params {object} props - Position of player
 */
var Player = function(props) {
    this.x = props.x;
    this.y = props.y;
    this.sprite = 'images/char-boy.png';
};

/**
 * @description Update the player, check if out of bounds
 */
Player.prototype.update = function() {
    if (this.y > 383 ) {
        this.y = 383;
    }
    if (this.x > 402.5) {
        this.x = 402.5;
    }
    if (this.x < 0) {
        this.x = 0;
    }
};

/**
 * @description Render the player and also display score
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayStats({score: score, level: gameLevel, deaths: deaths});
};

/**
 * @description Handle the key press event and see if player has won
 * @param key {string} - String representation of pressed key
 */
Player.prototype.handleInput = function(key) {
    // Going out of bounds is handled by Player's update method
    if (key === 'left') {
        this.x -= 50;
    }
    if (key === 'up') {
        this.y -= 50;
    }
    if (key === 'right') {
        this.x += 50;
    }
    if (key === 'down') {
        this.y += 50;
    }

    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    if (player.y + 63 <= 0) {
        player.x = 202.5;
        player.y = 383;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        displayWin();
        score += 1;
        gameLevel += 1;
        increaseDifficulty();
    }
};

/**
 * @description Display the score in a div
 * @param props {Object} - Score, level and death count for player
 */
var displayStats = function(props) {
    var canvas = document.getElementsByTagName('canvas')[0];
    scoreLevelDiv.innerHTML = 'Score: ' + props.score + ' | Level: '
        + props.level + ' | Deaths: ' + props.deaths;
    document.body.insertBefore(scoreLevelDiv, canvas);
};

/**
 * @description Check collision
 * @param enemy {Enemy} - Enemy to check collision with
 */
var checkCollision = function(enemy) {
    if (player.y + 131 >= enemy.y + 90 && player.x + 25 <= enemy.x + 88
        && player.y + 73 <= enemy.y + 135 && player.x + 76 >= enemy.x + 11) {
        player.x = 202.5;
        player.y = 383;
        deaths++;
        displayDead();
    }
};

/**
 * @description Increase the number of enemies on board
 */
var increaseDifficulty = function() {
    if (allEnemies.length < 5) {
        allEnemies.push(new Enemy({
            x: -100,
            y: Math.random() * 184 + 50,
            speed: Math.random() * 256
        }));
    } else {
        allEnemies = allEnemies.map(function (enemy) {
            enemy.speed += 5;
            return enemy;
        })
    }
};

/**
 * @description Show winning text
 */
var displayWin = function () {
    logDiv.innerText = 'You won!';
    logDiv.className = 'green';
};

/**
 * @description Show losing text
 */
var displayDead = function () {
    logDiv.innerText = 'You died!';
    logDiv.className = 'red';
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const INITIAL_PLAYER_CONFIG = {x: 202.5, y: 383};

var player = new Player(INITIAL_PLAYER_CONFIG),
    score = 0,
    deaths = 0,
    gameLevel = 1,
    scoreLevelDiv = document.createElement('div'),
    logDiv = document.createElement('div'),
    allEnemies = [new Enemy({
        x: -100,
        y: Math.random() * 184 + 50,
        speed: Math.random() * 100 + 25
    })];

// Place log div in view
logDiv.innerHTML = 'Let\'s begin the game!';
document.body.insertBefore(logDiv, document.getElementsByTagName('canvas')[0]);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
