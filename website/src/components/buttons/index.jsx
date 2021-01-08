import React from 'react';
import './style.scss'

const ButtonElem = ({clickEvent, title, btnType, customClass=''}) => {
  
  return (
    <button className={`btnClass ${btnType} ${customClass}`} onClick={clickEvent}>
      {title}
    </button>
  )
}

export default ButtonElem;