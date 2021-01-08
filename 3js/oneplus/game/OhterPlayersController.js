import * as THREE from '../../build/three.module.js';
import {
	MathUtils,
	Spherical,
	Vector3,
	Euler
} from "../../build/three.module.js";
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

var OhterPlayersController = function (modelpath,scene) 
{
	this.modelpath = modelpath;
	
	var scene = scene;
	let nametag,loader,group;
	var mesh,action,mixer;
	var dict = {};
	var clock = new THREE.Clock();
	var euler = new Euler( 0, 0, 0, 'YXZ' );

	

	this.loadModel = function(actor_id,name)
	{
		//temporary setup
		group = new THREE.Object3D();
		var loader = new GLTFLoader();
		loader.load( modelpath, function ( gltf ) {
			var animations = gltf.animations;
			mesh = gltf.scene;
			mixer = new THREE.AnimationMixer( mesh );
			action = mixer.clipAction( animations[ 0 ] );
			action.play();
			group.add( mesh );
			animate();
		} );
		
		dict[actor_id] = group;
		scene.add(dict[actor_id]);

		this.updateActorInfo(actor_id,name);
	};


	this.playAnimation = ()=>{
		if(action)
			action.play()
	}
	this.stopAnimation=()=>{
		if(action)
			action.stop()
	}

	this.addText = function(text)
	{
		var     canvas,
        context,
        metrics = null,
        textHeight = 16,
        textWidth = 0,
		actualFontSize = 0.3;

		canvas = document.createElement('canvas'),
     	context = canvas.getContext('2d');
     	context.fillStyle = '#FFFFFF';
		// 2d duty
		context.font = "20px Arial";
		metrics = context.measureText(text);
		textWidth = metrics.width;
	  
		canvas.width = textWidth;
		canvas.height = textHeight;
		// context.font = "normal " + textHeight + "px Arial";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "#000000";
		context.fillText(text, textWidth / 2, textHeight / 2);
	  
		let texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		let material = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
		let sprite = new THREE.Sprite( material );
		
		let textObject = new THREE.Object3D();
	   // var sprite = new THREE.Sprite(texture);
		textObject.textHeight = actualFontSize;
		textObject.textWidth = (textWidth / textHeight) * textObject.textHeight;
		sprite.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
			  
		textObject.add(sprite);
		return textObject;
	}
	this.updateActorPosition = function(actor_id,pos,rot)
	{	
		pos.y-=1;
		this.playAnimation();
		euler.y = rot;
		dict[actor_id].position.set(pos.x,pos.y,pos.z);
		dict[actor_id].quaternion.setFromEuler( euler );
		
		console.log("player y:"+pos.y);
	}
	this.updateActorInfo = function(actor_id,name)
	{
		console.log("updateActorInfo:"+name)
		let spritey = this.addText( (name)?name:"Anonymous" );
		dict[actor_id].add( spritey );
		// group.children[0].position.set(0,0.0,0);
		console.log(dict[actor_id])
		dict[actor_id].children[0].position.set(0,2,0);
		dict[actor_id].position.set(0,0,0);
		
		// dict[actor_id].children.children[1].position.set(0,0,0);
	}
	const animate=()=>{
		requestAnimationFrame(animate);
		if ( mixer ) {
			let delta = clock.getDelta();
			// console.log(mixer)
			mixer.update( delta );


		}
	}
	
};

export { OhterPlayersController };
