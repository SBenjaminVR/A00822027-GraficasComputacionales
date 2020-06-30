let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let slider = document.getElementById("slider");

function sierpinski(Ax, Ay, Bx, By, Cx, Cy, p) {
    if (p > 0) {
        sierpinski(Ax, Ay, (Ax + Cx) / 2, (Ay + Cy) / 2, (Ax + Bx) / 2, (Ay + By) / 2, p-1);
        sierpinski((Ax + Bx) / 2, (Ay + By) / 2, (Bx + Cx) / 2, (By + Cy) / 2, Bx, By, p-1);
        sierpinski((Ax + Cx) / 2, (Ay + Cy) / 2, (Bx + Cx) / 2, (By + Cy) / 2, Cx, Cy, p-1);
    }
    else {
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Bx, By);
        ctx.lineTo(Cx, Cy);
        ctx.lineTo(Ax, Ay);
    }
}

function dibujarTriangulos(profundidad, width, height, size) {
    let mitadX = width/2;
    let mitadY = height/2;
 
    let radioI = (size/6) * Math.sqrt(3);
    let radioE = (size/3) * Math.sqrt(3);
 
    sierpinski(mitadX-(size/2), mitadY+radioI, mitadX+(size/2), mitadY+radioI, mitadX, mitadY-radioE, profundidad);
}

function borrarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0,0);
}

function pintarTriangulos() {
    ctx.fillStyle = '#F1C40F';
    ctx.fill();
    ctx.strokeStyle = '#9A7D0A';
    ctx.lineWidth = 1;
    ctx.stroke();
}

slider.addEventListener('mouseup', function() {
    borrarCanvas();
    dibujarTriangulos(this.value, 675, 650, 500);
    pintarTriangulos();
});

