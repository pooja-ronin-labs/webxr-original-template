import * as THREE from 'three';
import { Euler,Vector3 } from 'three';
import {THREEx} from './threex.chromakey';
export class VideoComponentChromaKey
{
    constructor(){

    }
    load=(path,width,height,mesh)=>
    {

        this.myGreenScreenMaterial = new THREEx.ChromaKeyMaterial(""+path, 0xd432); 
        let myGeometry = new THREE.PlaneBufferGeometry( width, height);
        this.myGreenScreenVideoObject = new THREE.Mesh( myGeometry, this.myGreenScreenMaterial );
    }
    update=(delta)=>
    {
        this.myGreenScreenMaterial.update();
    }
    play=()=>
    {
        this.myGreenScreenMaterial.startVideo();
    }
    setActive=(flag)=>
    {
        this.movieScreen = flag;
    }
    getObject=()=>
    {
        return this.myGreenScreenVideoObject;
    }
}

