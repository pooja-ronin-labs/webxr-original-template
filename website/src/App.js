import React, { useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

//pages
import XrPage from './pages/xrPage';

function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}


function App({ location, popupInit }) {

  const wrapperHeight = () => {
    const vh = window.innerHeight * .01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  useEffect(() => {
    wrapperHeight();
    const debouncedHandleResize = debounce(function handleResize() {
      const vh = window.innerHeight * .01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 500);

    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [])
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={XrPage} />
      </Switch>
    </div>
  );
}

const mapStateToProps = ({ auth, app }) => {
  return {
    authToken: auth.authToken,
    popupInit: app.popupInit
  }
}

export default connect(mapStateToProps)(App);
