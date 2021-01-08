/// <reference path="3rdparty/easeljs.d.ts" />          
/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/> 
/// <reference path="master-client.ts"/> 
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// For Photon Cloud Application access create cloud-app-info.js file in the root directory (next to default.html) and place next lines in it:
//var AppInfo = {
//    AppId: "your app id",
//    AppVersion: "your app version",
//}
// fetching app info global variable while in global context
var DemoWss = this["AppInfo"] && this["AppInfo"]["Wss"];
var DemoAppId = this["AppInfo"] && this["AppInfo"]["AppId"] ? this["AppInfo"]["AppId"] : "<no-app-id>";
var DemoAppVersion = this["AppInfo"] && this["AppInfo"]["AppVersion"] ? this["AppInfo"]["AppVersion"] : "1.0";
var DemoFbAppId = this["AppInfo"] && this["AppInfo"]["FbAppId"];
var DemoConstants = {
    PlayerMoved: 0,
    PlayerInfo:1,
    LogLevel: Exitgames.Common.Logger.Level.DEBUG
};
var Demo = /** @class */ (function (_super) {
    __extends(Demo, _super);
    function Demo(canvas) {
        var _this = _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion) || this;
        _this.canvas = canvas;
        this.connected = false;
        return _this;
    }
    // sends to all including itself
    Demo.prototype.raiseEventAll = function (eventCode, data, options) {
        options = options || {};
        options.receivers = Photon.LoadBalancing.Constants.ReceiverGroup.All;
        this.raiseEvent(eventCode, data, options);
    };
    // overrides
    Demo.prototype.roomFactory = function (name) { return new DemoRoom(this, name); };
    Demo.prototype.actorFactory = function (name, actorNr, isLocal) { return new DemoPlayer(this, name, actorNr, isLocal); };
    Demo.prototype.myRoom = function () { return _super.prototype.myRoom.call(this); };
    Demo.prototype.myActor = function () { return _super.prototype.myActor.call(this); };
    Demo.prototype.myRoomActors = function () { return _super.prototype.myRoomActors.call(this); };
    Demo.prototype.start = function (player,otherplayers) {
        this.stage = new createjs.Stage(this.canvas);
        this.myRoom().loadResources(this.stage);
        // this.setupUI();
        this.otherplayers = otherplayers;
        this.player = player;
        this.ConnectToRoomAutomatically();
    };

    //OnActor Join or leave
    Demo.prototype.onActorJoin = function (actor) {
        console.log("myscript actor " + actor.actorNr + " joined");
        console.log("actor name" + actor.getCustomProperty("name") + " joined");
        _this = this;

        if(actor.actorNr != _this.myActor().actorNr)
            this.otherplayers.loadModel(actor.actorNr,actor.getCustomProperty("name"));
        else
        {
            this.connected = true;
            for (var i in _this.myRoomActors()) {
                if(i != _this.myActor().actorNr)
                {
                    console.log("other actor no:"+i+" name:"+_this.myRoomActors()[i].getCustomProperty("name"));
                    this.otherplayers.loadModel(i,_this.myRoomActors()[i].getCustomProperty("name"));
                }
            }
        }
        // var myActorNr = _this.myActor().actorNr;
        // if(actor.actorNr == myActorNr)
        //     _this.raiseEventAll(DemoConstants.PlayerMoved, { x:100,y:0,z:0 });
    };
    Demo.prototype.onActorLeave = function (actor) {
        console.log("myscript actor " + actor.actorNr + " left");
    };
    Demo.prototype.createDemoRoom = function () {
        console.log("myscript: createDemoRoom");

        this.myRoom().setEmptyRoomLiveTime(10000);
        this.createRoomFromMy("DemoPairsGame (Master Client)");
    };
    Demo.prototype.onJoinRoom = function () {
        console.log("myscript: onjoin room");
    };
    Demo.prototype.onOperationResponse = function (errorCode, errorMsg, code, content) {
        console.log("myscript: onOperationResponse");
        if (errorCode) {
            switch (code) {
                case Photon.LoadBalancing.Constants.OperationCode.JoinRandomGame:
                    switch (errorCode) {
                        case Photon.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                            console.log("myscript Join Random:"+ errorMsg);
                            this.createDemoRoom();
                            break;
                        default:
                            console.log("myscript Join Random:"+ errorMsg);
                            break;
                    }
                    break;
                case Photon.LoadBalancing.Constants.OperationCode.CreateGame:
                    if (errorCode != 0) {
                        consle.log("myscript CreateGame:"+ errorMsg);
                        this.disconnect();
                    }
                    break;
                case Photon.LoadBalancing.Constants.OperationCode.JoinGame:
                    if (errorCode != 0) {
                        console.log("myscript CreateGame:"+ errorMsg);
                        this.disconnect();
                    }
                    break;
                default:
                    console.log("myscript Operation Response error:"+ errorCode +"," +errorMsg + "," +code +","+content);
                    break;
            }
        }
        else
            console.log("myscript: no error code generated");
    };

    Demo.prototype.onStateChange = function (state) {
       
       var LBC = Photon.LoadBalancing.LoadBalancingClient;
       console.log("myscirpt: state change:"+LBC.StateToName(state));
       switch (state) {
           case LBC.State.JoinedLobby:
               this.joinRandomRoom();
               break;
           default:
               break;
       }
    };

    Demo.prototype.onEvent = function (code, content, actorNr) {
        if(_this.myActor().actorNr == actorNr)
            return;
        this.otherplayers.stopAnimation();
        switch (code) {
            case DemoConstants.PlayerMoved:
                // console.log("player moved");
                this.otherplayers.updateActorPosition(actorNr,content.pos,content.rot);
                break;
            case DemoConstants.PlayerInfo:
                // console.log("player moved");
                this.otherplayers.updateActorInfo(actorNr,content.info);
                break;
            default:
                
        }
        // console.log("Demo: onEvent"+ code+ " content:"+ content.pos.x+ " actor:"+ actorNr);
    };

    // Demo.prototype.setupUI = function () {
    //     var _this = this;
    //     var btn = document.getElementById("connect");
    //     btn.onclick = function (ev) { 
    //         console.log("connecting player with available room");
    //         var n = "pratik" + (1000 * Math.random());
    //         var id = "n:" + n;
    //         _this.myActor().setInfo(id, n.value);
    //         _this.myActor().setCustomProperty("auth", { name: n });
    //         _this.connectToRegionMaster("EU");
    //     };
    // };

    Demo.prototype.ConnectToRoomAutomatically = function(){
        var _this = this;
        console.log("connecting player with available room");
        var n = "user" + (1000 * Math.random());
        var id = "n:" + n;
        _this.myActor().setInfo(id, n.value);
        _this.myActor().setCustomProperty("auth", { name: n });
        _this.myActor().setCustomProperty("name", _this.player.getPlayerName());
        _this.connectToRegionMaster("EU");
    };
    Demo.prototype.IsConnected = function(){
        return this.connected;
    };
    return Demo;
}(Photon.LoadBalancing.LoadBalancingClient));


var DemoRoom = /** @class */ (function (_super) {
    __extends(DemoRoom, _super);
    function DemoRoom(demo, name) {
        var _this = _super.call(this, name) || this;
        _this.demo = demo;
        // acceess properties every time
        return _this;
    }
    DemoRoom.prototype.loadResources = function (stage) {
        console.log("myscript: DemoRoom loadResources");
    };
    return DemoRoom;
}(Photon.LoadBalancing.Room));

var DemoPlayer = /** @class */ (function (_super) {
    __extends(DemoPlayer, _super);
    function DemoPlayer(demo, name, actorNr, isLocal) {
        var _this = _super.call(this, name, actorNr, isLocal) || this;
        _this.demo = demo;
        return _this;
    }
    DemoPlayer.prototype.getId = function () {
        return this.getCustomProperty("id");
    };
    DemoPlayer.prototype.getName = function () {
        return this.getCustomProperty("name");
    };
    DemoPlayer.prototype.setInfo = function (id, name) {
        this.demo.setUserId(id);
        this.setCustomProperty("id", id);
        this.setCustomProperty("name", name);
    };
    return DemoPlayer;
}(Photon.LoadBalancing.Actor));

// var loadBalancingClient;
// window.onload = function () {
//     loadBalancingClient = new Demo(document.getElementById("container"));
//     loadBalancingClient.start();
// };

// var MultiplayerHandler = function () {
//     this.loadBalancingClient = new Demo(document.getElementById("container"));
//     loadBalancingClient.start();
// };
// export { MultiplayerHandler };

