const _getROIParams = (camera, cb) => {
    const { location, streams } = camera;
    const { id } = location;
    const defaultUrl = `https://${id}.solink.direct:8080`;
    const deviceUrl = location ? location.accessibleAddress : defaultUrl;
    const { app_metadata } = AuthStore.getUser();
    const { date } = this.props;

    const connect = new ConnectAPI({
      deviceUrl: deviceUrl,
      authToken: AuthStore.getJwt(),
      cloudOnly: FeaturesUtil.isCloudOnly(id),
    });

    const stream = _.find(streams, o => o.name === 'SD') || streams[0];

    const camId = ObjectProcessor.GetCameraId(camera);
    const camDeviceComboId = ObjectProcessor.GetCameraDeviceIdCombo(camera);

    const start = +new Date(moment(date).startOf('day').format());
    const end = +new Date(moment(date).endOf('day').format());

    const cameraUrl = `${deviceUrl}/cameras/${camId}`;
    const m3u8 = `${cameraUrl}/video.m3u8?begin=${start}&end=${end}&stream=${stream.id}`;

    this.setState({
      m3u8: m3u8,
      start: start,
      end: end,
    });

    const params = {
      tenantId: app_metadata.tenantId,
      deviceId: location.id,
      motiongrid: true,
      camId: camId,
      streamId: stream.id,
      start: start,
      end: end,
    }

    connect.listVideos(params).then((recordingData) => {
      cb(recordingData);
    }).catch(err => console.debug('err loading recording data', err));
  }