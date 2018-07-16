import React from 'react'
import IsMobile from 'ismobilejs'

// import Slider from 'material-ui/Slider'
import ProjectionDome from '../libs/ProjectionDome'

import ('../css/VROverlay.css')

export default class VROverlay extends React.PureComponent {

  constructor(props) {
    super(props);

    this.onResize = this._handleResize.bind(this);
    this.onMouseScroll = this._handleMouseScroll.bind(this);

    this.showLonLat = false;

    this.state = {
      vrZoom:              0,
      lon:                 props.position.lon,
      lat:                 props.position.lat,
      paddingX:            props.paddingX || 1.0,
      paddingY:            props.paddingY || 1.0,
      showPaddingSliders:  false,
      videoElement:        props.videoElement
    };
  }


  componentWillReceiveProps(nextProps) {
    if (this.state.videoElement !== nextProps.videoElement) {
      this.setState({
        paddingX:      nextProps.paddingX || 1.0,
        paddingY:      nextProps.paddingY || 1.0,
        videoElement:  nextProps.videoElement
      });
    }
  }


  componentDidMount() {
    this.passiveSupported = false;
    
    try {
      const options = Object.defineProperty({}, "passive", {
        get: function () {
          this.passiveSupported = true;
        }
      });

      window.addEventListener('test', null, options);
    } catch (err) { }

    window.addEventListener('resize', this.onResize);
    this.refs.controlsOverlay.addEventListener('mousewheel', this.onMouseScroll, this.passiveSupported ? { passive: true } : false);
    this.refs.controlsOverlay.addEventListener('DOMMouseScroll', this.onMouseScroll, this.passiveSupported ? { passive: true } : false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.refs.controlsOverlay) {
      this.refs.controlsOverlay.removeEventListener('mousewheel', this.onMouseScroll);
      this.refs.controlsOverlay.removeEventListener('DOMMouseScroll', this.onMouseScroll);
    }

    this.destroy();
  }

  render() {
    return (
      <div className='vr-overlay' style={this.props.style}>
        <div ref='canvasContainer' style={{height: '100%'}} className='vr-canvas-container' />
        { this.renderControls() }
      </div>
    );
  }

  renderControls() {
    return (
      <div
        ref='controlsOverlay'
        className='vr-controls'
        onMouseOver={this._handleMouseOver.bind(this)}
        onMouseOut={this._handleMouseOut.bind(this)}
        onMouseDown={this._handleMouseDown.bind(this)}
        onMouseUp={this._handleMouseUp.bind(this)}
        onMouseMove={this._handleMouseMove.bind(this)}
        onClick={this._handleMouseClick.bind(this)} 
        onKeyPress={this._handleKeyPress.bind(this)}>
        {this.props.showControls && this.props.splits === 1 && this.renderDirectionPad() }
        {/* {this.props.showControls && this.props.splits === 1 && this.state.showPaddingSliders && this.renderPaddingSliders() } */}
        {/* {this.props.showControls && this.props.splits === 1 && this.renderZoomSlider() } */}
      </div>
    );
  }

  renderDirectionPad() {
    return (
      <div className='control-panel'>
        <div className='top'>
          <i className='zmdi zmdi-keyboard_arrow_up' onClick={this._moveVR.bind(this, 'up')} />
        </div>
        <div className='middle'>
          <i className='zmdi zmdi-chevron-left' onClick={this._moveVR.bind(this, 'left')} />
          <i className='zmdi zmdi-chevron-right' onClick={this._moveVR.bind(this, 'right')} />
        </div>
        <div className='bottom'>
          <i className='zmdi zmdi-keyboard_arrow_down' onClick={this._moveVR.bind(this, 'down')} />
        </div>
      </div>
    );
  }

  // renderZoomSlider() {
  //   const styles = {
  //     display: 'flex',
  //     height: 124,
  //     flexDirection: 'row',
  //     justifyContent: 'space-around',
  //   };

  //   return (
  //     <div className='zoom-panel'>
  //       <div style={styles}>
  //         {<Slider style={{height: 100}} axis="y" defaultValue={0} value={this.state.value} onChange={this._handleSliderChange.bind(this)} />}
  //       </div>
  //     </div>
  //   );
  // }

  // renderPaddingSliders() {
   
  //   const paddingX = (typeof this.state.paddingX === 'number') ? this.state.paddingX.toFixed(3) : this.state.paddingX;
  //   const paddingY = (typeof this.state.paddingY === 'number') ? this.state.paddingY.toFixed(3) : this.state.paddingY;

  //   return (
  //     <div className='padding-panel'>

  //       <div className='padding-sliders-container'>
  //         {<Slider className='padding-slider' axis='y' defaultValue={1.0} max={1.2} step={0.001} value={this.state.paddingX} onChange={this._handlePaddingX.bind(this)} />}
  //         {<Slider className='padding-slider' axis='y' defaultValue={1.0} max={1.2} step={0.001} value={this.state.paddingY} onChange={this._handlePaddingY.bind(this)} />}
  //       </div>

  //       <div className='padding-value'>{paddingX} x {paddingY}</div>

  //     </div>
  //   );
  // }
    
  fittedVideoSize() {
    const wcr = 16 / 9;
    
    const cw = this.refs.canvasContainer.offsetWidth;
    const ch = this.refs.canvasContainer.offsetHeight;
    const car = cw / ch;

    return (car > wcr) ? { w: ch * wcr, h: ch } : { w: cw, h: cw / wcr };
  }

  destroy() {
    if (this.p) {
      this.p.destroy();
    }
    
    window.removeEventListener('resize', this.onResize);
    if (this.refs.controlsOverlay) {
      this.refs.controlsOverlay.removeEventListener('mousewheel', this.onMouseScroll);
      this.refs.controlsOverlay.removeEventListener('DOMMouseScroll', this.onMouseScroll);
    }
  }

  videoElementReady(videoElement) {
    const h = this._determineHeight();

    this.p = new ProjectionDome(this.refs.canvasContainer, h * 16 / 9, h, videoElement, {
      inverseHPanning: true,
      inverseVPanning: true,
      speedX: 0.1,
      speedY: 0.1,
      lon: this.props.position.lon,
      lat: this.props.position.lat,
      mouseSensitivityX: IsMobile.phone ? 0.5 : 0.1,
      mouseSensitivityY: IsMobile.phone ? 0.5 : 0.1,
      paddingX: this.state.paddingX,
      paddingY: this.state.paddingY
    });

    this.p.onloadeddata();
  }

  _determineHeight() {
    if (!this.refs.canvasContainer) {
      return;
    }

    if (this.props.multiPlay) {
      const width = this.refs.canvasContainer.offsetWidth;
      return Math.min(width * 9 / 16, this.refs.canvasContainer.offsetHeight);
    }

    return this.props.splits === 2 ? this.refs.canvasContainer.offsetHeight / 2 : this.refs.canvasContainer.offsetHeight;
  }

  _handleResize() {
    const vs = this.fittedVideoSize();
    this.p.resize(vs.w, vs.h);
  }

  _handleSliderChange(e, value) {
    this.setState({value})
    this.p.setZoom(value);
  }

  _handleMouseClick(e) {
    if (this.mouseMoveFired) {
      this.mouseMoveFired = false;
      return;
    }

    if (this.props.onMouseClick) {
      this.props.onMouseClick(e);
    }
  }

  _handleMouseOver() {
    if (this.props.onHover) {
      this.props.onHover(true);
    }
  }

  _handleMouseOut() {
    if (this.props.onHover) {
      this.props.onHover(false);
    }
  }

  _handleMouseDown(e) {
    let isRightMB = false;
    if ('which' in e) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      isRightMB = e.which === 3;
    } else if ('button' in e) { // IE, Opera 
      isRightMB = e.button === 2;
    }

    if (isRightMB) {
      return;
    }

    this.mouseDown = true;
    this.refs.controlsOverlay.classList.add('mouse-down');

    this.p.onMouseDown(e);
  }

  _handleMouseUp(e) {
    this.mouseDown = false;
    this.refs.controlsOverlay.classList.remove('mouse-down');

    this.p.onMouseUp(e);
    this.props.onPositionUpdate(this.props.splitIndex, { lon: this.state.lon, lat: this.state.lat });
  }

  _handleMouseScroll(e) {
    this.p.onMouseWheel(e);
  }

  _handleMouseMove(e) {
    if (!this.mouseDown) {
      return;
    }

    this.mouseMoveFired = true;
    this.p.onMouseMove(e, (newLon, newLat) => {
      this.setState({ lon: newLon, lat: newLat });
    });
  }

  _handleKeyPress(e) {
    if (e.key === '#') {
      // this.setState({
      //   showPaddingSliders: !this.state.showPaddingSliders
      // });
    }
  }

  _handlePaddingX(e, value) {
    this.setState({ paddingX: value });
    this.p.setPadding({
      x: value
    });
  }

  _handlePaddingY(e, value) {
    this.setState({ paddingY: value });
    this.p.setPadding({
      y: value
    });
  }

  _moveVR(direction) {
    const opt = { animated: true };

    switch(direction) {
      case 'up': {
        this.p.moveY(0.1, opt);
        break;
      }
      case 'right': {
        this.p.moveX(-0.1, opt);
        break;
      }
      case 'down': {
        this.p.moveY(-0.1, opt);
        break;
      }
      case 'left': {
        this.p.moveX(0.1, opt);
        break;
      }
    }
  }
}
