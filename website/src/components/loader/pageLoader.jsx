import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import {useHistory, withRouter} from 'react-router-dom';
import {routeChange} from '../../store/app/app.action';
import opLog from '../../assets/images/opLogo.png'
import vdo from '../../assets/OPLoader.webm'

import './style.scss';

const PageLoader = ({location, pageLoading, routeChanged}) => {
  useEffect(() => {
    if(location.pathname !== '/login') {
      routeChanged(location.pathname);
    }
    ReactGA.pageview(location.pathname)
  }, [location]);
  return (
    // <div className="pageLoader">
    //   <video poster="true" autoPlay loop muted playsInline disableRemotePlayback >
    //     <source src={vdo} type="video/webm" />
    //     Your browser does not support the video tag.
    //   </video>
    // </div> 
    <>
      {pageLoading && 
        <div className="pageLoader">
          <video poster="true" autoPlay loop muted playsInline disableRemotePlayback >
            <source src={vdo} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>  
      }
    </>
  )
};

const mapStateToProps = ({app}) => ({
  pageLoading: app.pageLoading
});

const mapDispatchToProps = (dispatch) => ({
  routeChanged: (route) => dispatch(routeChange({route})),
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PageLoader))