export enum FileType {
  EPISODE = 'episode',
  SEASON = 'season',
  MOVIE = 'movie',
}

export enum JobName {
  DOWNLOAD_MOVIE = 'download_movie',
  DOWNLOAD_EPISODE = 'download_episode',
  DOWNLOAD_SEASON = 'download_season',
}

export enum DownloadableMediaState {
  MISSING = 'missing',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
}
