import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {ModalOverlay, ModalContent, CloseButton} from './_style';
import {popupContent} from './constant';

const GenericPopup = ({contentType, close}) => {
  const [closeInit, setCloseInit] = useState(false);
  const [content, setContent] = useState({title: '', content: []}); 
  const elem = useRef();
  const overLay = useRef();
  useEffect(() => {
    if(closeInit) {
      elem.current.addEventListener('transitionend', () => {
        close();
      });
      elem.current.classList.remove('slideIn');
      overLay.current.classList.remove('show');
    }
  }, [closeInit]);
  useEffect(() => {
    overLay.current.classList.add('show');
    elem.current.classList.add('slideIn');
  }, []);
  useEffect(() => {
    if(contentType) {
      setContent(popupContent[contentType]);
    }
  }, [contentType]);

  return (
    <div>
      <ModalOverlay ref={overLay}/>
      <ModalContent ref={elem}>
        <h3 className="title">
          {content.title}
          {/* {appObj.popupTitle} */}
        </h3>
        <div className="content">
          {
            content.content.map((c) => <p>{c}</p>)
          }
          {/* <p>{appObj.popupMsg}</p> */}
        </div>
        <CloseButton onClick={() => setCloseInit(true)}>
          CLOSE
        </CloseButton>
      </ModalContent>
    </div>
  )
}
const mapStateToProps = ({app}) => ({
  contentType: app.popupContent
})
const mapDispatchToProps = (dispatch) => ({
  close: () => dispatch({type: 'CLOSE_POPUP'})
})
export default connect(mapStateToProps, mapDispatchToProps)(GenericPopup);