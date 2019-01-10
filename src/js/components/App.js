import React, { Component, Fragment } from 'react';
import WindowManager from './WindowManager';
import Mobile from './Mobile';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'

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
    return (
      <Router>
        <Switch>
          <Route path='/projects/chit_facilities' render={() => {window.location.href="fees.html"}}/>
          <Route path='/projects/chit_lead' render={() => {window.location.href="lead.html"}}/>
          <Route path='/'>
            {
              this.state.isMobile
                ? <Mobile />
                : <WindowManager />
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
