import React, { Component, Fragment } from 'react';
import WindowManager from './WindowManager';
import Mobile from './Mobile';

const MOBILE_CUTOFF = 550;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false,
    }

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    this.setState({
      isMobile: window.innerWidth < MOBILE_CUTOFF
    });
  }

  render() {
    return this.state.isMobile
      ? <Mobile />
      : <WindowManager />;
  }
}

export default App;
