import {
	Euler,
	EventDispatcher,
	Vector3
} from "../../build/three.module.js";

	var mobile 
	mobile = false;
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); 

	var ww = document.body.clientWidth/2;
	var wh = document.body.clientHeight/2;

	var h = window.innerHeight;
    var container = document.getElementById('container');
	var PointerLockControls = function ( camera, domElement ) {

		if (isMobile) { mobile = true; } else{	mobile = false; }
		
		if ( domElement === undefined ) {
			console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
			domElement = document.body;
		}

		this.domElement = domElement;
		this.isLocked = false;

		var scope = this;

		var changeEvent = { type: 'change' };
		var lockEvent = { type: 'lock' };
		var unlockEvent = { type: 'unlock' };

		var euler = new Euler( 0, 0, 0, 'YXZ' );

		var PI_2 = Math.PI / 4;
		this.jump=false;
		var vec = new Vector3();
		var clientX, clientY;
		var xfromtouch = 0;
		var yfromtouch = 0;
		var lastxpos = 0;
		var lastypos = 0;
		var prevTouchPosX;
		var prevTouchPosY;
		var isDrag = false;
		var timeElepsed;
		var lerp;
		var clamp;
		
		
		function onTouch(e){
			isDrag = true;
			// console.log("onTouch");
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
			prevTouchPosX = clientX;
			prevTouchPosY = clientY;
		}	
		
		function onTouchMove( e ) {
			clientY = e.touches[0].clientY;
			clientX = e.touches[0].clientX;

		  	// clientY = e.touches[0].clientY - prevTouchPosY;
			// clientX = e.touches[0].clientX - prevTouchPosX;
			// prevTouchPosX = e.touches[0].clientX;
			// prevTouchPosY = e.touches[0].clientY;

			// euler.setFromQuaternion( camera.quaternion );
			// euler.y += Math.PI * clientX * 0.0005;
			// euler.x += Math.PI * clientY * 0.0005;
			// euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
			// camera.quaternion.setFromEuler( euler );

			scope.dispatchEvent( changeEvent );
			
		};
		function onTouchEnd( e ) {
			// console.log("onTouchEnd");
			isDrag = false;
		};
		function onMouseMove( e ) {
			if ( scope.isLocked === false ) return;
			clientX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			clientY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		
			euler.setFromQuaternion( camera.quaternion );
			euler.y -= clientX * 0.0005;
			euler.x -= clientY * 0.0005;
			euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
			camera.quaternion.setFromEuler( euler );

			scope.dispatchEvent( changeEvent );
		}

		function onPointerlockChange() {
			if ( document.pointerLockElement === scope.domElement ) {
				scope.dispatchEvent( lockEvent );
				scope.isLocked = true;
			} else {
				scope.dispatchEvent( unlockEvent );
				scope.isLocked = false;
				document.querySelector('#name-input').style.display ="block";
				document.querySelector("#hopin").style.display="block";
			}
		}

		function onPointerlockError() {
			if(!scope.isLocked){
				domElement.requestPointerLock();
			}
		}
		
		this.connect = function () {
			document.addEventListener( 'mousemove', onMouseMove, false );
			// document.addEventListener( 'mousedown', onMouseDown, false );
			// document.addEventListener( 'mouseup', onMouseUp, false );

			container.addEventListener( 'touchstart', onTouch, false );
			container.addEventListener( 'touchmove', onTouchMove, false);
			container.addEventListener( 'touchend', onTouchEnd, false );

			document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
			document.addEventListener( 'pointerlockerror', onPointerlockError, false );
		};

		this.disconnect = function () {
			document.removeEventListener( 'mousemove', onMouseMove, false );
			// document.removeEventListener( 'mousedown', onMouseDown, false );
			// document.removeEventListener( 'mouseup', onMouseUp, false );
			
			container.removeEventListener( 'touchstart', onTouch, false );
			container.removeEventListener( 'touchend', onTouchEnd, false );
			container.removeEventListener( 'touchmove', onTouchMove, false);
			document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
			document.removeEventListener( 'pointerlockerror', onPointerlockError, false );
		};

		this.dispose = function () {
			this.disconnect();
		};

		this.getObject = function () { // retaining this method for backward compatibility
			return camera;
		};

		this.getDirection = function () {
			var direction = new Vector3( 0, 0, - 1 );
			return function ( v ) {
				return v.copy( direction ).applyQuaternion( camera.quaternion );
			};
		}();

		this.moveForward = function ( distance ) {
			vec.setFromMatrixColumn( camera.matrix, 0 );
			vec.crossVectors( camera.up, vec );
			camera.position.addScaledVector( vec, distance );
		};

		this.moveRight = function ( distance ) {
			vec.setFromMatrixColumn( camera.matrix, 0 );
			camera.position.addScaledVector( vec, distance );
		};

		this.lookForward = function ( distance ) {
			euler.setFromQuaternion( camera.quaternion );
			euler.x = clamp(euler.x + distance,-PI_2,PI_2);
			
			camera.quaternion.setFromEuler( euler );
		};

		this.lookRight = function ( distance ) {
			euler.setFromQuaternion( camera.quaternion );
			euler.y += distance;
			camera.quaternion.setFromEuler( euler );
		};

		this.jumpPlayer =()=>{
			if(!this.jump){
				this.jump=true;
				let jumpin = setInterval(function(){ camera.position.y+=0.1; }, 10);
				setTimeout(function(){ 
					clearInterval(jumpin);
					jumpDown();
				}, 300);
			}
		}
		const jumpDown = () =>{
			if(this.jump){
				this.jump=false;
				let jumpin = setInterval(function(){ camera.position.y-=0.1; }, 10);
				
				setTimeout(function(){ 
					clearInterval(jumpin);
					this.jump=false;
				}, 300);
			}
		}

		this.update = function(delta)
		{
			timeElepsed = delta;
			// console.log("timeElepsed:"+timeElepsed);

			//look at
			if(false && isMobile && prevTouchPosX != clientX)
			{
				return;
				vec[1] = clientY - prevTouchPosY; 
				vec[0] = clientX - prevTouchPosX;
				vec[2] = 0;
				

				vec = vec.normalize ();

				prevTouchPosX = lerp(prevTouchPosX,clientX,timeElepsed*3);
				prevTouchPosY = lerp(prevTouchPosY,clientY,timeElepsed*3);

				euler.setFromQuaternion( camera.quaternion );
				euler.y = euler.y + vec[0] * 0.02 * timeElepsed;//0.0009;
				euler.x = euler.x + vec[1] * 0.02 * timeElepsed;
				euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
				
				// let y = clientY - prevTouchPosY;
				// let x = clientX - prevTouchPosX;
				// let speed = 20 * delta;
				

				// prevTouchPosX = this.lerp(prevTouchPosX,clientX,speed);
				// prevTouchPosY = this.lerp(prevTouchPosY,clientY,speed);

				// euler.setFromQuaternion( camera.quaternion );
				// euler.y =  this.lerp(euler.y,euler.y + Math.PI/1000 * x ,speed);
				// euler.x =  this.lerp(euler.x,euler.x + Math.PI/1000 * y ,speed);
				// euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
				camera.quaternion.setFromEuler( euler );
			}
			//***************************************************** */
		};

		lerp = function (a,  b,  c) {
			return a +  clamp(c,0,1) * (b - a);
		}

		clamp = function(v,min,max){
			return Math.max( min, Math.min( max, v ) )
		}
			
		if (mobile == true) {
			this.lock = function () {
				scope.isLocked = true;
				this.connect();
			};
		}
		else{
			this.lock = function () {
				this.domElement.requestPointerLock();
			};
		}

		this.unlock = function () {
			document.exitPointerLock();
			
		};
		this.connect();
	};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export default PointerLockControls ;