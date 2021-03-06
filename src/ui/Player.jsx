import React from 'react';
import Hls from 'connect-hls.js';
import { store } from '../store';


import PlayerOverlay from './PlayerOverlay'
import VROverlayWrap from './VROverlayWrap'

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      ended: false,
    };

    this.currentTick = 0;
    this.playerReady = false;
  }

  componentDidMount() {
    const { m3u8 } = this.props;
    if (m3u8) {
      this._initializeHLS(() => {
        const videoElement = this.refs.roiPlayer;

        videoElement.addEventListener('timeupdate', this._handleTimeUpdate.bind(this));
        videoElement.addEventListener('loadeddata', this._handleDataLoaded.bind(this));
        videoElement.addEventListener('seeking', this._handleSeeking.bind(this));
        videoElement.addEventListener('seeked', this._handleSeeked.bind(this));
        // videoElement.addEventListener('ended', this._handleEnded.bind(this));
        videoElement.addEventListener('playing', this._handlePlaying.bind(this));

        this.playerReady = true;
      });
    }
  }

  componentWillUnmount() {
    this.playerReady = false;

    const videoElement = this.refs.roiPlayer;

    videoElement.removeEventListener('timeupdate', this._handleTimeUpdate.bind(this));
    videoElement.removeEventListener('loadeddata', this._handleDataLoaded.bind(this));
    videoElement.removeEventListener('seeking', this._handleSeeking.bind(this));
    videoElement.removeEventListener('seeked', this._handleSeeked.bind(this));
    // videoElement.removeEventListener('ended', this._handleEnded.bind(this));
    videoElement.removeEventListener('playing', this._handlePlaying.bind(this));

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
    const { m3u8, id, multiPlay, is360, camera: { id: callhomeCameraId } } = this.props;
    const { loading, ended } = this.state;

    const height = multiPlay ? '100%' : 'calc(100vw * 9 / 16)';

    return (
      <div style={{width: '100%', height: height, position: 'relative'}}>
        {
          is360
            ? <VROverlayWrap videoElement={this.refs.roiPlayer} multiPlay={multiPlay} />
            : <PlayerOverlay {...this.props} id={id} cameraId={callhomeCameraId} onSeek={this._seek} loading={loading} ended={ended} />
        }
        <video
          style={{
            objectFit: `fill`,
          }}
          ref='roiPlayer'
          src={m3u8}
          autoPlay={true}
          width='100%'
          height='100%'
          controls={false} />
      </div>
    )
  }

  _play = () => {
    const p = this.refs.roiPlayer;
    p.play();
  }

  _pause = () => {
    const p = this.refs.roiPlayer;
    p.pause();
  }

  _seek = target => {
    let p = this.refs.roiPlayer;
    p.currentTime = target;
  }

  _initializeHLS = cb => {
    const { m3u8, jwtToken } = this.props;

    const config = {
      xhrSetup: (xhr, url) => {
        xhr.withCredentials = true;
        xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
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

  _startPlayback = () => {
    const { start } = this.props;
    this.hls.startLoad(start);
  }

  _handleTimeUpdate = d => {
    if (!this.playerReady) {
      return;
    }

    const { id, ttf, primaryClockTime, primaryPlayerTime, primaryPlayerId } = this.props;
    const currentTick = parseInt(d.target.currentTime) * 1000;
    const adjustedCurrentTick = ttf.invert(primaryClockTime);

    if (currentTick / 1000 !== adjustedCurrentTick / 1000 && id !== primaryPlayerId) {
      this._seek(adjustedCurrentTick / 1000)
      this.currentTick = adjustedCurrentTick;
      store.dispatch({ type: 'UPDATE_PLAY_TIME', meta: { playerId: id }, payload: adjustedCurrentTick })
    } else if (this.currentTick !== currentTick) {
      this.currentTick = currentTick;
      store.dispatch({ type: 'UPDATE_PLAY_TIME', meta: { playerId: id }, payload: currentTick })
    }
  }

  _handleDataLoaded = () => {

  }

  _handleSeeking = () => {
    this.setState({
      loading: true,
    })
  }

  _handleSeeked = () => {
    this.setState({
      loading: false,
    })
  }

  _handleEnded = () => {
    this.setState({
      loading: false,
      ended: true,
    })
  }

  _handlePlaying = () => {
    this.setState({
      loading: false,
    })
  }

  _changePlaybackRate = value => {
    const vid = this.refs.roiPlayer;
    if (vid) {
      vid.playbackRate = value;
    }
  }

  _eventListeners = () => {
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

export default Player;