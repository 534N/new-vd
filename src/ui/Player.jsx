import React from 'react';
import { connect } from 'react-redux';
import Hls from 'connect-hls.js';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.currentTick = 0;
  }

  componentDidMount() {
    const { m3u8 } = this.props;
    if (m3u8) {
      console.debug('init hls');
      this._initializeHLS(() => {
        const videoElement = this.refs.roiPlayer;

        videoElement.addEventListener('timeupdate', this._handleTimeUpdate.bind(this));
        videoElement.addEventListener('loadeddata', this._handleDataLoaded.bind(this));
        videoElement.addEventListener('seeking', this._handleSeeking.bind(this));
        videoElement.addEventListener('seeked', this._handleSeeked.bind(this));
      });
    }
  }

  componentWillUnmount() {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.m3u8 !== this.props.m3u8) {
      this._initializeHLS();
    }

    if (nextProps.playState && nextProps.playState !== this.props.playState) {
      this._play();
    }

    if (!nextProps.playState && nextProps.playState !== this.props.playState) {
      this._pause();
    }

    if (nextProps.seekTarget && nextProps.seekTarget !== this.props.seekTarget) {
      this._seek(nextProps.seekTarget);
    }

    if (nextProps.playbackRate && nextProps.playbackRate !== this.props.playbackRate) {
      this._changePlaybackRate(nextProps.playbackRate);
    }
  }

  render() {
    const { m3u8, width, height } = this.props;
    return (
      <video
        style={{
          objectFit: `fill`,
        }}
        ref='roiPlayer'
        src={m3u8}
        autoPlay={true}
        width={`${width}px`}
        height={`${height}px`}
        controls={false} />
    )
  }

  _play() {
    const p = this.refs.roiPlayer;
    p.play();
  }

  _pause() {
    const p = this.refs.roiPlayer;
    p.pause();
  }

  _seek(target) {
    let p = this.refs.roiPlayer;
    p.currentTime = target;
  }

  _initializeHLS(cb) {
    const { m3u8, auth } = this.props;
    const { jwtToken } = auth;

    const config = {
      xhrSetup: (xhr, url) => {
        xhr.withCredentials = true;
        // if (/\.m3u8/.test(url)) {
          xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        // }
      },
      autoStartLoad: false,
      debug: false,
      enableWorker: true,
      quickLoadSeekThreshold: 1/2,
      fragLoadingTimeOut: 60000,
    };

    if (this.hls) {
      this.hls.destroy();
    }

    this.hls = new Hls(config);
    this.hls.attachMedia(this.refs.roiPlayer);

    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('media attached');
      this.hls.loadSource(m3u8);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('manifest parsed!');
        this._startPlayback();

        if (cb) {
          cb();
        }

      });
    });
  }

  _startPlayback() {
    const { start } = this.props;
    this.hls.startLoad(start);
  }

  _handleTimeUpdate(d) {

    const { onTimeUpdate } = this.props;
    const currentTick = parseInt(d.target.currentTime);

    if (this.currentTick !== currentTick) {
      this.currentTick = currentTick;
      onTimeUpdate(currentTick)
    }

  }

  _handleDataLoaded() {

  }

  _handleSeeking() {
    const { onSeeking } = this.props;
    onSeeking();
  }

  _handleSeeked() {
    const { onSeeked } = this.props;
    onSeeked();
  }

  _changePlaybackRate(value) {
    const vid = this.refs.roiPlayer;
    if (vid) {
      vid.playbackRate = value;
    }
  }

  _eventListeners() {
    return {
      loadeddata: this.props.onLoadedData,
      canplay: this.props.onCanPlay,
      canplaythrough: this.props.onCanPlayThrough,
      playing: this.props.onPlaying,
      waiting: this.props.onWaiting,
      seeking: this.props.onSeeking,
      seeked: this.props.onSeeked,
      ended: this.props.onEnded,
      durationchange: this.props.onDurationChange,
      play: this.props.onPlay,
      pause: this.props.onPause,
      ratechange: this.props.onRateChange,
    };
  }
}

export default connect(state => {
  return {
    auth: state.auth
  };  
})(Player);