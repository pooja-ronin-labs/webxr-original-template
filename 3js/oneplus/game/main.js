'use strict';

		import * as THREE from '../../build/three.module.js';
		import { Euler} from "../../build/three.module.js";
		import Stats from '.././jsm/libs/stats.module.js';
		import { GLTFLoader } from '.././jsm/loaders/GLTFLoader.js';
		import { DRACOLoader } from '.././jsm/loaders/DRACOLoader.js';
		import PointerLockControls from './TouchPointerLockControls.js';
		import { JoyStick } from './joystick.js';
		import { Player } from './Player.js';
		import { OhterPlayersController } from './OhterPlayersController.js';

		var scene, camera, dirLight, stats;
        var renderer, mixer, controls;
        var keyboard,btn1,joystick,joystick2,input;
        var otherPlayers, loadBalancingClient;
		var path, format,envMap,dracoLoader,loader;
		var video,videoImage,videoImageContext,videoTexture,movieMaterial,movieGeometry,movieScreen,movieScreen2,ytPlayer;
		var canJump = false;
		var velocity = new THREE.Vector3();
		var clock = new THREE.Clock();
		var container = document.getElementById('container');
		var euler = new Euler( 0, 0, 0, 'YXZ' );
		var player = new Player("");

		stats = new Stats();
		container.appendChild(stats.dom);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild(renderer.domElement);

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xbfe3dd);

		camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(-165, -212, -292);
		euler.y = (180-22) * (Math.PI/180);
		camera.quaternion.setFromEuler( euler );

		otherPlayers = new OhterPlayersController('models/gltf/WalkAnimMale.gltf',scene);

		
		
		controls = new PointerLockControls( camera, renderer.domElement );
		btn1 = document.querySelector("#hopin");
		input=document.querySelector('#name-input');

		btn1.addEventListener("click",()=>{
			btn1.style.display="none";
			input.style.display="none";
			controls.lock();
			video.play();

			if(loadBalancingClient === undefined)
			{
				player.setPlayerName(input.value);
				loadBalancingClient = new Demo(document.getElementById("container"));
				loadBalancingClient.start(player,otherPlayers);
				addEventListener('keydown',(e)=>{
					keyboard[e.key] = true;
					// otherPlayers.playAnimation();
				})
				addEventListener('keyup',(e)=>{
					keyboard[e.key] = false;
					// otherPlayers.stopAnimation();
				})
				// video.play();
			}	
		});

		keyboard =[];
		// addEventListener('keydown',(e)=>{
		// 	keyboard[e.key] = true;
			
		// })
		// addEventListener('keyup',(e)=>{
		// 	keyboard[e.key] = false;
			
		// })

		function processKeyboard(){
			let speed=0.2;
			if (keyboard['w']){
				controls.moveForward(speed);
				otherPlayers.playAnimation();
                broadcastPlayerMovement();
			}
			if (keyboard['s']){
                controls.moveForward(-speed);
                broadcastPlayerMovement();
			}
			if (keyboard['a']){
                controls.moveRight(-speed);
                broadcastPlayerMovement();
			}
			if (keyboard['d']){
                controls.moveRight(speed);
                broadcastPlayerMovement();
			}
			if(keyboard[' ']){
				if(!controls.jump)
					controls.jumpPlayer();
			}
		}

        const broadcastPlayerMovement = ()=>{
            loadBalancingClient.raiseEventAll(DemoConstants.PlayerMoved,{ pos:camera.position,rot: euler.setFromQuaternion( camera.quaternion ).y});
        }

		//joystick movement code
		const onMove=(forward,right)=>{
			let speed=0.005;
			forward *= -speed;
			right *= speed;
			controls.moveRight(right);
			controls.moveForward(forward);
			broadcastPlayerMovement();
		}
		joystick = new JoyStick({onMovefn:onMove,type:0})


		const onMove2=(forward,right)=>{
			let speed=0.0002;
			forward *= -speed;
			right *= -speed;
			controls.lookRight(right);
			controls.lookForward(forward);
			broadcastPlayerMovement();
		}
		joystick2 = new JoyStick({onMovefn:onMove2,type:1})


		//video player
		
		video = document.createElement( 'video' );
		// video.id = 'video';
		// video.type = ' video/ogg; codecs="theora, vorbis" ';
		video.src = "./game/sample.mp4";
		video.muted=true;
		video.loop=true;
		video.setAttribute("playsinline",null); 
		video.load(); // must call after setting/changing source
		// video.play();
		
		video.width = 480;
		video.height = 204;

		videoImage = document.createElement( 'canvas' );
		videoImage.width = 480;
		videoImage.height = 270;

		videoImageContext = videoImage.getContext( '2d' );
		videoImageContext.fillStyle = '#000000';
		videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

		videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		
		movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
		movieGeometry = new THREE.PlaneGeometry( 50, 25, 4, 4 );
		movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
		movieScreen.rotation.y = Math.PI;
		movieScreen.position.set(-125, -195, -110);

		movieScreen2 = new THREE.Mesh( movieGeometry, movieMaterial );
		movieScreen2.position.set(-125, -195, -109.9);
		scene.add(movieScreen);
		scene.add(movieScreen2);
		
		
		

		//lights

		scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));

		dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
		dirLight.position.set(5, 2, 8);
		scene.add(dirLight);

		// envmap
		// path = 'textures/cube/Park2/';
		// format = '.jpg';
		// envMap = new THREE.CubeTextureLoader().load([
		// 	path + 'posx' + format, path + 'negx' + format,
		// 	path + 'posy' + format, path + 'negy' + format,
		// 	path + 'posz' + format, path + 'negz' + format
		// ]);

		// dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath('js/libs/draco/gltf/');

		loader = new GLTFLoader();
		loader.setDRACOLoader(dracoLoader);
		loader.load('models/gltf/OnePlus_3D_World.gltf', function (gltf) {

			let model = gltf.scene;
			model.position.set(0, 0, 0);
			model.scale.set(1, 1, 1);
			model.traverse(function (child) {

				// if (child.isMesh) child.material.envMap = envMap;
				if(child.isMesh)
				{
					// child.receiveShadow = true;
					// child.castShadow = true;
				}

			});

			scene.add(model);

			// mixer = new THREE.AnimationMixer(model);
			// mixer.clipAction(gltf.animations[0]).play();

			animate();

		}, undefined, function (e) {

			console.error(e);

		});
		window.onresize = function () {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);
			// controls.handleResize();
		};
		function animate() {
			
			requestAnimationFrame(animate);
			processKeyboard();
			let delta = clock.getDelta();
			
			

			if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
			{
				let vRatio = (videoImage.height / video.videoHeight) * video.videoWidth;
				videoImageContext.drawImage( video, 0,0, vRatio, videoImage.height);
				if ( videoTexture ) 
					videoTexture.needsUpdate = true;
			}

			// mixer.update(delta);

			// controls.update();
			joystick.update();
			joystick2.update();

			controls.update( delta);

			stats.update();

			renderer.render(scene, camera);

		}