import React from 'react'
import VROverlay from '../components/VROverlay'

const totalSplits = 4;

const splitStyles = {
  'split-1': [
    { top: 0, left: 0, width: '100%', height: '100%' },
  ],
  'split-2': [
    { top: 0, left: 0, width: '50%' },
    { top: 0, left: '50%', width: '50%' },
  ],
  'split-3': [
    { top: 0, left: 0, width: '50%', height: '50%' },
    { top: 0, left: '50%', width: '50%', height: '50%' },
    { top: '50%', left: 0, width: '50%', height: '50%' },
  ],
  'split-4': [
    { top: 0, left: 0, width: '50%', height: '50%' },
    { top: 0, left: '50%', width: '50%', height: '50%' },
    { top: '50%', left: 0, width: '50%', height: '50%' },
    { top: '50%', left: '50%', width: '50%', height: '50%' },
  ],
};

const initPositions = {
  'split-1': [
    { lon: -180, lat: 30 },
  ],
  'split-2': [
    { lon: -180, lat: 30 },
    { lon: 1, lat: 30 },
  ],
  'split-3': [
    { lon: -180, lat: 30 },
    { lon: -60, lat: 30 },
    { lon: 60, lat: 30 },
  ],
  'split-4': [
    { lon: -180, lat: 30 },
    { lon: -90, lat: 30 },
    { lon: 1, lat: 30 },
    { lon: 90, lat: 30 },
  ],
};

const initSplit = 1;


class VROverlayWrap extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      splits: initSplit,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { videoElement } = nextProps;

    debugger
    if (videoElement) {
      this._init360(videoElement)
    }
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        zIndex: 10000,
        height: '100%',
        width: '100%',
      }}>
        { this._renderVROverlay() }
      </div>
    )
  }

  _renderVROverlay() {
    const { VRSettings = {}, togglePausePlay, videoElement } = this.props
    const { splits } = this.state;

    let renderList = [];
      
    for (let i = 1; i <= splits; i++) {
  
      const splitIndex = `split-${i}`;
      const style      = splitStyles[splitIndex];
      const position   = initPositions[splitIndex];
      const paddingX   = VRSettings ? VRSettings.widthRatio : 1.0;
      const paddingY   = VRSettings ? VRSettings.heightRatio : 1.0;

      renderList.push(
        <VROverlay
          ref={`vrOverlay-${i}`}
          key={`vrOverlay-${i}`}
          style={style[i-1]}
          position={position}
          splits={splits}
          splitIndex={splitIndex}
          onPositionUpdate={this._updatePositions}
          togglePausePlay={togglePausePlay}
          videoElement={videoElement}
          onHover={this._handleMouseHover}
          onMouseClick={this._handleMouseClick}
          multiPlay={false}
          showControls={true} 
          paddingX={paddingX}
          paddingY={paddingY} />
      )
    }
  
    return renderList;
  }

  _destroy360() {
    const { splits } = this.state;

    for (let i = 1; i <= splits; i++) {
      this.refs[`vrOverlay-${i}`].destroy();
    }
  }

  _init360(videoElement) {
    const { splits } = this.state;

    for (let i = 1; i <= splits; i++) {
      this.refs[`vrOverlay-${i}`].videoElementReady(videoElement);
    }
  }

  _updatePositions() {

  }

  _handleMouseHover() {

  }

  _handleMouseClick() {

  }

}

export default VROverlayWrap;
