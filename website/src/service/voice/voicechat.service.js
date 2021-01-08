import Janus from './janus'

class VoiceChatService {

  constructor(){
    this.mixertest = null
    this.webrtcUp = null
    this.janus = null
    this.onlineUser = {}

  }

   makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  isConnected(){
    return this.mixertest?.session?.isConnected()
  }

  toggleVoiceChat(muted_flag){
    if(this.isConnected()){
      if(muted_flag){
        document.getElementById("roomaudio").pause()
      }else{
        document.getElementById("roomaudio").play()
      }
      this.mixertest.send({message: { "request": "configure", "muted": muted_flag }});
    }
  }

  init(token, username, room, createRoom){

    if(this.isConnected())
      return
    this.token = token
    this.username = username
    this.room = 0
    this.createRoom = createRoom
    room.split("").forEach( (i) =>{
        this.room = this.room + parseInt(i.charCodeAt())
    })

    Janus.init({
      debug: "all",
      callback:  () => {

        let opaqueId = "audiobridgetest-" + Janus.randomString(12);

        this.janus = new Janus({
            server: 'wss://voice.theoneplusworld.com',
            token: this.token,
            success:  () => {
              console.log("hello")
              this.janus.attach({
                    plugin: "janus.plugin.audiobridge",
                    opaqueId: opaqueId,
                    success: this.onConnectSuccess.bind(this),
                    onmessage: this.onJanusMessage.bind(this),
                    onlocalstream: this.onLocalStream.bind(this),
                    onremotestream: this.onRemoteStream.bind(this),
                    error: function (cause) {
                      console.log("VoiceChat Error", cause)
                    },
                    destroyed: function () {
                      console.log("VoiceChat Destroyed")
                    }
                });
              }
            })
        }
    })
  }

  onLocalStream(stream){
    console.log("Janus Got a local stream",stream);
  }

  onRemoteStream(stream){
    console.log("Janus Got a remote stream",stream)
    if(document.getElementById("roomaudio"))
    {  Janus.attachMediaStream(document.getElementById("roomaudio"), stream);
    }
    else
      console.error("Janus No audio element found")
  }

  onConnectSuccess(pluginHandle){
      this.mixertest = pluginHandle;
      console.log("Plugin attached! (" + this.mixertest.getPlugin() + ", id=" + this.mixertest.getId() + ")");

      if(this.createRoom){
        let createRoom = {
          "request": "create",
          "room": this.room,
          "display": this.username
        };
        this.mixertest.send({
          "message": createRoom
        });
      }

      let register = {
        "request": "join",
        "room": this.room,
        "display": this.username
      };
      this.mixertest.send({
        "message": register
      });
  }

  destroy(){
    if(this.janus){
      this.mixertest.send({
        "message": { "request":"leave" }
      });
      this.janus.destroy()
      this.mixertest =  null
      this.janus = null
    }
  }

  updateUserList(list, clean = false){
    if( clean ){
      this.onlineUser = {}
    }else
    {
      list.forEach((item)=>{
        this.onlineUser[item.id] = item.display
      })
    }
    console.log("Janus online users",this.onlineUser);
  }

  onJanusMessage(msg, jsep){
    console.log("Janus Message received",msg,jsep);
    let event = msg["audiobridge"];
    console.debug("Janus Event: " + event);
    if (event != undefined && event != null) {
      if(event === "joined") {
        if(msg["participants"] !== undefined && msg["participants"] !== null) {
            let list = msg["participants"];
            Janus.debug("Got a list of participants:");
            this.updateUserList(list,false);
        }

        if (!this.webrtcUp) {
            this.webrtcUp = true;
            // Publish our stream
            this.mixertest.createOffer({
              media: {
                video: false
              }, // This is an audio only room
              success:  (jsep) => {
                console.log("Janus Got SDP!");
                let publish = {
                  "request": "configure",
                  "muted": false
                };
                this.mixertest.send({
                  "message": publish,
                  "jsep": jsep
                });
              },
              error: function (error) {
                console.log("Janus WebRTC error:", error);
              }
            });
        }
      }

      else if (event === "roomchanged") {
        if(msg["participants"] !== undefined && msg["participants"] !== null) {
              let list = msg["participants"];
              this.updateUserList(list,true);
        }
      }
      else if (event === "destroyed") {
            // The room has been destroyed
            console.log("The room has been destroyed!");
      }

      else if (event === "event") {
            if(msg["participants"] !== undefined && msg["participants"] !== null) {
              let list = msg["participants"];
              this.updateUserList(list,false);
            }
            if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
              let leaving_id = msg["leaving"];
              delete this.onlineUser[leaving_id];
            }
          }
        }
        if(jsep !== undefined && jsep !== null) {
          console.log("Janus Handling Jsep",jsep)
          this.mixertest.handleRemoteJsep({jsep: jsep});
        }
  }

}

let _instance = null

export default new VoiceChatService()