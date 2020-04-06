import { registerEnumType, Field, ObjectType } from '@nestjs/graphql';

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
  PROCESSED = 'processed',
}

export enum ParameterKey {
  REGION = 'region',
  LANGUAGE = 'language',
  TMDB_API_KEY = 'tmdb_api_key',
  JACKETT_API_KEY = 'jackett_api_key',
  MAX_MOVIE_DOWNLOAD_SIZE = 'max_movie_download_size',
  MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE = 'max_tvshow_episode_download_size',
  PREFERRED_TAGS = 'preferred_tags',
}

export enum JobsQueue {
  DOWNLOAD = 'download',
  REFRESH_TORRENT = 'refresh_torrent',
  RENAME_AND_LINK = 'rename_and_link',
}

export enum DownloadQueueProcessors {
  DOWNLOAD_MOVIE = 'download_movie',
  DOWNLOAD_SEASON = 'download_season',
  DOWNLOAD_EPISODE = 'download_episode',
}

export enum RenameAndLinkQueueProcessors {
  HANDLE_MOVIE = 'handle_movie',
  HANDLE_SEASON = 'handle_season',
  HANDLE_EPISODE = 'handle_episode',
}

@ObjectType()
export class GraphQLCommonResponse {
  @Field() public success!: boolean;
  @Field({ nullable: true }) public message?: string;
}

registerEnumType(FileType, { name: 'FileType' });
registerEnumType(JobName, { name: 'JobName' });
registerEnumType(DownloadableMediaState, { name: 'DownloadableMediaState' });
registerEnumType(ParameterKey, { name: 'ParameterKey' });
