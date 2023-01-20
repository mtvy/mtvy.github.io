
async function typeWriter(name, char_ind, txt, delay) {
    if (char_ind < txt.length){
        document.getElementById(name).innerHTML += txt.charAt(char_ind);
        char_ind++;
        setTimeout(typeWriter, delay, name, char_ind, txt, delay);
    }
}

async function makeObjects() {
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
    
    camera.position.y = 23;
    camera.position.z = 26;
    
    var controls = new THREE.OrbitControls(camera);
    
    var particleCount = numberOfParticles;
    
    //var spherePoints,
    //    cubePoints;
    
    var particles = new THREE.Geometry(),
    sphereParticles = new THREE.Geometry(),
    cubeParticles = new THREE.Geometry();
    
    controls.update();
    var pMaterial = new THREE.PointCloudMaterial({
        color: particleColor,
        size: particleSize,
        map: THREE.ImageUtils.loadTexture(particleImage),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    //var sphere = new THREE.SphereGeometry(5, 40, 40);
    //spherePoints = THREE.GeometryUtils.randomPointsInGeometry(sphere, particleColor);
    
    //var box = new THREE.BoxGeometry(12, 12, 12);
    //cubePoints = THREE.GeometryUtils.randomPointsInGeometry(box, particleColor);
    
    for (var p = 0; p < particleCount; p++){
        var vertex = new THREE.Vector3();
        vertex.x = 0;
        vertex.y = 0;
        vertex.z = 0;
        
        particles.vertices.push(vertex);
    }
        
    
    createVertices(sphereParticles, sphere, null, null);
    createVertices(cubeParticles, cube, null, 1);
    
    function createVertices(emptyArray, points, yOffset = 0, trigger = null){
        //let buff = [];
        for (var p = 0; p < particleCount; p++){
            var vertex = new THREE.Vector3();
            vertex.x = points[p]['x'];
            vertex.y = points[p]['y'] - yOffset;
            vertex.z = points[p]['z'];
            //buff.push({'x': vertex.x, 'y': vertex.y, 'z': vertex.z});
            emptyArray.vertices.push(vertex);
        }
        //
        
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
    toSphere();

    function toSphere(){
        handleTriggers(0);
        morphTo(sphereParticles);
    }

    function toCube(){
        handleTriggers(1);
        morphTo(cubeParticles);
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

    function handleTriggers(disable){
        for (var x = 0; x < triggers.length; x++){
            if (disable === x){
                triggers[x].setAttribute('data-disabled', true);
            } else {
                triggers[x].setAttribute('data-disabled', false);
            }
        }
    }
}


makeObjects().then(
    setTimeout(function() {
        typeWriter("logo", 0, "MTVY.", 69).then(document.getElementById("links").style.opacity = 1
    )}, 500)
);

