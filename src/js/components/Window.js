import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import WindowButton from './WindowButton';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 500;
const DEFAULT_X = 100;
const DEFAULT_Y = 100;

class Window extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMaximized: false,
      x: props.initialPosition[0],
      y: props.initialPosition[1],
      hasMoved: false,
      width: 500,
      height: 400,
      dragging: false,
    }

    this.toggleMaximize = this.toggleMaximize.bind(this);
  }

  toggleMaximize() {
    this.setState({
      isMaximized: !this.state.isMaximized,
      isMinimized: false
    });
  }

  render() {
    let {
      order,
      onClick,
      onClose,
      index,
      children,
      title
    } = this.props;

    let x, y, width, height;

    if (this.state.isMaximized) {
      x = 0;
      y = 0;
      width = window.innerWidth - 40;
      height = window.innerHeight - 40;
    } else {
      x = this.state.x;
      y = this.state.y;
      width = this.state.width;
      height = this.state.height;
    }

    return (
      <Rnd
        className={`
          window
          ${this.state.dragging && 'window--dragging'}
        `}
        minWidth={200}
        minHeight={200}
        dragHandleClassName='actionBar'
        onMouseDown={() => onClick(index)}
        size={{
          width: width,
          height: height
        }}
        position={{
          x: x,
          y: y
        }}
        style={{
          zIndex: order,
        }}
        onDragStart={() => {
          if (!this.state.hasMoved) {
            this.props.onMove();
            this.setState({hasMoved: true});
          }
          this.setState({dragging: true});
        }}
        onDragStop={(e, d) => {
          this.setState({
            x: d.x,
            y: d.y,
            dragging: false,
          })
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.setState({
            isMaximized: false,
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
  }}
      >
        <div className='actionBar'>
          <WindowButton onClick={() => onClose(index)} type='close'/>
          <WindowButton onClick={this.toggleMaximize} type='maximize'/>
        </div>
        <div className='windowContents'>
          <div className='windowContents__wrap'>
            {children}
          </div>
        </div>
      </Rnd>
    )
  }
}

Window.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.number,
  index: PropTypes.number.isRequired,
  title: PropTypes.string,
  initialPosition: PropTypes.arrayOf(PropTypes.number),
  onMove: PropTypes.func,
}

Window.defaultProps = {
  onClick: () => {},
  onClose: () => {},
  order: 1,
  title: '',
  initialPosition: [100, 100],
  onMove: () => {},
}

export default Window;
