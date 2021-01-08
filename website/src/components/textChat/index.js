import React, { Component } from 'react'
import io from 'socket.io-client';
import styled from 'styled-components'



        

const ROOM_ACTIONS = {
    JOINED: 1,
    MOVEMENT: 2,
    ARENA_CHANGE: 3,
    CHAT: 4,
    LEFT: 5
};


const ChatWrapper= styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    cursor:default;
    z-index:1;
    position:absolute;
    background-color:#eee;
    top:0;
    left:0;

    
`

const ChatContainer = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column-reverse;
    
`

const ChatMessage = styled.div`
    font-size:18px;
    color:#666;
    width:100%;
    text-align:left;
    padding:10px;
    box-sizing:border-box;
    padding:10px 20px;
`

const ChatUser = styled.span`
    font-size:18px;
    color:#f44336;
    font-weight:bold;
    padding:10px;
`


const SendMessageContainer = styled.div`
    display:flex;
    flex-direction:row;
    width:100%;
    height:50px;
    background-color:#fff;
    padding:10px;
    box-sizing:border-box;
    align-items:center;
    border-top:1px solid #eee;

`

const ChatInput = styled.input`
    font-size:18px;
    color:#666;
    background-color:#fff;
    width:100%;
    border:none;
    outline:none;
    padding:5px 20px;

    &::placeholder{
        color:#999;
    }
`

const ChatSend= styled.div`
    font-size:16px;
    font-weight:bold;
    color:#f44336;
    padding:0 10px;
    cursor:pointer;

`

const CloseIcon = styled.div`
    width:50px;
    height:50px;
    border-radius:50%;
    color:#f44336;
    font-size:25px;
    display:grid;
    place-items:center;
    margin-right:0;
    margin-left:auto;
    
`


class Chat extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
             messageArray:[],
             message:"",
             name:"Pratik",
             roomId:"18182"
        }

        this.socket = io('https://roaming.dev.theoneplusworld.com/');


    }
    
    componentDidMount =()=>{
        this.socket.on('roaming', (data) => {
           
            

            switch(data.action)
            {
                case ROOM_ACTIONS.CHAT:
                    console.log(data)
                    let obj ={};
                    let newArray = this.state.messageArray;
                    obj.name="Guest"
                    obj.text=data.mg;
                    newArray.unshift(obj)
                    this.setState({messageArray:newArray})
                    break;
                
            }

        });
    }
    


    messageSendHandler = () =>{
        this.socket.emit('roaming',{action:ROOM_ACTIONS.CHAT, roomId:this.state.roomId, mg:this.state.message});
        let obj ={};
        let newArray = this.state.messageArray;
        obj.name="You"
        obj.text=this.state.message;
        newArray.unshift(obj)
        this.setState({messageArray:newArray})
        this.setState({message:""})
    }
    

    render() {
        
        return (
            <>
            <ChatWrapper >
                <div style={{width:"100%",textAlign:"right"}} >
                <CloseIcon onClick={this.props.closeChat} >&#10006;</CloseIcon>
                </div>
                <ChatContainer >
                    {
                        this.state.messageArray.map((message,index)=>{
                            return(
                                <ChatMessage key={index} ><ChatUser>{message.name} :</ChatUser>{message.text}</ChatMessage>
                            )
                        })
                    }
                </ChatContainer>
                <SendMessageContainer >
                    <ChatInput placeholder="Type a Message" value={this.state.message} onChange={(e)=>{this.setState({message:e.target.value})}} />
                    <ChatSend onClick={this.messageSendHandler} >Send</ChatSend>
                </SendMessageContainer>
                
            </ChatWrapper>
            
            </>
        )
    }
}



export default Chat;
