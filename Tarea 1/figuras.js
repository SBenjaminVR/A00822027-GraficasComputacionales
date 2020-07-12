let mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; // ms

let direction = 'up';

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource =
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas) {
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
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

function initGL(canvas) {
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

function createPyramid(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        // Face 1 (0,1,2)
        0.0, 1.0, 0.0,
        0.0, -1.0, 1.0,
        -1.0, -1.0, 0.1,

        // Face 2 (3,4,5)
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.1,
        -0.5, -1.0, -1.0,

        // Face 3 (6,7,8)
        0.0, 1.0, 0.0,
        1.0, -1.0, 0.1,
        0.5, -1.0, -1.0,

        // Face 4 (9,10,11)
        0.0, 1.0, 0.0,
        -0.5, -1.0, -1.0,
        0.5, -1.0, -1.0,

        // Face 5 (12,13,14)
        0.0, 1.0, 0.0,
        0.0, -1.0, 1.0, 
        1.0, -1.0, 0.1,

        // Pentagon face (15,16,17,18,19)
        0.0, -1.0, 1.0, // 1
        -1.0, -1.0, 0.1, // 2
        1.0, -1.0, 0.1, // 3
        -0.5, -1.0, -1.0, // 4
        0.5, -1.0, -1.0  // 5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.98, 0.84, 0.62, 1.0], // Face 1
        [0.97, 0.76, 0.44, 1.0], // Face 2
        [0.95, 0.61, 0.07, 1.0], // Face 3
        [0.96, 0.69, 0.25, 1.0], // Face 4
        [0.84, 0.54, 0.06, 1.0], // Face 5
        [1.0, 1.0, 1.0, 1.0]  // Pentagon
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the pyramid's face.
    let vertexColors = [];
    for (const color of faceColors) {
        for (let j = 0; j < 3; j++)
            vertexColors.push(...color);
    }
    //Extra faces of the pentagon
    vertexColors.push(...faceColors[5]);
    vertexColors.push(...faceColors[5]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let pyramidIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17, 17, 18, 19, 16, 17, 18
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

    let pyramid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
        vertSize: 3, nVerts: 20, colorSize: 4, nColors: 20, nIndices: 24,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return pyramid;
}

function createDodecahedron(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        // Face 1 (0,1,2,3,4) A2->J
        0.0, -1.618, 1/1.618,
        0.0, -1.618, -1/1.618,
        1.0, -1.0, -1.0,
        1.618, -1/1.618, 0.0,
        1.0, -1.0, 1.0,

        // Face 2 (5,6,7,8,9) J->B1
        1.0, -1.0, 1.0,
        1.618, -1/1.618, 0.0,
        1.618, 1/1.618, 0.0,
        1.0, 1.0, 1.0,
        1/1.618, 0.0, 1.618,

        // Face 3 (10,11,12,13,14) A2->I
        0.0, -1.618, 1/1.618,
        1.0, -1.0, 1.0,
        1/1.618, 0.0, 1.618,
        -1/1.618, 0.0, 1.618,
        -1.0, -1.0, 1.0,

        // Face 4 (15,16,17,18,19) A4->D
        0.0, -1.618, -1/1.618,
        0.0, -1.618, 1/1.618,
        -1.0, -1.0, 1.0,
        -1.618, -1/1.618, 0,
        -1.0, -1.0, -1.0,

        // Face 5 (20,21,22,23,24) B3->B4
        1/1.618, 0.0, -1.618,
        1.0, -1.0, -1.0,
        0.0, -1.618, -1/1.618,
        -1.0, -1.0, -1.0,
        -1/1.618, 0.0, -1.618,

        // Face 6 (25,26,27,28,29) C1->A
        1.618, 1/1.618, 0.0,
        1.618, -1/1.618, 0.0,
        1.0, -1.0, -1.0,
        1/1.618, 0.0, -1.618,
        1.0, 1.0, -1.0,

        // Face 7 (30,31,32,33,34) A->A3
        1.0, 1.0, -1.0,
        1/1.618, 0.0, -1.618,
        -1/1.618, 0.0, -1.618,
        -1.0, 1.0, -1.0,
        0.0, 1.618, -1/1.618,

        // Face 8 (35,36,37,38,39) C1->G
        1.618, 1/1.618, 0.0,
        1.0, 1.0, -1.0,
        0.0, 1.618, -1/1.618,
        0.0, 1.618, 1/1.618,
        1.0, 1.0, 1.0,

        // Face 9 (40,41,42,43,44) B1->B2
        1/1.618, 0.0, 1.618,
        1.0, 1.0, 1.0,
        0.0, 1.618, 1/1.618,
        -1.0, 1.0, 1.0,
        -1/1.618, 0.0, 1.618,
        
        //Face 10 (45,46,47,48,49) B2->H
        -1/1.618, 0.0, 1.618,
        -1.0, -1.0, 1.0,
        -1.618, -1/1.618, 0.0,
        -1.618, 1/1.618, 0.0,
        -1.0, 1.0, 1.0,

        //Face 11 (50,51,52,53,54) H->C2
        -1.0, 1.0, 1.0,
        0.0, 1.618, 1/1.618,
        0.0, 1.618, -1/1.618,
        -1.0, 1.0, -1.0,
        -1.618, 1/1.618, 0.0,

        //Face 12(55,56,57,58,59) C2->C4
        -1.618, 1/1.618, 0.0,
        -1.0, 1.0, -1.0,
        -1/1.618, 0.0, -1.618,
        -1.0, -1.0, -1.0,
        -1.618, -1/1.618, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.52, 0.76, 0.91, 1.0], // Face 1
        [0.36, 0.68, 0.89, 1.0], // Face 2
        [0.2, 0.6, 0.86, 1.0], // Face 3
        [0.18, 0.53, 0.76, 1.0], // Face 4
        [0.16, 0.45, 0.65, 1.0], // Face 5
        [0.13, 0.38, 0.55, 1.0],  //Face 6
        [0.48, 0.14, 0.11, 1.0], //Face 7
        [0.57, 0.17, 0.13, 1.0], //Face 8
        [0.66, 0.2, 0.15, 1.0], // Face 9
        [0.75, 0.22, 0.17, 1.0], // Face 10
        [0.85, 0.53, 0.5, 1.0], // Face 11
        [0.8, 0.38, 0.33, 1.0], // Face 12
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the dodecahedron's face.
    let vertexColors = [];
    for (const color of faceColors) {
        for (let j = 0; j < 5; j++)
            vertexColors.push(...color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let dodecahedronIndices = [
        0, 1, 2, 2, 3, 4, 0, 2, 4,
        5, 6, 7, 7, 8, 9, 5, 7, 9,
        10, 11, 12, 12, 13, 14, 10, 12, 14,
        15, 16, 17, 17, 18, 19, 15, 17, 19,
        20, 21, 22, 22, 23, 24, 20, 22, 24,
        25, 26, 27, 27, 28, 29, 25, 27, 29,
        30, 31, 32, 32, 33, 34, 30, 32, 34,
        35, 36, 37, 37, 38, 39, 35, 37, 39,
        40, 41, 42, 42, 43, 44, 40, 42, 44,
        45, 46, 47, 47, 48, 49, 45, 47, 49,
        50, 51, 52, 52, 53, 54, 50, 52, 54,
        55, 56, 57, 57, 58, 59, 55, 57, 59
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecahedronIndices), gl.STATIC_DRAW);

    let dodecahedron = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
        vertSize: 3, nVerts: 60, colorSize: 4, nColors: 60, nIndices: dodecahedronIndices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

    dodecahedron.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        angle /= rotationAxis.length;

        for (let i = 0; i < rotationAxis.length; i++) {
            mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[i]);
        }
    };

    return dodecahedron;
}

function createOctahedron(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        // Face 1 (0,1,2)
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        // Face 2 (3,4,5)
        1.0, 0.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, 1.0,

        // Face 3 (6,7,8)
        1.0, 0.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, -1.0,

        // Face 4 (9,10,11)
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, -1.0,

        //Face 5 (12,13,14)
        -1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        // Face 6 (15,16,17)
        -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, 1.0,

        // Face 7 (18,19,20s)
        -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, -1.0,

        // Face 9 (21,22,23)
        -1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.46, 0.84, 0.77, 1.0], // Face 1
        [0.45, 0.78, 0.71, 1.0], // Face 2
        [0.49, 0.81, 0.63, 1.0], // Face 3
        [0.51, 0.88, 0.67, 1.0], // Face 4
        [0.28, 0.79, 0.69, 1.0], // Face 5
        [0.27, 0.7, 0.62, 1.0], // Face 6
        [0.32, 0.75, 0.5, 1.0], // Face 7
        [0.35, 0.84, 0.55, 1.0]  // Face 8
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the pyramid's face.
    let vertexColors = [];
    for (const color of faceColors) {
        for (let j = 0; j < 3; j++)
            vertexColors.push(...color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let octahedronIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12,13,14,
        15,16,17,
        18,19,20,
        21,22,23
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);

    let octahedron = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
        vertSize: 3, nVerts: 20, colorSize: 4, nColors: 20, nIndices: octahedronIndices.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);

    octahedron.update = function () {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        if (this.modelViewMatrix[13] < 1.9 && direction == 'up') {
         mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, [0,0.01,0]);
        }
        else {
            if (this.modelViewMatrix[13] >= 1.9 && direction == 'up') {
                direction = 'down';
            }
            
        }
        if (this.modelViewMatrix[13] > -1.9 && direction == 'down') {
            mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, [0,-0.01,0]);
           }
           else {
            if (this.modelViewMatrix[13] <= -1.9 && direction == 'down') {
                direction = 'up';
            }
        }
    };

    return octahedron;
}


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

function draw(gl, objs) {
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for (i = 0; i < objs.length; i++) {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) {
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function () { run(gl, objs); });

    draw(gl, objs);

    for (i = 0; i < objs.length; i++)
        objs[i].update();
}
