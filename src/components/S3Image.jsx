'use strict';

import React from 'react';
import { s3_bucket_name } from '../settings';
import S3 from 'aws-sdk/clients/s3';

export default class extends React.Component {
  constructor(props) {
    super(props);

    const { src, images } = props;
    const current = 0;

    this.ignoreList = [];

    this.state = {
      current: current,
      thumbnails: this._getThumbnails(images, src),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { src, s3 } = this.props;
    const { current, thumbnails } = this.state;

    return (
      src !== nextProps.src ||
      s3 !== nextProps.s3 ||
      current !== nextState.current ||
      thumbnails !== nextState.thumbnails
    );

  }

  componentWillReceiveProps(nextProps) {
    const { src, images } = nextProps;

    this.setState({
      thumbnails: this._getThumbnails(images, src),
    });
  }

  componentDidMount() {
    this._startRotating();
  }

  componentWillUnmount() {
    this._stopRotating();
  }

  render() {
    const { id, images, width, height } = this.props;
    const { current, thumbnails } = this.state;

    const thumbnailDOMs = thumbnails.map(({ date, url }, idx) => {
      return (
        <img
          ref={date}
          id={date}
          key={idx}
          style={{
            position: images ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: width || '320px',
            height: height || '180px',
            display: idx === current || thumbnails.length === 1 ? `block` : `none`,
          }}
          src={url}
          onError={this._handleImgLoadingError.bind(this, date)} />
      )
    });

    return (
      <div>
        {
          thumbnailDOMs.length > 0 && thumbnailDOMs
        }
        {
          thumbnailDOMs.length === 0 &&
          <img src={require('../svg/no-image-available.svg')} />
        }
      </div>
    );
  }

  _getThumbnails(images, src) {
    let thumbnails = [];

    if (images && images.length > 0) {
      thumbnails = images.sort((a, b) => {
        return +new Date(a.date) - +new Date(b.date);
      }).map(img => this._getImage(img));
    } else {
      thumbnails.push(this._getImage({ url: src }));
    }

    return thumbnails;
  }

  _handleImgLoadingError(id) {
    const { thumbnails } = this.state;

    this.ignoreList.push(id);

    const filteredList = thumbnails.filter(({ date }) => this.ignoreList.indexOf(date) === -1);

    this.setState({
      thumbnails: filteredList,
    })
    this._stopRotating();
    this._startRotating(filteredList);
  }

  _getImage({ date, url }) {
    const { bucketPrefix, aws } = this.props;

    const s3 = new S3(aws);
    // const signedURL = s3.getSignedUrl('getObject', {
    //   Bucket: s3_bucket_name,
    //   Key: bucketPrefix + '/' + url
    // });

    return {
      date: +new Date(date) || 0,
      url: require('../svg/no-image-available.svg'),
    };
  }

  _stopRotating() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
    }
  }

  _startRotating(filteredList) {
    const { thumbnails } = this.state;
    let { current } = this.state;

    if (!filteredList) {
      filteredList = thumbnails;
    }

    if (filteredList.length <= 1) {
      return;
    }

    this.rotationInterval = setInterval(() => {
      const idx = ++current % filteredList.length;
      this.setState({
        current: idx,
      });

    }, 1000);
  }
}
