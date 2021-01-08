import React, { Component } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faTimes,faMicrophone,faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

const Container =styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    cursor:default;
`

const SubContainers = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:20px;
    box-sizing:border-box;
    border-bottom:1px solid #ddd;
`

const ElementWrapper = styled.div`
    display:flex;
    align-items:center;

`
const Heading = styled.span`
    font-size:25px;
    color:#f44336;
    padding:0 10px;
`

const FriendCount = styled.div`
    font-size:18px;
    color:#f44336;
    padding:15px;
`

const Voice = styled.div`
    font-size:18px;
    color:#666;
    padding:0 10px;
`

const FriendDP = styled.img`
    width:50px;
    height:50px;
    border-radius:50%;

`

const FriendName =styled.span`
    font-size:20px;
    color:#666;
`

const ChatInput= styled.input`
    border:none;
    outline:none;
    width:100%;
    padding:10px 20px;
    height:50px;
    color:#666;
    font-size:18px;
    background-color:#fff;
    border-top:1px solid #eee;
    position:absolute;
    bottom:0;

    &::placeholder{
        color:#999;

    }
`

class index extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <Container>
                <SubContainers>
                    <ElementWrapper>
                        <FontAwesomeIcon onClick={this.props.closeMenu} style={{width:"25px",height:"25px"}} icon={faChevronLeft} color ="#f44336" />
                        <Heading>Private Party</Heading>
                    </ElementWrapper>
                    <FontAwesomeIcon style={{width:"25px",height:"25px"}} icon={faTimes} color ="#f44336" />
                </SubContainers>
                <SubContainers>
                    <FriendCount>{this.props.friends.length} Friends</FriendCount>
                    <ElementWrapper>
                        <Voice>Voice Chat - On</Voice>
                        <FontAwesomeIcon style={{width:"25px",height:"25px"}} icon={faMicrophone} color ="#f44336" />
                    </ElementWrapper>
                </SubContainers>
                {
                    this.props.friends.map((friend)=>{
                        return(
                            <SubContainers key={friend.userId} >
                                <FriendDP src={require("./imgs/profile.png")} />
                                <FriendName>{friend.name}</FriendName>
                                <FontAwesomeIcon style={{width:"25px",height:"25px"}} icon={faMicrophone} color ="#f44336" />
                            </SubContainers>
                        )
                        
                    })
                }

                <ChatInput onClick={this.props.openChat} type="text" placeholder="Type a Message" />
            </Container>
        )
    }
}

export default index
