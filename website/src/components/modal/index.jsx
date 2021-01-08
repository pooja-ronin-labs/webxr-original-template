import React from 'react';
import {ModalBackdrop} from './_style';

const ModalWrapper = ({children}) => {
  return (
    <ModalBackdrop>
      {children}
    </ModalBackdrop>
  )
}

export default ModalWrapper;