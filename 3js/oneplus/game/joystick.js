import {
	Vector3
} from "../../build/three.module.js";

export class JoyStick{
    constructor(options){
        this.circle = document.createElement("div");
        this.circle.className = options.type == 0 ? "js-circle" : "js-circle2";
        this.thumb = document.createElement("div");
        this.thumb.className = "js-circle-thumb";
        this.circle.appendChild(this.thumb);
        document.body.appendChild(this.circle);
        this.domElement = this.thumb;
        this.maxRadius = options.maxRadius || 40;
        this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        this.onMove = options.onMovefn;
        this.origin = { left:this.domElement.offsetLeft, top:this.domElement.offsetTop };
        this.isDrag = false;
        this.top = 0;
        this.left = 0;
        this.vec = new Vector3(0,0,0);
        this.touchIndex = 0;
        
        if (this.domElement!=undefined){
            const joystick = this;
            if ('ontouchstart' in window){
                this.circle.addEventListener('touchstart', function(evt){ joystick.tap(evt); });
            }else{
                this.circle.addEventListener('mousedown', function(evt){ joystick.tap(evt); });
            }
        }
    }
    
    getMousePosition(evt){
        
        let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
        return { x:clientX, y:clientY };
    }

    tap(evt){
        this.isDrag = true;
        evt = evt || window.event;
        // get the mouse cursor position at startup:
        
        this.offset = this.getMousePosition(evt);
        const joystick = this;
        if ('ontouchstart' in window){
            this.circle.ontouchmove = function(evt){ joystick.move(evt); };
            this.circle.ontouchend =  function(evt){ joystick.up(evt); };
        }else{
            this.circle.onmousemove = function(evt){ joystick.move(evt); };
            this.circle.onmouseup = function(evt){ joystick.up(evt); };
        }
    }
    
    move(evt){
        // console.log("move");
        evt = evt || window.event;
        const mouse = this.getMousePosition(evt);
        // calculate the new cursor position:
        this.left = mouse.x - this.offset.x;
        this.top = mouse.y - this.offset.y;

        
        const sqMag = this.left*this.left + this.top*this.top;
        if (sqMag>this.maxRadiusSquared){
            //Only use sqrt if essential
            const magnitude = Math.sqrt(sqMag);
            this.left /= magnitude;
            this.top /= magnitude;
            this.left *= this.maxRadius;
            this.top *= this.maxRadius;
        }
        
        this.domElement.style.top = `${this.top + this.domElement.clientHeight/2}px`;
        
        this.domElement.style.left = `${this.left + this.domElement.clientWidth/2}px`;
           
        
    }
    
    up(evt){
        this.isDrag = false;
        this.left = 0;
        this.top = 0;
        if ('ontouchstart' in window){
            this.circle.ontouchmove = null;
            this.circle.ontouchend = null;
        }else{
            this.circle.onmousemove = null;
            this.circle.onmouseup = null;
        }
        this.domElement.style.top = `${this.origin.top}px`;
        this.domElement.style.left = `${this.origin.left}px`;
    }

    update(){
        if(this.isDrag == true)
        {
            this.vec[0] = this.left;
            this.vec[1] = this.top;
            this.vec = this.vec.normalize ();
            if (this.onMove!=undefined) this.onMove(this.vec[1], this.vec[0]);
        }
    };
}

