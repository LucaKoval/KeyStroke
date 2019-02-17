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
var soundsPlaneGeometry, soundsPlaneMaterial, soundsPlane;
var soundsPlaneMaterialTemplate = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: true
    });

var time = 0;
var mapUpdateTime = 0;
var heightMapDim = 150;
var heightMap = zeros([heightMapDim, heightMapDim]);
var heightMax = 100;
var minHeight = 0.001;

var soundsPlaneColors = zeros([heightMapDim, heightMapDim]);


function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function twoDMax(arr) {
    var maxRow = arr.map(function(row){ return Math.max.apply(Math, row); });
    return Math.max.apply(null, maxRow);
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
            this.x -= this.timeUpdate;
        },
        checkExist: function() {
            if (this.amp <= minHeight) sounds.splice(sounds.indexOf(this), 1);
        },
    }
    sounds.push(sound)
    heightMap[x][y] = amp;
}

var effectController, materialDepth;

var postprocessing = { enabled: true };
var shaderSettings = {
    rings: 3,
    samples: 4
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff793f);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.y = 300;
    camera.position.x = 300;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    $('.data-container > .row').append(renderer.domElement);

    var depthShader = THREE.BokehDepthShader;

    materialDepth = new THREE.ShaderMaterial( {
        uniforms: depthShader.uniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader
    });

    materialDepth.uniforms['mNear'].value = camera.near;
    materialDepth.uniforms['mFar'].value = camera.far;

    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 5000;
    controls.maxPolarAngle = Math.PI / 2;

    // Sound plane initialization
    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);
    soundsPlaneMaterial = soundsPlaneMaterialTemplate;
    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        soundsPlaneGeometry.vertices[i].z = 0;
    }
    soundsPlane = new THREE.Mesh(soundsPlaneGeometry, soundsPlaneMaterial);
    scene.add(soundsPlane);
    soundsPlane.rotation.x = -Math.PI/2;

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLight.position.set( 2, 1.2, 10 ).normalize();
    scene.add( directionalLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( - 2, 1.2, - 10 ).normalize();
    scene.add( directionalLight );

    initPostprocessing();

    effectController = {
        enabled: true,
        jsDepthCalculation: true,
        shaderFocus: false,
        fstop: 2.2,
        maxblur: 0.5,
        showFocus: false,
        focalDepth: 3000,
        manualdof: false,
        vignetting: true,
        depthblur: false,
        threshold: 0.5,
        gain: 2.0,
        bias: 0.5,
        fringe: 0.7,
        focalLength: 15,
        noise: true,
        pentagon: false,
        dithering: 0.0001
    };
    var matChanger = function () {
        for ( var e in effectController ) {
            if ( e in postprocessing.bokeh_uniforms ) {
                postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];
            }
        }
        postprocessing.enabled = effectController.enabled;
        postprocessing.bokeh_uniforms[ 'znear' ].value = camera.near;
        postprocessing.bokeh_uniforms[ 'zfar' ].value = camera.far;
        camera.setFocalLength( effectController.focalLength );
    };

    matChanger();

    window.addEventListener('resize', onWindowResize, false);
}

function initPostprocessing() {
    postprocessing.scene = new THREE.Scene();
    postprocessing.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10000, 10000 );
    postprocessing.camera.position.z = 100;
    postprocessing.scene.add( postprocessing.camera );
    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
    postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    var bokeh_shader = THREE.BokehShader;
    postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );
    postprocessing.bokeh_uniforms[ 'tColor' ].value = postprocessing.rtTextureColor.texture;
    postprocessing.bokeh_uniforms[ 'tDepth' ].value = postprocessing.rtTextureDepth.texture;
    postprocessing.bokeh_uniforms[ 'textureWidth' ].value = window.innerWidth;
    postprocessing.bokeh_uniforms[ 'textureHeight' ].value = window.innerHeight;
    postprocessing.materialBokeh = new THREE.ShaderMaterial( {
        uniforms: postprocessing.bokeh_uniforms,
        vertexShader: bokeh_shader.vertexShader,
        fragmentShader: bokeh_shader.fragmentShader,
        defines: {
            RINGS: shaderSettings.rings,
            SAMPLES: shaderSettings.samples
        }
    } );
    postprocessing.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight ), postprocessing.materialBokeh );
    postprocessing.quad.position.z = - 500;
    postprocessing.scene.add( postprocessing.quad );
}

function shaderUpdate() {
    postprocessing.materialBokeh.defines.RINGS = shaderSettings.rings;
    postprocessing.materialBokeh.defines.SAMPLES = shaderSettings.samples;
    postprocessing.materialBokeh.needsUpdate = true;
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

const TOTAL_KEYS = 12;
const KEY_DIVISIONS = TOTAL_KEYS + 1;

function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            if (!(!data.keyPressed || data.keyPressed == '' || data.keyPressed == ' ')) {
                var keys = data.keyPressed.trim().split(' ');
                keys.forEach(function(key) {
                    if (parseInt(key)) {
                        switch (parseInt(key)) {
                            case 1:
                                // note = 'E♭'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 11/KEY_DIVISIONS), 100);
                                break;
                            case 2:
                                // note = 'C#'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 9/KEY_DIVISIONS), 100);
                                break;
                            case 3:
                                // note = 'B♭'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 6/KEY_DIVISIONS), 100);
                                break;
                            case 4:
                                // note = 'G#'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 4/KEY_DIVISIONS), 100);
                                break;
                            case 5:
                                // note = 'F#'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 2/KEY_DIVISIONS), 100);
                                break;
                            case 6:
                                // note = 'F'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 1/KEY_DIVISIONS), 100);
                                break;
                            case 7:
                                // note = 'G'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 3/KEY_DIVISIONS), 100);
                                break;
                            case 8:
                                // note = 'A'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 5/KEY_DIVISIONS), 100);
                                break;
                            case 9:
                                // note = 'B'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 7/KEY_DIVISIONS), 100);
                                break;
                            case 10:
                                // note = 'C'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 8/KEY_DIVISIONS), 100);
                                break;
                            case 11:
                                // note = 'D'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 10/KEY_DIVISIONS), 100);
                                break;
                            case 12:
                                // note = 'E'
                                createSound(Math.floor(heightMapDim/2), heightMapDim - Math.floor(heightMapDim * 12/KEY_DIVISIONS), 100);
                                break;
                        }
                    }
                });
            }
        },
        error: function (err) {
          console.log('Error: ' + err);
        }
    });
}

setInterval(function() {
    requestData()
}, 100)


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
            heightMap[i][j] = Math.abs(heightMap[i][j]) >= minHeight ? heightMap[i][j] : 0;
        }
    }

    soundsPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, heightMapDim - 1, heightMapDim - 1);

    for (var i = 0; i < soundsPlaneGeometry.vertices.length; i++) {
        var row = Math.floor(i/heightMapDim);
        var column = (i+1) - row*heightMapDim - 1;
        soundsPlaneGeometry.vertices[i].z = heightMap[row][column];
    }

    for (var i = 0; i < soundsPlaneGeometry.faces.length; i++) {
        var face = soundsPlaneGeometry.faces[i];
        face.vertexColors[0] = Math.abs(soundsPlaneGeometry.vertices[face.a].z) >= minHeight ? new THREE.Color("hsl(29, 100%, " + Math.abs(soundsPlaneGeometry.vertices[face.a].z)*100/heightMax + "%)") : new THREE.Color(0xffffff)
        // face.vertexColors[0] = Math.abs(soundsPlaneGeometry.vertices[face.a].z) >= minHeight ? new THREE.Color("hsl(50, 100, 50)") : new THREE.Color(0xffffff)
        // face.vertexColors[1] = Math.abs(soundsPlaneGeometry.vertices[face.b].z) >= minHeight ? new THREE.Color("hsl(50, 100, 50)") : new THREE.Color(0xffffff)
        // face.vertexColors[2] = Math.abs(soundsPlaneGeometry.vertices[face.c].z) >= minHeight ? new THREE.Color("hsl(50, 100, 50)") : new THREE.Color(0xffffff)
        face.vertexColors[1] = Math.abs(soundsPlaneGeometry.vertices[face.b].z) >= minHeight ? new THREE.Color("hsl(29, 100%, " + Math.abs(soundsPlaneGeometry.vertices[face.b].z)*100/heightMax + "%)") : new THREE.Color(0xffffff)
        face.vertexColors[2] = Math.abs(soundsPlaneGeometry.vertices[face.c].z) >= minHeight ? new THREE.Color("hsl(29, 100%, " + Math.abs(soundsPlaneGeometry.vertices[face.c].z)*100/heightMax + "%)") : new THREE.Color(0xffffff)
        // face.vertexColors[0] = new THREE.Color("hsl(29, 100%, 50%)")
        // face.vertexColors[1] = new THREE.Color("hsl(50, 100%, 50%)")
        // face.vertexColors[2] = new THREE.Color("hsl(50, 100%, 50%)")
    }

    soundsPlaneMaterial = soundsPlaneMaterialTemplate;
    
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
}

function linearize( depth ) {
    var zfar = camera.far;
    var znear = camera.near;
    return - zfar * znear / ( depth * ( zfar - znear ) - zfar );
}

function smoothstep( near, far, depth ) {
    var x = saturate( ( depth - near ) / ( far - near ) );
    return x * x * ( 3 - 2 * x );
}

function render() {
    // renderer.render( scene, camera );
    if ( postprocessing.enabled ) {
        renderer.clear();
        // render scene into texture
        renderer.render( scene, camera, postprocessing.rtTextureColor, true );
        // render depth into texture
        scene.overrideMaterial = materialDepth;
        renderer.render( scene, camera, postprocessing.rtTextureDepth, true );
        scene.overrideMaterial = null;
        // render bokeh composite
        renderer.render( postprocessing.scene, postprocessing.camera );
    } else {
        scene.overrideMaterial = null;
        renderer.clear();
        renderer.render( scene, camera );
    }
}
