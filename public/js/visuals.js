// if ( WEBGL.isWebGLAvailable() === false ) {
//     document.body.appendChild( WEBGL.getWebGLErrorMessage() );
// }

var camera, controls, scene, renderer;
// var soundsPlane, soundsPlaneGeometry, lightMain;
var lightMain;
var soundsPlaneGeometry, soundsPlaneMaterial, soundsPlane;

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

var time, mapUpdateTime = 0;
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
        dampening: 0.95,
        updateAmp: function() {
            this.amp *= this.dampening;
        },
        checkExist: function() {
            if (this.amp <= 0.0001) sounds.splice(sounds.indexOf(this), 1);
        },
    }
    sounds.push(sound)
}

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();
function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xcccccc );
    // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    $('.body-container > .data-container > .row').append(renderer.domElement);
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );
    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Create test sound
    createSound(0, 0, 100);

    // Plane
    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    soundsPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true
    });
    // var geometry = new THREE.PlaneGeometry( 10000, 10000, 0 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        // console.log('e')
        soundsPlaneGeometry.vertices[i].z = randomInt(100);
        // soundsPlaneGeometry.__dirtyVertices = true;
    }
    
    soundsPlane = new THREE.Mesh( soundsPlaneGeometry, soundsPlaneMaterial );
    // soundsPlane.matrixAutoUpdate = false;
    scene.add(soundsPlane);
    soundsPlane.rotation.x = Math.PI/2;

    // world
    // var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
    // var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
    // for ( var i = 0; i < 500; i ++ ) {
    //     var mesh = new THREE.Mesh( geometry, material );
    //     mesh.position.x = Math.random() * 1600 - 800;
    //     mesh.position.y = 0;
    //     mesh.position.z = Math.random() * 1600 - 800;
    //     mesh.updateMatrix();
    //     mesh.matrixAutoUpdate = false;
    //     scene.add( mesh );
    // }
    // lights
    // var light = new THREE.DirectionalLight( 0xffffff );
    lightMain = new THREE.DirectionalLight( 0xffffff );
    lightMain.position.set( 1, 1, 1 );
    scene.add( lightMain );
    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    // scene.add( light );
    var light = new THREE.AmbientLight( 0x222222 );
    // scene.add( light );
    //
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

function updateMesh() {
    // console.log('e');
    scene.remove(soundsPlane);
    soundsPlane.geometry.dispose();
    soundsPlane.material.dispose();
    // // console.log('f')
    // for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
    //     // console.log('e')
    //     soundsPlaneGeometry.vertices[i].z = randomInt(100);
    //     // soundsPlaneGeometry.__dirtyVertices = true;
    // }
    // soundsPlane.updateMatrix();
    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    soundsPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true
    });
    // var geometry = new THREE.PlaneGeometry( 10000, 10000, 0 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        // console.log('e')
        soundsPlaneGeometry.vertices[i].z = randomInt(100);
        // soundsPlaneGeometry.__dirtyVertices = true;
    }
    
    soundsPlane = new THREE.Mesh( soundsPlaneGeometry, soundsPlaneMaterial );
    // soundsPlane.matrixAutoUpdate = false;
    scene.add(soundsPlane);
    soundsPlane.rotation.x = Math.PI/2;
}

function animate() {
    lightMain.position.x = Math.cos(time);
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
    updateSounds();
    // console.log(mapUpdateTime, Math.ceil(mapUpdateTime) + 0.05, Math.ceil(mapUpdateTime) - 0.05, mapUpdateTime <= Math.ceil(mapUpdateTime) + 0.05, mapUpdateTime >= Math.ceil(mapUpdateTime) - 0.05)
    if (mapUpdateTime <= Math.ceil(mapUpdateTime) + 0.05 && mapUpdateTime >= Math.ceil(mapUpdateTime) - 0.05) {
        updateMesh();
        mapUpdateTime += 0.05;
    }
    time += 0.005;
    mapUpdateTime += 0.005;
    // console.log(mapUpdateTime);
    // console.log(time);
}

function render() {
    renderer.render( scene, camera );
}










// var camera, scene, renderer;
// var geometry, material, mesh;

// init();
// animate();

// function init() {
//     camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
//     camera.position.z = 1;
//     // camera.position.x = 0.5;
//     // camera.position.y = 0;

//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     $('.body-container > .data-container > .row').append(renderer.domElement);

//     scene = new THREE.Scene();

//     // var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
//     // camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

//     var controls = new THREE.OrbitControls( camera );

//     //controls.update() must be called after any manual changes to the camera's transform
//     // camera.position.set( 0, 20, 100 );
//     // controls.update();

//     geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
//     material = new THREE.MeshNormalMaterial();

//     mesh = new THREE.Mesh( geometry, material );
//     scene.add(mesh);

//     var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
//     var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
//     var plane = new THREE.Mesh( geometry, material );
//     scene.add(plane);

//     // mesh.rotation.x = Math.PI/4;
//     // mesh.rotation.y = Math.PI/4;
// }

// function animate() {
//     requestAnimationFrame( animate );


//     // camera.position.x = radius * Math.cos( angle );
//     // camera.position.z = radius * Math.sin( angle );
//     // camera.position.y = radius * Math.sin( angle );
//     // angle += 0.01;

//     // mesh.rotation.x += 0.01;
//     // mesh.rotation.y += 0.01;

//     // required if controls.enableDamping or controls.autoRotate are set to true
//     controls.update();

//     renderer.render( scene, camera );
// }




// // Set body min-width
// var bodyHalfWidth = $(window).outerWidth(true)/2;
// document.body.style.minWidth = Math.max(1074,bodyHalfWidth);

// var PIXEL_RATIO = (function () {
//     var ctx = document.createElement("canvas").getContext("2d"),
//         dpr = window.devicePixelRatio || 1,
//         bsr = ctx.webkitBackingStorePixelRatio ||
//               ctx.mozBackingStorePixelRatio ||
//               ctx.msBackingStorePixelRatio ||
//               ctx.oBackingStorePixelRatio ||
//               ctx.backingStorePixelRatio || 1;

//     return dpr / bsr;
// })();

// createHiDPICanvas = function(w, h, ratio) {
//     if (!ratio) { ratio = PIXEL_RATIO; }
//     var can = document.getElementById("initialCanvas");
//     can.width = w * ratio;
//     can.height = h * ratio;
//     can.style.width = w + "px";
//     can.style.height = h + "px";
//     can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
//     return can;
// }

// var RESOLUTIONVAR = 2;

// var $navbarHeight = $('.body-container > nav').outerHeight();
// var correctWindowHeight = window.innerHeight

// window.addEventListener('resize', resizeCanvas, false);

// var c;

// var ctx;

// var resizeCanvasCalled = false;

// resizeCanvas();

// var canvasHeight = correctWindowHeight - ($navbarHeight);

// function resizeCanvas() {
//     c = createHiDPICanvas(window.outerWidth, correctWindowHeight - ($navbarHeight), RESOLUTIONVAR);

//     ctx = c.getContext("2d");
    
//     resizeCanvasCalled = true;
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

// let circles = []

// function makeCircle(x, y) {
//     var circle = {
//         x: x,
//         y: y,
//         r: 100
//     }

//     circles.push(circle)
// }

// document.onclick = click
// function click(e) {
//     makeCircle(e.clientX, e.clientY)
// }

// function render() {
//     requestAnimationFrame(render)

//     ctx.clearRect(0, 0, c.width, c.height)

//     ctx.fillStyle = 'afafaf'
//     ctx.fillRect(0, 0, c.width, c.height)

//     circles.forEach(function(circle) {
//         ctx.beginPath();
//         ctx.fillStyle = 'green';
//         ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
//         ctx.fill();
//     })

//     // Object
//     // ctx.beginPath();
//     // ctx.fillStyle = 'green';
//     // ctx.arc(object.x, object.y, object.r, 0, 2 * Math.PI, false);
//     // ctx.fill();
// }

// requestAnimationFrame(render);
