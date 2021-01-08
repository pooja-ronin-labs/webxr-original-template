import React from 'react';
import './style.scss';

const SectionHeader = ({title, backBtn,closeBtn,  backEvent, closeEvent, style, forMenu}) => {
  return (
    <div className={`sectionHeader ${forMenu ? 'menuSectionHeader' : ''}`} style={style}>
      <div>
        {backBtn ? <span className="back" onClick={() => backEvent()}></span> : '' }
        {title}
      </div>
      {closeBtn ? <div className="closeBtn" onClick={() => closeEvent()}>×</div> : '' }
    </div>
  )
}

export default SectionHeader;