import * as THREE from 'three';
import { Euler,Vector3 } from 'three';
export class VideoComponent
{
    constructor(){

    }
    load(path,width,height,mesh)
    {
        this.video = document.createElement( 'video' );
		// video.id = 'video';
		// video.type = ' video/ogg; codecs="theora, vorbis" ';
		this.video.src = require(""+path);
		// this.video.muted=true;
        this.video.loop=true;
        this.video.setAttribute("webkit-playsinline",true); 
		this.video.setAttribute("playsinline",true); 
		this.video.load(); // must call after setting/changing source
//		 this.video.play();
		
		this.video.width = width;
		this.video.height = height;

		this.videoImage = document.createElement( 'canvas' );
		this.videoImage.width = width;
		this.videoImage.height = height;

		this.videoImageContext = this.videoImage.getContext( '2d' );
		this.videoImageContext.fillStyle = '#000000';
 //       this.videoImageContext.fillRect( 0, 0, this.videoImage.width, this.videoImage.height );
        
        this.videoTexture = new THREE.Texture( this.videoImage );
		this.videoTexture.minFilter = THREE.LinearFilter;
		this.videoTexture.magFilter = THREE.LinearFilter;
		
        this.movieMaterial = new THREE.MeshBasicMaterial( { map: this.videoTexture, overdraw: true, side:THREE.DoubleSide,transparent:true } );
        
        if(mesh === undefined)
        {
            this.movieGeometry = new THREE.PlaneGeometry(width/height, 1, 4, 4 );
            this.movieScreen = new THREE.Mesh( this.movieGeometry, this.movieMaterial );
            this.movieScreen.rotation.y = Math.PI;
            // this.movieScreen.position.set(0,22.6,-210.7);
            // this.movieScreen.scale.set(10.1,10.1,1);
            // movieScreen2 = new THREE.Mesh( movieGeometry, movieMaterial );
            // movieScreen2.position.set(-125, -195, -109.9);
            // this.scene.add(this.movieScreen);
            // this.movieScreen.visible = false;
            return this.movieScreen;
        }
        else
        {
            // this.videoTexture.flipY = true;
            mesh.material = this.movieMaterial;
        }
    }
    update(delta)
    {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA ) 
        {
            let vRatio = (this.videoImage.height / this.video.videoHeight) * this.video.videoWidth;
            this.videoImageContext.clearRect(0,0,this.videoImage.width,this.videoImage.height);
            this.videoImageContext.drawImage( this.video, 0,0, vRatio, this.videoImage.height);
            if ( this.videoTexture ) 
                this.videoTexture.needsUpdate = true;
        }
    }
    play()
    {
        this.video.play();
    }
    setActive(flag)
    {
        this.movieScreen = flag;
    }
    getObject()
    {
        return this.movieScreen;
    }
}

