import React, { useRef, useState,useEffect} from 'react';
import XrView from '../../Scenes/xr/index';

const XrPage = () => {
const elemWrapper = useRef(null);

useEffect(() => {
  XrView(elemWrapper.current);
}, []);


return (
  <>
    <canvas ref={elemWrapper} id="xrCanvas"></canvas>
  </>
)

};
export default XrPage;
