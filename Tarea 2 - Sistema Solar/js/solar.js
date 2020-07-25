
let sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto;
let marsMoon, marsMoon2;

let asteroid, asteroid2, asteroid3, asteroid4, asteroid5, asteroid6, asteroid7, asteroid8, asteroid9;
let jupiterMoon, jupiterMoon2, jupiterMoon3, jupiterMoon4, jupiterMoon5, jupiterMoon6, jupiterMoon7, jupiterMoon8, jupiterMoon9;

let saturnRing;
let planetSegments = 48;
let mercuryData = storePlanet(88, 0.012, 22, "textures/mercury.png", 0.5, planetSegments);
let venusData = storePlanet(224, 0.02, 27, "textures/venus.jpg", 0.9, planetSegments);

var earthData = storePlanet(365.2564, 0.015, 32, "textures/earth.jpg", 1, planetSegments);
var moonData = storePlanet(29.5, 0.01, 2.8, "textures/moon.jpg", 0.4, planetSegments);

let marsData = storePlanet(687, 0.03, 36, "textures/mars.png", 0.7, planetSegments);
let marsMoonData = storePlanet(22.5, 0.01, 1, "textures/moon.jpg", 0.3, planetSegments);
let marsMoon2Data = storePlanet(23.5, 0.015, 1.2, "textures/moon.jpg", 0.3, planetSegments);

let asteroidSize = 2;
let asteroidData = storePlanet(300, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid2Data = storePlanet(298, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid3Data = storePlanet(296, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid4Data = storePlanet(294, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid5Data = storePlanet(292, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid6Data = storePlanet(290, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid7Data = storePlanet(288, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid8Data = storePlanet(286, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);
let asteroid9Data = storePlanet(284, 0.02, 41, "textures/asteroid.jpg", asteroidSize, planetSegments);

let jupiterData = storePlanet(700, 0.012, 48, "textures/jupiter.jpg", 4, planetSegments);
let jupiterMoonData = storePlanet(23.5, 0.01, 1, "textures/moon.jpg", 1, planetSegments);
let jupiterMoon2Data = storePlanet(22.5, 0.01, 1.2, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon3Data = storePlanet(21.5, 0.01, 1.4, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon4Data = storePlanet(20.5, 0.01, 1.6, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon5Data = storePlanet(19.5, 0.01, 1.1, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon6Data = storePlanet(18.5, 0.01, 1.3, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon7Data = storePlanet(17.5, 0.01, 1.4, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon8Data = storePlanet(16.5, 0.01, 1.5, "textures/moon.jpg", 0.2, planetSegments);
let jupiterMoon9Data = storePlanet(16.5, 0.01, 1.6, "textures/moon.jpg", 0.2, planetSegments);


let saturnData = storePlanet(800, 0.13, 54, "textures/saturn.jpg", 3.4, planetSegments);
let uranusData = storePlanet(900, 0.134, 60, "textures/uranus.jpg", 2.3, planetSegments);
let neptuneData = storePlanet(1000, 0.138, 65, "textures/neptune.jpg", 2.2, planetSegments);
let plutoData = storePlanet(1100, 0.018, 70, "textures/pluto.jpg", 0.38, planetSegments);

let pointLight, earthOrbit, ring, controls, scene, camera, renderer;
var orbitData = { value: 200, runOrbit: true, runRotation: true };
let clock = new THREE.Clock();

function storePlanet(OrbitRate, RotationRate, DistanceFromAxis, Texture, Size, Segments) {
    return {
        orbitRate: OrbitRate,
        rotationRate: RotationRate,
        distanceFromAxis: DistanceFromAxis,
        texture: Texture,
        size: Size,
        segments: Segments
    };
}

function createRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({ color: myColor, side: THREE.DoubleSide });
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

function createSaturnRing(size, innerDiameter, facets, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    let texture = new THREE.TextureLoader().load("textures/saturnRing.jpg")
    var ring1Material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

function drawOrbits() {
    let orbitWidth = 0.1;
    mercuryOrbit = createRing(mercuryData.distanceFromAxis + orbitWidth, mercuryData.distanceFromAxis - orbitWidth, 320, 0xff231c, "mercuryOrbit", 0);
    venusOrbit = createRing(venusData.distanceFromAxis + orbitWidth, venusData.distanceFromAxis - orbitWidth, 320, 0xff231c, "venusOrbit", 0);
    earthOrbit = createRing(earthData.distanceFromAxis + orbitWidth, earthData.distanceFromAxis - orbitWidth, 320, 0xff231c, "earthOrbit", 0);
    marsOrbit = createRing(marsData.distanceFromAxis + orbitWidth, marsData.distanceFromAxis - orbitWidth, 320, 0xff231c, "marsOrbit", 0);

    asteroidsOrbit = createRing(asteroidData.distanceFromAxis + orbitWidth, asteroidData.distanceFromAxis - orbitWidth, 320, 0xff9295c, "asteroidOrbit", 0);

    jupiterOrbit = createRing(jupiterData.distanceFromAxis + orbitWidth, jupiterData.distanceFromAxis - orbitWidth, 320, 0x71dcea, "jupiterOrbit", 0);
    saturnOrbit = createRing(saturnData.distanceFromAxis + orbitWidth, saturnData.distanceFromAxis - orbitWidth, 320, 0x71dcea, "saturnOrbit", 0);
    uranusOrbit = createRing(uranusData.distanceFromAxis + orbitWidth, uranusData.distanceFromAxis - orbitWidth, 320, 0x71dcea, "uranusOrbit", 0);
    neptuneOrbit = createRing(neptuneData.distanceFromAxis + orbitWidth, neptuneData.distanceFromAxis - orbitWidth, 320, 0x71dcea, "neptuneOrbit", 0);
    plutoOrbit = createRing(plutoData.distanceFromAxis + orbitWidth, plutoData.distanceFromAxis - orbitWidth, 320, 0x71dcea, "plutoOrbit", 0);
}

function createSphere(material, size, segments) {
    let geometry = new THREE.SphereGeometry(size, segments, segments);
    let sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    return sphere;
}

function addPlanet(data, x, y, z) {
    let material;
    var texture;

    if (data.texture && data.texture !== "") {
        texture = new THREE.ImageUtils.loadTexture(data.texture);
    }
    let materialOptions = { color: "white", map: texture };
    material = new THREE.MeshLambertMaterial(materialOptions);
    material.receiveShadow = true;
    material.castShadow = true;
    
    let planet = createSphere(material, data.size, data.segments);
    planet.receiveShadow = true;
    planet.name = data.name;
    scene.add(planet);
    planet.position.set(x, y, z);

    return planet;
}

function createLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function movePlanet(planet, data, time, rotation) {
    if (orbitData.runRotation && !rotation) {
        planet.rotation.y += data.rotationRate;
    }
    if (orbitData.runOrbit) {
        planet.position.x = Math.cos(time * (1.0 / (data.orbitRate * orbitData.value)) + 10.0) * data.distanceFromAxis;
        planet.position.z = Math.sin(time * (1.0 / (data.orbitRate * orbitData.value)) + 10.0) * data.distanceFromAxis;
    }
}

function moveMoon(moon, planet, data, time) {
    movePlanet(moon, data, time);
    if (orbitData.runOrbit) {
        moon.position.x = moon.position.x + planet.position.x;
        moon.position.z = moon.position.z + planet.position.z;
    }
}

function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();
    let time = Date.now();

    sun.rotation.y += 0.0021;
    movePlanet(mercury, mercuryData, time);
    movePlanet(venus, venusData, time);

    movePlanet(earth, earthData, time);
    moveMoon(moon, earth, moonData, time);

    movePlanet(mars, marsData, time);
    moveMoon(marsMoon, mars, marsMoonData, time);
    moveMoon(marsMoon2, mars, marsMoon2Data, time);


    movePlanet(asteroid, asteroidData, time);
    movePlanet(asteroid2, asteroid2Data, time);
    movePlanet(asteroid3, asteroid3Data, time);
    movePlanet(asteroid4, asteroid4Data, time);
    movePlanet(asteroid5, asteroid5Data, time);
    movePlanet(asteroid6, asteroid6Data, time);
    movePlanet(asteroid7, asteroid7Data, time);
    movePlanet(asteroid8, asteroid8Data, time);
    movePlanet(asteroid9, asteroid9Data, time);

    movePlanet(jupiter, jupiterData, time);
    moveMoon(jupiterMoon, jupiter, jupiterMoonData, time);
    moveMoon(jupiterMoon2, jupiter, jupiterMoon2Data, time);
    moveMoon(jupiterMoon3, jupiter, jupiterMoon3Data, time);
    moveMoon(jupiterMoon4, jupiter, jupiterMoon4Data, time);
    moveMoon(jupiterMoon5, jupiter, jupiterMoon5Data, time);
    moveMoon(jupiterMoon6, jupiter, jupiterMoon6Data, time);
    moveMoon(jupiterMoon7, jupiter, jupiterMoon7Data, time);
    moveMoon(jupiterMoon8, jupiter, jupiterMoon8Data, time);
    moveMoon(jupiterMoon9, jupiter, jupiterMoon9Data, time);


    movePlanet(saturn, saturnData, time);
    movePlanet(uranus, uranusData, time);
    movePlanet(neptune, neptuneData, time);
    movePlanet(pluto, plutoData, time);

    movePlanet(saturnRing, saturnData, time, true);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function createScene() {
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    let starsBackground = new THREE.TextureLoader().load("textures/stars.jpg")
    starsBackground.format = THREE.RGBFormat;
    scene.background = starsBackground;

    pointLight = createLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    let sunTexture = new THREE.TextureLoader().load("textures/sol.jpg")
    let materialOptions = { color: "white", map: sunTexture };
    let sunMaterial = new THREE.MeshBasicMaterial(materialOptions);
    sun = createSphere(sunMaterial, 16, 48);
    scene.add(sun);

    let spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture("textures/glow.png"),
        useScreenCoordinates: false,
        color: 0xffffee,
        transparent: false,
        blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite);

    //PLANETS AND MOONS
    mercury = addPlanet(mercuryData, mercuryData.distanceFromAxis, 0);
    venus = addPlanet(venusData, venusData.distanceFromAxis, 0);

    earth = addPlanet(earthData, earthData.distanceFromAxis, 0);
    moon = addPlanet(moonData, moonData.distanceFromAxis, 0.8);

    mars = addPlanet(marsData, marsData.distanceFromAxis, 0);
    marsMoon = addPlanet(marsMoonData, marsMoonData.distanceFromAxis, 0.8);
    marsMoon2 = addPlanet(marsMoon2Data, marsMoon2Data.distanceFromAxis, 0.8);

    asteroid = addPlanet(asteroidData, asteroidData.distanceFromAxis, 0);
    asteroid2 = addPlanet(asteroid2Data, asteroid2Data.distanceFromAxis, 0);
    asteroid3 = addPlanet(asteroid3Data, asteroid3Data.distanceFromAxis, 0);
    asteroid4 = addPlanet(asteroid4Data, asteroid4Data.distanceFromAxis, 0);
    asteroid5 = addPlanet(asteroid5Data, asteroid5Data.distanceFromAxis, 0);
    asteroid6 = addPlanet(asteroid6Data, asteroid6Data.distanceFromAxis, 0);
    asteroid7 = addPlanet(asteroid7Data, asteroid7Data.distanceFromAxis, 0);
    asteroid8 = addPlanet(asteroid8Data, asteroid8Data.distanceFromAxis, 0);
    asteroid9 = addPlanet(asteroid9Data, asteroid9Data.distanceFromAxis, 0);

    jupiter = addPlanet(jupiterData, jupiterData.distanceFromAxis, 0);
    jupiterMoon = addPlanet(jupiterMoonData, jupiterMoonData.distanceFromAxis, 0.8);
    jupiterMoon2 = addPlanet(jupiterMoon2Data, jupiterMoon2Data.distanceFromAxis, 0.8);
    jupiterMoon3 = addPlanet(jupiterMoon3Data, jupiterMoon3Data.distanceFromAxis, 0.8);
    jupiterMoon4 = addPlanet(jupiterMoon4Data, jupiterMoon4Data.distanceFromAxis, 0.8);
    jupiterMoon5 = addPlanet(jupiterMoon5Data, jupiterMoon5Data.distanceFromAxis, 0.8);
    jupiterMoon6 = addPlanet(jupiterMoon6Data, jupiterMoon6Data.distanceFromAxis, 0.8);
    jupiterMoon7 = addPlanet(jupiterMoon7Data, jupiterMoon7Data.distanceFromAxis, 0.8);
    jupiterMoon8 = addPlanet(jupiterMoon8Data, jupiterMoon8Data.distanceFromAxis, 0.8);
    jupiterMoon9 = addPlanet(jupiterMoon9Data, jupiterMoon9Data.distanceFromAxis, 0.8);

    saturn = addPlanet(saturnData, saturnData.distanceFromAxis, 0);
    saturnRing = createSaturnRing(7, 4.5, 30, "saturnRing", saturnData.distanceFromAxis);
    saturnRing.position.y += 0.4;

    uranus = addPlanet(uranusData, uranusData.distanceFromAxis, 0);
    neptune = addPlanet(neptuneData, neptuneData.distanceFromAxis, 0);
    pluto = addPlanet(plutoData, plutoData.distanceFromAxis, 0);

    drawOrbits();
    update(renderer, scene, camera, controls);
}

createScene();
