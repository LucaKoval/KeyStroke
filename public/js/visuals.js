if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

var camera, controls, scene, renderer;
var lightMain;
var soundsPlaneGeometry, soundsPlaneMaterial, soundsPlane;
var soundsPlaneMaterialTemplate = new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: true
    });

var time = 0;
var mapUpdateTime = 0;
var heightMapDim = 100;
var heightMap = zeros([heightMapDim, heightMapDim]);

var soundsPlaneColors = zeros([heightMapDim, heightMapDim]);


function randomInt(max) {
    return Math.floor(Math.random() * max);
}

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
    // createSound(50, 50, 100);

    // Sound plane initialization
    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        // var row = Math.floor(i/heightMapDim);
        // var column = (i+1) - row*heightMapDim - 1;
        // var color = new THREE.Color("hsl(0, 100%, 50%)");
        var color = new THREE.Color("rgb(255, 0, 0)");
        soundsPlaneColors[i] = color;
        // soundsPlaneGeometry.colors.push(new THREE.Color(0xFF0000));
        // soundsPlaneGeometry.vertexColors.push(new THREE.Color(0xFF0000));
        // soundsPlaneGeometry.vertexColors.push(new THREE.Color(0xFF0000)); 
    }
    soundsPlaneGeometry.colors = soundsPlaneColors;
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
    scene.add(lightMain);
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

// var keyPressed = 0;

const TOTAL_KEYS = 12;
const KEY_DIVISIONS = TOTAL_KEYS + 1;

function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            // console.log('data: ' + data)
            // $('#value').html("Key pressed: " + data)
            // keyPressed = data;
            if (!(!data || data == '' || data == ' ')) {
                // createSound(Math.floor(heightMapDim/2), heightMapDim, 100);
                var keys = data.split(' ');
                console.log(keys);
                keys.forEach(function(key) {
                    if (parseInt(key)) createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * parseInt(key)/KEY_DIVISIONS), 100);
                });
            }
            //  else {
            //     createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * parseInt(data)/KEY_DIVISIONS), 100);
            // }
        },
        error: function (err) {
          console.log('Error: ' + err);
        }
    });
}

setInterval(function() {
    requestData()
}, 500)


function updateMesh(time) {
    scene.remove(soundsPlane);
    soundsPlane.geometry.dispose();
    soundsPlane.material.dispose();

    for (var i = 0; i < heightMapDim; i++) {
        for (var j = 0; j < heightMapDim; j++) {
            heightMap[i][j] = 0;
            sounds.forEach(function(sound) {
                heightMap[i][j] += sound.amp*Math.cos(sound.time)*Math.pow(Math.E, -1*Math.sqrt((sound.x - j)*(sound.x - j) + (sound.y - i)*(sound.y - i)));
            });
        }
    }

    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    // soundsPlaneMaterial = soundsPlaneMaterialTemplate;

    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        var row = Math.floor(i/heightMapDim);
        var column = (i+1) - row*heightMapDim - 1;
        soundsPlaneGeometry.vertices[i].z = heightMap[row][column];
    }

    // console.log(soundsPlaneGeometry.faces.length, soundsPlaneGeometry.vertices.length);

    for (var i = 0; i < soundsPlaneGeometry.faces.length; i++) {
        var face = soundsPlaneGeometry.faces[i];
        // face.color.setHex( Math.random() * 0xffffff );
        // console.log(face.a);
        face.vertexColors[0] = new THREE.Color( Math.abs(soundsPlaneGeometry.vertices[face.a].z)/10 * 0xffffff);
        face.vertexColors[1] = new THREE.Color( Math.abs(soundsPlaneGeometry.vertices[face.b].z)/10 * 0xffffff);
        face.vertexColors[2] = new THREE.Color( Math.abs(soundsPlaneGeometry.vertices[face.c].z)/10 * 0xffffff);
    }

    // var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

    // console.log(soundsPlaneMaterial.vertexColors);

    // soundsPlaneMaterial = soundsPlaneMaterialTemplate;
    soundsPlaneMaterial = soundsPlaneMaterialTemplate;

    // soundsPlaneMaterial.vertexColors = soundsPlaneColors;

    // soundsPlaneGeometry.colors = soundsPlaneColors;
    // soundsPlaneGeometry.vertexColors = soundsPlaneColors;
    // console.log(soundsPlaneGeometry.vertexColors);
    
    soundsPlane = new THREE.Mesh(soundsPlaneGeometry, soundsPlaneMaterial);
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
    // if (randomInt(100) > 90) createSound(randomInt(heightMapDim), randomInt(heightMapDim), randomInt(200));


}

function render() {
    renderer.render( scene, camera );
}
