import React, { Component, Fragment } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import htmlParser from 'react-markdown/plugins/html-parser';
import Window from './Window';
import Menu from './Menu';
import * as Posts from '../../assets/posts/index.js';

const MOBILE_CUTOFF = 550;

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
  processingInstructions: []
})

class WindowManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windows: [],
      numUnmovedWindows: 0,
    }

    this.addWindow = this.addWindow.bind(this);
    this.addWindowFromSlug = this.addWindowFromSlug.bind(this);
    this.removeWindow = this.removeWindow.bind(this);
    this.bringWindowToFront = this.bringWindowToFront.bind(this);
    this.handleInitialWindowMove = this.handleInitialWindowMove.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.addWindowFromSlug(window.location.hash.substring(1));
    }, false);

    if (window.location.hash) {
      this.addWindowFromSlug(window.location.hash.substring(1));
    }
  }

  addWindowFromSlug(slug) {
    let post = Object.keys(Posts).find(p => Posts[p].attributes.slug === slug);
    if (post) {
      this.addWindow(post);
    }
  }

  addWindow(name) {
    if (Object.keys(Posts).includes(name)) {
      if (this.state.windows.includes(Posts[name])) {
        this.bringWindowToFront(this.state.windows.indexOf(Posts[name]))
        return;
      }

      this.updateLocation(Posts[name].attributes.slug);

      this.setState({
        windows: [
          ...this.state.windows,
          Posts[name],
        ],
        numUnmovedWindows: this.state.numUnmovedWindows + 1,
      });
    }
  }

  updateLocation(slug) {
    window.location.hash = slug;
  }

  bringWindowToFront(index) {
    this.updateLocation(this.state.windows[index].attributes.slug);
    let windows = this.state.windows;
    windows.push(windows.splice(index, 1)[0]);
    this.setState({windows: windows});
  }

  handleInitialWindowMove() {
    this.setState({numUnmovedWindows: this.state.numUnmovedWindows - 1});
  }

  removeWindow(index) {
    let windows = this.state.windows;
    windows.splice(index, 1);
    this.setState({windows: windows});

    let nextWindow = windows.length > 0 ? windows[windows.length - 1].attributes.slug : '';

    console.log(nextWindow)

    this.updateLocation(nextWindow);
  }

  render() {
    return (
      <div id="main">
        <Fragment>
          {
            this.state.windows.map((e, i) => (
              <Window
                order={i}
                key={e.attributes.title}
                index={i}
                title={e.attributes.title}
                onMove={this.handleInitialWindowMove}
                onClick={this.bringWindowToFront}
                onClose={this.removeWindow}
                initialPosition={[
                  100 + (15 * this.state.numUnmovedWindows),
                  100 + (15 * this.state.numUnmovedWindows)
                ]}
              >
                <h1 className="title">{e.attributes.title}</h1>
                <ReactMarkdown
                  escapeHtml={false}
                  astPlugins={[parseHtml]}
                  source={e.body}
                />
              </Window>
            ))
          }
        </Fragment>
        <a href="#about">
          <Menu position='top left' content='About'/>
        </a>
        <a href="#work">
          <Menu position='bottom left' content='Work'/>
        </a>
        <a href="https://github.com/charliesmart" target="_blank">
          <Menu position='top right' content='Github'/>
        </a>
        <a href="https://twitter.com/charliersmart" target="_blank">
          <Menu position='bottom right' content='Twitter'/>
        </a>
        <div className='name'>Charlie Smart</div>
      </div>
    )
  }
}

export default WindowManager;
