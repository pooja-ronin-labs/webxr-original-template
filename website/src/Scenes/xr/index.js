import * as THREE from 'three';
import { sRGBEncoding } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { VideoComponent } from '../Video/VideoComponent';

const XrView = (elem) => {
  let
    clock = new THREE.Clock(),
    scene,
    renderer,
    camera,
    controller,
    reticle,
    hitTestSource,
    hitTestSourceRequested = false,
    videoComponent,
    vec = new THREE.Vector3(0, 0, 0),
    model,
    isModelDetected = false,
    animators = [];
  // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 1000);
  // scene = new THREE.Scene();
  initScene();
  animate();
  function initScene() {
    const canvas = document.querySelector("#xrCanvas");
    // const backgroundColor = 0xf1f1f1;
    // scene.background = new THREE.Color(backgroundColor);
    // scene.fog = new THREE.Fog(backgroundColor, 60, 90);
    // Init the renderer

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);

    // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    // light.position.set(0.5, 1, 0.25);
    const light_amb = new THREE.AmbientLight("#FFFFFF", 0.5);
    const light_dir = new THREE.DirectionalLight("#FFFFFF", 2.5);//2.5);
    // const light_point = new THREE.PointLight("#00FF00", 0)
    // scene.add(light);
    scene.add(light_amb);



    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = sRGBEncoding;
    // renderer.setClearColor(0xcccccc);

    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));
    model = new THREE.Object3D();
    model.visible = false;
    light_dir.position.set(0, 100, 0);
    model.add(light_dir);
    scene.add(model);

    load(require("./Base2.gltf"), false, true);
    load(require("./Carousel.gltf"), true, false);
    load(require("./Cart.gltf"), true, false);
    load(require("./FerrisWheel2.gltf"), true, false);


    function onSelect() {
      if (reticle.visible) {
        model.visible = true;
        model.position.setFromMatrixPosition(reticle.matrix);
        reticle.visible = false;
        isModelDetected = true;
      }
    }

    function load(path, isWithAnimation, isPointLightRequired) {
      let loader = new GLTFLoader();
      let _isWithAnimation = isWithAnimation;
      let _isPointLightRequired = isPointLightRequired;

      loader.load(path, (gltf) => {
        let obj = gltf.scene;
        model.add(obj);
        console.log("model loaded:" + _isWithAnimation);
        obj.scale.set(0.00005, 0.00005, 0.00005);

        if (_isWithAnimation === true) {
          console.log("before animation");
          let mixer = new THREE.AnimationMixer(obj);

          let clip = THREE.AnimationClip.findByName(gltf.animations, "animation_0");

          let action = mixer.clipAction(clip);


          action.play();
          console.log("after animation :" + animators);
          animators.push(mixer);
        }

        // if (_isPointLightRequired === true) {
        //   obj.findByName("hauntedHouse").findByName("Mesh_0").add(light_point);
        //   light_point.position.set(0, 1, 0);
        // }
      }, null, () => { console.log("Cannot Load Model"); })
    }

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
      new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    //

    window.addEventListener('resize', onWindowResize, false);
  }



  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //

  function animate() {
    renderer.setAnimationLoop(render);
  }

  function render(timestamp, frame) {
    if (frame) {

      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();

      if (hitTestSourceRequested === false) {
        session.requestReferenceSpace('viewer').then(function (referenceSpace) {
          session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
            hitTestSource = source;
          });
        });

        session.addEventListener('end', function () {
          hitTestSourceRequested = false;
          hitTestSource = null;
        });

        hitTestSourceRequested = true;
      }

      if (hitTestSource) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (!isModelDetected && hitTestResults.length) {
          const hit = hitTestResults[0];
          reticle.visible = true;
          reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
        } else {
          reticle.visible = false;
        }
      }
    }

    let delta = clock.getDelta();
    if (model.visible) {
      for (let i = 0; i < animators.length; i++) {
        animators[i].update(delta);
      }
    }
    renderer.render(scene, camera);
  }
}
export default XrView;

