import io from 'socket.io-client';
import store from '../store/store';
import {Singleton} from './socketManager.service'; 

const SOCKET_URL = "https://roaming.dev.theoneplusworld.com/";
//const SOCKET_URL = "https://066bed322f96.ngrok.io/";
let socket = null;


const MatchmakerService = {
    connect(onConnectCallback) {

        if(Singleton.getInstance().isConnected())
        {
            socket = Singleton.getInstance().socket;
            onConnectCallback();
        }
        else
        {
            Singleton.getInstance().registerCallBacks(onConnectCallback,null,null);
            Singleton.getInstance().connectPublicRoom();
        }
        
        // let authToken = store.getState().auth.authToken;
        // let socketOptions = authToken ? {
        //     query: {
        //         token: authToken
        //     }
        // } : {};

        // socket = io(SOCKET_URL, socketOptions);
        // socket.on('connect', () => {
        //     console.log("Socket Connected", socket.connected);
        //     onConnectCallback();
        // });

        
    },

    join(gameType, roomType, onJoinCallback) {
        const joinGameData = {
            gameType: gameType,
            roomType: roomType,
        };
        Singleton.getInstance().socket.emit('joinGame', joinGameData);
        Singleton.getInstance().socket.on('joinGame', onJoinCallback);
    },

    cancelFind(gameType){
        const queryData = {
            gameType: gameType,
        };
        Singleton.getInstance().socket.emit('leaveGamingRoom', queryData);
    },

    registerReciever(event, callback){
        Singleton.getInstance().socket.on(event, callback);
    },

    removeReciever(event, callback){
        console.log("removing " + event);
        Singleton.getInstance().socket.off(event, callback);
    },

    send(event, data){
        Singleton.getInstance().socket.emit(event, data);
    }
}

export default MatchmakerService;