import React, { useEffect, useState } from 'react';
import {ReactComponent as FB} from '../../assets/images/facebook.svg';
import {ReactComponent as TW} from '../../assets/images/twitter.svg';
import {ReactComponent as WH} from '../../assets/images/whatsapp.svg';
import {ReactComponent as CP} from '../../assets/images/copy.svg';

const ShareComponent = ({msg, initPopup, resetPop}) => {
  const [shareMsg, setShareMsg] = useState(msg);
  const [showCompoent, setShowComponent] = useState(false);
  useEffect(() => {
    if(initPopup) {
      openShare();
    }
  }, [initPopup])
  const openShare = () => {
    if(navigator.share) {
      navigator.share({
        title: 'The OnePlus World',
        text: msg ? msg : '',
        url: `${window.location.origin}`
      }).then(() => {
        console.log('Thanks for sharing!');
      })
    } else {
      setShowComponent(true);
    }
  }
  const closeME = () => {
    setShowComponent(false);
    resetPop(false)
  }
  const shareOnFB = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`,
      '_blank'
    )
  }
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${window.location.origin}`,
      '_blank'
    )
  }
  const shareWA = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)} ${window.location.origin}`,
      '_blank'
    )
  }
  const copyClip = () => {
    navigator.clipboard.writeText(`${msg} ${window.location.origin}`)
  }
  
  return (
    showCompoent ? <>
      <div className="overlay"></div>
      <div className="shreWrapper">
        <div className="shareHeader">
          #Share <div onClick={closeME}>&#10006;</div>
        </div>
        <div className="shareBtnWrapper">
          <div className="shareBtn" onClick={shareOnFB}><FB/></div>
          <div className="shareBtn" onClick={shareOnTwitter}><TW/></div>
          <div className="shareBtn" onClick={shareWA}><WH/></div>
          <div className="shareBtn" onClick={copyClip}><CP/></div>
        </div>
      </div>
    </>:null
  )
}

export default ShareComponent;