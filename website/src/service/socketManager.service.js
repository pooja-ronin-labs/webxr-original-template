import io from 'socket.io-client';
import store from '../store/store';
import freeRoamingWorldService from '../service/freeRoamingWorld.service';
const SocketIO = require('socket.io-client')
const encrypt = require('socket.io-encrypt')

export const GAME_STATES = {
    WAITING: 1,
    RUNNING: 2,
    FINISHED: 3,
    DESTROYED: 4,
};
export const ROOM_TYPES = {
    PUBLIC: 1,
    PRIVATE: 2,
};
export const ROOM_CATEGORY = {
    ROAMING: 1,
    GAMING: 2,
};
export const PLAYER_STATES = {
    WAITING: 1,
    PLAYING: 2,
    EXIT: 3,
    AUTOEXIT: 4,
    WON: 5,
    LOST: 6,
};

export const GAME_TYPES = {
    PING_PONG: 1,
};

export const GAME_WIN_POINTS = {
    1: 100, // ping pong
};

export const ROOM_ACTIONS = {
    JOINED: 1,
    MOVEMENT: 2,
    ARENA_CHANGE: 3,
    CHAT: 4,
    LEFT: 5,
    EMOJI: 6
};
export const MAP_AREA = {
    AUDITORIUM: 1,
    GAMEROOM: 2,
};
export class SocketManagerService
{
    
    constructor(socketManager)
    {
        this.isPrivateRoom = false;
        this.isSocketConnectionErrPopupOn = false;
        this.manualDisconnect = false;
    }
    registerCallBacks=(callBackConnected,callBackFailed,callBackDisconnected)=>
    {
        this.callBackConnected = callBackConnected;
        this.callBackFailed = callBackFailed;
        this.callBackDisconnected = callBackDisconnected;
    }
    connectPublicRoom=()=>
    {
        freeRoamingWorldService.getPublicRoomSocketAddress().then(this.onPublicRoomCallback.bind(this));
    }
    connectPrivateRoom=(room)=>
    {
        console.log("join room;"+room);
        this.room = room;
        freeRoamingWorldService.getPrivateRoomSocketAddress(room).then(this.onPrivateRoomCallback.bind(this));
    }
    onPublicRoomCallback=(rsp)=> 
    {
        console.log("connect to this socket :"+ rsp["ipaddr"]);
        console.log(rsp);
        console.log("token:"+freeRoamingWorldService.getBearerToken());
        this.connect(rsp["ipaddr"],{token:freeRoamingWorldService.getBearerToken()});
        // this.socketManager.connect("http://d07a01d243f2.ngrok.io/",{token:freeRoamingWorldService.getBearerToken()}); //test
    }
    onPrivateRoomCallback=(rsp)=> 
    {
        console.log(rsp);
        console.log("connect to this socket address:"+ rsp["ipaddr"]);
        console.log("connect to this socket room:"+ rsp["privateCode"]);
        console.log("room :"+this.room);
        this.connect(rsp["ipaddr"],{privateCode:rsp["privateCode"] ? rsp["privateCode"] : this.room,token:freeRoamingWorldService.getBearerToken()});
        // this.socketManager.connect("http://d07a01d243f2.ngrok.io/",{privateCode:rsp["privateCode"],token:freeRoamingWorldService.getBearerToken()});//test
    }
    connect=(url,querydata)=>
    {
        
        
        this.socket = SocketIO( url ,querydata ? {query:querydata} : {} );
        encrypt('5A2D5E425F91CF9C5B274C66381A6')(this.socket)
        console.log(this.socket.id); // undefined
        
        this.socket.on('connect', () => {
            console.log("Socket Connected"+this.socket.id); // 'G5p5...'
            // this.broadcastRoomJoin();
            if(this.isSocketConnectionErrPopupOn) {
                this.isSocketConnectionErrPopupOn = false;
                store.dispatch({type: 'SHOW_POPUP', payload: {title: 'Yay!', msg: 'We are back online!', reload: false}})
            }
        });
        this.socket.on('disconnect', () => {
            if(this.callBackDisconnected)
                this.callBackDisconnected();
            store.dispatch({type: 'SOCKET_STATUS', payload: false});
            if(!this.isSocketConnectionErrPopupOn && !this.manualDisconnect)
            {
                this.isSocketConnectionErrPopupOn = true;
                store.dispatch({type: 'SHOW_POPUP', payload: {title: 'OOPS!', msg: 'Seems like you are not connected to the internet, or a glitch in the connection, or you have another session running on another tab or device.', reload: true}})
            }
            this.manualDisconnect = false; 
        });
        this.socket.on('connect_error', (error) => {
            console.log("Socket connect_error"+error); // 'G5p5
            if(this.callBackFailed)
                this.callBackFailed();
            store.dispatch({type: 'SOCKET_STATUS', payload: false});
            if(!this.isSocketConnectionErrPopupOn)
            {
                this.isSocketConnectionErrPopupOn = true;
                store.dispatch({type: 'SHOW_POPUP', payload: {title: 'OOPS!', msg: 'Seems like you are not connected to the internet, or a glitch in the connection, or you have another session running on another tab or device.', reload: true}})
            }
        });

        this.socket.on('roomState', (data) => {
            this.roomData = data;
            // console.log("Socket event roomState received:");
            // console.log(data);
            this.roomType = data.roomType;
            if(data.roomType===2){
                this.isPrivateRoom=true
            }
            if (data.roomType===1){
                this.isPrivateRoom=false
            }
            this.roomId = data.roomId;
            if(this.callBackConnected)
                this.callBackConnected();
            
            store.dispatch({type: 'SOCKET_STATUS', payload: true});
        });
    }
    isConnected=()=>
    {
        return this.socket && this.socket.connected;
    }

}

export var Singleton = (function () {
    var instance;
 
    function createInstance() {
        console.log("Socket Created ::::***********");
        var socketManagerServiceSingleton = new SocketManagerService();
        return socketManagerServiceSingleton;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();