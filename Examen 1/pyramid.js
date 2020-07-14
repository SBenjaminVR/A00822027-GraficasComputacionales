let projectionMatrix = null, shaderProgram = null;

let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;

let mat4 = glMatrix.mat4;

let duration = 10000;

let verts = [];
let vertexColors = [];
let pyramidIndices = [];

let vertexShaderSource = `
attribute vec3 vertexPos;
attribute vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}`;

let fragmentShaderSource = `
    precision lowp float;
    varying vec4 vColor;

    void main(void) {
    // Return the pixel color: always output white
    gl_FragColor = vColor;
}
`;

function createShader(gl, str, type) {
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl) {
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function initWebGL(canvas) {
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
}

function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
}

function draw(gl, objs) {
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for (obj of objs) {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function sierpinsky(gl, x, y, z, n, size) {
    if (n > 0) {
        sierpinsky(gl, x - size / 2, y - size / 2, z + size / 2, n - 1, size / 2);
        sierpinsky(gl, x + size / 2, y - size / 2, z + size / 2, n - 1, size / 2);
        sierpinsky(gl, x, y + size / 2, z, n - 1, size / 2);
    }
    else {
        let a = Math.random(), b = Math.random(), c = Math.random();
        for (let i = 0; i < 3; i++) {
            vertexColors.push(a, b, c, 1);
        }

        verts.push(x, y + size, z);
        verts.push(x - size, y - size, z + size);
        verts.push(x + size, y - size, z + size);
    }

}

function createFloor(gl, x, y, z, n, size) {
    if (n > 0) {
        createFloor(gl, x - size / 2, y, z + size / 2, n - 1, size / 2);
        createFloor(gl, x + size / 2, y, z + size / 2, n - 1, size / 2);
        createFloor(gl, x, y, z - size / 2, n - 1, size / 2);
    }
    else {
        let a = Math.random(), b = Math.random(), c = Math.random();
        for (let i = 0; i < 3; i++) {
            vertexColors.push(a, b, c, 1);
        }

        verts.push(x, y, z - size);
        verts.push(x - size, y, z + size);
        verts.push(x + size, y, z + size);
    }
}

function otherFaces(gl, x, y, z, n, size) {
    if (n > 0) {
        otherFaces(gl, x, y + size / 2, z, n - 1, size / 2);
        otherFaces(gl, x, y - size / 2, z - size / 2, n - 1, size / 2);
        otherFaces(gl, x - size / 2, y - size / 2, z + size / 2, n - 1, size / 2);
    }
    else {
        let a = Math.random(), b = Math.random(), c = Math.random();
        for (let i = 0; i < 3; i++) {
            vertexColors.push(a, b, c, 1);
        }
        a = Math.random(), b = Math.random(), c = Math.random();
        for (let i = 0; i < 3; i++) {
            vertexColors.push(a, b, c, 1);
        }

        verts.push(-x, y + size, z);
        verts.push(-x, y - size, z - size);
        verts.push(-x + size, y - size, z + size);
        verts.push(x, y + size, z);
        verts.push(x, y - size, z - size);
        verts.push(x - size, y - size, z + size);
    }
}

function createPyramid(gl, translation, rotationAxis, n) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    sierpinsky(gl, 0, 0, 0, n, 0.6);
    otherFaces(gl, 0, 0, 0, n, 0.6);
    createFloor(gl, 0, -0.6, 0, n, 0.6);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    for (let i = 0; i < verts.length / 3; i += 3) {
        pyramidIndices.push(i, i + 1, i + 2);
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

    console.log(verts);
    console.log(vertexColors);
    console.log(pyramidIndices);

    let pyramid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: pyramidIndexBuffer,
        vertSize: 3, nVerts: verts.length / 3, colorSize: 4, nColors: vertexColors.length / 4, nIndices: pyramidIndices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    }

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);
    mat4.rotate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, Math.PI / 8, [1, 0, 0]);

    pyramid.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    verts = [];
    vertexColors = [];
    pyramidIndices = [];

    return pyramid;
}

function update(glCtx, objs) {
    requestAnimationFrame(() => update(glCtx, objs));

    draw(glCtx, objs);
    objs.forEach(obj => obj.update())
}

function main() {
    let canvas = document.getElementById("pyramidCanvas");
    let glCtx = initWebGL(canvas);

    initViewport(glCtx, canvas);
    initGL(glCtx, canvas);

    let pyramid = createPyramid(glCtx, [0, 0, -2], [0, 1, 0], 3);

    initShader(glCtx, vertexShaderSource, fragmentShaderSource);

    update(glCtx, [pyramid]);
}