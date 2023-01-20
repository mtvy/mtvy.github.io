const numberOfParticles = 6000;

const particleImage = 'https://motionarray.imgix.net/preview-34649aJ93evd9dG_0008.jpg?w=660&q=60&fit=max&auto=format',
      particleColor = '0xFFFFFF',
      particleSize  = 0.2;

const defaultAnimationSpeed = 1,
      morphAnimationSpeed   = 3;

const triggers = document.getElementsByClassName('triggers')[0].querySelectorAll('span');

var stats = new Stats();
stats.showPanel(0);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function fullScreen(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', fullScreen, false);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

camera.position.y = 25;
camera.position.z = 36;

var controls = new THREE.OrbitControls(camera);
controls.update();

var particleCount = numberOfParticles;

var spherePoints,
    cubePoints,
    rocketPoints,
    spacemanPoints;

var particles = new THREE.Geometry(),
    sphereParticles = new THREE.Geometry(),
    cubeParticles = new THREE.Geometry(),
    rocketParticles = new THREE.Geometry(),
    spacemanParticles = new THREE.Geometry();

var pMaterial = new THREE.PointCloudMaterial({
    color: particleColor,
    size: particleSize,
    map: THREE.ImageUtils.loadTexture(particleImage),
    blending: THREE.AdditiveBlending,
    transparent: true
});

var geometry = new THREE.SphereGeometry(5, 30, 30);

spherePoints = THREE.GeometryUtils.randomPointsInGeometry(geometry, particleColor);

var geometry = new THREE.BoxGeometry(9, 9, 9);

cubePoints = THREE.GeometryUtils.randomPointsInGeometry(geometry, particleColor);

const codepenAssetUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605067/';

var objLoader = new THREE.OBJLoader();
objLoader.setPath(codepenAssetUrl);
objLoader.load('CartoonRocket.obj', function(object){
    object.traverse(function(child){
        if (child instanceof THREE.Mesh){
            let scale = 2.1;
            let area = new THREE.Box3();
            area.setFromObject(child);
            let yOffset = (area.max.y * scale) / 2;

            child.geometry.scale(scale, scale, scale);
            rocketPoints = THREE.GeometryUtils.randomPointsInBufferGeometry(child.geometry, particleCount);
            createVertices(rocketParticles, rocketPoints, yOffset, 2);
        } 
    });
});

var objLoader = new THREE.OBJLoader();
objLoader.setPath(codepenAssetUrl);
objLoader.load('Astronaut.obj', function(object){
    object.traverse(function(child){
        if (child instanceof THREE.Mesh){
            let scale = 4.6;
            let area = new THREE.Box3();
            area.setFromObject(child);
            let yOffset = (area.max.y * scale) / 2;

            child.geometry.scale(scale, scale, scale);
            spacemanPoints = THREE.GeometryUtils.randomPointsInBufferGeometry(child.geometry, particleCount);
            createVertices(spacemanParticles, spacemanPoints, yOffset, 3);
        } 
    });
});

for (var p = 0; p < particleCount; p++){
    var vertex = new THREE.Vector3();
    vertex.x = 0;
    vertex.y = 0;
    vertex.z = 0;

    particles.vertices.push(vertex);
}

createVertices(sphereParticles, spherePoints, null, null);
createVertices(cubeParticles, cubePoints, null, 1);

function createVertices(emptyArray, points, yOffset = 0, trigger = null){
    for (var p = 0; p < particleCount; p++){
        var vertex = new THREE.Vector3();
        vertex.x = points[p]['x'];
        vertex.y = points[p]['y'] - yOffset;
        vertex.z = points[p]['z'];

        emptyArray.vertices.push(vertex);
    }

    if (trigger !== null){
        triggers[trigger].setAttribute('data-disabled', false);
    }
    
}

var particleSystem = new THREE.PointCloud(
    particles,
    pMaterial
);

particleSystem.sortParticles = true;

scene.add(particleSystem);

const normalSpeed = (defaultAnimationSpeed/100),
      fullSpeed = (morphAnimationSpeed/100);

let animationVars = {
    speed: normalSpeed
}

function animate(){
    stats.begin();
    particleSystem.rotation.y += animationVars.speed;
    particles.verticesNeedUpdate = true;
    stats.end();

    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
setTimeout(toCube, 500);

function toSphere(){
    handleTriggers(0);
    morphTo(sphereParticles);
}

function toCube(){
    handleTriggers(1);
    morphTo(cubeParticles);
}

function toRocket(){
    handleTriggers(2);
    morphTo(rocketParticles);
}

function toSpaceman(){
    handleTriggers(3);
    morphTo(spacemanParticles);
}

function morphTo(newParticles, color = '0xffffff'){
    TweenMax.to(animationVars, 0.3, {
        ease: Power4.easeIn,
        speed: fullSpeed,
        onComplete: slowDown
    });
    particleSystem.material.color.setHex(color);

    for (var i = 0; i < particles.vertices.length; i++){
        TweenMax.to(particles.vertices[i], 4, {
            ease: Elastic.easeOut.config(1, 0.75),
            x: newParticles.vertices[i].x,
            y: newParticles.vertices[i].y,
            z: newParticles.vertices[i].z
        });
    }
}

function slowDown(){
    TweenMax.to(animationVars, 4, {
        ease: Power2.easeOut,
        speed: normalSpeed,
        delay: 1
    });
}

triggers[0].addEventListener('click', toSphere);
triggers[1].addEventListener('click', toCube);
triggers[2].addEventListener('click', toRocket);
triggers[3].addEventListener('click', toSpaceman);

function handleTriggers(disable){
    for (var x = 0; x < triggers.length; x++){
        if (disable === x){
            triggers[x].setAttribute('data-disabled', true);
        } else {
            triggers[x].setAttribute('data-disabled', false);
        }
    }
}