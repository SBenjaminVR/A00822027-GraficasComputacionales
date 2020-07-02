let ctx = null;
let canvas = document.getElementById('ballCanvas');
ctx = canvas.getContext('2d');

let movePlayer1 = false, movePlayer2 = false;
let command1 = 0, command2 = 0;
let pressed = {
    w: false,
    s: false,
    o: false,
    l: false
}

class brick {
    constructor(color, team, y) {
        this.color = color;
        this.team = team;
        this.y = y;
        this.velocityY = 4;
    }

    draw() {
        ctx.fillStyle = this.color;
        if (this.team == 'left') {
            ctx.fillRect(canvas.width * 0.01, this.y, 15, 70);
        }
        else {
            ctx.fillRect(canvas.width - ((canvas.width * 0.01) + 15), this.y, 15, 70);
        }

    }

    move(yLimit, command) {
        if ((this.y + 70 < yLimit && command > 0) || (this.y > 0 && command < 0)) {
            this.y += this.velocityY * command;
        }
    }

    changeColor(newColor) {
        this.color = newColor;
    }
}

class sphere {
    constructor(color, x, y, radius) {
        this.color = color;
        this.x = x;
        this.y = y,
            this.radius = radius;
        this.right = true;
        this.up = true;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    collide(xMin, xMax, yMin, yMax) {
        if (((this.x + this.radius) > xMin && (this.x + this.radius) < xMax) || ((this.x + this.radius) > xMin && (this.x - this.radius) < xMax)) {
            if ((this.y + this.radius) > yMin && (this.y + this.radius) < yMax) {
                this.right = !this.right
            }
        }
    }

    update(xLimit, yLimit) {
        if (this.x + this.radius > xLimit) { this.right = false; }
        if (this.x < this.radius) { this.right = true; }

        if (this.y + this.radius > yLimit) { this.up = true; }
        if (this.y < this.radius) { this.up = false; }


        if (this.right) {
            this.x += 5;
        }
        else {
            this.x -= 5;
        }

        if (this.up) {
            this.y -= 5;
        }
        else {
            this.y += 5;
        }
    }

    changeColor(newColor) {
        this.color = newColor;
    }
}

function update(ball, player1, player2) {
    requestAnimationFrame(() => update(ball, player1, player2));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (movePlayer1) { player1.move(canvas.height, command1); }
    if (movePlayer2) { player2.move(canvas.height, command2); }

    if (!pressed['w'] && !pressed['s']) {
        movePlayer1 = false;
    }

    if (!pressed['o'] && !pressed['l']) {
        movePlayer2 = false;
    }

    ball.collide(canvas.width * 0.01, (canvas.width * 0.01) + 15, player1.y, player1.y+70);
    ball.collide(canvas.width - ((canvas.width * 0.01) + 15), canvas.width - ((canvas.width * 0.01) + 15) + 15, player2.y, player2.y+70);
    ball.draw();
    player1.draw();
    player2.draw();
    ball.update(canvas.width, canvas.height);
}


let player1 = new brick('white', 'left', 10);
let player2 = new brick('white', 'right', 10);
let ball = new sphere('white', canvas.width / 2, canvas.height / 2, 15);

function main() {
    update(ball, player1, player2);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            command1 = -1;
            movePlayer1 = true;
            break;
        case 's':
            command1 = 1;
            movePlayer1 = true;
            break;
        case 'o':
            command2 = -1;
            movePlayer2 = true;
            break;
        case 'l':
            command2 = 1;
            movePlayer2 = true;
            break;
    }
    pressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key == 'w' || event.key == 's' || event.key == 'o' || event.key == 'l') {
        pressed[event.key] = false;
    }
})

/* Change color of player 1 */
document.getElementById('player1Blue').addEventListener('click', (event) => {
    player1.changeColor('#80d8ff')
})

document.getElementById('player1Pink').addEventListener('click', (event) => {
    player1.changeColor('#ec407a')
})

document.getElementById('player1Teal').addEventListener('click', (event) => {
    player1.changeColor('#80cbc4')
})

document.getElementById('player1White').addEventListener('click', (event) => {
    player1.changeColor('white')
})

/* Change color of player 2 */

document.getElementById('player2Blue').addEventListener('click', (event) => {
    player2.changeColor('#80d8ff')
})

document.getElementById('player2Pink').addEventListener('click', (event) => {
    player2.changeColor('#ec407a')
})

document.getElementById('player2Teal').addEventListener('click', (event) => {
    player2.changeColor('#80cbc4')
})

document.getElementById('player2White').addEventListener('click', (event) => {
    player2.changeColor('white')
})

/* Change color of the ball */

document.getElementById('ballYellow').addEventListener('click', (event) => {
    ball.changeColor('#ffeb3b')
})

document.getElementById('ballRed').addEventListener('click', (event) => {
    ball.changeColor('#e53935')
})

document.getElementById('ballPurple').addEventListener('click', (event) => {
    ball.changeColor('#b39ddb')
})

document.getElementById('ballWhite').addEventListener('click', (event) => {
    ball.changeColor('#white')
})