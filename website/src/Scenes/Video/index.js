import * as THREE from 'three';
import store from '../../store/store';
import { VideoComponent } from './VideoComponent';
import { THREEx } from './threex.chromakey';
const Video = (elem) => {
  let
    scene,
    renderer,
    clock,
    videoComponent,
    myGreenScreenMaterial,
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 1000);
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  initScene();

  store.dispatch({ type: 'LOADING_COMPLETE' })
  function initScene() {
    const canvas = document.querySelector("#video1Canvas");
    const backgroundColor = 0xf1f1f1;
    //const backgroundColor = "red";
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 90);
    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 5;

    window.addEventListener('resize', onResize);
    render();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }

  function render() {
    let delta = clock.getDelta();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

}

export default Video;

