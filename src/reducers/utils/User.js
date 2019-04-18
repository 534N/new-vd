export const allowRemotePlayback = (metadata) => !(metadata.playbackSource && metadata.playbackSource.toLowerCase() === 'local');
