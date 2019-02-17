if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, controls, scene, renderer;
var lightMain;
var soundsPlaneGeometry, soundsPlaneMaterial, soundsPlane;
var soundsPlaneMaterialTemplate = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true
    });

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

var time = 0;
var mapUpdateTime = 0;
var heightMapDim = 100;
var heightMap = zeros([heightMapDim, heightMapDim]);

var sounds = [];
var numSoundsCreated = 0;
function createSound(x, y, amp) {
    numSoundsCreated++;
    var sound = {
        id: numSoundsCreated,
        x: x,
        y: y,
        amp: amp,
        time: 0,
        timeUpdate: 0.3,
        dampening: 0.90,
        updateAmp: function() {
            this.amp *= this.dampening;
            this.time += this.timeUpdate;
        },
        checkExist: function() {
            if (this.amp <= 0.0001) sounds.splice(sounds.indexOf(this), 1);
        },
    }
    sounds.push(sound)
    heightMap[x][y] = amp;
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    $('.body-container > .data-container > .row').append(renderer.domElement);
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );

    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Create test sound
    createSound(50, 50, 100);

    // Sound plane initialization
    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    soundsPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true
    });
    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        soundsPlaneGeometry.vertices[i].z = 0;
    }
    
    soundsPlane = new THREE.Mesh( soundsPlaneGeometry, soundsPlaneMaterial );
    scene.add(soundsPlane);
    soundsPlane.rotation.x = -Math.PI/2;

    lightMain = new THREE.DirectionalLight(0xffffff);
    lightMain.position.set(1, 1, 1);
    scene.add( lightMain );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function updateSounds() {
    sounds.forEach(function(e) {
        e.updateAmp();
        e.checkExist();
    });
}

function updateMesh(time) {
    scene.remove(soundsPlane);
    soundsPlane.geometry.dispose();
    soundsPlane.material.dispose();

    for (var i = 0; i < heightMapDim; i++) {
        for (var j = 0; j < heightMapDim; j++) {
            heightMap[i][j] = 0;
            sounds.forEach(function(sound) {
                heightMap[i][j] += sound.amp*Math.cos(sound.time)*Math.pow(Math.E, -Math.sqrt((sound.x - j)*(sound.x - j) + (sound.y - i)*(sound.y - i)));
            });
        }
    }

    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    soundsPlaneMaterial = soundsPlaneMaterialTemplate;

    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        var row = Math.floor(i/heightMapDim);
        var column = (i+1) - row*heightMapDim - 1;
        soundsPlaneGeometry.vertices[i].z = heightMap[row][column];
    }
    
    soundsPlane = new THREE.Mesh( soundsPlaneGeometry, soundsPlaneMaterial );
    scene.add(soundsPlane);
    soundsPlane.rotation.x = -Math.PI/2;
}

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
    updateSounds();
    if (mapUpdateTime <= Math.ceil(mapUpdateTime) + 0.05 && mapUpdateTime >= Math.ceil(mapUpdateTime) - 0.05) {
        updateMesh(time);
    }
    mapUpdateTime += 0.5;
    if (randomInt(100) > 90) createSound(randomInt(heightMapDim), randomInt(heightMapDim), randomInt(200));
}

function render() {
    renderer.render( scene, camera );
}
