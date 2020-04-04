import { registerEnumType } from '@nestjs/graphql';

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

export enum ParameterKey {
  REGION = 'region',
  LANGUAGE = 'language',
  TMDB_API_KEY = 'tmdb_api_key',
}

registerEnumType(FileType, { name: 'FileType' });
registerEnumType(JobName, { name: 'JobName' });
registerEnumType(DownloadableMediaState, { name: 'DownloadableMediaState' });
